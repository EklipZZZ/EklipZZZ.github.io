---
layout: default
title: 代码笔记
permalink: /dai-ma-bi-ji/
---

<h1>代码笔记</h1>
<p>这里存放我学习过程中整理的代码片段和技巧。</p>

<ul>
  {% for post in site.categories["代码笔记"] %}
    <li>
      <a href="{{ post.url }}">{{ post.title }}</a>
      <span style="color: #888; font-size: 0.9em;">{{ post.date | date: "%Y-%m-%d" }}</span>
    </li>
  {% endfor %}
</ul>

{% if site.categories["代码笔记"].size == 0 %}
  <p>暂无代码笔记，敬请期待。</p>
{% endif %}
