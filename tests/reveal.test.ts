import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  createRevealHydrationStore,
  getScrollRevealProps,
  revealVisible,
} from '../src/lib/reveal.ts';

test('keeps reveal content visible before hydration, with no remount key', () => {
  const reveal = getScrollRevealProps({ hydrated: false, reducedMotion: false });

  assert.strictEqual(reveal.remountKey, undefined);
  assert.strictEqual(reveal.motionProps, revealVisible);
});

test('keeps reveal content visible when reduced motion is preferred, with no remount key', () => {
  const reveal = getScrollRevealProps({ hydrated: true, reducedMotion: true });

  assert.strictEqual(reveal.remountKey, undefined);
  assert.strictEqual(reveal.motionProps, revealVisible);
});

test('returns remounting viewport reveal props after hydration', () => {
  assert.deepStrictEqual(
    getScrollRevealProps({ hydrated: true, reducedMotion: false, margin: '-120px' }),
    {
      remountKey: 'scroll-reveal:-120px',
      motionProps: {
        initial: 'hidden',
        whileInView: 'visible',
        viewport: { once: true, margin: '-120px' },
      },
    },
  );
});

test('the spreadable motion props never carry a React key', () => {
  const hydrated = getScrollRevealProps({ hydrated: true, reducedMotion: false });

  assert.ok(!('key' in hydrated.motionProps));
  assert.ok(!('key' in revealVisible));
});

test('does not queue hydration work on the server', () => {
  let scheduled = 0;
  const store = createRevealHydrationStore({
    hasWindow: () => false,
    schedule: () => {
      scheduled += 1;
    },
  });

  const unsubscribe = store.subscribe(() => {});

  assert.equal(scheduled, 0);
  assert.equal(store.getSnapshot(), false);
  assert.equal(store.getServerSnapshot(), false);

  unsubscribe();
});

test('queues one client hydration signal and notifies active subscribers once', () => {
  const scheduled: Array<() => void> = [];
  const store = createRevealHydrationStore({
    hasWindow: () => true,
    schedule: (callback) => {
      scheduled.push(callback);
    },
  });
  let firstListenerCalls = 0;
  let secondListenerCalls = 0;

  const unsubscribeFirst = store.subscribe(() => {
    firstListenerCalls += 1;
  });
  const unsubscribeSecond = store.subscribe(() => {
    secondListenerCalls += 1;
  });

  assert.equal(scheduled.length, 1);
  assert.equal(store.getSnapshot(), false);

  unsubscribeFirst();
  scheduled[0]();

  assert.equal(firstListenerCalls, 0);
  assert.equal(secondListenerCalls, 1);
  assert.equal(store.getSnapshot(), true);

  scheduled[0]();
  assert.equal(secondListenerCalls, 1);

  const unsubscribeLate = store.subscribe(() => {
    throw new Error('already-hydrated subscriptions should not be notified again');
  });

  assert.equal(store.getSnapshot(), true);
  assert.equal(scheduled.length, 1);

  unsubscribeSecond();
  unsubscribeLate();
});

test('unsubscribe removes a listener before the hydration notification', () => {
  const scheduled: Array<() => void> = [];
  const store = createRevealHydrationStore({
    hasWindow: () => true,
    schedule: (callback) => {
      scheduled.push(callback);
    },
  });
  let calls = 0;

  const unsubscribeFirst = store.subscribe(() => {
    calls += 1;
  });

  assert.equal(typeof unsubscribeFirst, 'function');
  unsubscribeFirst();

  const unsubscribeSecond = store.subscribe(() => {
    calls += 1;
  });

  assert.equal(scheduled.length, 1);
  scheduled[0]();

  assert.equal(calls, 1);
  assert.equal(store.getSnapshot(), true);

  unsubscribeSecond();
});
