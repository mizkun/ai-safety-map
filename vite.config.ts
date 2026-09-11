import vinext from 'vinext';
import { defineConfig } from 'vite';

export default defineConfig({
  server: { watch: { useFsEvents: false, usePolling: true } },
  plugins: [vinext()],
});
