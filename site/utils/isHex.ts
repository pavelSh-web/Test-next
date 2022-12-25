export default function isHex(h: string) {
    return /^(0x)?[0-9a-f]{1,}$/i.test(h);
}
