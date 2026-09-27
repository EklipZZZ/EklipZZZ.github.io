---
layout: post
title: "ProxyCLIP"
date: "2026-09-27 07:58:33"
author: "EklipZ"
categories: ["论文笔记"]
permalink: "/lun-wen-bi-ji/proxyclip/"
---

核心：代理注意力，归一化和掩码，小patch



什么是代理注意力
- 利用VFM的视觉特征进行相似度匹配后的矩阵作为CLIP的注意力矩阵，然后利用CLIP最后一层的值嵌入进行交互，得到最终的具有区分能力和空间一致性的视觉特征
- 代理指的是：**CLIP的注意力矩阵替换为VFM的相似度矩阵。**

![Pasted image 20260830231815](/assets/images/obsidian/ebf44b03bf922e4120e6ea0055b020fb.png)

归一化和掩码
动机：VFM获得的代理注意力并不一定有良好的一致性，因为它们的归纳偏置不一定相同
为此,作者计算了一个归一化矩阵
相当于对所有VFM的相似度矩阵进行了一个归一化处理，确保不会受到尺度的影响(不同VFM相似度分数的分布不同)。
这一步把 VFM 的相似度矩阵变成了标准的注意力权重矩阵：每一行对应一个“中心 patch”，对所有 patch 做 softmax 得到归一加权系数。
