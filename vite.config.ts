/// <reference types="vitest" />

// Configure Vitest (https://vitest.dev/config)

import { defineConfig } from 'vite';
import VitePluginPackageAddMissingField from './plugins/vite-plugin-package-add-missing-field';

export default defineConfig({
  test: {
    /* for example, use global to avoid globals imports (describe, test, expect): */
    // globals: true,
  },
  plugins: [
    VitePluginPackageAddMissingField([
      {
        packageName: 'vscode',
        field: {
          main: 'lib/shared.js',
        },
      },
    ]),
  ],
});
