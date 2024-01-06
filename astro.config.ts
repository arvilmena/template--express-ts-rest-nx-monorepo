import { defineConfig } from 'astro/config';
// https://astro.build/config
export default defineConfig({
  srcDir: './apps/frontend-astro/src',
  publicDir: './apps/frontend-astro/public',
  outDir: './dist/apps/frontend-astro',
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
                    // Allow serving files from one level up to the project root
                    allow: [
                      // searchForWorkspaceRoot(process.cwd()),
                      // '/Users/arvil/Projects/stonkerino',
                      // '/Users/arvil/Projects/node_modules',
                      // '/Users/arvil/Projects/apps/frontend-astro',
                      // '../..',
                      '..',
                    ],
                  },
                },
              },
            });
          },
        },
      };
    })(),
  ],
  // vite: {
  //   server: {
  //     config: {
  //       fs: {
  //         strict: false,
  //         // Allow serving files from one level up to the project root
  //         allow: [
  //           // searchForWorkspaceRoot(process.cwd()),
  //           // '/Users/arvil/Projects/stonkerino',
  //           // '/Users/arvil/Projects/node_modules',
  //           // '/Users/arvil/Projects/apps/frontend-astro',
  //           // '../..',
  //           '..',
  //         ],
  //       },
  //     },
  //   },
  // },
});
