---
layout: default
title: "水下开放词汇分割：研究路线"
permalink: "/lun-wen-bi-ji/underwater-ovss/"
---

# 水下开放词汇分割：研究路线

这份导航记录从 **2026 年 8 月至今**的问题、尝试与下一步。水下开放词汇语义分割要做的是：给定一张水下图像和一组文字类别，为图像中的位置分配对应类别。研究重点是理解现有模型何时能可靠地判断目标，何时会把错误传给更多区域。

这里的“免训练”指当前任务中不更新模型参数；使用的 CLIP、DINO 和其他模型本身仍来自预训练。不同实验的模型、数据和评价口径并不完全相同，不能直接把零散结果拼成一个完整方法。

<link rel="stylesheet" href="/assets/css/research-map.css">

<section class="research-map" aria-label="研究历程总览">
  <div class="map-header"><div><span>RESEARCH JOURNEY / 2026</span><h2>从基线到问题拆解</h2></div><b>01 — 04</b></div>
  <p class="map-intro">以实验问题为线索，串联每个阶段的探索。</p>
  <div class="journey-grid">
    <a href="#2026-年-8-月从论文阅读到基线复现"><small>01 / AUG</small><strong>建立基线</strong><p>论文阅读 → E2O 复现<br>检查数据与评价口径</p><em>语义从哪里来？</em></a>
    <a href="#2026-年-9-月文字语义与空间传播"><small>02 / SEP</small><strong>语义 × 传播</strong><p>类别表达 · 同义词<br>视觉结构与空间关系</p><em>描述和传播如何影响预测？</em></a>
    <a href="#2026-年-10-月从候选区域转向区域判类"><small>03 / OCT</small><strong>区域 × 判类</strong><p>点框与分割候选<br>覆盖、分类及区域竞争</p><em>候选有了，类别对吗？</em></a>
    <a href="#2026-年-11-月视觉代表背景与结构"><small>04 / NOV</small><strong>视觉代表</strong><p>选点 · 前景与水体<br>结构传播及配对比较</p><em>可靠证据怎样利用？</em></a>
  </div>
  <div class="map-footer">阶段关联展示研究脉络；具体实验条件以各自记录为准。</div>
</section>

<section class="research-map research-branches" aria-label="后续研究问题架构图">
  <div class="map-header"><div><span>QUESTION MAP / NEXT</span><h2>把问题拆开，再逐项验证</h2></div><b>EXPLORING</b></div>
  <div class="map-root"><small>REFERENCE</small><strong>水下图像 + 类别文本</strong><span>E2O 基线及匹配条件下的预测</span></div>
  <div class="branch-stem" aria-hidden="true"></div>
  <div class="branch-grid">
    <div><small>01 / SEMANTICS</small><strong>类别证据</strong><p>描述是否覆盖可见目标？<br>不同来源是否一致？</p></div>
    <div><small>02 / PROTOTYPES</small><strong>视觉代表</strong><p>选点是否正确且有覆盖？<br>水体误报与目标误删如何权衡？</p></div>
    <div><small>03 / STRUCTURE</small><strong>空间传播</strong><p>结构信息如何引导传播？<br>错误是否被进一步放大？</p></div>
    <div><small>04 / EVALUATION</small><strong>评价与复核</strong><p>类别、背景、忽略值一致吗？<br>同图对照与独立数据能否复现？</p></div>
  </div>
  <div class="map-footer">并行的待验证问题，连线表示比较关系，不表示模块已组合成完整方法。</div>
</section>

<p class="research-csdn">更多同步阅读笔记：<a href="https://blog.csdn.net/2511_93684020">CSDN · VoidLoop0x0 ↗</a></p>

## 2026 年 8 月：从论文阅读到基线复现

阅读 [MaskCLIP](/lun-wen-bi-ji/maskcilp/)、[E2O](/lun-wen-bi-ji/e2o/) 等工作，理解如何把图文模型的全局语义转成位置级类别响应；随后复现 E2O，检查数据读取、类别映射、提示词以及评价流程。

