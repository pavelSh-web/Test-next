import { BCS, HexString, TxnBuilderTypes } from 'aptos';

interface Proof {
    address: HexString;
    amount: number;
    type: number; // 0 - presale, 1 - sale
}

export default function createSignature(signer, types, proof: Proof): Uint8Array {
    const serializer = new BCS.Serializer();

    // Type
    serializer.serializeFixedBytes(TxnBuilderTypes.AccountAddress.fromHex(types[0]).address);
    serializer.serializeStr(types[1]);
    serializer.serializeStr(types[2]);

    // Data
    serializer.serializeFixedBytes(TxnBuilderTypes.AccountAddress.fromHex(proof.address).address);
    serializer.serializeU64(proof.amount);
    serializer.serializeU8(proof.type);

    const messageBytes = serializer.getBytes();

    return signer.signBuffer(messageBytes).toUint8Array();
}
