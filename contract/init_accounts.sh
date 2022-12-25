#!/bin/sh

aptos init  --network devnet --profile default --private-key 0x9758ba931a5ad5840687a5ceaa7dcfe6ace9a515dff01d30a2bb16fec91bedc5 --assume-yes
aptos account fund-with-faucet --account default --amount 500000000

aptos init --network devnet --profile dev --private-key 0xe960327ac260d3a8579388f50754b1c1db5a70f85c636a1761d584c6dcd58786 --assume-yes
aptos account fund-with-faucet --account dev --amount 500000000

aptos init --network devnet --profile owner --private-key 0x54a5851bfbb7f9948a289675962666cc8272296b57f46e6655cf761c05d9547b --assume-yes
aptos account fund-with-faucet --account owner --amount 500000000

aptos init --network devnet --profile user1 --private-key 0xeea5f61948532dc46ae988a37cbae0a168805fbe7a6c6fffa017e00944f1526c --assume-yes
aptos account fund-with-faucet --account user1 --amount 500000000

aptos init --network devnet --profile user2 --private-key 0xa1c4b0811c9be1e495c569c8f5bada7d590857a589c7eb3eacb9c64ad66a5e35 --assume-yes
aptos account fund-with-faucet --account user2 --amount 500000000
