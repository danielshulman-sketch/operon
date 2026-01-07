import { Sora, Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import CookieConsent from './components/CookieConsent';

const sora = Sora({
    subsets: ['latin'],
    variable: '--font-sora',
    display: 'swap',
});

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
    subsets: ['latin'],
    variable: '--font-plus-jakarta',
    display: 'swap',
});

export const metadata = {
    title: 'Operon - Business Automation Platform',
    description: 'GDPR-compliant AI-powered business automation and workflow management',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" className={`${sora.variable} ${inter.variable} ${plusJakarta.variable}`}>
            <body className="font-inter antialiased">
                {children}
                <CookieConsent />
            </body>
        </html>
    );
}
