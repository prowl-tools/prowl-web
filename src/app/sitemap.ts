import type { MetadataRoute } from "next";
// Relative ".ts" imports (not "@/") so the sitemap unit test can import this
// module under the node test runner, which resolves neither the tsconfig "@/"
// path alias nor extensionless specifiers. Mirrors src/lib/blog-metadata.ts.
import { getAllPosts } from "../lib/blog.ts";
import { BLOG_FEED_PATH } from "../lib/rss.ts";

// The blog is visible again (owner decision, 2026-09-03): its nav/footer links
// and the /blog and RSS feed sitemap entries are restored now that a
// content-writer pipeline is producing story/how-to posts at each release, so
// new posts land in the sitemap automatically as they ship.
export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const latestBlogPostDate = posts.reduce<Date | null>((latest, post) => {
    const publishedAt = new Date(post.date);
    return !latest || publishedAt > latest ? publishedAt : latest;
  }, null);

  const blogEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `https://prowl.tools/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    {
      url: "https://prowl.tools",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      // Competitive-positioning page (prowl PROWL-037 / GTM-002). A durable
      // landing page targeting "Maestro / Playwright / XCUITest alternative"
      // searches, ranked just below the homepage.
      url: "https://prowl.tools/compare",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: "https://prowl.tools/blog",
      lastModified: latestBlogPostDate ?? new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      // Blog RSS feed (PQW-009). Included so the feed is a discoverable,
      // crawlable resource alongside the HTML pages; low priority since it is
      // a machine-readable mirror of /blog rather than a landing page.
      url: `https://prowl.tools${BLOG_FEED_PATH}`,
      lastModified: latestBlogPostDate ?? new Date(),
      changeFrequency: "weekly",
      priority: 0.4,
    },
    ...blogEntries,
  ];
}
