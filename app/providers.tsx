'use client';
import { useState, type ReactNode } from 'react';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useServerInsertedHTML } from 'next/navigation';

const theme = createTheme({
  cssVariables: true,
  palette: {
    primary: { main: '#6655a8' },
    secondary: { main: '#438880' },
    text: { primary: '#25283a', secondary: '#697082' },
    background: { default: '#eef1f7', paper: 'rgba(249,251,255,.84)' },
  },
  typography: {
    fontFamily:
      'Inter, "Hiragino Sans", "Noto Sans JP", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: { borderRadius: 16 },
  components: {
    MuiButton: {
      styleOverrides: { root: { borderRadius: 999, boxShadow: 'none' } },
    },
    MuiIconButton: { styleOverrides: { root: { color: '#64677d' } } },
    MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
    MuiAccordion: {
      styleOverrides: {
        root: {
          background: 'transparent',
          boxShadow: 'none',
          '&:before': { display: 'none' },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontSize: 12,
          lineHeight: 1.7,
          borderRadius: 10,
          background: '#36384d',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 28,
          border: '1px solid rgba(255,255,255,.8)',
          backdropFilter: 'blur(28px)',
          boxShadow: '0 30px 100px rgba(47,54,90,.18)',
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: 20,
          background: 'rgba(251,253,255,.94)',
          backdropFilter: 'blur(24px)',
          border: '1px solid white',
          boxShadow: '0 16px 60px rgba(52,59,95,.16)',
        },
      },
    },
  },
});

function createStyleRegistry() {
  const cache = createCache({ key: 'mui' });
  cache.compat = true;
  const previous = cache.insert;
  let pending: { name: string; global: boolean }[] = [];
  cache.insert = (...args) => {
    const [selector, serialized] = args;
    if (cache.inserted[serialized.name] === undefined)
      pending.push({ name: serialized.name, global: !selector });
    return previous(...args);
  };
  return {
    cache,
    flush: () => {
      const result = pending;
      pending = [];
      return result;
    },
  };
}

export default function Providers({ children }: { children: ReactNode }) {
  const [registry] = useState(createStyleRegistry);
  useServerInsertedHTML(() => {
    const inserted = registry.flush();
    if (!inserted.length) return null;
    const normal = inserted.filter((i) => !i.global);
    return (
      <>
        {inserted
          .filter((i) => i.global)
          .map((i) => (
            <style
              key={i.name}
              data-emotion={'mui-global ' + i.name}
              dangerouslySetInnerHTML={{
                __html: String(registry.cache.inserted[i.name] || ''),
              }}
            />
          ))}
        {normal.length > 0 && (
          <style
            data-emotion={'mui ' + normal.map((i) => i.name).join(' ')}
            dangerouslySetInnerHTML={{
              __html: normal
                .map((i) => registry.cache.inserted[i.name] || '')
                .join(''),
            }}
          />
        )}
      </>
    );
  });
  return (
    <CacheProvider value={registry.cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}
