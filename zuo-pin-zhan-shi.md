---
layout: default
title: 作品展示
permalink: /zuo-pin-zhan-shi/
---

<h1>作品展示</h1>
<p>这里展示我参与或独立完成的项目与作品。</p>

<ul>
  {% for post in site.categories["作品展示"] %}
    <li>
      <a href="{{ post.url }}">{{ post.title }}</a>
      <span style="color: #888; font-size: 0.9em;">{{ post.date | date: "%Y-%m-%d" }}</span>
    </li>
  {% endfor %}
</ul>

{% if site.categories["作品展示"].size == 0 %}
  <p>暂无作品展示，敬请期待。</p>
{% endif %}
