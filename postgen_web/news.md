---
layout: default
title: News - PostGen Web
permalink: /news.html
order: 2
---

<div class="container">
    <header class="header">
        <div class="header-top">
            <h1>POSTGEN NEWS</h1>
            <img src="{{ '/assets/img/Logo.png' | relative_url }}" alt="PostGen Logo" class="logo">
        </div>
    </header>

<div class="context-search-bar-container">
  <input type="search" id="news-context-search" class="context-search-bar" placeholder="Search news..." autocomplete="off" />
</div>

<div id="news-list" class="news-list-vertical">
  {% for post in site.posts %}
    <div class="news-card" data-post-title="{{ post.title | escape }}" data-post-excerpt="{{ post.excerpt | strip_html | escape }}" data-post-body="{{ post.content | strip_html | escape }}">
      {% if post.image %}
        <div class="news-media"><img src="{{ post.image | relative_url }}" alt="Feature image for {{ post.title }}" loading="lazy" /></div>
      {% elsif post.video %}
        <div class="news-media"><video src="{{ post.video | relative_url }}" controls poster="{{ post.image | relative_url }}" style="max-width:100%;border-radius:8px;"></video></div>
      {% endif %}
      <div class="news-meta">
        <span class="news-date">{{ post.date | date: "%b %d, %Y" }}</span>
      </div>
      <h2 class="news-title"><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h2>
      <div class="news-excerpt">{{ post.excerpt | strip_html | truncate: 160 }}</div>
      <a href="{{ post.url | relative_url }}" class="news-read-more">Read more &rarr;</a>
    </div>
  {% endfor %}
</div>
<style>
body {
  background: #f7f9fb;
  font-family: 'Segoe UI', 'Roboto', Arial, sans-serif;
  color: #222;
  margin: 0;
  padding: 0;
}
main {
  max-width: 1200px;
  margin: 3rem auto;
  padding: 2rem;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.07);
}
@media screen and (min-width: 701px) {
  .news-article {
    max-width: none;
  }
}
h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
}
.news-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2.2rem;
  margin: 2.5rem 0 4rem 0;
  padding: 0 1rem;
  max-width: 700px;
}
.news-card {
  background: #ffffffff;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.10), 0 1.5px 6px rgba(0,0,0,0.07);
  padding: 1.7rem 1.2rem 1.3rem 1.2rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  transition: box-shadow 0.18s, transform 0.18s;
  position: relative;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.06);
  padding: 2rem 2rem 1.5rem 2rem;
  transition: box-shadow 0.2s;
  max-width: 1200px;
  align-self: center;
}
.news-card:hover {
  box-shadow: 0 6px 24px rgba(0,0,0,0.14);
}
.news-card h2 {
  margin-top: 0;
  margin-bottom: 0.5rem;
  font-size: 2rem;
  font-weight: 600;
}
.news-meta {
  color: #888;
  font-size: 1rem;
  margin-bottom: 1rem;
}
.read-more {
  display: inline-block;
  margin-top: 0.8rem;
  color: #1976d2;
  font-weight: 500;
  text-decoration: none;
}
.read-more:hover {
  text-decoration: underline;
}
.news-hero {
  text-align: center;
  padding: 2.5rem 0 1.2rem 0;
  }
.news-lead {
  font-size: 1.18rem;
  color: #444;
  margin-bottom: 0.7rem;
  }
/* End update */
.news-list-vertical {
  display: flex;
  flex-direction: column;
  gap: 2.2rem;
  margin: 2.5rem 0 4rem 0;
  padding: 0 1rem;
}
.news-card.featured {
  border: 2.5px solid #ffd43b;
  background: #fffbb8;
}
.news-card:hover {
  box-shadow: 0 16px 48px rgba(0,0,0,0.12);
  transform: translateY(-3px) scale(1.02);
}
.news-media {
  width: 100%;
  margin-bottom: 1.1rem;
  border-radius: 9px;
  overflow: hidden;
  background: #fff475;
  display: flex;
  align-items: center;
  justify-content: center;
}
.news-media img, .news-media video {
  width: 100%;
  max-height: 220px;
  object-fit: cover;
  border-radius: 9px;
}
.news-meta {
  width: 100%;
  font-size: 0.98rem;
  color: #888;
  margin-bottom: 0.4rem;
}
.news-title {
  margin: 0 0 0.7rem 0;
  font-size: 1.35rem;
  font-weight: 700;
  color: #222;
}
.news-excerpt {
  font-size: 1.08rem;
  color: #555;
  margin-bottom: 1.2rem;
  width: 100%;
}
.news-read-more {
  margin-top: auto;
  color: #1976d2;
  font-weight: 600;
  text-decoration: underline;
  font-size: 1.04rem;
  transition: color 0.15s;
}
.news-read-more:hover {
  color: #0d47a1;
}
.featured-news-title {
  margin-top: 2.2rem;
  color: #d4a200;
  text-align: left;
  font-size: 1.25rem;
  font-weight: bold;
  letter-spacing: 0.05em;
}
.context-search-bar-container {
  width: 100%;
  max-width: 700px;
  margin: 2.2rem auto 1.3rem auto;
  display: flex;
  justify-content: center;
}
.context-search-bar {
  width: 100%;
  font-size: 1.13rem;
  border: 1.5px solid #ffffffff;
  border-radius: 8px;
  padding: 0.8rem 1.1rem;
  background: #ffffffff;
  color: #333;
  outline: none;
  box-shadow: 0 2px 12px rgba(0,0,0,0.04);
  transition: border 0.18s, box-shadow 0.18s;
}
.context-search-bar:focus {
  border: 2px solid #000000ff;
  box-shadow: 0 2px 20px rgba(255,212,59,0.09);
}



</style>
