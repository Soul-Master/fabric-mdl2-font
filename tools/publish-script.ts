import { removeFiles, copyFiles } from './utils/file.js';
import { mkdirSync } from 'node:fs';

const publishFolder = 'dist';

removeFiles(publishFolder);

mkdirSync(publishFolder);

copyFiles('src/build/*.js', `${publishFolder}/build`);
copyFiles('src/css/*.css', `${publishFolder}/css`);
copyFiles('src/index.*', `${publishFolder}`);
copyFiles('font/*.woff2', `${publishFolder}/font`);
copyFiles('svg/*', `${publishFolder}/svg`);