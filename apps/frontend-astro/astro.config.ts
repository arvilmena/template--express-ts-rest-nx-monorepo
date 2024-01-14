import { defineConfig } from 'astro/config';
// https://astro.build/config
export default defineConfig({
  srcDir: './src',
  publicDir: './public',
  outDir: '../../dist/apps/frontend-astro',
  vite: {
    server: {
      fs: {
        strict: false,
      },
    },
  },
  // output: 'server',
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
