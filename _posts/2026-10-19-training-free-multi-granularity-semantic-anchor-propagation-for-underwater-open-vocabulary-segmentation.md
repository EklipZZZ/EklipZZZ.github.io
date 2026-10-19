---
layout: post
title: "Training-Free Multi-Granularity Semantic Anchor Propagation for Underwater Open-Vocabulary Segmentation"
date: "2026-10-19 12:17:10"
author: "EklipZ"
categories: ["论文笔记"]
permalink: "/lun-wen-bi-ji/training-free-multi-granularity-semantic-anchor-propagation-for-underwater-open-vocabulary-segmentation/"
---

## 1. 研究背景

  

本项目以 **Earth2Ocean（E2O）** 为 baseline，关注 **training-free underwater open-vocabulary segmentation**。E2O 的核心目标是在不进行额外水下训练的前提下，将陆地图像上预训练的视觉—语言模型迁移到水下场景。

  

E2O 主要包含两个关键模块：

  

- **GMG（Geometric-guided Visual Mask Generator）**：利用额外的几何视觉编码器提取特征，并通过 patch-to-patch self-similarity 构造几何注意力先验，用于修正 CLIP 的视觉特征。

- **CSA（Category-visual Semantic Alignment）**：利用水下场景模板和 MLLM 生成的 caption、object、attribute 等信息增强类别文本表示，并将增强后的文本表示与视觉特征进行像素级匹配。

  

E2O 的基本逻辑可以概括为：

  

$[\text{Category-independent geometric refinement}+\text{semantic embedding enhancement}\rightarrow\text{pixel-category matching}]$

  

目前我们的研究重点不是改变其 **training-free** 设定，而是进一步思考：**如何让丰富的文本语义真正参与空间定位，而不是仅在最终匹配前被压缩为一个融合后的文本向量。**

  

---

  

## 2. E2O 当前存在的关键问题

  

### 2.1 语义增强主要停留在文本表示层面

  

E2O 的 CSA 已经引入了较丰富的语义信息，包括：

  

- 类别名称；

- 水下场景模板；

- 图像 caption；

- object 信息；

- attribute 描述。

  

但这些信息最终仍主要被编码并融合为一个类别文本表示：

  

\[

E_{\mathrm{fused}}

\]

  

随后直接与修正后的视觉特征进行匹配。

  

因此，E2O 实际采用的是：

  

\[

\text{rich semantics}

\rightarrow

\text{single fused text embedding}

\rightarrow

\text{dense matching}

\]

  

这样做虽然增强了类别语义，但不同语义粒度对应的空间信息并未被显式利用。

  

例如，对于同一目标：

  

- 类别语义可能回答“它是什么”；

- 中等粒度描述可能回答“它整体长什么样”；

- 属性语义可能回答“哪些局部区域具有最明显的判别特征”。

  

这些语义并不一定对应完全相同的视觉区域。如果提前将它们融合为单一 embedding，其空间互补性可能被弱化。

  

---

  

### 2.2 GMG 的传播是 category-agnostic 的

  

E2O 的 GMG 首先通过几何编码器获得视觉特征，并计算：

  

\[

S = G^{\top}G

\]

  

得到整幅图像的 patch-to-patch self-similarity，再利用该结构关系修正 CLIP 特征。

  

其核心问题在于：

  

> **GMG 能够回答“哪些 patch 在视觉结构上相似”，但不知道“对于当前类别，应该从哪些 patch 开始传播”。**

  

也就是说，其传播过程主要由视觉几何结构决定，与当前类别语义之间缺少显式联系。

  

因此，E2O 的 GMG 更接近：

  

\[

\boxed{\text{Category-agnostic geometric propagation}}

\]

  

而我们希望进一步实现：

  

\[

\boxed{\text{Semantic-conditioned spatial propagation}}

\]

  

---

  

## 3. 我们目前的核心思考

  

我们的基本出发点是：

  

> **不同粒度的文本语义不应该只用于构造一个更强的类别文本原型，而应该分别参与视觉空间定位。**

  

具体而言，我们希望借鉴 SynCLIP 中 SAR 的核心思想：

  

\[

\text{semantic point}

\rightarrow

\text{VFM spatial correlation}

\rightarrow

\text{object region expansion}

\]

  

但不照搬 SynCLIP 的训练机制，而是在 **training-free** 条件下重新设计。

  

整体流程暂定为：

  

\[

\boxed{

\text{Multi-granularity semantics}

\rightarrow

\text{CLIP semantic anchors}

\rightarrow

\text{DINO anchor propagation}

\rightarrow

\text{multi-anchor fusion}

}

\]

  

