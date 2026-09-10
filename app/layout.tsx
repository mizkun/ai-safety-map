import type { Metadata } from 'next';
import './globals.css';
import Providers from './providers';
export const metadata: Metadata = {
  title: 'AI Safety Map',
  description:
    'AIリスクの経路、次に進む条件、現在の証拠・成立条件・対策を理解するオープンな学習マップ。',
  icons: { icon: (process.env.NODE_ENV === 'production' ? '' : '/ai-safety-map') + '/favicon.svg?v=2' },
  metadataBase: new URL('https://ai-safety-map.org/'),
};
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
