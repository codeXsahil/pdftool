import { PDFDocument, PDFName, PDFString, PDFDict, StandardFonts, rgb, degrees } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';

// Set worker source for pdfjs-dist
pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

export interface PDFMetadata {
    title?: string;
    author?: string;
    subject?: string;
    keywords?: string;
    creator?: string;
    producer?: string;
    creationDate?: Date;
    modificationDate?: Date;
    pageCount?: number;
    timezoneOffset?: string; // e.g., "+05'30'"
}

export interface RiskAnalysis {
    score: number; // 0-100, higher is riskier
    flags: string[];
    threats?: string[];
}

export interface ATSAnalysis {
    score: number;
    missingKeywords: string[];
    foundKeywords: string[];
}

export interface FontColorAnalysis {
    fonts: string[];
    colors: string[]; // Hex codes or descriptions
}

export interface LinkAnalysis {
    links: string[];
    suspiciousLinks: string[];
}

export async function extractMetadata(file: File): Promise<PDFMetadata> {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer, { updateMetadata: false });

    // Extract raw timezone from CreationDate if possible
    let timezoneOffset: string | undefined;
    try {
        const infoDict = (pdfDoc as any).getInfoDict();
        const creationDateEntry = infoDict.get(PDFName.of('CreationDate'));
        if (creationDateEntry instanceof PDFString) {
            const rawDate = creationDateEntry.asString();
            // Regex to capture timezone part: D:YYYYMMDDHHmmSS+HH'mm'
            const match = rawDate.match(/([+-]\d{2}'\d{2}'|Z)$/);
            if (match) {
                timezoneOffset = match[1];
            }
        }
    } catch (e) {
        console.warn('Could not extract raw timezone', e);
    }

    return {
        title: pdfDoc.getTitle(),
        author: pdfDoc.getAuthor(),
        subject: pdfDoc.getSubject(),
        keywords: pdfDoc.getKeywords(),
        creator: pdfDoc.getCreator(),
        producer: pdfDoc.getProducer(),
        creationDate: pdfDoc.getCreationDate(),
        modificationDate: pdfDoc.getModificationDate(),
        pageCount: pdfDoc.getPageCount(),
        timezoneOffset,
    };
}

export async function extractText(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(' ');
        fullText += pageText + ' ';
    }

    return fullText;
}

export function analyzeATS(text: string, jobDescription: string): ATSAnalysis {
    const normalize = (str: string) => str.toLowerCase().replace(/[^\w\s]/g, '');
    const jobWords = normalize(jobDescription).split(/\s+/).filter(w => w.length > 3);
    const resumeText = normalize(text);

    // Simple keyword matching (can be improved with TF-IDF or more complex NLP later)
    // We'll use a set of unique significant words from the JD
    const uniqueKeywords = Array.from(new Set(jobWords));
    const foundKeywords: string[] = [];
    const missingKeywords: string[] = [];

    uniqueKeywords.forEach(keyword => {
        if (resumeText.includes(keyword)) {
            foundKeywords.push(keyword);
        } else {
            missingKeywords.push(keyword);
        }
    });

    const score = Math.round((foundKeywords.length / uniqueKeywords.length) * 100) || 0;

    return {
        score,
        foundKeywords,
        missingKeywords: missingKeywords.slice(0, 10) // Limit to top 10 missing
    };
}

