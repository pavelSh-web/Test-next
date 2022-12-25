import { AptosAccount, AptosClient, FaucetClient, HexString, Types } from 'aptos';

export default class Module {
    private client: AptosClient;
    private faucet: FaucetClient;
    private log = true;
    private verbose = false;

    public address: HexString;
    public name = '';

    constructor({ address, name, client, faucet, log, verbose }: { address: string, name: string, client: AptosClient, faucet: FaucetClient, log?: boolean,  verbose?: boolean }) {
        this.address = new HexString(address);
        this.name = name;
        this.client = client;
        this.faucet = faucet;

        if (log != null) {
            this.log = log;
        }

        if (verbose != null) {
            this.verbose = verbose;
        }
    }

    toggleLogging(state) {
        this.log = state;
    }

    logMessage(...args: any[]) {
        if (this.log) {
            console.log(...args);
        }
    }

    logGroup(...args: any[]) {
        if (this.log) {
            console.group(...args);
        }
    }

    logGroupEnd() {
        if (this.log) {
            console.groupEnd();
            console.log('');
        }
    }

    getResourceName(localName) {
        return `${ this.address.hex() }::${ this.name }::${ localName }`;
    }

    async runEntryFunction(signer: AptosAccount, name: string, args: any[] = []): Promise<Types.Transaction_UserTransaction> {
        const payload = {
            function: this.getResourceName(name),
            type_arguments: [],
            arguments: args || []
        };

        this.logGroup(`Run "${ name }" by signer (${ signer.address() })`);

        const txnRequest = await this.client.generateTransaction(signer.address(), payload, { max_gas_amount: '500000' });
        const bcsTxn = AptosClient.generateBCSTransaction(signer, txnRequest);
        const transactionRes = await this.client.submitSignedBCSTransaction(bcsTxn);

        this.logMessage(`TX: ${ transactionRes.hash }, wait...`);
        const result = await this.client.waitForTransactionWithResult(transactionRes.hash);

        // @ts-ignore
        if (result.success) {
            this.logMessage(`Success`, this.verbose ? result : '');
        }
        else {
            this.logMessage(`Error`, this.verbose ? result : '');
        }

        this.logGroupEnd();

        return result as Types.Transaction_UserTransaction;
    }

    async getResources(): Promise<Types.MoveResource[]> {
        return this.client.getAccountResources(this.address);
    }


    /**
     * Get module resource data
     */
    async getResourceData(resourceName): Promise<Types.MoveStructValue | void> {
        if (!resourceName) {
            return null;
        }

        const searchForType = this.getResourceName(resourceName);
        const resources = await this.getResources();

        const foundResource = resources.find(resource => resource.type === searchForType);

        return foundResource?.data;
    }
}
