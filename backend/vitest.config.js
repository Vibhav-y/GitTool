import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        environment: 'node',
        include: ['tests/**/*.test.js'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'html'],
            include: ['src/**/*.js'],
            exclude: ['src/admin/**', 'src/shared/supabase.js'],
        },
        // Each test file gets its own isolated module registry
        isolate: true,
    },
});