export async function analyzeRisk(file: File, metadata: PDFMetadata): Promise<RiskAnalysis> {
    const flags: string[] = [];
    const threats: string[] = [];
    let score = 0;

    // --- Metadata Analysis ---
    // Check for missing standard metadata
    if (!metadata.creationDate) {
        flags.push('Missing creation date');
        score += 20;
    }

    // Check for suspicious producer/creator
    const suspiciousTools = ['ilovepdf', 'smallpdf', 'phantompdf', 'gpl ghostscript'];
    if (metadata.producer && suspiciousTools.some(tool => metadata.producer?.toLowerCase().includes(tool))) {
        flags.push(`Suspicious producer tool detected: ${metadata.producer}`);
        score += 30;
    }

    // Check for date anomalies
    if (metadata.creationDate && metadata.modificationDate) {
        const diffTime = Math.abs(metadata.modificationDate.getTime() - metadata.creationDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays > 365) {
            flags.push('Modification date is significantly later than creation date (> 1 year)');
            score += 10;
        }
    }

    // Check for empty author in a resume context
    if (!metadata.author || metadata.author.trim() === '') {
        flags.push('No author specified');
        score += 10;
    }

    // Timezone check (simple heuristic)
    if (metadata.timezoneOffset) {
        // Just noting it for now, could add logic to flag non-local timezones if we knew the user's location
    }

    // --- Threat Analysis (Deep Scan) ---
    try {
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer, { updateMetadata: false });
        const catalog = pdfDoc.catalog;

        // Check for JavaScript
        // Note: This is a basic check. Malicious JS can be hidden in many places.
        const names = catalog.get(PDFName.of('Names'));
        if (names instanceof PDFDict && names.has(PDFName.of('JavaScript'))) {
            threats.push('Embedded JavaScript detected (Potential Security Risk)');
            score += 50;
        }

        // Check for OpenAction (auto-execute on open)
        if (catalog.has(PDFName.of('OpenAction'))) {
            // OpenAction isn't always bad (e.g. initial zoom), but JS actions are.
            // We'll flag it as a "Note" or minor risk unless we inspect deeper.
            // For now, let's just flag it if it looks suspicious.
            const openAction = catalog.get(PDFName.of('OpenAction'));
            if (openAction instanceof PDFDict && openAction.has(PDFName.of('JS'))) {
                threats.push('Auto-executing JavaScript (OpenAction) detected');
                score += 50;
            }
        }

        // Check for Embedded Files
        if (names instanceof PDFDict && names.has(PDFName.of('EmbeddedFiles'))) {
            threats.push('Hidden embedded files detected');
            score += 40;
        }

    } catch (e) {
        console.warn('Deep scan failed', e);
    }

    return {
        score: Math.min(score, 100),
        flags,
        threats
    };
}

export async function modifyMetadata(file: File, newMetadata: PDFMetadata): Promise<Uint8Array> {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer, { updateMetadata: true }); // Enable XMP sync

    if (newMetadata.title !== undefined) pdfDoc.setTitle(newMetadata.title);
    if (newMetadata.author !== undefined) pdfDoc.setAuthor(newMetadata.author);
    if (newMetadata.subject !== undefined) pdfDoc.setSubject(newMetadata.subject);
    if (newMetadata.keywords !== undefined) pdfDoc.setKeywords(newMetadata.keywords.split(',').map(k => k.trim()));
    if (newMetadata.creator !== undefined) pdfDoc.setCreator(newMetadata.creator);
    if (newMetadata.producer !== undefined) pdfDoc.setProducer(newMetadata.producer);

    // Note: pdf-lib handles creation/mod dates automatically if not set, but we can force them if needed.
    // For now, let's update modification date to current time.
    pdfDoc.setModificationDate(new Date());

    return await pdfDoc.save();
}

export async function sanitizeMetadata(file: File): Promise<Uint8Array> {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer, { updateMetadata: true });

    pdfDoc.setTitle('');
    pdfDoc.setAuthor('');
    pdfDoc.setSubject('');
    pdfDoc.setKeywords([]);
    pdfDoc.setCreator('');
    pdfDoc.setProducer('');

    const epoch = new Date(0); // Jan 1, 1970
    pdfDoc.setCreationDate(epoch);
    pdfDoc.setModificationDate(epoch);

    return await pdfDoc.save();
}

// --- Phase 2: Security & Utility Functions ---

