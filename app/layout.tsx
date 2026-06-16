import type { Metadata } from 'next';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: {
    template: '%s | Soporte Granada',
    default: 'Soporte Granada — Servicio Técnico de Software Apple y Windows en Granada',
  },
  description:
    'Servicio técnico de software para Mac, iPad, iPhone, Windows, Microsoft 365 y Surface en Granada. Soporte preventivo y correctivo. Sin colas, sin perder tus datos.',
  keywords: ['apple', 'mac', 'iphone', 'ipad', 'windows', 'microsoft 365', 'soporte técnico', 'granada', 'software'],
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