其中最核心的创新问题聚焦在三个部分：

  

1. **如何在 CLIP 特征图上确定可靠且互补的 semantic anchors；**

2. **如何将这些 anchors 映射到 DINO 空间并进行有效传播；**

3. **如何融合多个 anchor 对应的 DINO propagation maps。**

  

---

  

## 4. 与 E2O 的核心差异

  

### 4.1 从“文本特征融合”转向“多粒度语义空间定位”

  

E2O：

  

\[

\text{multiple semantic cues}

\rightarrow

\text{fused text embedding}

\]

  

我们的思路：

  

\[

\text{multiple semantic cues}

\rightarrow

\text{multiple spatial grounding maps}

\]

  

对于类别 \(c\)，构造不同粒度的文本：

  

\[

T^c=

\{T^c_{1},T^c_{2},...,T^c_{G}\}

\]

  

例如：

  

- 类别级：`zebrafish`

- 描述级：`a small striped fish`

- 属性级：`striped body`

- 属性级：`silver appearance`

- 属性级：`elongated body shape`

  

利用冻结的 CLIP text encoder 得到文本特征：

  

\[

t_g^c=F_T(T_g^c)

\]

  

并分别与 CLIP dense visual features 计算相似度：

  

\[

A_g^c(i)=

\cos(t_g^c,V_i^{CLIP})

\]

  

由此得到多个不同粒度的语义响应图，而不是先将所有文本融合。

  

---

  

### 4.2 从“全局 self-similarity”转向“semantic anchor-guided propagation”

  

E2O：

  

\[

G

\rightarrow

G^\top G

\rightarrow

A_{\mathrm{geo}}

\]

  

即先建立整幅图像上的视觉结构关系。

  

我们的思路则首先由语义确定可靠位置：

  

\[

A_g^c

\rightarrow

p_{g,k}^c

\]

  

其中：

  

\[

p_{g,k}^c

\]

  

表示由第 \(g\) 个语义粒度选出的第 \(k\) 个 semantic anchor。

  

然后将 CLIP 上的 anchor **按照空间位置映射**到 DINO 特征图，而不是学习一个 CLIP-to-DINO 特征映射：

  

\[

p_{g,k}^{CLIP}

\rightarrow

p_{g,k}^{DINO}

\]

  

再以该 DINO anchor feature 为中心，与整幅 DINO 特征图计算视觉相关性：

  

\[

R_{g,k}^c(j)

=

\cos

\left(

d_{p_{g,k}^c},

d_j

\right)

\]

  

得到一张 anchor-specific spatial correlation map。

  

因此，两者的根本差异是：

  

### E2O

  

\[

\boxed{

\text{visual structure}

\rightarrow

\text{global geometric propagation}

}

\]

  

### Ours

  

\[

\boxed{

\text{category semantics}

\rightarrow

\text{semantic anchors}

\rightarrow

\text{anchor-conditioned visual propagation}

}

\]

  

---

  

## 5. 为什么需要多粒度 Semantic Anchors

  

单一类别名称往往只能提供较粗的类别语义。

  

例如：

  

> `zebrafish`

  

可能能够找到鱼的大体区域，但面对：

  

- 相似鱼类；

- 复杂水下背景；

- 低对比度；

- 遮挡；

- 目标尺度变化；

  

单一类别文本产生的响应可能不稳定。

  

不同粒度语义可以提供不同但互补的定位信息：

  

\[

\text{category}

\rightarrow

\text{object identity}

\]

  

\[

\text{description}

\rightarrow

\text{overall appearance}

\]

  

\[

\text{attribute}

\rightarrow

\text{local discriminative cues}

\]

  

因此，我们希望不同语义分别产生 anchors：

  

\[

\mathcal P^c=

\{p_1^c,p_2^c,\ldots,p_K^c\}

\]

  

这些 anchors 不应简单等价于 CLIP activation map 的 Top-K，而需要进一步考虑：

  

### 5.1 Semantic confidence

  

anchor 对当前类别语义具有较高响应。

  

### 5.2 Cross-granularity consistency

  

同一空间位置如果被多个语义粒度共同支持，其可靠性更高。

  

### 5.3 Discriminability

  

anchor 不仅要对目标类别高响应，还应尽量减少与其他相似类别的混淆。

  

### 5.4 Spatial complementarity

  

多个 anchors 不应全部集中在目标同一个局部区域，而应覆盖具有互补信息的视觉区域。

  

