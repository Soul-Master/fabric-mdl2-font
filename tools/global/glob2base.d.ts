declare module 'glob2base' {
    import * as glob from 'glob';

    export default function glob2base(glob: glob.IGlobBase): string;
}