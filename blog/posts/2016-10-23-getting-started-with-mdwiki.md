---
title: Getting Started with mdWiki
date: 2016-10-23
slug: getting-started-with-mdwiki
tags: [markdown, tools, blogging]
excerpt: Five commands to spin up an mdWiki blog locally — no build step, just markdown and a Python server.
---

# Get started with mdWiki fast on the command line

```
mkdir myblog
cd myblog
wget mdwiki.info
echo "Hello world" >> index.md
python -m SimpleHTTPServer 8000 & open http://localhost:8000
```
