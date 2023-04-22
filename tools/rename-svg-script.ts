import { readFileSync, renameSync } from 'node:fs';
import type allIconNames from 'data/AllIconNames.json';

type AllIconNamesType = typeof allIconNames;
type IconName = AllIconNamesType[0];

const allIconNamesText = readFileSync('data/AllIconNames.json', 'utf-8');
let iconNames: IconName[];

try {
    iconNames = JSON.parse(allIconNamesText);
}
catch {
    throw new Error('Unable to parse icon name data');
}

const iconMoonSvgFolder = 'icomoon/SVG/';
const outputSvgFolder = 'svg/';

for(const icon of iconNames) {
    renameSync(
        iconMoonSvgFolder + 'uni' + icon.unicode + '.svg', 
        outputSvgFolder + icon.name + '.svg'
    );
}