因此，我们最终需要解决的第一个核心问题是：

  

\[

\boxed{

\text{How to select reliable, discriminative and complementary semantic anchors?}

}

\]

  

---

  

## 6. 为什么需要 DINO Propagation

  

CLIP 更擅长解决：

  

> **“哪个位置具有当前文本语义？”**

  

但它的 dense spatial representation 不一定能够完整恢复目标边界。

  

因此，CLIP 更适合作为 **semantic locator**。

  

相反，DINO 的局部视觉特征通常具有更好的空间结构一致性，因此更适合回答：

  

> **“与这个可靠语义点属于同一视觉结构的区域还有哪些？”**

  

因此，我们希望建立明确的功能分工：

  

\[

\boxed{

\text{CLIP: semantic localization}

}

\]

  

\[

\boxed{

\text{DINO: structural propagation}

}

\]

  

对于一个 anchor：

  

\[

p_k^c

\]

  

首先找到其对应的 DINO feature：

  

\[

d_{p_k^c}

\]

  

然后计算：

  

\[

R_k^c(j)

=

\cos(d_{p_k^c},d_j)

\]

  

由一个 semantic point 扩展得到一张 spatial correlation map：

  

\[

p_k^c

\rightarrow

R_k^c

\]

  

因此，DINO 的作用不是重新进行类别识别，而是：

  

> **利用视觉自相似性恢复 semantic anchor 所属目标的空间范围。**

  

---

  

## 7. 为什么不能简单平均多个 DINO Propagation Maps

  

不同 semantic anchors 的可靠性并不相同。

  

例如：

  

- `striped body` 可能高度对应目标主体；

- `silver` 可能同时响应鱼体与水面高光；

- `small` 本身空间判别性可能较弱；

- 类别名称可能覆盖整体目标，但边界不完整。

  

因此，如果简单：

  

\[

R^c=

\frac{1}{K}

\sum_{k=1}^{K}R_k^c

\]

  

容易把错误传播结果一起引入。

  

所以第三个关键问题不是“如何平均”，而是：

  

\[

\boxed{

\text{How to adaptively fuse multiple semantic-anchor propagation results?}

}

\]

  

当前可以重点考虑三个信息来源：

  

### 7.1 Anchor confidence

  

CLIP 对该 anchor 的原始语义置信度。

  

### 7.2 Cross-anchor consistency

  

如果多个独立 anchors 在 DINO 空间传播后指向相同区域，则这些区域可信度更高。

  

### 7.3 Cross-granularity complementarity

  

粗粒度语义负责稳定主体区域，细粒度语义负责补充局部判别结构。

  

因此，可以考虑：

  

\[

R^c=

\sum_{k=1}^{K}

w_k^cR_k^c

\]

  

其中：

  

\[

w_k^c=

f(

\text{confidence},

\text{consistency},

\text{redundancy}

)

\]

  

整个权重计算过程必须保持 training-free，不引入任何可学习参数。

  

---

  

## 8. 当前方法与 SynCLIP SAR 的关系

  

我们的思路受到 SynCLIP SAR 的启发，但不等同于直接移植 SAR。

  

SynCLIP 的关键思想是：

  

\[

\text{semantic activation}

\rightarrow

\text{semantic tokens}

\rightarrow

\text{VFM spatial correlation}

\]

  

我们保留其中：

  

> **以语义定位得到的可靠视觉点作为 VFM 空间传播的起点。**

  

但我们的研究重点进一步转向：

  

### 8.1 从单一语义响应扩展为多粒度语义响应

  

不是只寻找一组高响应 semantic tokens，而是利用不同粒度文本分别定位不同语义 anchors。

  

### 8.2 Anchor selection 本身成为核心模块

  

不是简单 Top-K，而是考虑语义一致性、判别性与互补性。

  

### 8.3 传播结果不简单平均

  

不同语义 anchor 得到的 DINO correlation maps 进一步进行自适应融合。

  

因此，我们真正需要建立的是：

  

\[

\boxed{

\text{Multi-granularity Semantic Anchor Propagation}

}

\]

  

而不是简单的：

  

\[

\text{SynCLIP SAR for underwater images}

\]

  

---

  

## 9. 当前方法的核心技术问题

  

现阶段整个方法可以压缩为三个研究问题。

  

### Problem 1：Semantic Anchor Determination

  

> 如何利用多粒度文本响应，从 CLIP 特征图中确定可靠、判别且互补的 semantic anchors？

  

这是第一个主要创新点。

  

---

  

### Problem 2：Semantic-conditioned DINO Propagation

  

