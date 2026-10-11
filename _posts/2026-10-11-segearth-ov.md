---
layout: post
title: "SegEarth-OV: Towards Training-Free Open-Vocabulary Segmentation for Remote Sensing Images"
date: "2026-10-11 12:25:47"
author: "EklipZ"
categories: ["论文笔记"]
permalink: "/lun-wen-bi-ji/segearth-ov/"
---

# SegEarth-OV: Towards Training-Free Open-Vocabulary Segmentation for Remote Sensing Images

Kaiyu Li 等，CVPR 2025。 [原论文](https://doi.org/10.1109/CVPR52734.2025.00986) · [项目与代码](https://likyoo.github.io/SegEarth-OV)

> **一句话概括：** 用 SimFeatUp 恢复 CLIP 局部特征的空间细节，再减去一部分全局 CLS 特征，改善遥感图像中的开放词汇分割。

## 问题

作者观察到，CLIP 的 patch 特征分辨率较低，在遥感影像里容易把小目标切坏、边界贴合不准；同时，图像级 CLS 表征携带的全局信息会影响 patch 特征，使局部区域也响应到不相关类别。

## 方法

1. **SimFeatUp 上采样：** 冻结 CLIP，用高分辨率 RGB 图像引导 joint bilateral upsampler 放大局部特征。SimFeatUp 在 16k 张无标签 Million-AID 遥感图像上单独训练，目标同时包含特征重建和图像内容重建。
2. **调整 CLIP 末层：** 为密集预测改动最后一个 Transformer block，以 $q$-$q$、$k$-$k$、$v$-$v$ 自注意力替换标准注意力，并去掉 FFN 与残差连接。
3. **减弱全局偏置：** 从每个局部 patch 特征中减去一定比例的 CLS 特征，再与类别文本嵌入计算相似度：

$$
\hat{O}_{\mathrm{patch}}=O_{\mathrm{patch}}-\lambda O_{\mathrm{cls}},\qquad \lambda=0.3
$$

## 结果与边界

论文在 17 个遥感数据集、4 类任务上评估。8 个多类别语义分割数据集的平均 mIoU 为 **39.2**，比 ClearCLIP 的 **33.4** 高 5.8 个点；作者报告建筑、道路和洪水提取任务的平均提升分别为 **8.2、4.0、15.3** 个点。消融中，上采样模块、图像重建约束和 CLS 偏置修正均带来增益；但更大的输入尺寸并非对所有数据集都有帮助，细粒度 iSAID 的 mIoU 也只有 21.7。

“Training-free”在本文中主要指**不用语义标注训练分割模型**。作者明确训练了 SimFeatUp，只是用无标签遥感图像、且与分割类别无关。因此它不符合“整个流程零参数更新”的严格定义；若只冻结并调用已训练好的 SimFeatUp 权重，那是另一种使用设置，跨域效果仍需验证。

## 对水下 OVSS 的启发

可借鉴的假设是：更高分辨率的局部特征或许有助于恢复小目标和边缘信息。但 SimFeatUp 学自遥感图像，水下的色偏、散射和低对比度并不等于遥感中的低分辨率问题；它可能修边，也可能把噪声放大。对 E2O，先把冻结权重作为独立对照，检查边界指标、小目标表现和总体 mIoU，不能预设一定有效；重新训练 SimFeatUp 则不符合当前零参数更新约束。

## 强相关笔记

论文直接比较了 [MaskCLIP复现](/dai-ma-bi-ji/maskclip无监督分割实战/)、[SCLIP](/lun-wen-bi-ji/sclip/) 和 [ClearCLIP](/lun-wen-bi-ji/clearclip/)。