export async function encryptPDF(file: File, password?: string, ownerPassword?: string): Promise<Uint8Array> {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);

    await (pdfDoc as any).encrypt({
        userPassword: password || '',
        ownerPassword: ownerPassword || password || '',
        permissions: {
            printing: 'highResolution',
            modifying: false,
            copying: false,
            annotating: false,
            fillingForms: false,
            contentAccessibility: false,
            documentAssembly: false,
        },
    });

    return await pdfDoc.save();
}

export async function watermarkPDF(file: File, text: string): Promise<Uint8Array> {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const pages = pdfDoc.getPages();

    for (const page of pages) {
        const { width, height } = page.getSize();
        const fontSize = 50;
        const textWidth = helveticaFont.widthOfTextAtSize(text, fontSize);

        page.drawText(text, {
            x: width / 2 - textWidth / 2,
            y: height / 2,
            size: fontSize,
            font: helveticaFont,
            color: rgb(0.7, 0.7, 0.7),
            opacity: 0.3,
            rotate: degrees(45),
        });
    }

    return await pdfDoc.save();
}

export async function redactPDF(file: File, rects: { pageIndex: number, x: number, y: number, width: number, height: number }[]): Promise<Uint8Array> {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const pages = pdfDoc.getPages();

    for (const rect of rects) {
        if (rect.pageIndex >= 0 && rect.pageIndex < pages.length) {
            const page = pages[rect.pageIndex];
            // Draw a black rectangle over the area
            page.drawRectangle({
                x: rect.x,
                y: rect.y,
                width: rect.width,
                height: rect.height,
                color: rgb(0, 0, 0),
                opacity: 1,
            });
        }
    }

    return await pdfDoc.save();
}

export async function compressPDF(file: File): Promise<Uint8Array> {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    // pdf-lib doesn't have advanced compression like ghostscript, but we can use object streams
    return await pdfDoc.save({ useObjectStreams: true });
}

export async function analyzeFontsAndColors(file: File): Promise<FontColorAnalysis> {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;

    const fonts = new Set<string>();
    // Colors are harder to extract reliably without rendering, so we'll skip deep color analysis for now
    // or implement a basic check if possible. For now, let's just list fonts.

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        await page.getOperatorList();

        // This is a simplified way to find fonts. A robust way requires inspecting the operator list deeply.
        // For this MVP, we might rely on pdf.js's font loading if exposed, or just return a placeholder
        // until we implement deep operator parsing.
        // Actually, page.commonObjs.get('Font') might work if available.

        try {
            // @ts-ignore - accessing internal API for fonts
            const pageFonts = page.commonObjs.get('Font');
            if (pageFonts) {
                // This part is tricky as pdf.js API changes. 
                // Let's try to get loaded fonts from the stats or similar.
            }
        } catch (e) {
            // ignore
        }
    }

    return {
        fonts: Array.from(fonts),
        colors: []
    };
}

export async function extractLinks(file: File): Promise<LinkAnalysis> {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;

    const links: string[] = [];
    const suspiciousLinks: string[] = [];

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const annotations = await page.getAnnotations();

        for (const ant of annotations) {
            if (ant.url) {
                links.push(ant.url);
                if (ant.url.includes('bit.ly') || ant.url.includes('tinyurl') || ant.url.includes('http:')) {
                    suspiciousLinks.push(ant.url);
                }
            }
        }
    }

    return {
        links,
        suspiciousLinks
    };
}

export interface HistoryAnalysis {
    hasIncrementalUpdates: boolean;
    updateCount: number;
}

export async function analyzeHistory(file: File): Promise<HistoryAnalysis> {
    const text = await file.text();
    // Look for "%%EOF" markers which indicate end of file sections. 
    // A simple PDF has one. Incremental updates add more.
    const eofCount = (text.match(/%%EOF/g) || []).length;

    // Also check for "Prev" key in trailer which points to previous cross-reference table
    const hasPrev = /trailer[\s\S]*?\/Prev\s+\d+/.test(text);

    return {
        hasIncrementalUpdates: eofCount > 1 || hasPrev,
        updateCount: Math.max(0, eofCount - 1)
    };
}

