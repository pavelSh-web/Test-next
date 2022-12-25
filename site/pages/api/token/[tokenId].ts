import getTokenMetadata from '@utils/getTokenMetadata';
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = Record<string, string | number | null>

enum ErrorCode {
    BAD_TOKEN_ID,
    TOKEN_ID_NOT_FOUND,
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const tokenId = `${ req.query.tokenId }`.replace('.json', '');

    if (!tokenId) {
        return res.status(400).json({
            code: ErrorCode.BAD_TOKEN_ID,
            error: 'Wrong TokenId'
        });
    }

    const tokenMetadata = await getTokenMetadata(tokenId);

    if (!tokenMetadata) {
        return res.status(404).json({
            code: ErrorCode.TOKEN_ID_NOT_FOUND,
            error: 'TokenId Not Found'
        });
    }

    res.status(200).json(tokenMetadata)
}
