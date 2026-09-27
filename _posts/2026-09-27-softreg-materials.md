---
layout: post
title: "软著申报材料生成系统"
date: 2026-09-27 16:00:00 +0800
author: "EklipZ"
categories: ["作品展示"]
permalink: /zuo-pin-zhan-shi/softreg-materials/
---

<div class="project-showcase">
  <section class="project-showcase__hero" aria-labelledby="softreg-title">
    <div>
      <p class="project-showcase__eyebrow">作品展示 · Web 应用</p>
      <h1 id="softreg-title">软著申报材料生成系统</h1>
      <p class="project-showcase__lead">将软件著作权申请信息、源码核对和材料生成放进一条可检查、可追溯的准备流程。</p>
      <ul class="project-showcase__tags" aria-label="技术栈">
        <li>Next.js 16</li>
        <li>React 19</li>
        <li>TypeScript</li>
        <li>Supabase</li>
        <li>Vercel</li>
        <li>Python · LibreOffice</li>
      </ul>
    </div>

    <ol class="project-flow" aria-label="材料准备流程示意">
      <li><span class="project-flow__number">01</span><span><strong>填写申请信息</strong><span>软件资料与著作权人</span></span></li>
      <li><span class="project-flow__number">02</span><span><strong>核对源码</strong><span>统计代码行数，检查修改建议</span></span></li>
      <li><span class="project-flow__number">03</span><span><strong>生成申报材料</strong><span>源代码与用户手册 DOCX / PDF</span></span></li>
      <li><span class="project-flow__number">04</span><span><strong>查看生成记录</strong><span>回顾任务状态并下载文件</span></span></li>
    </ol>
  </section>

  <section class="project-showcase__section" aria-labelledby="softreg-features">
    <h2 id="softreg-features">围绕材料准备的几个环节</h2>
    <div class="project-showcase__grid">
      <article class="project-feature">
        <h3>申请信息管理</h3>
        <p>集中维护软件基本资料和著作权人信息，并管理不同申请的编辑状态。</p>
      </article>
      <article class="project-feature">
        <h3>源码统计与辅助核对</h3>
        <p>提交源码压缩包后，系统可统计代码行数，并针对技术字段给出模型生成的修改建议；建议由申请人确认后再采用。</p>
      </article>
      <article class="project-feature">
        <h3>申报文档生成</h3>
        <p>根据申请信息生成源代码文档和用户手册，提供 DOCX 与 PDF 文件。</p>
      </article>
      <article class="project-feature">
        <h3>生成记录与文件下载</h3>
        <p>保留材料生成记录与任务状态，并通过受限的文件链接下载生成结果。</p>
      </article>
    </div>
  </section>

  <section class="project-showcase__section" aria-labelledby="softreg-architecture">
    <h2 id="softreg-architecture">技术实现</h2>
    <div class="project-showcase__architecture">
      <p>应用界面与服务端使用 Next.js、React 和 TypeScript；Supabase 提供用户认证、数据库及私有文件存储，部署运行在 Vercel。文档转换流程使用 Python 和 LibreOffice 处理 PDF。AI 辅助通过用户配置的兼容模型服务完成。</p>
    </div>
    <aside class="project-showcase__note">
      <p>源码分析和模型生成内容属于辅助信息。系统用于准备申报材料，申请人仍需核对最终文档并自行办理正式登记手续。</p>
    </aside>
  </section>

  <div class="project-showcase__cta">
    <a href="https://ipgen.top" target="_blank" rel="noopener noreferrer">访问系统</a>
    <a href="https://github.com/EklipZZZ/materialgenerate/tree/vercel-byok" target="_blank" rel="noopener noreferrer">查看项目代码（当前实现分支）</a>
  </div>
</div>
