import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          ['@babel/plugin-proposal-decorators', { version: '2023-05' }],
        ],
      },
    }),
    dts(),
  ],
  build: {
    lib: {
      entry: './src/index.ts', // The entry point for your package
      name: 'RemirrorReprint', // A unique global name for UMD builds
      fileName: (format) => `remirror-reprint.${format}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'remirror'], // Mark these as external dependencies
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          remirror: 'Remirror',
        },
      },
    },
  },
});