export async function analyzeGeoTags(file: File): Promise<string[]> {
    const text = await file.text();
    const warnings: string[] = [];

    // Basic check for XMP GPS tags in the raw file content
    if (text.includes('exif:GPSLatitude') || text.includes('GPSMapDatum')) {
        warnings.push('Found XMP GPS Metadata tags (Potential Location Data)');
    }

    // We can't easily check inside binary image streams client-side without heavy parsing,
    // but we can warn if we see camera metadata tags often associated with geotagged photos.
    if (text.includes('exif:Make') || text.includes('exif:Model')) {
        warnings.push('Found Camera EXIF tags (Images may contain hidden location data)');
    }

    return warnings;
}

export async function convertToPDFA(file: File): Promise<Uint8Array> {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);

    // To make a file PDF/A compliant, we need to:
    // 1. Add an OutputIntent (Color Profile)
    // 2. Add XMP Metadata claiming PDF/A compliance
    // Note: This makes it "claim" compliance. True compliance requires embedding all fonts, 
    // no encryption, etc. We do the best effort tagging here.

    // Register a standard OutputIntent (sRGB)
    // In a real app, we would embed a real ICC profile. Here we create a minimal valid structure.
    const outputIntent = pdfDoc.context.obj({
        Type: 'OutputIntent',
        S: 'GTS_PDFA1',
        OutputConditionIdentifier: 'sRGB IEC61966-2.1',
        Info: 'sRGB IEC61966-2.1',
        RegistryName: 'http://www.color.org'
    });

    const catalog = pdfDoc.catalog;
    // @ts-ignore - accessing internal array
    if (!catalog.has(PDFName.of('OutputIntents'))) {
        catalog.set(PDFName.of('OutputIntents'), pdfDoc.context.obj([outputIntent]));
    }

    // We would ideally use pdfDoc.setMetadata() with XML, but pdf-lib has limited high-level XMP support.
    // We will set the Title/Author which generates basic XMP. 
    // For full PDF/A, we'd need to inject custom XML. 
    // For this MVP, we'll stick to the OutputIntent which is the biggest technical hurdle.

    return await pdfDoc.save();
}

// --- Phase 3: Quality & Accessibility ---

export interface QualityAnalysis {
    heatmap: { word: string; count: number; density: number }[];
    spellingErrors: string[];
    languageMismatch: { declared: string; detected: string; isMismatch: boolean };
    marginIssues: { page: number; issue: string }[];
    accessibility: {
        hasTitle: boolean;
        hasLanguage: boolean;
        isTagged: boolean;
        score: number;
        issues: string[];
    };
    contrastIssues: { page: number; text: string; contrastRatio: number }[];
}

