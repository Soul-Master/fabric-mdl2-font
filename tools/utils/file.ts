import { copyFileSync, existsSync, mkdirSync, rmSync } from 'fs';
import glob from 'glob';
import glob2base from 'glob2base';
import { dirname, join, relative, resolve } from 'path';

const bomChar = 0xFEFF;

export function removeFiles(pathOrPattern: string) {
    if (pathOrPattern.includes('*')) {
        const files = glob.sync(pathOrPattern);

        for (const f of files) {
            rmSync(f, { force: true });
        }
    }
    else {
        if (existsSync(pathOrPattern)) {
            rmSync(pathOrPattern, { force: true, recursive: true });
        }
    }
}

// Port from cpx@1.5.0
// https://github.com/mysticatea/cpx/blob/v1.5.0/
export function copyFiles(source: string, outDir: string) {
    const globSource = new glob.GlobSync(source, {
        nodir: true,
        follow: false
    });
    const base = normalizePath(glob2base(globSource));

    globSource.found.forEach(srcPath => {
        const dstPath = src2dst(srcPath, outDir, base!);
        if (dstPath === srcPath) return;

        const dstDir = dirname(dstPath);
        if (!existsSync(dstDir)) {
            mkdirSync(dstDir, { recursive: true });
        }

        copyFileSync(srcPath, dstPath);
    });
}

function src2dst(sourcePath: string, outDir: string, base: string) {
    if (base === '.') {
        return join(outDir, sourcePath);
    }

    return sourcePath.replace(base, outDir)
}

function normalizePath(sourcePath: string) {
    if (sourcePath == null) return null;

    let normalizedPath = relative(process.cwd(), resolve(sourcePath));

    normalizedPath = normalizedPath.replace(/\\/g, '/');

    if (/\/$/.test(normalizedPath)) {
        normalizedPath = normalizedPath.slice(0, -1);
    }

    return normalizedPath || '.';
}