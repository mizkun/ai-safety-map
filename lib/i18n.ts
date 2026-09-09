import ja from '@/content/ui/ja.json';
import en from '@/content/ui/en.json';
export type Locale = 'ja' | 'en';
export type Messages = typeof ja;
export const messages: Record<Locale, Messages> = { ja, en };
export function formatMessage(
  value: string,
  values: Record<string, string | number>,
) {
  return value.replace(/\{(\w+)\}/g, (match, key) =>
    String(values[key] ?? match),
  );
}
