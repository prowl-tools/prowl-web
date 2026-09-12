import assert from 'node:assert/strict';
import { test } from 'node:test';

import sitemap from '../src/app/sitemap.ts';
import { getAllPosts } from '../src/lib/blog.ts';

const SITE_URL = 'https://prowl.tools';

test('sitemap includes the homepage, the blog index, the RSS feed, and every post', () => {
  const entries = sitemap();
  const urls = entries.map((entry) => entry.url);
  const posts = getAllPosts();
  const blogPostUrls = posts.map((post) => `${SITE_URL}/blog/${post.slug}`);

  assert.ok(urls.includes(SITE_URL));
  assert.ok(urls.includes(`${SITE_URL}/compare`));
  assert.ok(urls.includes(`${SITE_URL}/blog`));
  assert.ok(urls.includes(`${SITE_URL}/blog/feed.xml`));

  for (const postUrl of blogPostUrls) {
    assert.ok(urls.includes(postUrl));
  }
});

test('sitemap entries include expected metadata', () => {
  const entries = sitemap();
  const entriesByUrl = new Map(entries.map((entry) => [entry.url, entry]));
  const posts = getAllPosts();
  const latestBlogPostDate = posts.reduce<Date | null>((latest, post) => {
    const publishedAt = new Date(post.date);
    return !latest || publishedAt > latest ? publishedAt : latest;
  }, null);

  assert.ok(latestBlogPostDate);

  const homepage = entriesByUrl.get(SITE_URL);
  assert.ok(homepage);
  assert.ok(homepage.lastModified instanceof Date);
  assert.equal(homepage.changeFrequency, 'weekly');
  assert.equal(homepage.priority, 1);

  const compare = entriesByUrl.get(`${SITE_URL}/compare`);
  assert.ok(compare);
  assert.ok(compare.lastModified instanceof Date);
  assert.equal(compare.changeFrequency, "monthly");
  assert.equal(compare.priority, 0.9);

  const blogIndex = entriesByUrl.get(`${SITE_URL}/blog`);
  assert.ok(blogIndex);
  assert.deepEqual(blogIndex.lastModified, latestBlogPostDate);
  assert.equal(blogIndex.changeFrequency, 'weekly');
  assert.equal(blogIndex.priority, 0.8);

  const feed = entriesByUrl.get(`${SITE_URL}/blog/feed.xml`);
  assert.ok(feed);
  assert.deepEqual(feed.lastModified, latestBlogPostDate);
  assert.equal(feed.changeFrequency, 'weekly');
  assert.equal(feed.priority, 0.4);

  for (const post of posts) {
    const postEntry = entriesByUrl.get(`${SITE_URL}/blog/${post.slug}`);
    assert.ok(postEntry);
    assert.deepEqual(postEntry.lastModified, new Date(post.date));
    assert.equal(postEntry.changeFrequency, 'monthly');
    assert.equal(postEntry.priority, 0.7);
  }
});
