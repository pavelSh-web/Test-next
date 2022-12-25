import { expect } from 'chai';

import {
    AptosClient,
    CoinClient,
    AptosAccount,
    FaucetClient,
    HexString,
} from 'aptos';


import createSignature from '../scripts/createSignature';
import { execShellCommand, formatBigint } from '../scripts/helpers';

import Module from '../scripts/Module';

const NODE_URL = "https://fullnode.devnet.aptoslabs.com";
const FAUCET_URL = "https://faucet.devnet.aptoslabs.com";

const MODULE_NAME = 'nft_factory';
const DEPLOYER_PROFILE_NAME = 'module';
const DEPLOYER_PRIVATE_KEY = new HexString('0x184787af5cc34bd89f31e113cfadc1f8978967ab99fbb8514142920db1397c4f');
const OWNER_PRIVATE_KEY = new HexString('0x54a5851bfbb7f9948a289675962666cc8272296b57f46e6655cf761c05d9547b');
const DEV_PRIVATE_KEY = new HexString('0xe960327ac260d3a8579388f50754b1c1db5a70f85c636a1761d584c6dcd58786');
const USER1_PRIVATE_KEY = new HexString('0xeea5f61948532dc46ae988a37cbae0a168805fbe7a6c6fffa017e00944f1526c');
const USER2_PRIVATE_KEY = new HexString('0xa1c4b0811c9be1e495c569c8f5bada7d590857a589c7eb3eacb9c64ad66a5e35');
const USER3_PRIVATE_KEY = new HexString('0x84b540509384ddc80be8c27b77dbccb0c6d81ce84fd26e465c2831e31906bb62');
const USER4_PRIVATE_KEY = new HexString('0x2d755070f56575aa4132e5ef6ed9ff00ed671d127c1f3c6e5fec2c906829c721');

// Collection params
const PRESALE_PRICE = 80000000n; // 0.8 APT
const SALE_PRICE = 100000000n; // 1 APT
const PRESALE_LIMIT = 1;
const SALE_LIMIT = 2;
const PRESALE_START = Math.floor(Date.now() / 1000);
const SALE_START = Math.floor(Date.now() / 1000);

const COLLECTION_SUPPLY = 5;
const COLLECTION_URI = 'https://bestpasses.nft/';
const COLLECTION_NAME = 'CoolPass';
const COLLECTION_DESC = 'Amazing pass collection';

const TOKEN_NAME_PREFIX = 'Amazing pass #';
const TOKEN_DESC = 'Really useless pass item';
const TOKEN_BASE_URI = 'https://bestpasses.nft/token/';
const ROYALTY_NUMERATOR = 15;
const ROYALTY_DENOMINATOR = 100;

