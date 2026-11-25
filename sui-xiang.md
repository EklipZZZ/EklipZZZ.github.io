---
layout: default
title: 随想
permalink: /sui-xiang/
---

<h1>随想</h1>
<p>这里记录我日常的思考、感悟与随笔。</p>

<ul>
  {% for post in site.categories["随想"] %}
    <li>
      <a href="{{ post.url }}">{{ post.title }}</a>
      <span style="color: #888; font-size: 0.9em;">{{ post.date | date: "%Y-%m-%d" }}</span>
    </li>
  {% endfor %}
</ul>

{% if site.categories["随想"].size == 0 %}
  <p>暂无随想，敬请期待。</p>
{% endif %}
