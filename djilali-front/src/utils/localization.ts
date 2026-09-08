/**
 * Helper utilities for language detection, localization, and optional Arabic filtering.
 */

export type Lang = 'fr' | 'ar';

/**
 * Checks if a Sanity document has an Arabic version provided by the admin.
 * Supports both dedicated fields (e.g. title_ar, body_ar) and legacy object localization (e.g. title.ar).
 */
export const hasArabic = (item: any, titleField: string = 'title'): boolean => {
    if (!item) return false;

    // Check dedicated _ar field
    const arField = `${titleField}_ar`;
    if (typeof item[arField] === 'string' && item[arField].trim().length > 0) {
        return true;
    }

    // Check if rich text body_ar or content_ar has blocks
    if (Array.isArray(item.body_ar) && item.body_ar.length > 0) {
        return true;
    }
    if (Array.isArray(item.content_ar) && item.content_ar.length > 0) {
        return true;
    }

    // Check legacy object format e.g. title: { ar: "..." }
    if (item[titleField] && typeof item[titleField] === 'object' && typeof item[titleField].ar === 'string' && item[titleField].ar.trim().length > 0) {
        return true;
    }

    return false;
};

/**
 * Safely extracts a localized text string based on the active language.
 */
export const getLocalizedText = (item: any, field: string, lang: Lang): string => {
    if (!item) return '';

    if (lang === 'ar') {
        const arField = `${field}_ar`;
        if (typeof item[arField] === 'string' && item[arField].trim().length > 0) {
            return item[arField].trim();
        }
        if (item[field] && typeof item[field] === 'object' && typeof item[field].ar === 'string') {
            return item[field].ar.trim();
        }
        return '';
    }

    // French (default)
    if (typeof item[field] === 'string') {
        return item[field].trim();
    }
    if (item[field] && typeof item[field] === 'object') {
        return (item[field].fr || item[field].en || '').trim();
    }

    return '';
};

/**
 * Safely extracts localized rich text / PortableText blocks based on the active language.
 */
export const getLocalizedBlocks = (item: any, field: string, lang: Lang): any[] | null => {
    if (!item) return null;

    if (lang === 'ar') {
        const arField = `${field}_ar`;
        if (Array.isArray(item[arField]) && item[arField].length > 0) {
            return item[arField];
        }
        if (item[field] && typeof item[field] === 'object' && Array.isArray(item[field].ar) && item[field].ar.length > 0) {
            return item[field].ar;
        }
        return null;
    }

    // French (default)
    if (Array.isArray(item[field]) && item[field].length > 0) {
        return item[field];
    }
    if (item[field] && typeof item[field] === 'object') {
        if (Array.isArray(item[field].fr) && item[field].fr.length > 0) return item[field].fr;
        if (Array.isArray(item[field].en) && item[field].en.length > 0) return item[field].en;
    }

    return null;
};

/**
 * Filters items: in French mode, returns all items; in Arabic mode, returns only items that have an Arabic translation.
 */
export const filterByLang = <T>(items: T[], lang: Lang, titleField: string = 'title'): T[] => {
    if (!Array.isArray(items)) return [];
    if (lang === 'fr') return items;
    return items.filter(item => hasArabic(item, titleField));
};

/**
 * Checks if a category document has an Arabic title provided in Sanity.
 */
export const hasCategoryArabic = (cat: any): boolean => {
    if (!cat) return false;
    if (typeof cat.title_ar === 'string' && cat.title_ar.trim().length > 0) return true;
    if (cat.title && typeof cat.title === 'object' && typeof cat.title.ar === 'string' && cat.title.ar.trim().length > 0) return true;
    return false;
};

/**
 * Gets the localized title for a category document.
 * In Arabic mode: returns cat.title_ar if provided, otherwise empty string ''.
 * In French mode: returns cat.title.
 */
export const getLocalizedCategory = (cat: any, lang: Lang): string => {
    if (!cat) return '';
    if (typeof cat === 'string') return cat.trim();
    if (lang === 'ar') {
        if (typeof cat.title_ar === 'string' && cat.title_ar.trim().length > 0) {
            return cat.title_ar.trim();
        }
        if (cat.title && typeof cat.title === 'object' && typeof cat.title.ar === 'string') {
            return cat.title.ar.trim();
        }
        return '';
    }
    if (typeof cat.title === 'string') return cat.title.trim();
    if (cat.title && typeof cat.title === 'object') {
        return (cat.title.fr || cat.title.en || '').trim();
    }
    return '';
};
