import type { PDFMetadata } from './pdfUtils';

export interface MetadataTemplate {
    id: string;
    name: string;
    description: string;
    category: 'job-seeker' | 'hr' | 'academic' | 'creative' | 'legal';
    fields: Partial<PDFMetadata>;
}

export const METADATA_TEMPLATES: MetadataTemplate[] = [
    // Job Seeker
    {
        id: 'ats-optimized',
        name: 'ATS Optimized',
        description: 'Clean metadata optimized for Applicant Tracking Systems.',
        category: 'job-seeker',
        fields: {
            producer: 'Microsoft Word',
            creator: 'Microsoft Word',
            keywords: 'Resume, CV, Job Application, Candidate',
            subject: 'Resume',
        },
    },
    {
        id: 'standard-resume',
        name: 'Standard Resume',
        description: 'Professional metadata for general use.',
        category: 'job-seeker',
        fields: {
            producer: 'Adobe Acrobat Pro',
            creator: 'Adobe Acrobat Pro',
            keywords: 'Resume, Professional, Experience',
            subject: 'Professional Resume',
        },
    },
    {
        id: 'federal-resume',
        name: 'Federal Resume',
        description: 'Strict metadata for government applications.',
        category: 'job-seeker',
        fields: {
            producer: 'USAJOBS Resume Builder',
            keywords: 'Federal, Government, GS-Level, Clearance',
            subject: 'Federal Employment Application',
        },
    },

    // Creative
    {
        id: 'creative-portfolio',
        name: 'Creative Portfolio',
        description: 'Metadata for design portfolios.',
        category: 'creative',
        fields: {
            producer: 'Adobe InDesign 2024',
            creator: 'Adobe InDesign 2024',
            keywords: 'Portfolio, Design, UX/UI, Creative, Case Studies',
            subject: 'Design Portfolio',
        },
    },

    // Academic
    {
        id: 'academic-cv',
        name: 'Academic CV',
        description: 'For research and academic positions.',
        category: 'academic',
        fields: {
            producer: 'LaTeX with hyperref',
            creator: 'LaTeX',
            keywords: 'Curriculum Vitae, Research, Publications, Academic',
            subject: 'Academic Curriculum Vitae',
        },
    },

    // HR
    {
        id: 'hr-verified',
        name: 'HR Verified',
        description: 'Mark document as verified by HR department.',
        category: 'hr',
        fields: {
            keywords: 'Verified, Internal, HR Review, Cleared',
            subject: 'Candidate Verification Document',
            author: 'HR Department',
        },
    },
    {
        id: 'background-check',
        name: 'Background Cleared',
        description: 'Status update for background checks.',
        category: 'hr',
        fields: {
            keywords: 'Background Check, Cleared, Verified, Safe',
            subject: 'Background Check Report',
        },
    },
    {
        id: 'internal-review',
        name: 'Internal Review',
        description: 'Flag document for internal team review.',
        category: 'hr',
        fields: {
            keywords: 'Confidential, Internal Use Only, Review Pending',
            subject: 'Internal Review Copy',
        },
    },

    // Legal
    {
        id: 'confidential-nda',
        name: 'Confidential NDA',
        description: 'Strict confidentiality markers.',
        category: 'legal',
        fields: {
            keywords: 'NDA, Confidential, Legal, Non-Disclosure',
            subject: 'Non-Disclosure Agreement',
            author: 'Legal Department',
        },
    },
    {
        id: 'public-release',
        name: 'Public Release',
        description: 'Cleared for public distribution.',
        category: 'legal',
        fields: {
            keywords: 'Public, Distribution, Cleared, Press Release',
            subject: 'Public Release Document',
        },
    },
];
