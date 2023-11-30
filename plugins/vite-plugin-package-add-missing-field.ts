import { join } from 'node:path';
import { cwd } from 'node:process';
import _debug from 'debug';
import type { Plugin } from 'vite';
import { readPackage } from 'read-pkg';
import { updatePackage } from 'write-package';

const debug = _debug('vite-plugin-package-add-missing-field');

export interface Options {
  /**
   * @default ''
   */
  packagePath?: string;
  /**
   * @default ''
   */
  packageName?: string;
  /**
   * Define field in package.json (if field missing) for npm / internal package
   *
   * @default 'main'
   */
  field: { [index: string]: string };
  /**
   * @default true
   */
  isNPM?: boolean;
}

export interface VitePluginPackageAddMissingFieldPlugin extends Plugin {
  api: {
    options: Options;
  };
}

function isEmpty(str: string) {
  return str === '';
}

function VitePluginPackageAddMissingField(
  options: Options[]
): VitePluginPackageAddMissingFieldPlugin[] {
  return options.map((opts) => {
    let { packagePath = '', packageName = '', field = {}, isNPM = true } = opts;

    if (isEmpty(packagePath) && isEmpty(packageName)) packagePath = cwd();

    if (isEmpty(packagePath) && !isEmpty(packageName)) {
      if (isNPM) {
        packagePath = join(cwd(), 'node_modules', packageName);
      } else {
        packagePath = join(cwd(), packageName);
      }
    }

    return {
      name: 'vite-plugin-package-main',
      async config() {
        debug('loading package.json at %s', packagePath);

        try {
          const packageJson = await readPackage({
            cwd: packagePath,
          });
          await Promise.all([
            ...Object.keys(field).map(async (f: string) => {
              const fieldValue = packageJson[f];
              if (!fieldValue) {
                debug('No %s field found in package.json', f);
                await updatePackage(packagePath, { [f]: field[f] });
              }
            }),
          ]);
        } catch (e) {
          debug('parse error: %o', e);
          debug('error on loading package.json at %s, skip', packagePath);
        }
      },
      api: {
        options: {
          packagePath,
          packageName,
          field,
          isNPM,
        },
      },
    };
  });
}

export default VitePluginPackageAddMissingField;
