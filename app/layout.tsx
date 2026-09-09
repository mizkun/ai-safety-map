import type { Metadata } from 'next';
import './globals.css';
import Providers from './providers';
export const metadata: Metadata = {
  title: 'AI Safety Map — 現在から未来への条件をたどる',
  description:
    'AIリスクの経路、次に進む条件、現在の証拠・成立条件・対策を理解するオープンな学習マップ。',
  icons: { icon: '/ai-safety-map/favicon.svg' },
  metadataBase: new URL('https://mizkun.github.io/ai-safety-map/'),
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
