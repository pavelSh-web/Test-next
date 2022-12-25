import { promises as fs } from 'fs';
import path from 'path';

const tokenDir = path.join(process.cwd(), 'meta/json/');

export default async function getTokenMetadata(tokenId: string | number): Promise<Record<string, any> | null> {
    try {
        const file = await fs.readFile(path.join(tokenDir, `${ tokenId }.json`));

        return JSON.parse(file.toString());
    }
    catch (err) {
        console.error(err);

        return null;
    }
}
