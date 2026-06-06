import { useSyncExternalStore } from 'react';

export type ResolvedAppearance = 'light' | 'dark';
export type Appearance = ResolvedAppearance | 'system';

export type UseAppearanceReturn = {
    readonly appearance: Appearance;
    readonly resolvedAppearance: ResolvedAppearance;
    readonly updateAppearance: (mode: Appearance) => void;
};

const listeners = new Set<() => void>();
let currentAppearance: Appearance = 'system';

const prefersDark = (): boolean => {
    if (typeof window === 'undefined') {
        return false;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

const setCookie = (name: string, value: string, days = 365): void => {
    if (typeof document === 'undefined') {
        return;
    }

    try {
        const maxAge = days * 24 * 60 * 60;
        const secure = window.location.protocol === 'https:' ? ';Secure' : '';
        document.cookie = `${name}=${value};path=/;max-age=${maxAge};SameSite=Lax${secure}`;
    } catch (e) {
        console.warn('Failed to set cookie:', e);
    }
};

const getStoredAppearance = (): Appearance => {
    if (typeof window === 'undefined') {
        return 'system';
    }

    let stored: Appearance | null = null;

    try {
        stored = localStorage.getItem('appearance') as Appearance | null;
    } catch (e) {
        console.warn('Failed to read from localStorage:', e);
    }

    if (stored === 'light' || stored === 'dark' || stored === 'system') {
        return stored;
    }

    // Fallback: read from cookie
    try {
        const match = document.cookie.match(/(^|;)\s*appearance\s*=\s*([^;]+)/);

        if (match) {
            const cookieVal = decodeURIComponent(match[2]) as Appearance;

            if (
                cookieVal === 'light' ||
                cookieVal === 'dark' ||
                cookieVal === 'system'
            ) {
                return cookieVal;
            }
        }
    } catch (e) {
        console.warn('Failed to read cookie:', e);
    }

    return 'system';
};

const isDarkMode = (appearance: Appearance): boolean => {
    return appearance === 'dark' || (appearance === 'system' && prefersDark());
};

const applyTheme = (appearance: Appearance): void => {
    if (typeof document === 'undefined') {
        return;
    }

    const isDark = isDarkMode(appearance);

    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
};

const subscribe = (callback: () => void) => {
    listeners.add(callback);

    return () => listeners.delete(callback);
};

const notify = (): void => listeners.forEach((listener) => listener());

const mediaQuery = (): MediaQueryList | null => {
    if (typeof window === 'undefined') {
        return null;
    }

    return window.matchMedia('(prefers-color-scheme: dark)');
};

const handleSystemThemeChange = (): void => applyTheme(currentAppearance);

export function initializeTheme(): void {
    if (typeof window === 'undefined') {
        return;
    }

    let hasStored = false;

    try {
        hasStored = !!localStorage.getItem('appearance');
    } catch (e) {
        console.warn('Failed to check localStorage:', e);
    }

    if (!hasStored) {
        const fallback = getStoredAppearance();

        try {
            localStorage.setItem('appearance', fallback);
        } catch (e) {
            // ignore
        }

        setCookie('appearance', fallback);
    }

    currentAppearance = getStoredAppearance();
    applyTheme(currentAppearance);

    // Set up system theme change listener
    const mq = mediaQuery();

    if (mq) {
        if (mq.addEventListener) {
            mq.addEventListener('change', handleSystemThemeChange);
        } else {
            mq.addListener(handleSystemThemeChange);
        }
    }
}

export function useAppearance(): UseAppearanceReturn {
    const appearance: Appearance = useSyncExternalStore(
        subscribe,
        () => currentAppearance,
        () => 'system',
    );

    const resolvedAppearance: ResolvedAppearance = isDarkMode(appearance)
        ? 'dark'
        : 'light';

    const updateAppearance = (mode: Appearance): void => {
        currentAppearance = mode;

        try {
            // Store in localStorage for client-side persistence...
            localStorage.setItem('appearance', mode);
        } catch (e) {
            console.warn('Failed to write to localStorage:', e);
        }

        // Store in cookie for SSR...
        setCookie('appearance', mode);

        applyTheme(mode);
        notify();
    };

    return { appearance, resolvedAppearance, updateAppearance } as const;
}