**阶段问题：**水下颜色退化和外观相似会影响文字与图像的匹配；空间传播可以改善预测，也可能把局部错误扩散。复现的作用是建立可比较的起点。

## 2026 年 9 月：文字语义与空间传播

围绕类别名称、同义词和属性描述开展对照，并比较不同视觉结构特征在传播中的作用。部分描述改写和传播替换在不同样本上的变化并不稳定；单次结果不能直接当作普遍有效的结论。

这一阶段逐渐形成的判断是：**文字描述、位置关系和最后的像素解码要分开检查**。某个环节看起来合理，并不保证叠加后更好。相关阅读包括 [SynCLIP](/lun-wen-bi-ji/synclip/)、[TextRegion](/lun-wen-bi-ji/textregion/) 和 [ProxyCLIP](/lun-wen-bi-ji/proxyclip/)。

## 2026 年 10 月：从候选区域转向区域判类

尝试以点、框和通用分割模型生成候选区域，再比较图块特征、图像裁剪和文本匹配等区域判类方式；也单独探索了 SAM3 的文本与区域路线。

分析中发现，**区域是否覆盖目标**与**区域是否被判为正确类别**是两个不同的问题。使用标注做事后诊断可以帮助区分错误来源，但这种诊断不能当成实际预测能力；区域竞争、漏类和误报也需要分别看。

## 2026 年 11 月：视觉代表、背景与结构

在 E2O 基线上，继续比较从图像中选择代表位置、构建类别视觉代表，以及加入水体相关视觉证据的做法。不同数据集和描述来源下存在明显差异：有的改善背景误报，也有出现目标被误删或整体退化的情况，因此仍需同图配对检查。

近期还探索了 DINO 区域、区域表示及空间传播关系。部分区域读出和裁剪对照未优于原参照；借助真实标注干预传播的实验属于**事后机制诊断**，不能当成不使用标注的实际预测效果。具体条件和样本范围仍应回到实验记录核对。

## 下一步：把问题拆开验证

下面是待验证的方向，不表示已经连成完整系统：

1. **类别证据是否可靠：**检查文字描述与图像中实际可见内容的对应关系，并比较不同来源的描述是否遗漏真实目标。
2. **视觉代表是否有帮助：**分别检查选点的正确性、覆盖范围和错点的影响，再比较加入视觉证据前后的预测；特别关注水体误报与目标误删之间的取舍。
3. **结构信息如何使用：**固定语义输入，比较是否传播、普通邻域传播与视觉结构引导传播，并检查错误是否被扩大。
4. **评价是否可信：**明确各数据集的类别、背景和忽略值；保留负结果，在匹配条件下与基线比较，并为最终评价保留合适的独立数据。

每次优先改变一个因素，用同一批图片、相同类别与评价口径比较；若效果只在某些数据或条件下出现，就按对应范围报告。

## 延伸阅读

- 基线与密集特征：[E2O](/lun-wen-bi-ji/e2o/) · [ClearCLIP](/lun-wen-bi-ji/clearclip/) · [SCLIP](/lun-wen-bi-ji/sclip/)
- 区域与结构：[TextRegion](/lun-wen-bi-ji/textregion/) · [GeoSeC](/lun-wen-bi-ji/geosec/) · [SAM](/lun-wen-bi-ji/sam/) · [SAM3](/lun-wen-bi-ji/sam3/)
- 语义与视觉代表：[SynCLIP](/lun-wen-bi-ji/synclip/) · [RSVP](/lun-wen-bi-ji/rsvp/) · [TCC](/lun-wen-bi-ji/tcc/)

*这是一份公开的阶段性概览，依据截至 2026 年 11 月的阅读与实验记录整理；更详细的配置、样本和结果以各实验记录为准。*
