import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    root: './',
    build: {
        outDir: './dist',
        rollupOptions: {
            input: {
                main: './index.html'
            }
        }
    },
    server: {
        port: 8962,
        open: true
    },
    resolve: {
        alias: {
            '@': '/src',
        },
    },
});