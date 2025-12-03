# 🛡️ PDF Metadata Guardian

> **Secure, Client-Side PDF Analysis & Optimization Tool**
>
> *Analyze, Edit, and Secure your PDFs without them ever leaving your browser.*

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge&logo=github)](https://codeXsahil.github.io/pdftool)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6.0-purple?style=for-the-badge&logo=vite)](https://vitejs.dev)

## 🌟 Overview

**PDF Metadata Guardian** is a powerful web application designed for privacy-conscious users who need to inspect, edit, and secure PDF documents. Unlike other online tools, **all processing happens 100% on your device**. Your files are never uploaded to any server, ensuring complete confidentiality.

## 🚀 Key Features

### 🔍 Deep Analysis
- **Metadata Inspector**: View and edit standard metadata (Title, Author, Creator, Producer, Dates).
- **Risk Analysis**: Detect potential security risks like JavaScript, embedded files, and form actions.
- **Timezone Forensics**: Reveal the original timezone offset from creation dates.
- **History Analysis**: Track document modification history and software versions.
- **Geo-Tag Scanner**: Identify potential location data hidden in metadata.

### 🛡️ Security Suite
- **Watermarking**: Add custom text overlays (e.g., "CONFIDENTIAL") to all pages.
- **Deep Sanitization**: "Nuke" button to strip all metadata and reset dates to the **1970 Epoch** for maximum anonymity.
- **PDF/A Converter**: Convert documents to PDF/A-1b archival standard.
- **Compression**: Optimize file size by removing redundant objects.

### 🎯 Quality & Accessibility
- **ATS Keyword Scanner**: Paste a job description to check if your resume matches required keywords.
- **WCAG Audit**: Check for accessibility compliance (Tags, Language, Title).
- **Spell Check & Grammar**: Detect common typos and language mismatches.
- **Print Margin Checker**: Identify potential layout issues for printing.
- **Contrast Analyzer**: Heuristic check for low-contrast text.

### 💻 Power User Tools
- **JSON Export**: Download full analysis reports for offline review.
- **Font & Link Inspector**: List all embedded fonts and external hyperlinks.
- **Batch Processing**: Analyze multiple files simultaneously.

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS, Framer Motion (Animations), Lucide React (Icons)
- **PDF Core**: 
  - `pdf-lib` (Modification, Creation)
  - `pdfjs-dist` (Text Extraction, Parsing)

## 📦 Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/codeXsahil/pdftool.git
    cd pdftool
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run development server**
    ```bash
    npm run dev
    ```

4.  **Build for production**
    ```bash
    npm run build
    ```

## 🔒 Privacy Promise

We believe in **Privacy by Design**.
- **No Server Uploads**: Everything runs in your browser's WebAssembly / JS engine.
- **No Analytics**: We don't track your document content.
- **Open Source**: You can inspect the code to verify our claims.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Made with ❤️ for Privacy
</p>
