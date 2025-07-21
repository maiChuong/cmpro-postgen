---
layout: default
title: News - PostGen Web
---

<div class="container">
    <header class="header">
        <div class="header-top">
            <h1>PostGen Web News</h1>
            <img src="{{ '/assets/img/Logo.png' | relative_url }}" alt="PostGen Logo" class="logo">
        </div>
    </header>

    <section class="section">
        <h2>Latest Updates</h2>
        <p>Stay updated with the latest developments in AI-powered content creation.</p>
    </section>

    {% for post in site.posts %}
    <article class="section blog-post">
        <div class="blog-header">
            <h2><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h2>
            <div class="blog-meta">
                <span class="date">{{ post.date | date: "%B %d, %Y" }}</span>
                {% if post.author %}<span class="author">{{ post.author }}</span>{% endif %}
                {% if post.category %}<span class="category">{{ post.category }}</span>{% endif %}
            </div>
        </div>
        
        <div class="blog-content">
            {{ post.excerpt }}
        </div>
        
        {% if post.tags %}
        <div class="blog-footer">
            <div class="tags">
                {% for tag in post.tags %}
                <span class="tag">#{{ tag }}</span>
                {% endfor %}
            </div>
            <!-- <p><a href="{{ post.url | relative_url }}" class="btn btn-primary">Read More</a></p> -->
        </div>
        {% endif %}
    </article>
    {% endfor %}
</div>
