import { readdirSync } from 'fs';
import { join } from 'path';

// utils must build before core
// runtime must build before renderer-react
const headPkgs: string[] = [];
const tailPkgs = readdirSync(join(__dirname, 'package')).filter(
  pkg => pkg.charAt(0) !== '.' && !headPkgs.includes(pkg),
);

export default {
  target: 'node',
  disableTypeCheck: true,
  cjs: { type: 'babel', lazy: true },
  pkgs: [...headPkgs, ...tailPkgs],
  extraBabelPlugins: [
    [
      'babel-plugin-import',
      { libraryName: 'antd', libraryDirectory: 'es', style: true },
      'antd',
    ],
  ],
};
