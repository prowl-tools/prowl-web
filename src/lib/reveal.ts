'use client';

import { createContext, createElement, useContext, useSyncExternalStore, type ReactNode } from 'react';
import { useReducedMotion, type MotionProps } from 'motion/react';

export type RevealMotionProps = Pick<MotionProps, 'initial' | 'animate' | 'whileInView' | 'viewport'>;

/**
 * The scroll-reveal state, split so the remount key can never be spread into
 * JSX: pass `key={reveal.remountKey}` directly and spread only
 * `reveal.motionProps`. React ignores a `key` arriving via spread and warns
 * ("A props object containing a \"key\" prop is being spread into JSX"), and
 * has announced the warning will become an error.
 */
export type ScrollRevealProps = {
  remountKey: string | undefined;
  motionProps: RevealMotionProps;
};

type HydrationScheduler = (callback: () => void) => void;

type CreateRevealHydrationStoreOptions = {
  hasWindow?: () => boolean;
  schedule?: HydrationScheduler;
};

export type RevealHydrationStore = {
  subscribe: (listener: () => void) => () => void;
  getSnapshot: () => boolean;
  getServerSnapshot: () => false;
};

type ScrollRevealState = {
  hydrated: boolean;
  reducedMotion: boolean | null;
  margin?: string;
};

/**
 * Renders an element at its `visible` variant from the first paint with no
 * hidden initial state and no entrance animation. This is the SSR / no-JS /
 * reduced-motion baseline: content ships in the HTML fully visible instead of
 * behind an inline `opacity:0`.
 *
 * Use for above-the-fold content — heroes and the LCP element. The entrance
 * animation is intentionally skipped there: hiding the LCP element and then
 * fading it in on hydration would flash content and regress LCP/FCP. The
 * trade-off is that heroes appear on the first server-rendered paint rather than
 * animating in, which is the correct call for the largest contentful paint.
 */
export const revealVisible: RevealMotionProps = { initial: 'visible', animate: 'visible' };

export function createRevealHydrationStore({
  hasWindow = () => typeof window !== 'undefined',
  schedule = queueMicrotask,
}: CreateRevealHydrationStoreOptions = {}): RevealHydrationStore {
  let hydratedSnapshot = false;
  let hydrationQueued = false;
  const hydrationListeners = new Set<() => void>();

  function emitHydrationChange() {
    for (const listener of hydrationListeners) {
      listener();
    }
  }

  function markHydrated() {
    hydrationQueued = false;

    if (hydratedSnapshot) {
      return;
    }

    hydratedSnapshot = true;
    emitHydrationChange();
  }

  function subscribe(listener: () => void) {
    hydrationListeners.add(listener);

    if (hasWindow() && !hydratedSnapshot && !hydrationQueued) {
      hydrationQueued = true;
      schedule(markHydrated);
    }

    return () => {
      hydrationListeners.delete(listener);
    };
  }

  function getSnapshot() {
    return hydratedSnapshot;
  }

  function getServerSnapshot(): false {
    return false;
  }

  return {
    subscribe,
    getSnapshot,
    getServerSnapshot,
  };
}

const RevealHydrationContext = createContext(false);
const revealHydrationStore = createRevealHydrationStore();

/**
 * Provides the one post-hydration signal shared by every reveal consumer on the
 * page. The store emits once after the first client subscription so the initial
 * render matches SSR, then reveal sections can remount into scroll animation.
 */
export function RevealHydrationProvider({ children }: { children: ReactNode }) {
  const hydrated = useSyncExternalStore(
    revealHydrationStore.subscribe,
    revealHydrationStore.getSnapshot,
    revealHydrationStore.getServerSnapshot,
  );

  return createElement(RevealHydrationContext.Provider, { value: hydrated }, children);
}

/**
 * Returns `false` on the server and on the first client render (so hydration
 * matches the server markup), then `true` once hydration has completed.
 */
function useHydrated(): boolean {
  return useContext(RevealHydrationContext);
}

/**
 * Progressive-enhancement scroll reveal for below-the-fold sections.
 *
 * On the server, on the first client render (pre-hydration), for no-JS visitors,
 * and when `prefers-reduced-motion` is set, it returns {@link revealVisible} so
 * the content is always visible — nothing ships as `opacity:0`. Only once the
 * component has hydrated with motion allowed does it enable the `hidden` ->
 * `visible` scroll-triggered entrance. The returned `remountKey` (passed as the
 * element's `key` directly, never spread) intentionally remounts
 * the Motion element at that point, because Motion only applies `initial` on
 * mount; changing `initial` after the SSR-visible mount would leave the element
 * visible and skip the reveal. Because these sections are off-screen at the
 * moment hydration runs, the remount is not visible to users; if a section
 * happens to be in view, motion's viewport observer fires immediately and it
 * simply plays its entrance rather than getting stuck.
 *
 * @param margin IntersectionObserver root margin passed through to motion's
 *   `viewport.margin` (e.g. `'-80px'` to trigger slightly before fully in view).
 */
export function getScrollRevealProps({
  hydrated,
  reducedMotion,
  margin = '-80px',
}: ScrollRevealState): ScrollRevealProps {
  if (!hydrated || reducedMotion) {
    return { remountKey: undefined, motionProps: revealVisible };
  }

  return {
    remountKey: `scroll-reveal:${margin}`,
    motionProps: {
      initial: 'hidden',
      whileInView: 'visible',
      viewport: { once: true, margin },
    },
  };
}

export function useScrollReveal(margin = '-80px'): ScrollRevealProps {
  const hydrated = useHydrated();
  const reducedMotion = useReducedMotion();

  return getScrollRevealProps({ hydrated, reducedMotion, margin });
}
