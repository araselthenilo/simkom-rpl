import { createInertiaApp } from '@inertiajs/react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme } from '@/hooks/use-appearance';
import PengurusLayout from '@/layouts/pengurus-layout';
import SettingsLayout from '@/layouts/settings/layout';
import AdminLayout from './layouts/admin-layout';
import AuthLayout from './layouts/auth-layout';
import HomeLayout from './layouts/home-layout';
import PembinaLayout from './layouts/pembina-layout';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    layout: (name) => {
        switch (true) {
            case name === 'auth/login' ||
                name === 'auth/forgot-password' ||
                name === 'auth/confirm-password' ||
                name === 'auth/reset-password':
                return null;
            case name.startsWith('auth/'):
                return AuthLayout;
            case name.startsWith('settings/'):
                return SettingsLayout;
            case name === 'home' ||
                name.startsWith('organisasi/') ||
                name.startsWith('kegiatan/'):
                return [HomeLayout];
            case name.startsWith('pengurus/'):
                return [PengurusLayout];
            case name.startsWith('admin/'):
                return [AdminLayout];
            case name.startsWith('pembina/'):
                return [PembinaLayout];
            default:
                return null;
        }
    },
    strictMode: true,
    withApp(app) {
        return (
            <TooltipProvider delayDuration={0}>
                {app}
                <Toaster />
            </TooltipProvider>
        );
    },
    progress: {
        color: 'var(--primary)',
    },
});

// This will set light / dark mode on load...
initializeTheme();
