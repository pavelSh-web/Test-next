import { promises as fs } from 'fs';
import path from 'path';
import isHex from './isHex';

const whitelistFileName = path.join(process.cwd(), 'meta/whitelist.txt');

let whitelist: string[];

function normalizeAddress(address: string) {
    if (!address) {
        return '';
    }

    return address.trim().replace(/^0x/, '');
}

async function readFile() {
    const content = (await fs.readFile(whitelistFileName)).toString();

    return content.split('\n')
                  .map(address => normalizeAddress(address))
                  .filter(address => address && isHex(address));
}

/**
 * Checks have been address included in whitelist.txt file
 * @param address
 */
export default async function addressInWhitelist(address: string) {
    whitelist = whitelist || await readFile();

    return whitelist.includes(normalizeAddress(address));
}
