---
layout: post
title: "AnchorDiff: Training-Free Concept Grounding for MM-DiTs via Anchor-Based Graph Propagation"
date: "2026-10-11 12:25:47"
author: "EklipZ"
categories: ["论文笔记"]
permalink: "/lun-wen-bi-ji/anchordiff/"
---

# AnchorDiff: Training-Free Concept Grounding for MM-DiTs via Anchor-Based Graph Propagation

Jian Zhang、Zhijun Zhang，arXiv:2605.26460v1，2026 年 5 月。[原论文](https://arxiv.org/abs/2605.26460)![Pasted image 20261011204633](/assets/images/obsidian/4670c670eaaf462d33005523d0bf91e0.png)

> **一句话概括：** 先从概念注意力中找一个最可信的目标位置，再用 MM-DiT 自注意力构造的图把响应扩到同一物体，同时尽量挡住相似干扰物。

## 问题

论文把“目标概念的响应漏到外观相似的非目标物体上”称为 **concept leakage**。例如问图里的 dog，响应可能同时覆盖 cat。直接把概念响应图铺开，或只按特征相似度传播，都可能把相似物体连在一起。

## 方法流程

1. **选 anchor：** 从概念到图像的 cross-attention 响应图 $A_{C\to I}$ 中，取目标概念响应最高的 patch，作为单点 seed。它负责回答“从哪里开始扩散”。
2. **建结构门：** 比较图像自注意力矩阵 $A_{I\to I}$ 的两行。每一行表示一个 patch 把注意力分给哪些图像 patch；两行相似，表示它们的注意力去向相近。作者保留相似度最高的 2% 连接作为 $G_{\mathrm{attn}}$，用来限制传播路径。
3. **补足物体内部连接：** 自注意力输出 $O_{I\to I}=A_{I\to I}V$ 是每个 patch 对其他 patch 的 value 特征做注意力加权后的结果。比较两个输出向量的余弦相似度，得到 **output-space similarity**：它衡量的是两个位置聚合后的上下文特征像不像，不是原始像素相似度，也不是类别文本相似度。它能连起同一物体上相距较远的部分，但也可能连到外观相似的另一物体，所以要用上一步的结构门过滤。

$$
W_{\mathrm{cos}}(i,j)=\cos(O_i,O_j),\qquad
W=W_{\mathrm{cos}}\odot G_{\mathrm{attn}},\qquad
s^{(t+1)}=\widehat W^{\top}s^{(t)}
$$

4. **传播并取 mask：** 从 one-hot anchor 开始，在行归一化后的图上迭代传播 160 步；把响应归一化到 $[0,1]$，再以响应均值二值化得到目标 mask。

因此，attention-row similarity 是“哪些位置看向相似的地方”，主要提供结构门；output-space similarity 是“看过上下文后得到的特征是否相似”，主要提供物体内部的稠密连接。前者减少错连，后者避免响应只停留在 seed 附近。

## 结果与边界

方法冻结 Stable Diffusion 3 / 3.5 的 MM-DiT，不更新模型参数。它在 ImageNet-Segmentation 与 PascalVOC 单概念 grounding 上，SD3.5 的 mIoU 分别为 **77.29** 和 **81.53**。作者另建含 1,272 张图的 Multi-Concept Confusion Dataset，针对同图中外观相似的多个概念评测泄漏；SD3.5 达到 **68.85 mIoU**、**89.97 Acc**，NAR 为 **12.21**，优于该测试上的 Seg4Diff SD3.5。这个数据集混合合成图和网络图，mask 由 Qwen2.5-VL 与 SAM2 生成后再人工检查。

AnchorDiff 的 seed 不是必然正确：论文在该数据集的 2,842 个图像-概念对上报告 anchor 命中率为 SD3 **89.09%**、SD3.5 **90.25%**。起点选错，后面的图传播无法自动纠正。并且每个概念只选一个 anchor，同类目标若彼此分离，单点可能覆盖不到其他实例。图层选择也依赖 backbone：论文分别为 SD3 和 SD3.5 使用不同层组合；“training-free”不等于无需算力或无需选推理超参数。

## 对水下 OVSS 的关系

可借鉴的是“语义位置作 seed、结构关系控制传播”这一拆分思路，不是把 AnchorDiff 直接插进 E2O。它读取的是 SD3/SD3.5 的 MM-DiT 内部注意力；E2O 的 CLIP 特征和 GMG/CSA 接口不同。若要验证这条思路，应先比较水下图像中的 anchor 命中率、相似干扰物泄漏和边界覆盖；并确认单个 seed 是否足以覆盖目标。论文做的是逐概念 grounding mask，不等同于对整幅图做互斥、穷尽的多类别语义分割。
