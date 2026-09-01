---
layout: default
title: 论文笔记
permalink: /lun-wen-bi-ji/
---

<!-- obsidian-publisher:nav-link -->

[Underwater OVSS 研究导航](/lun-wen-bi-ji/underwater-ovss/)

<h1>📝 论文笔记</h1>
<p>这里收录了我阅读和复现的论文笔记。</p>

<ul>
  {% for post in site.categories["论文笔记"] %}
    <li>
      <a href="{{ post.url }}">{{ post.title }}</a>
      <span style="color: #888; font-size: 0.9em;">{{ post.date | date: "%Y-%m-%d" }}</span>
    </li>
  {% endfor %}
</ul>

{% if site.categories["论文笔记"].size == 0 %}
  <p>📭 暂无论文笔记，敬请期待。</p>
{% endif %}
