import { AptosAccount, BCS, HexString, TxnBuilderTypes } from 'aptos';
import { Proof } from '../externals';

const MODULE_ADDRESS = new HexString(process.env.MODULE_ADDRESS as string);
const MODULE_NAME = process.env.MODULE_NAME as string;
const PROOF_TYPE = 'ProofChallenge';

export default function createSignature(signer: AptosAccount, proof: Proof): HexString {
    const serializer = new BCS.Serializer();

    // Type
    serializer.serializeFixedBytes(TxnBuilderTypes.AccountAddress.fromHex(MODULE_ADDRESS).address);
    serializer.serializeStr(MODULE_NAME);
    serializer.serializeStr(PROOF_TYPE);

    // Data
    serializer.serializeFixedBytes(TxnBuilderTypes.AccountAddress.fromHex(proof.address).address);
    serializer.serializeU64(proof.amount);
    serializer.serializeU8(proof.type);

    return signer.signBuffer(serializer.getBytes());
}
