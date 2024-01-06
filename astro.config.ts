import { defineConfig } from 'astro/config';
// https://astro.build/config
export default defineConfig({
  srcDir: './apps/frontend-astro/src',
  publicDir: './apps/frontend-astro/public',
  outDir: './dist/apps/frontend-astro',
  vite: {
    server: {
      fs: {
        strict: false,
      },
    },
  },
  integrations: [
    (() => {
      console.log(`my astro config loaded...`);
      return {
        name: 'project-name-vite-config',
        hooks: {
          'astro:config:setup': ({ updateConfig }) => {
            updateConfig({
              vite: {
                server: {
                  fs: {
                    strict: false,
                  },
                },
              },
            });
          },
        },
      };
    })(),
  ],
});