> 如何利用 semantic anchors 引导 DINO 的视觉结构传播，并控制传播范围，减少背景或相似纹理导致的错误扩散？

  

这是第二个主要创新点。

  

---

  

### Problem 3：Cross-anchor Adaptive Fusion

  

> 如何根据 anchor 可靠性、传播结果一致性以及不同语义粒度之间的互补关系，自适应融合多个 DINO propagation maps？

  

这是第三个主要创新点。

  

---

  

## 10. 当前整体框架

  

```text

Input Underwater Image

        │

        ├─────────────────────────────┐

        │                             │

        ▼                             ▼

   CLIP Visual                    DINO Visual

    Encoder                        Encoder

        │                             │

        ▼                             ▼

 Dense CLIP Features            Dense DINO Features

        ▲

        │

Multi-granularity Text

        │

        ├── Category-level

        ├── Description-level

        └── Attribute-level

        │

        ▼

Granularity-specific

CLIP Response Maps

        │

        ▼

Semantic Anchor Determination

        │

        ▼

Multiple Semantic Anchors

        │

        │ spatial correspondence

        ▼

Corresponding DINO Anchors

        │

        ▼

Anchor-wise DINO Propagation

        │

        ▼

R1, R2, ..., RK

        │

        ▼

Cross-anchor Adaptive Fusion

        │

        ▼

Final Semantic-aware Spatial Map

        │

        ▼

Refine / Guide CLIP Prediction

        │

        ▼

Final Segmentation

```

  

---

  

## 11. 与 E2O 的方法演进关系

  

可以将整个改进概括为以下三个变化。

  

### E2O：Semantic Fusion

  

\[

\text{multiple semantics}

\rightarrow

\text{one fused embedding}

\]

  

### Ours：Semantic Grounding

  

\[

\text{multiple semantics}

\rightarrow

\text{multiple semantic anchors}

\]

  

---

  

### E2O：Category-agnostic Geometry

  

\[

G^\top G

\rightarrow

\text{global geometric prior}

\]

  

### Ours：Category-conditioned Geometry

  

\[

\text{semantic anchor}

\rightarrow

\text{DINO structural propagation}

\]

  

---

  

### E2O：Single Geometric Refinement

  

\[

A_{\mathrm{geo}}V

\]

  

### Ours：Multi-anchor Adaptive Refinement

  

\[

\{R_1,\ldots,R_K\}

\rightarrow

R_{\mathrm{final}}

\]

  

---

  

## 12. 一句话概括当前方法

  

> **不同于 Earth2Ocean 将丰富语义融合为单一文本表示，并利用类别无关的几何先验统一修正视觉特征，我们保留不同粒度语义的空间差异，在 CLIP 特征图中挖掘可靠且互补的语义锚点，并以这些锚点为起点在 DINO 空间中传播目标结构信息，进一步通过跨锚点自适应融合获得最终的类别相关空间响应，从而在 training-free 条件下实现由语义驱动的细粒度视觉定位。**

  

---

  

## 13. 当前需要继续解决的问题

  

后续研究优先集中在以下三个问题，而暂时不扩展其他模块：

  

1. **Anchor 如何选？**

   - Top-K 是否足够？

   - 是否需要跨粒度一致性？

   - 如何避免多个 anchor 高度冗余？

   - 如何考虑类别间 discriminability？

  

2. **Anchor 如何传播？**

   - 全局 cosine similarity 是否足够？

   - 是否需要阈值控制？

   - 是否需要 CLIP semantic map 对 DINO propagation 进行约束？

   - 如何防止相似背景纹理造成过传播？

  

3. **多个传播结果如何融合？**

   - confidence weighting；

   - agreement weighting；

   - redundancy suppression；

   - coarse-to-fine fusion；

   - 是否可以形成完全无参数的自适应融合机制。

  

这三个问题应作为当前方法设计和后续消融实验的主线。

  

---

  

## 14. 当前研究原则

  

整个方法设计需要始终满足以下约束：

  

- **Training-free**：不进行额外训练或微调；

- CLIP、DINO、MLLM 等模型参数均保持冻结；

- 不依赖水下训练集学习额外参数；

- 所有 anchor selection、propagation 和 fusion 均通过推理阶段计算完成；

- 避免简单堆叠 SynCLIP SAR，而应重点突出多粒度 anchor selection、semantic-conditioned propagation 和 adaptive fusion；

- 方法创新应围绕“语义如何指导空间传播”展开，而不是继续增加文本描述数量或基础模型数量。
