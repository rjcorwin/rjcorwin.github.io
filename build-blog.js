#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

// --- Frontmatter parser ---
function parseFrontmatter(src) {
  if (!src.startsWith('---')) return { data: {}, body: src };
  const end = src.indexOf('\n---', 3);
  if (end === -1) return { data: {}, body: src };
  const block = src.slice(4, end).trim();
  const body = src.slice(end + 4).trim();
  const data = {};
  for (const line of block.split('\n')) {
    const colon = line.indexOf(':');
    if (colon === -1) continue;
    const key = line.slice(0, colon).trim();
    let val = line.slice(colon + 1).trim();
    if (val.startsWith('[') && val.endsWith(']')) {
      val = val.slice(1, -1).split(',').map(s => s.trim()).filter(Boolean);
    }
    data[key] = val;
  }
  return { data, body };
}

// --- Star background script (shared) ---
const starScript = `
  <script>
    (function () {
      const s = document.createElement('div');
      s.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:0;';
      for (let i = 0; i < 50; i++) {
        const star = document.createElement('div');
        const dur   = 2 + Math.random() * 5;
        const delay = -(Math.random() * 6);
        star.style.cssText = \`
          position:absolute;
          left:\${Math.random()*100}%; top:\${Math.random()*100}%;
          width:2px; height:2px; background:#fff;
          animation:star-twinkle \${dur}s ease-in-out infinite \${delay}s;
          --base-op:\${(.08+Math.random()*.2).toFixed(2)};
          --peak-op:\${(.4+Math.random()*.4).toFixed(2)};
        \`;
        s.appendChild(star);
      }
      document.body.prepend(s);
    })();
  </script>`;

const nav = `
  <nav class="site-nav">
    <a href="/" class="nav-logo">RJ CORWIN</a>
    <ul class="nav-links">
      <li><a href="/blog/">BLOG</a></li>
      <li><a href="https://github.com/rjcorwin" target="_blank" rel="noopener">GITHUB</a></li>
      <li><a href="https://twitch.tv/HackingWithRJ" target="_blank" rel="noopener">TWITCH</a></li>
      <li><a href="https://youtube.com/@HackingWithRJ" target="_blank" rel="noopener">YOUTUBE</a></li>
    </ul>
  </nav>`;

const footer = `
  <footer class="site-footer">
    <p>RJ CORWIN &nbsp;&mdash;&nbsp; <a href="/">HOME</a> &nbsp;&mdash;&nbsp; <a href="/blog/">BLOG</a></p>
  </footer>`;

// --- Post page template ---
function postTemplate({ title, date, tags, bodyHtml, prevPost, nextPost }) {
  const tagHtml = (tags || []).map(t => `<span class="tag">${t.toUpperCase()}</span>`).join('\n        ');
  const prevLink = prevPost
    ? `<a href="${prevPost.slug}.html" class="post-nav-link prev-post">
      <span class="nav-dir">&lt; PREV</span>
      <span class="nav-title">${prevPost.title.toUpperCase()}</span>
    </a>`
    : `<a href="index.html" class="post-nav-link prev-post">
      <span class="nav-dir">&lt; BACK</span>
      <span class="nav-title">BLOG INDEX</span>
    </a>`;
  const nextLink = nextPost
    ? `<a href="${nextPost.slug}.html" class="post-nav-link next-post">
      <span class="nav-dir">NEXT &gt;</span>
      <span class="nav-title">${nextPost.title.toUpperCase()}</span>
    </a>`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title.toUpperCase()} — RJ CORWIN</title>
  <link rel="stylesheet" href="../style.css">
</head>
<body>
${nav}

  <div class="post-hero">
    <div class="post-meta">
      <span class="post-date">${date}</span>
      <div class="post-tags">
        ${tagHtml}
      </div>
    </div>
    <h1>${title.toUpperCase()}</h1>
  </div>

  <div class="post-divider"></div>

  <article class="post-body">
${bodyHtml}
  </article>

  <nav class="post-nav">
    ${prevLink}
    ${nextLink}
  </nav>
${footer}
${starScript}

</body>
</html>`;
}

// --- Index page template ---
function indexTemplate(posts) {
  const cards = posts.map((p, i) => {
    const num = String(i + 1).padStart(2, '0');
    const tagHtml = (p.tags || []).map(t => `<span class="tag">${t.toUpperCase()}</span>`).join('\n            ');
    return `
        <a href="${p.slug}.html" class="blog-card" data-num="${num}">
          <span class="post-num">${num}</span>
          <span class="post-date">${p.date}</span>
          <span class="post-title">${p.title.toUpperCase()}</span>
          <span class="post-excerpt">
            ${p.excerpt || ''}
          </span>
          <div class="post-tags">
            ${tagHtml}
          </div>
        </a>`;
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>BLOG — RJ CORWIN</title>
  <link rel="stylesheet" href="../style.css">
</head>
<body>
${nav}

  <section class="site-section" style="padding-top: 140px;">
    <div class="section-inner">
      <span class="section-label">&gt; SELECT STAGE</span>
      <h1 class="section-heading neon-magenta">BLOG</h1>

      <div class="blog-list">
${cards}
      </div>
    </div>
  </section>

  <footer class="site-footer">
    <p>RJ CORWIN &nbsp;&mdash;&nbsp; <a href="/">HOME</a> &nbsp;&mdash;&nbsp; BUILT WITH RAW HTML AND SPITE</p>
  </footer>

  <script>
    /* stars */
    (function () {
      const s = document.createElement('div');
      s.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:0;';
      for (let i = 0; i < 60; i++) {
        const star = document.createElement('div');
        const dur   = 2 + Math.random() * 5;
        const delay = -(Math.random() * 6);
        star.style.cssText = \`
          position:absolute;
          left:\${Math.random()*100}%; top:\${Math.random()*100}%;
          width:2px; height:2px; background:#fff;
          animation:star-twinkle \${dur}s ease-in-out infinite \${delay}s;
          --base-op:\${(.1+Math.random()*.25).toFixed(2)};
          --peak-op:\${(.5+Math.random()*.5).toFixed(2)};
        \`;
        s.appendChild(star);
      }
      document.body.prepend(s);
    })();
  </script>

</body>
</html>`;
}

// --- Main ---
const postsDir = path.join(__dirname, 'blog', 'posts');
const blogDir  = path.join(__dirname, 'blog');

const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));

const posts = files.map(file => {
  const src = fs.readFileSync(path.join(postsDir, file), 'utf8');
  const { data, body } = parseFrontmatter(src);
  return {
    title:   data.title   || file,
    date:    data.date    || '',
    slug:    data.slug    || file.replace(/\.md$/, ''),
    tags:    data.tags    || [],
    excerpt: data.excerpt || '',
    bodyHtml: marked(body),
  };
});

// Sort newest first
posts.sort((a, b) => (a.date < b.date ? 1 : -1));

// Write per-post HTML
posts.forEach((post, i) => {
  const prevPost = posts[i + 1] || null; // older post
  const nextPost = posts[i - 1] || null; // newer post
  const html = postTemplate({ ...post, prevPost, nextPost });
  const outPath = path.join(blogDir, `${post.slug}.html`);
  fs.writeFileSync(outPath, html);
  console.log(`wrote ${post.slug}.html`);
});

// Write index
const indexHtml = indexTemplate(posts);
fs.writeFileSync(path.join(blogDir, 'index.html'), indexHtml);
console.log('wrote blog/index.html');
