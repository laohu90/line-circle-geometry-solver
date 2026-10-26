# Line & Circle Geometry Solver (直线与圆位置关系判定器)

> **High-School & College Analytical Geometry Assistant & SEO-Optimized Web App**  
> *Determine Secant, Tangent, and Disjoint Relations, Complete the Square Step-by-Step, Calculate Intercepted Chord Lengths, and Manage Exam Mistake Notebooks.*

[![Live Demo](https://img.shields.io/badge/Demo-line--circle--geometry--solver.formulacalckit.com-emerald.svg)](https://line-circle-geometry-solver.formulacalckit.com)
[![GitHub](https://img.shields.io/badge/GitHub-laohu90%2Fline--circle--geometry--solver-blue.svg)](https://github.com/laohu90/line-circle-geometry-solver)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-7.0-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-61dafb)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8)](https://tailwindcss.com/)
[![KaTeX](https://img.shields.io/badge/LaTeX-KaTeX-3298dc)](https://katex.org/)

---

## 🆕 Recent Updates (v1.1.0)
- **智能识别增强 (Auto Parse)**：支持标准式 `(x-x₀)²+(y-y₀)²=r²` 展开与自动匹配，支持多方程分隔识别与单方程待机置灰保护，无法识别时提供醒目红色错误提示。
- **解题步骤中文文案与充要条件**：完善 $D^2+E^2-4F=0$ 点圆检验与退化说明，相交时明确标注 $d_{\min}=0$。
- **考点与秒杀公式精炼例题**：垂径定理、配方法、最值范围、防斜率不存在四大模型均配备直观数字例题。
- **错题本全中文标签与心得**：标签（相交与弦长、最值距离、相切与切线、竖直线防坑、垂径定理）及心得前缀（易错坑点、核心原理、考场策略等）全中文支持，新增标签分类筛选与清空二次确认。
- **移动端全面优化**：深度适配 iPhone 13 (390×844) 及 375~420px 屏幕，Canvas 支持单指平移与双指捏合缩放，参数框与操作按钮防溢出。

---

## 🌟 Key Features

### 1. Analytical Mathematical Derivation & Completing the Square
- **General to Standard Circle Form**: Automatically groups variables, moves constants, and calculates $(x + D/2)^2 + (y + E/2)^2 = (D^2 + E^2 - 4F)/4$.
- **Circle Existence Condition**: Rigorously evaluates $D^2 + E^2 - 4F > 0$ for real circles, detects point degenerations ($=0$) and imaginary loci ($<0$).
- **Perpendicular Distance Formula**: Step-by-step substitution into $d = \frac{|Ax_0 + By_0 + C|}{\sqrt{A^2 + B^2}}$ with numerator absolute values and simplified exact radicals.
- **Classification Matrix**: Real-time classification between **Secant ($d < R$)**, **Tangent ($d = R$)**, and **Disjoint ($d > R$)**.

### 2. Dual-Method Chord Length Theorem
- **Method 1 (Geometric Chord Theorem)**: In the right-angled triangle $\text{Rt}\triangle OHA$ formed by center $O$, perpendicular foot $H$, and chord endpoint $A$:
  $$R^2 = d^2 + \left(\frac{L}{2}\right)^2 \implies L = 2\sqrt{R^2 - d^2}$$
- **Method 2 (Algebraic Elimination & Vieta's Formulas)**: Substitutes the line into the circle, yielding quadratic $ax^2 + bx + c = 0$, evaluating discriminant $\Delta > 0$, and deriving chord length $L = \sqrt{1 + k^2}|x_1 - x_2|$.
- **Dual-Proof Verification**: Cross-verifies both methods to ensure 100% calculation accuracy for high-stakes college entrance and AP exams.

### 3. Interactive Cartesian Canvas
- High-precision coordinate grid with dynamic pan and continuous mouse-wheel zoom.
- Live perpendicular segment $d$ with right-angle indicator $\llcorner$ and foot $H$.
- Interactive drag: drag the center $O(x_0, y_0)$ or the circumference to observe live geometric transitions.
- High-resolution SVG export for note-taking and assignment illustrations.

### 4. Smart Natural Equation Parser
- Paste any natural equation like:
  - `(x - 2)^2 + (y + 1)^2 = 9`
  - `x^2 + y^2 - 4x + 2y - 4 = 0`
  - `3x + 4y - 12 = 0`
  - `y = -0.75x + 3`
  - `x = 4` (vertical line with undefined slope)
- Instant recognition and parameter extraction without tedious manual input.

### 5. Multilingual Localization (Default: English)
- **English** (Default)
- **Español** (Spanish)
- **Français** (French)
- **Português** (Portuguese)
- **中文** (Chinese)

### 6. Problem Notebook & Exam Question Bank
- Save challenging questions with 1-click.
- Record personal pitfall notes and memory shortcuts.
- Tag and keyword search with real-time match highlighting.
- Printable exam review mode (`Ctrl + P` / `Cmd + P`) and JSON data backup/import.

---

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/laohu90/line-circle-geometry-solver.git

# Navigate to project directory
cd line-circle-geometry-solver

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

### Build for Production

```bash
npm run build
```

The output will be generated in the `dist` directory, ready to deploy to any static host (Vercel, Cloudflare Pages, Netlify, GitHub Pages).

---

## 📈 Google SEO & Organic Traffic Architecture

- **Semantic HTML5 & Google Guidelines Compliant**: Clean document structure with WCAG AA accessibility.
- **Schema.org Structured Data**:
  - `WebApplication` schema for rich software application carousels.
  - `FAQPage` schema answering high-volume search queries on line-circle positions and chord formulas.
- **OpenGraph & Twitter Card Metadata**: Tailored previews for social sharing on Twitter, Facebook, LinkedIn, Discord, and Slack.
- **Sitemap & Robots**: Pre-configured `sitemap.xml` and `robots.txt` with multilingual hreflang references.

---

## 📄 License

Licensed under the Apache License, Version 2.0.