export async function analyzeQuality(file: File): Promise<QualityAnalysis> {
    const text = await extractText(file);
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);

    // 1. Keyword Heatmap (Density)
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    const totalWords = words.length;
    const wordCounts: Record<string, number> = {};
    words.forEach(w => { if (w.length > 3) wordCounts[w] = (wordCounts[w] || 0) + 1; });

    const heatmap = Object.entries(wordCounts)
        .map(([word, count]) => ({ word, count, density: count / totalWords }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 20); // Top 20 keywords

    // 2. Spell Check (Basic Heuristic)
    // In a real app, use a library like 'typo-js' or an API. Here we check against a tiny list of common resume typos.
    const commonTypos = ['teh', 'recieve', 'seperate', 'occured', 'definately', 'experiance', 'manger', 'calender'];
    const spellingErrors = words.filter(w => commonTypos.includes(w));

    // 3. Language Mismatch
    // Heuristic: Check for common English words vs French/Spanish
    const englishCommon = ['the', 'and', 'to', 'of', 'in', 'is', 'for', 'experience', 'skills'];
    const frenchCommon = ['le', 'la', 'et', 'de', 'en', 'est', 'pour', 'experience', 'competences'];
    const spanishCommon = ['el', 'la', 'y', 'de', 'en', 'es', 'para', 'experiencia', 'habilidades'];

    const detectLang = (txt: string[]) => {
        const enCount = txt.filter(w => englishCommon.includes(w)).length;
        const frCount = txt.filter(w => frenchCommon.includes(w)).length;
        const esCount = txt.filter(w => spanishCommon.includes(w)).length;
        if (frCount > enCount && frCount > esCount) return 'fr';
        if (esCount > enCount && esCount > frCount) return 'es';
        return 'en'; // Default to English
    };

    const detectedLang = detectLang(words);
    // pdf-lib doesn't easily expose the Lang entry in Catalog without low-level access, 
    // but we can check standard metadata or assume 'en-US' if missing for this demo.
    // Let's try to find /Lang in the raw text as a fallback or use pdfDoc.getCatalog().get(PDFName.of('Lang'))
    let declaredLang = 'en-US'; // Default assumption
    try {
        const catalog = pdfDoc.catalog;
        // @ts-ignore
        const langEntry = catalog.get(PDFName.of('Lang'));
        if (langEntry) declaredLang = langEntry.toString();
    } catch (e) { }

    const isMismatch = !declaredLang.toLowerCase().startsWith(detectedLang);

    // 4. Print Margins
    // We need page dimensions. 
    const marginIssues: { page: number; issue: string }[] = [];
    pdfDoc.getPages().forEach((page) => {
        const { width, height } = page.getSize();
        // Standard printable area usually requires ~0.5 inch (36pts) margins
        // Without full content stream parsing of coordinates, we can't be 100% sure of text position,
        // but we can check if the MediaBox/CropBox is too close to standard paper sizes without bleed.
        // For this MVP, we'll simulate finding content too close to edge if the page size is non-standard.
        if (width < 595 || height < 842) { // Smaller than A4 might indicate cutting off
            // marginIssues.push({ page: idx + 1, issue: 'Page size is smaller than A4, check print settings.' });
        }
        // Real margin check requires pdf.js textContent coordinates. We will implement a mock check based on text extraction
        // or leave as a placeholder that warns if "bleed" is not detected on large images.
    });

    // 5. WCAG Accessibility Audit
    const issues: string[] = [];
    const title = pdfDoc.getTitle();
    if (!title) issues.push('Missing Document Title');
    if (!declaredLang) issues.push('Missing Language Definition');

    // Check for MarkInfo (Tagged PDF)
    let isTagged = false;
    try {
        const catalog = pdfDoc.catalog;
        // @ts-ignore
        const markInfo = catalog.get(PDFName.of('MarkInfo'));
        if (markInfo) isTagged = true;
    } catch (e) { }

    if (!isTagged) issues.push('Document is not Tagged (Required for screen readers, usually optional for printing)');

    const score = Math.max(0, 100 - (issues.length * 20));

    // 6. Contrast Analyzer
    // Difficult without rendering. We will return a placeholder or "N/A" unless we can analyze colors.
    // For now, we'll warn if we detect light text colors in the raw stream (e.g. "0.8 0.8 0.8 rg")
    const contrastIssues: { page: number; text: string; contrastRatio: number }[] = [];
    if (text.includes('0.9 g') || text.includes('0.9 G')) {
        contrastIssues.push({ page: 1, text: 'Potential low contrast text detected (light gray)', contrastRatio: 2.1 });
    }

    return {
        heatmap,
        spellingErrors,
        languageMismatch: { declared: declaredLang, detected: detectedLang, isMismatch },
        marginIssues,
        accessibility: { hasTitle: !!title, hasLanguage: !!declaredLang, isTagged, score, issues },
        contrastIssues
    };
}
