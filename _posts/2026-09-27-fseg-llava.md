---
layout: post
title: "FSeg-LLaVA：The Power of Prior"
date: "2026-09-27 07:58:33"
author: "EklipZ"
categories: ["论文笔记"]
permalink: "/lun-wen-bi-ji/fseg-llava/"
---

# FSeg-LLaVA：The Power of Prior

> **一句话概括：** 冻结 LLaVA，从中间层提取类别相关的视觉响应，再把可靠区域转成 SAM 的点框提示，完成 training-free OVSS。

![Pasted image 20260927113059](/assets/images/obsidian/f74b2a152598d9b5f88c4bec1b525691.png)

## 问题

CLIP 的 patch–文本匹配容易把不存在但语义相近的类别分给局部区域，也通常需要显式定义背景类别。论文转而利用 LLaVA 的生成式类别判断和局部视觉响应。

## 方法流程

1. **QAP**：逐类询问 LLaVA 图像中是否存在该类；若存在，再生成简短描述。
2. **TVR**：取 LLaVA 中间层（主要为第 7–13 层）的类别文本与视觉 token，结合相似度和注意力得到类别响应图。
3. **VGM → SAM**：用正、负视觉原型筛掉响应图中的噪声，生成前景点和外接框，提示 SAM 输出分割结果。

核心接口可简写为：

$$
M_r=M_v\odot\widehat{M}_f
\quad\longrightarrow\quad
\{\mathrm{points}(M_r),\mathrm{box}(M_r)\}
\quad\longrightarrow\quad
\mathrm{SAM}(I)
$$

其中 $M_v$ 是视觉原型筛选结果，$\widehat{M}_f$ 是 TVR 得到的可靠响应区域。

## 范式与证据

- **Training-free**：使用预训练 LLaVA 与 SAM，不在目标分割数据上训练或微调；也不要求输入背景子类。
- VOC21 上，FSeg-LLaVA1.5 达到 **68.0 mIoU**；FSeg-LLaVA1.6（Vicuna-7B）在五个数据集上的平均值为 **36.8**，高于 1.5 的 **35.7**，但并非每个数据集都更好。
- 点提示与框提示结合优于单独使用其一；论文也发现中间层定位优于过浅或过深层。对大面积、复杂的 stuff 类别，点框覆盖仍较困难。

## 对水下 OVSS 的启发（推论）

可验证“类别核验/短描述 → 中层语义响应 → 点框提示 SAM”这条推理链，重点观察水下色偏、浑浊时类别判断和提示区域是否稳定。

## 强相关笔记

论文直接比较：SCLIP、[ProxyCLIP](/lun-wen-bi-ji/proxyclip/)、ClearCLIP。

## 论文与代码

- [CVPR 2026 论文](https://openaccess.thecvf.com/content/CVPR2026/html/Zhang_The_Power_of_Prior_Training-Free_Open-Vocabulary_Semantic_Segmentation_with_LLaVA_CVPR_2026_paper.html)
- [官方代码](https://github.com/zbf1991/FSeg-LLaVA)
