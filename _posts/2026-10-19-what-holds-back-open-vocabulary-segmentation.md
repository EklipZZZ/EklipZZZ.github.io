---
layout: post
title: "What Holds Back Open-Vocabulary Segmentation?"
date: "2026-10-19 12:17:10"
author: "EklipZ"
categories: ["论文笔记"]
permalink: "/lun-wen-bi-ji/what-holds-back-open-vocabulary-segmentation/"
---

# What Holds Back Open-Vocabulary Segmentation?

Josip Šarić、Ivan Martinović、Matej Kristan、Siniša Šegvić，ICCV Workshops 2025。 [原论文](https://doi.org/10.1109/ICCVW69036.2025.00448)

> **一句话：** 开放词汇分割的误差来自多个环节：区域分类、mask 候选生成、候选筛选，以及训练集与测试集之间的标注规则差异。

## 论文范围

作者分析训练式 mask-based panoptic segmentation，实验模型为 FC-CLIP 和 MAFT+，训练集为 COCO、测试集为 ADE20K，使用 PQ 评价。论文用 oracle（以真实标注替换某一环节）分别检查分类和 mask 流程的上限。

![Pasted image 20261018214038](/assets/images/obsidian/1b660f125cf97db20d52446ca750a695.png)

图中汇总了 2023–2025 年 COCO→ADE20K 的开放词汇方法表现。作者观察到近两年性能进入平台期，和全监督基线仍有明显差距：语义分割约差 18.1 mIoU，panoptic segmentation 约差 20.8 PQ。

## 三个实验分别说明什么

### 1. 给正确 mask，区域分类仍不够强

作者用 ADE20K 的真实 mask 汇聚图像特征，再与类别文本特征计算相似度，从而单独测区域分类。最好的零样本结果是 OpenCLIP ConvNeXt-Large 的 **41.8 PQ**，比同骨干的 ADE20K 全监督 Mask2Former 低近 8 点。这验证了 CLIP 区域级分类的短板：即使边界完全正确，视觉—文本模型仍会认错区域内容。作者据此提出改进 VLM 预训练，让视觉表征更适合 dense recognition。

### 2. 给现有 mask 正确类别，结果会明显上升

作者保留模型预测出的 mask；当预测区域与真实区域的 IoU 大于 0.5 时，用真实类别替换模型类别。

| 模型 | 原始 PQ | oracle 分类后 PQ | unseen 类 PQ：原始 → 修正后 |
|---|---:|---:|---:|
| FC-CLIP | 26.8 | 39.8 | 17.3 → 34.2 |
| MAFT+ | 26.9 | 39.2 | 19.5 → 34.3 |

类别判断是明显瓶颈，尤其影响 unseen 类。oracle 只修正与真实区域 IoU 大于 0.5 的预测 mask；其他区域保留模型原有结果。修正后仍与全监督结果有差距，说明类别分对了，现有 mask proposal 也可能覆盖不足。论文 Table 2 与 Table 3 的 MAFT+ 原始 unseen PQ 分别列为 19.5 和 17.4；上表按 Table 2 的分类实验记录。

### 3. 候选 mask 选出来了，也可能被 no-object 筛掉

作者用真实标注从模型生成的候选 mask 中做 oracle matching。只替换选择步骤时，PQ 反而从 **26.8 降至 21.9**（FC-CLIP）、从 **26.9 降至 25.4**（MAFT+）：oracle 选中的有效区域仍会被 no-object 分类过滤。移除 no-object logit 后，PQ 升至 **36.7** 和 **33.7**，说明候选筛选本身也影响最终结果。

## 标注规则造成的另一类误差

作者比较 COCO 与 ADE20K 的标注后，发现部分类别的定义并不一致。例如，ADE20K 会单独标注墙上的 painting，而 COCO 常不标或把它并入墙面；两套数据对 pillow、traffic sign 的涵盖范围也不同。模型在 COCO 训练时没有被要求生成这些区域的 mask，甚至可能学会把相关候选判为 no-object。

这类错误来自训练监督与测试评价采用不同的区域定义。作者建议统一或精确映射数据集的类别体系，并指出现有 proposal generator 缺少词汇意识：测试类别词表变化时，同一图像仍会产生相同的 mask 候选。我读到这里想到之前看过的 promptable 方法：能否让类别词汇参与几何 mask 的生成，作为词汇感知 proposal 的原型？

作者还讨论了两种标注引导：提供 few-shot exemplar segmentation，或输入详细的自然语言标注规则。我的判断是，第一种不符合 training-free，第二种更实际。作者也指出，文字规则比收集覆盖各种情况的 exemplar 更容易准备；但 CLIP 文本编码器偏 bag-of-words，难以表达复杂规则。更强的语言编码器有助于描述细粒度类别，视觉编码器也需要具备相应的区分能力。

## 对水下 training-free OVSS 的关系

这篇工作的实验对象是训练式 panoptic 模型，给水下 OVSS 最直接的启发是把误差拆开测：固定模型和数据划分，比较真实区域上的冻结语义分类、当前 mask 对目标的覆盖，以及完整预测结果。这样可以定位主要损失来自区域生成还是类别判断。迁移到 E2O 时，按水下类别定义和分割指标评估，并检查推理流程中的候选筛选是否会丢掉有效区域。
