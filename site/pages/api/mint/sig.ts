// /api/mint/sig
//     ?address=cfe92f070b9614df1d522fcc5e1fe6d729a6b6805d3181aef8318712e4ab69bc
//     &amount=1
//     &type=0

import type { NextApiRequest, NextApiResponse } from 'next'
import { AptosAccount, HexString } from 'aptos';

import isHex from '@utils/isHex';
import createSignature from '@utils/createSignature';
import addressInWhitelist from '@utils/addressInWhitelist';

enum ErrorCode {
    BAD_ADDRESS,
    BAD_AMOUNT,
    PRESALE_NOT_STARTED,
    SALE_NOT_STARTED,
    NOT_IN_WHITELIST,
}

enum SaleType {
    PRESALE,
    PUBLIC,
}

type Data = {
    sig: string
}

type Error = {
    code: ErrorCode
    error: string
}

const SIGNER = new AptosAccount(new HexString(process.env.DEV_PRIVATE_KEY as string).toUint8Array());
const PRESALE_START_TIME = process.env.PRESALE_START_TIME as unknown as number;
const SALE_START_TIME = process.env.SALE_START_TIME as unknown as number;

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data | Error>
) {
    const now = Math.floor(Date.now() / 1000);
    const address = req.query.address as string || '0x0';
    const amount = parseInt(req.query.amount as string, 10);

    // @ts-ignore
    const type = parseInt((req.query.type as unknown as SaleType) ?? ((now < SALE_START_TIME) ? SaleType.PRESALE : SaleType.PUBLIC), 10);

    /* Asserts */
    if (!isHex(address)) {
        return res.status(400).json({
            code: ErrorCode.BAD_ADDRESS,
            error: 'Bad Address'
        });
    }

    if (!amount) {
        return res.status(400).json({
            code: ErrorCode.BAD_AMOUNT,
            error: 'Bad Amount'
        });
    }

    if (type === SaleType.PRESALE && now < PRESALE_START_TIME) {
        return res.status(400).json({
            code: ErrorCode.PRESALE_NOT_STARTED,
            error: 'Pre Sale Not Started'
        });
    }

    if (type === SaleType.PUBLIC && now < SALE_START_TIME) {
        return res.status(400).json({
            code: ErrorCode.SALE_NOT_STARTED,
            error: 'Public Sale Not Started'
        });
    }

    if (type === SaleType.PRESALE && !await addressInWhitelist(address)) {
        return res.status(400).json({
            code: ErrorCode.NOT_IN_WHITELIST,
            error: 'Not Whitelisted'
        });
    }

    /* GENERATE */
    const signature = createSignature(SIGNER, {
        address,
        amount,
        type
    });

    return res.status(200).json({
        sig: signature.hex()
    });
}