describe('nft_factory', () => {
    const getBalances = async(users: Record<string, AptosAccount>): Promise<Record<string, bigint>> => {
        const balances: [string, bigint][] = await Promise.all(
            Object.entries(users).map(async([name, account]) => {
                return [name, await coinClient.checkBalance(account)];
            })
        );

        return balances.reduce((acc, [name, balance]) => {
            return { ...acc, [name]: balance };
        }, {})
    }

    const client = new AptosClient(NODE_URL);
    const coinClient = new CoinClient(client);
    const faucet = new FaucetClient(NODE_URL, FAUCET_URL);

    const users = {
        deployer: new AptosAccount(DEPLOYER_PRIVATE_KEY.toUint8Array()),
        owner: new AptosAccount(OWNER_PRIVATE_KEY.toUint8Array()),
        dev: new AptosAccount(DEV_PRIVATE_KEY.toUint8Array()),
        presaleUser: new AptosAccount(USER1_PRIVATE_KEY.toUint8Array()),
        publicUser: new AptosAccount(USER2_PRIVATE_KEY.toUint8Array()),
        finalUser: new AptosAccount(USER3_PRIVATE_KEY.toUint8Array()),
        unluckyUser: new AptosAccount(USER4_PRIVATE_KEY.toUint8Array()),
    };

    let module: Module;
    let candymachine;
    let proofChallengeType;
    let startBalances: Record<string, bigint> = {};
    let finalBalances: Record<string, bigint> = {};

    /* Deploy */
    before(async () => {
        console.group('\nCreate module');
        console.log('Publishing...');
        await execShellCommand(`aptos move publish --profile ${ DEPLOYER_PROFILE_NAME } --named-addresses module_address=${ DEPLOYER_PROFILE_NAME } --assume-yes`);

        const address = users.deployer.address().hex();

        module = new Module({
            address,
            name: MODULE_NAME,
            client,
            faucet,
            log: true,
            verbose: true
        });
        console.log('Module deployed to address: ', address);
        console.groupEnd();

        proofChallengeType = [module.address.hex(), 'nft_factory', 'ProofChallenge'];

        console.group('\nCreate users');
        console.log('Fund users...');
        await faucet.fundAccount(users.deployer.address(), 110000000);
        // await faucet.fundAccount(users.owner.address(), 110000000);
        // await faucet.fundAccount(users.presaleUser.address(), 110000000);
        await faucet.fundAccount(users.publicUser.address(), 110000000);
        await faucet.fundAccount(users.publicUser.address(), 110000000);
        await faucet.fundAccount(users.finalUser.address(), 110000000);
        await faucet.fundAccount(users.finalUser.address(), 110000000);
        await faucet.fundAccount(users.unluckyUser.address(), 110000000);
        await faucet.fundAccount(users.unluckyUser.address(), 110000000);

        startBalances = await getBalances(users);

        console.log('Start balances: ');
        Object.entries(startBalances).map(async([name, balance]) => {
            console.log(`${ name }: `, formatBigint(balance));
        });

        console.groupEnd();
    });

    after(async () => {
        console.log('Final balances: ');

        Object.entries(finalBalances).map(async([name, balance]) => {
            console.log(`${ name }: `, formatBigint(balance));
        })
    });

    before(async() => {
        const args = [
            COLLECTION_NAME, // collection_name: String
            COLLECTION_DESC, // collection_desc: String
            COLLECTION_URI, // collection_uri: String
            COLLECTION_SUPPLY, // collection_maximum: u64

            TOKEN_NAME_PREFIX, // token_prefix: String
            TOKEN_DESC, // token_desc: String
            TOKEN_BASE_URI, // base_uri: String

            users.dev.address(), // payee_address: address
            ROYALTY_NUMERATOR, // royalty_numerator: u64
            ROYALTY_DENOMINATOR, // royalty_denominator: u64

            PRESALE_PRICE, // presale_price: u64
            SALE_PRICE, // sale_price: u64
            PRESALE_START, // presale_start: u64
            SALE_START, // sale_start: u64
            PRESALE_LIMIT, // presale_per_wallet: u64
            SALE_LIMIT, // sale_per_wallet: u64

            users.dev.pubKey().toUint8Array() // signer_pub_key: vector<u8>
        ];

        const result = await module.runEntryFunction(users.deployer, 'create_collection', args);

        expect(
            result
        ).to.have.property('success', true)

        const createCollection = result.events.find(evt => evt.type === '0x3::token::CreateCollectionEvent');
        candymachine = createCollection.data.creator;

        console.log('Collection created under resource', candymachine);
    });

    // beforeEach(async () => {});
    /* Tests */
    describe('Init Collection', async() => {
        it('Set Owner Address', async() => {
            expect(
                await module.runEntryFunction(users.deployer, 'set_owner_address', [users.owner.address()])
            ).to.have.property('success', true)

            // Not owner anymore, should fail
            expect(
                await module.runEntryFunction(users.deployer, 'set_owner_address', [users.owner.address()])
            ).to.have.property('success', false)
        });

        it('Set Token Info', async() => {
            expect(
                await module.runEntryFunction(users.owner, 'set_tokens_meta', [
                    candymachine,
                    TOKEN_NAME_PREFIX,
                    TOKEN_DESC,
                    TOKEN_BASE_URI,
                    ROYALTY_NUMERATOR,
                    ROYALTY_DENOMINATOR
                ])
            ).to.have.property('success', true)
        });

        it('Update Collection Info', async() => {
            expect(
                await module.runEntryFunction(users.owner, 'set_collection_meta', [candymachine, COLLECTION_SUPPLY, COLLECTION_URI, COLLECTION_DESC])
            ).to.have.property('success', true)
        });

        it('Set Dev Key', async() => {
            expect(
                await module.runEntryFunction(users.owner, 'set_dev_key', [candymachine, users.dev.pubKey().toUint8Array()])
            ).to.have.property('success', true)
        });

        it('Set Payee Address', async() => {
            expect(
                await module.runEntryFunction(users.owner, 'set_payee_address', [candymachine, users.dev.address()])
            ).to.have.property('success', true)
        });

        it('Set Mint Params', async() => {
            expect(
                await module.runEntryFunction(users.owner, 'set_prices', [candymachine, PRESALE_PRICE, SALE_PRICE])
            ).to.have.property('success', true)

            expect(
                await module.runEntryFunction(users.owner, 'set_limits', [candymachine, PRESALE_LIMIT, SALE_LIMIT])
            ).to.have.property('success', true)

            expect(
                await module.runEntryFunction(users.owner, 'set_start_timestamp', [candymachine, PRESALE_START, SALE_START])
            ).to.have.property('success', true)
        });
    });

    describe('Mint', async() => {
        it('Mint Not Open', async() => {
            const presaleSignature = createSignature(users.dev, proofChallengeType, {
                address: users.unluckyUser.address(),
                amount: PRESALE_LIMIT,
                type: 0
            });

            const saleSignature = createSignature(users.dev, proofChallengeType, {
                address: users.unluckyUser.address(),
                amount: SALE_LIMIT,
                type: 1
            });

            expect(
                await module.runEntryFunction(users.unluckyUser, 'presale_mint', [candymachine, PRESALE_LIMIT, presaleSignature])
            ).to.have.property('vm_status').contains('EMINTING_DISABLED')

            expect(
                await module.runEntryFunction(users.unluckyUser, 'mint', [candymachine, SALE_LIMIT, saleSignature])
            ).to.have.property('vm_status').contains('EMINTING_DISABLED')
        });

        it('Presale Mint', async() => {
            const signature = createSignature(users.dev, proofChallengeType, {
                address: users.presaleUser.address(),
                amount: PRESALE_LIMIT,
                type: 0
            });

            // Presale mint not open
            expect(
                await module.runEntryFunction(users.presaleUser, 'presale_mint', [candymachine, PRESALE_LIMIT, signature])
            ).to.have.property('vm_status').contains('EMINTING_DISABLED')

            // Open presale + Mint
            expect(
                await module.runEntryFunction(users.owner, 'set_sale_status', [candymachine, 1])
            ).to.have.property('success', true)

            expect(
                await module.runEntryFunction(users.presaleUser, 'presale_mint', [candymachine, PRESALE_LIMIT, signature])
            ).to.have.property('success', true)
        });

        it('Public Mint', async() => {
            const signature = createSignature(users.dev, proofChallengeType, {
                address: users.publicUser.address(),
                amount: SALE_LIMIT,
                type: 1
            });

            // Mint not open
            expect(
                await module.runEntryFunction(users.publicUser, 'mint', [candymachine, SALE_LIMIT, signature])
            ).to.have.property('vm_status').contains('EMINTING_DISABLED')

            // Open + Mint
            expect(
                await module.runEntryFunction(users.owner, 'set_sale_status', [candymachine, 2])
            ).to.have.property('success', true)

            expect(
                await module.runEntryFunction(users.publicUser, 'mint', [candymachine, SALE_LIMIT, signature])
            ).to.have.property('success', true)
        });

        it('Exceed Limit for Wallet', async() => {
            const signature = createSignature(users.dev, proofChallengeType, {
                address: users.publicUser.address(),
                amount: 1,
                type: 1
            });

            expect(
                await module.runEntryFunction(users.publicUser, 'mint', [candymachine, 1, signature])
            ).to.have.property('vm_status').contains('EOUT_OF_MINT_PER_WALLET')
        });

        it('Wrong signature', async() => {
            const signature = createSignature(users.dev, proofChallengeType, {
                address: users.unluckyUser.address(),
                amount: 22,
                type: 0
            });

            expect(
                await module.runEntryFunction(users.unluckyUser, 'mint', [candymachine, 1, signature])
            ).to.have.property('vm_status').contains('EINVALID_PROOF_OF_KNOWLEDGE')
        });

        it('Exceed Max Supply', async() => {
            const signature1 = createSignature(users.dev, proofChallengeType, {
                address: users.finalUser.address(),
                amount: SALE_LIMIT,
                type: 1
            });

            const signature2 = createSignature(users.dev, proofChallengeType, {
                address: users.unluckyUser.address(),
                amount: SALE_LIMIT,
                type: 1
            });

            expect(
                await module.runEntryFunction(users.finalUser, 'mint', [candymachine, SALE_LIMIT, signature1])
            ).to.have.property('success', true)

            expect(
                await module.runEntryFunction(users.unluckyUser, 'mint', [candymachine, SALE_LIMIT, signature2])
            ).to.have.property('vm_status').contains('EOUT_OF_MINT_SUPPLY')
        });
    });

    describe('Update Exist Token Data', async() => {
        const tokenNumber = 1;

        it('Change Token Description', async() => {
            expect(
                await module.runEntryFunction(users.owner, 'change_token_description', [candymachine, tokenNumber, 'Really useless changed pass item'])
            ).to.have.property('success', true)
        });

        it('Change Token Uri', async() => {
            expect(
                await module.runEntryFunction(users.owner, 'change_token_uri', [candymachine, tokenNumber, 'https://bestpasses.nft/token/new/'])
            ).to.have.property('success', true)
        });

        it('Change Token Royalty', async() => {
            expect(
                await module.runEntryFunction(users.owner, 'change_token_royalty', [candymachine, tokenNumber, users.dev.address(), 50, 100])
            ).to.have.property('success', true)
        });
    });

    describe('Check Balances', async() => {
        before(async() => {
            finalBalances = await getBalances(users);
        });

        it('Presale price', async() => {
            expect(finalBalances.presaleUser < startBalances.presaleUser - PRESALE_PRICE * BigInt(PRESALE_LIMIT)).to.be.true;
        });

        it('Sale price', async() => {
            expect(finalBalances.publicUser < startBalances.publicUser - SALE_PRICE * BigInt(SALE_LIMIT)).to.be.true;
        });

        it('Payee got their funds', async() => {
            expect(finalBalances.dev > startBalances.dev).to.be.true;
        });

        // NOTE не может существовать т.к ключ доступа у владельца аккаунта, т.е списание надо делать через кошелек
        // it('Withdraw from contract', async() => {
        //     const transferAmount = 1000000;
        //
        //     // Send APT from deployer to module
        //     await coinClient.transfer(users.deployer, { address: () => module.address } as unknown as AptosAccount, transferAmount);
        //
        //     // Withdraw APT from module to dev
        //     expect(
        //         await module.runEntryFunction(users.owner, 'withdraw', [users.dev.address(), transferAmount])
        //     ).to.have.property('success', true)
        // });
    });

    describe('Final State', async() => {
        // TODO ModuleData, TokenData
    });
});
