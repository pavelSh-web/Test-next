const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        appDir: true,
    },
    sassOptions: {
        includePaths: [path.join(__dirname, 'styles')],
    },
    // TODO разобраться почему .env не работает и вынести отсюда
    env: {
        MODULE_ADDRESS: '7ebfea4a07a94288aeb946acd6b50409d11b98ec9ba5e56c0e2c949ae1309e5a',
        MODULE_NAME: 'nft_factory',
        DEV_PRIVATE_KEY: '0xe960327ac260d3a8579388f50754b1c1db5a70f85c636a1761d584c6dcd58786',
        PRESALE_START_TIME: Math.floor(Date.now() / 1000) + 15,
        SALE_START_TIME: Math.floor(Date.now() / 1000) + 30,
    }
};

module.exports = nextConfig
