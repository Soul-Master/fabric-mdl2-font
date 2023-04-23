import { readFileSync, writeFileSync } from 'node:fs';
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

const iconsVariable = '[[icons]]';
const outputSvgFolder = 'svg/';
const pureSvgTemplateFile = 'src/pure-svg.html.template';
const pureSvgFile = 'src/pure-svg.html';

let iconsTemplate = '';

iconNames.forEach(x => {
    iconsTemplate += 
`<div class="IconContainer" tabindex="0" title="${x.name} - ${x.unicode}">
    <div class="IconContainer-icon">
    ${readFileSync(outputSvgFolder + x.name + '.svg')}
    </div>
    <div class="IconContainer-name ms-font-l">
        ${x.name}
    </div>
</div>`
})

let fileText = readFileSync(pureSvgTemplateFile, 'utf-8');
fileText = fileText.replace(iconsVariable, iconsTemplate);

writeFileSync(pureSvgFile, fileText, {
    encoding: 'utf-8'
})