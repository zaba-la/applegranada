import type { Metadata } from 'next';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: {
    template: '%s | AppleGranada',
    default: 'AppleGranada — Servicio Técnico de Software Apple en Granada',
  },
  description:
    'Servicio técnico de software para Mac, iPad e iPhone en Granada. Soporte preventivo y correctivo. Sin colas, sin perder tus datos.',
  keywords: ['apple', 'mac', 'iphone', 'ipad', 'soporte técnico', 'granada', 'software'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
