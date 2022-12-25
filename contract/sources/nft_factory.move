module module_address::nft_factory {
    use std::error;
    use std::signer::{address_of};
    use std::string::{Self, String};
    use std::vector;

    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_framework::account::{Self, SignerCapability};
    use aptos_framework::event::{Self, EventHandle};
    use aptos_std::simple_map::{Self, SimpleMap};
    use aptos_std::ed25519::{Self, ValidatedPublicKey};
    use aptos_token::token::{Self, TokenDataId};
    use aptos_framework::timestamp;

    // Resource
    struct ResourceSigners has key {
        signer_caps: SimpleMap<address, SignerCapability>,
        owner_address: address
    }

    // Main module data
    struct ModuleData has key {
        public_key: ed25519::ValidatedPublicKey, // Admin pk for signature verify

        payee_address: address,

        collection_supply: u64,
        collection_maximum: u64,
        collection_name: String,

        token_prefix: String,
        token_desc: String,
        base_uri: String,
        royalty_numerator: u64,
        royalty_denominator: u64,

        presale_price: u64,
        sale_price: u64,
        presale_start: u64,
        sale_start: u64,
        presale_per_wallet: u64,
        sale_per_wallet: u64,
        sale_status: u64,
    }

    // Mint event, contain reciever address and token id
    struct TokenMintingEvent has drop, store {
        token_receiver_address: address,
        token_data_id: TokenDataId,
    }

    // Minted tokens info
    struct MintedTokens has key {
        tokens: vector<TokenDataId>,
        events: EventHandle<TokenMintingEvent>,
        minters: SimpleMap<address, u64>,
    }

    // Data for signature verification
    struct ProofChallenge has drop {
        address: address,
        amount: u64,
        type: u8
    }

    /// Initial constants
    /// !!! Please do not forget to change this constants to the actual values
    const COLLECTION_NAME: vector<u8> = b"Collection Name";
    const DEFAULT_COLLECTION_DESC: vector<u8> = b"Collection Description";
    const DEFAULT_COLLECTION_URI: vector<u8> = b"https://example.com/";
    const DEFAULT_TOKEN_BASE_URI: vector<u8> = b"https://example.com/metadata/pass/";
    const DEFAULT_TOKEN_NAME_PREFIX: vector<u8> = b"Token Pass #";
    const DEFAULT_TOKEN_DESCRIPTION: vector<u8> = b"Token Pass Description";
    const DEFAULT_ROYALTY_NUMERATOR: u64 = 0;
    const DEFAULT_ROYALTY_DENOMINATOR: u64 = 100;
    const DEFAULT_COLLECTION_SUPPLY: u64 = 4444;

    const PAYEE_ADDRESS: address = @module_address;
    const PRESALE_PRICE: u64 = 100000000; // 1 APT
    const SALE_PRICE: u64 = 100000000; // 1 APT
    const PRESALE_PER_WALLET: u64 = 2;
    const SALE_PER_WALLET: u64 = 2;

    /// Sale states
    const SALE_STATUS_OFF: u64 = 0;
    const SALE_STATUS_PRESALE: u64 = 1;
    const SALE_STATUS_SALE: u64 = 2;

    /// Errors
    const EINVALID_ARGUMENT: u64 = 0;
    const ENOT_AUTHORIZED: u64 = 1;
    const EMINTING_DISABLED: u64 = 2;
    const EINVALID_PROOF_OF_KNOWLEDGE: u64 = 3;
    const EINSUFFICIENT_BALANCE: u64 = 4;
    const EOUT_OF_MINT_SUPPLY: u64 = 5;
    const EOUT_OF_MINT_PER_WALLET: u64 = 6;

    /* INIT */
    fun init_module(source_account: &signer) {
        if (!exists<ResourceSigners>(@module_address)) {
            move_to(source_account, ResourceSigners {
                signer_caps: simple_map::create<address, SignerCapability>(),
                owner_address: address_of(source_account),
            });
        };
    }

    /// Create collection
    public entry fun create_collection(
        source_account: &signer,

        collection_name: String,
        collection_desc: String,
        collection_uri: String,
        collection_maximum: u64,

        token_prefix: String,
        token_desc: String,
        base_uri: String,

        payee_address: address,
        royalty_numerator: u64,
        royalty_denominator: u64,

        presale_price: u64,
        sale_price: u64,
        presale_start: u64,
        sale_start: u64,

        presale_per_wallet: u64,
        sale_per_wallet: u64,
        signer_pub_key: vector<u8>
    ) acquires ResourceSigners {
        is_owner(source_account);

        // Write resource and signer info to source_account
        let (_, signer_cap) = account::create_resource_account(source_account, *string::bytes(&collection_name));
        let resource_signer = account::create_signer_with_capability(&signer_cap);

        // Save collection signer capabilities to source module
        store_signer_cap(address_of(&resource_signer), signer_cap);

        // Write tokens data to resource
        move_to(&resource_signer, MintedTokens {
            tokens: vector::empty<TokenDataId>(),
            events: account::new_event_handle<TokenMintingEvent>(&resource_signer),
            minters: simple_map::create(),
        });

        // Write module data to resource
        move_to(&resource_signer, ModuleData {
            public_key: std::option::extract(&mut ed25519::new_validated_public_key_from_bytes(signer_pub_key)),

            payee_address,

            collection_supply: 0,
            collection_name,
            collection_maximum,

            token_prefix,
            token_desc,
            base_uri,
            royalty_numerator,
            royalty_denominator,

            presale_price,
            sale_price,
            presale_start,
            sale_start,
            presale_per_wallet,
            sale_per_wallet,
            sale_status: 0,
        });

        // Create collection
        token::create_collection(
            &resource_signer,
            collection_name,
            collection_desc,
            collection_uri,
            collection_maximum,
            // Allow any mutation to the collection (description, uri, maximum_supply)
            vector<bool>[ true, true, true ]
        );
    }

    /// Internal mint
    fun safe_mint(resource_signer: &signer, receiver: &signer, amount: u64, module_data: &mut ModuleData, minted_tokens: &mut MintedTokens) {
        let supply = module_data.collection_supply;
        let maximum = module_data.collection_maximum;

        assert!(supply + amount <= maximum, error::out_of_range(EOUT_OF_MINT_SUPPLY));

        // Allow direct transfer
        token::opt_in_direct_transfer(receiver,true);

        let i = 1;

        // Mint + Send to receiver
        while (i <= amount) {
            let token_number = supply + i;
            let token_prefix = module_data.token_prefix;
            let token_desc = module_data.token_desc;
            let token_uri = module_data.base_uri;

            string::append(&mut token_prefix, integer_to_string(token_number));
            string::append(&mut token_uri, integer_to_string(token_number));

            // Create a token data to specify which token will be minted
            let token_data_id = token::create_tokendata(
                resource_signer,
                module_data.collection_name,
                token_prefix,
                token_desc,
                1, // ERC721
                token_uri,
                module_data.payee_address,
                module_data.royalty_denominator,
                module_data.royalty_numerator,
                // Allow some mutation to the token (maximum, uri, royalty, description, properties)
                token::create_token_mutability_config(
                    &vector<bool>[ false, true, true, true, true ]
                ),
                vector::empty<String>(),
                vector::empty<vector<u8>>(),
                vector::empty<String>(),
            );

            // let token_id = token::mint_token(&resource_signer, token_data_id, 1);
            // token::direct_transfer(&resource_signer, receiver, token_id, 1);
            token::mint_token_to(resource_signer, address_of(receiver), token_data_id, 1);

            vector::push_back(&mut minted_tokens.tokens, token_data_id);

            event::emit_event<TokenMintingEvent>(
                &mut minted_tokens.events,
                TokenMintingEvent {
                    token_receiver_address: address_of(receiver),
                    token_data_id
                }
            );

            i = i + 1;
        };

        module_data.collection_supply = module_data.collection_supply + amount;

        if (simple_map::contains_key(&minted_tokens.minters, &address_of(receiver))) {
            let minted_amount = simple_map::borrow_mut(&mut minted_tokens.minters, &address_of(receiver));

            *minted_amount = *minted_amount + amount;
        }
        else {
            simple_map::add(&mut minted_tokens.minters, address_of(receiver), amount);
        };
    }

    /// Transfer AptosCoin from signer to address
    fun safe_widthdraw(from: &signer, to: address, amount: u64) {
        check_balance(address_of(from), amount);

        coin::transfer<AptosCoin>(from, to, amount);
    }

    /* INTERNALS  */
    fun store_signer_cap(
        signer_address: address,
        signer_cap: SignerCapability,
    ) acquires ResourceSigners {
        let resource_data = borrow_global_mut<ResourceSigners>(@module_address);

        simple_map::add(&mut resource_data.signer_caps, signer_address, signer_cap);
    }

    /// Return a signer for making changes to 0x1 as part of on-chain governance proposal process.
    fun get_signer(resource_address: address): signer acquires ResourceSigners {
        let resource_data = borrow_global<ResourceSigners>(@module_address);
        let signer_cap = simple_map::borrow(&resource_data.signer_caps, &resource_address);

        account::create_signer_with_capability(signer_cap)
    }

    /// Die if caller is not owner
    fun is_owner(caller: &signer) acquires ResourceSigners {
        let resource_data = borrow_global<ResourceSigners>(@module_address);

        assert!(address_of(caller) == resource_data.owner_address, error::permission_denied(ENOT_AUTHORIZED));
    }

    /// Die if spender balance not enough
    fun check_balance(spender: address, amount: u64) {
        assert!(
            coin::balance<AptosCoin>(spender) >= amount,
            error::resource_exhausted(EINSUFFICIENT_BALANCE)
        );
    }

    /// Verify that the collection token minter intends to mint NFT
    fun verify_proof_of_knowledge(
        proof_challenge: ProofChallenge,
        proof_signature: vector<u8>,
        public_key: ValidatedPublicKey
    ) {
        let signature = ed25519::new_signature_from_bytes(proof_signature);
        let unvalidated_public_key = ed25519::public_key_to_unvalidated(&public_key);

        assert!(
            ed25519::signature_verify_strict_t(&signature, &unvalidated_public_key, proof_challenge),
            error::invalid_argument(EINVALID_PROOF_OF_KNOWLEDGE)
        );
    }

    /// Number to string helper
    fun integer_to_string(num: u64): String {
        let v1 = vector::empty();

        while (num/10 > 0){
            let rem = num%10;
            vector::push_back(&mut v1, (rem+48 as u8));
            num = num/10;
        };

        vector::push_back(&mut v1, (num+48 as u8));
        vector::reverse(&mut v1);
        string::utf8(v1)
    }


    /* PUBLIC METHODS */
    /// Presale for whitelisted users
    public entry fun presale_mint(receiver: &signer, candymachine: address, amount: u64, proof_signature: vector<u8>) acquires ResourceSigners, ModuleData, MintedTokens {
        let resource_signer = get_signer(candymachine);
        let module_data = borrow_global_mut<ModuleData>(address_of(&resource_signer));
        let minted_tokens = borrow_global_mut<MintedTokens>(address_of(&resource_signer));

        let proof_challenge = ProofChallenge {
            address: address_of(receiver),
            amount,
            type: 0
        };

        let minted_amount = 0;

        if (simple_map::contains_key(&minted_tokens.minters, &address_of(receiver))) {
            minted_amount = *simple_map::borrow(&minted_tokens.minters, &address_of(receiver));
        };

        // check wallet limits
        assert!(minted_amount + amount <= module_data.presale_per_wallet, error::invalid_argument(EOUT_OF_MINT_PER_WALLET));

        // Check sale status + check timestamp
        assert!(module_data.sale_status == SALE_STATUS_PRESALE, error::permission_denied(EMINTING_DISABLED));
        assert!(timestamp::now_seconds() > module_data.presale_start, error::permission_denied(EMINTING_DISABLED));

        // check signature
        verify_proof_of_knowledge(proof_challenge, proof_signature, module_data.public_key);

        // withdraw money
        safe_widthdraw(receiver, module_data.payee_address, module_data.presale_price * amount);

        // mint
        safe_mint(&resource_signer, receiver, amount, module_data, minted_tokens);
    }

    /// Public sale for all
    public entry fun mint(receiver: &signer, candymachine: address, amount: u64, proof_signature: vector<u8>) acquires ResourceSigners, ModuleData, MintedTokens {
        let resource_signer = get_signer(candymachine);

        let module_data = borrow_global_mut<ModuleData>(address_of(&resource_signer));
        let minted_tokens = borrow_global_mut<MintedTokens>(address_of(&resource_signer));

        let proof_challenge = ProofChallenge {
            address: address_of(receiver),
            amount,
            type: 1
        };

        let minted_amount = 0;

        if (simple_map::contains_key(&minted_tokens.minters, &address_of(receiver))) {
            minted_amount = *simple_map::borrow(&minted_tokens.minters, &address_of(receiver));
        };

        // check wallet limits
        assert!(
            minted_amount + amount <= module_data.sale_per_wallet,
            error::invalid_argument(EOUT_OF_MINT_PER_WALLET)
        );

        // Check sale status + check timestamp
        assert!(module_data.sale_status == SALE_STATUS_SALE, error::permission_denied(EMINTING_DISABLED));
        assert!(timestamp::now_seconds() > module_data.sale_start, error::permission_denied(EMINTING_DISABLED));

        // check signature
        verify_proof_of_knowledge(proof_challenge, proof_signature, module_data.public_key);

        // withdraw money
        safe_widthdraw(receiver, module_data.payee_address, module_data.sale_price * amount);

        // mint
        safe_mint(&resource_signer, receiver, amount, module_data, minted_tokens);
    }

    /* ADMIN METHODS */
    /// Change owner address
    public entry fun set_owner_address(caller: &signer, owner_address: address) acquires ResourceSigners {
        is_owner(caller);

        let module_data = borrow_global_mut<ResourceSigners>(@module_address);

        module_data.owner_address = owner_address;
    }

    /// Change payee address
    public entry fun set_payee_address(caller: &signer, candymachine: address, payee_address: address) acquires ResourceSigners, ModuleData {
        is_owner(caller);

        let resource_signer = get_signer(candymachine);
        let module_data = borrow_global_mut<ModuleData>(address_of(&resource_signer));

        module_data.payee_address = payee_address;
    }

    /// Set the dev public key
    public entry fun set_dev_key(caller: &signer, candymachine: address, pk_bytes: vector<u8>) acquires ResourceSigners, ModuleData {
        is_owner(caller);

        let resource_signer = get_signer(candymachine);
        let module_data = borrow_global_mut<ModuleData>(address_of(&resource_signer));

        module_data.public_key = std::option::extract(&mut ed25519::new_validated_public_key_from_bytes(pk_bytes));
    }

    /// Set sale status
    public entry fun set_sale_status(caller: &signer, candymachine: address, status: u64) acquires ResourceSigners, ModuleData {
        is_owner(caller);

        let statuses = vector<u64>[ SALE_STATUS_OFF, SALE_STATUS_PRESALE, SALE_STATUS_SALE ];

        assert!(
            vector::contains<u64>(&statuses, &status),
            error::invalid_argument(EINVALID_ARGUMENT)
        );

        let resource_signer = get_signer(candymachine);
        let module_data = borrow_global_mut<ModuleData>(address_of(&resource_signer));

        module_data.sale_status = status;
    }

    /// Set presale_price
    public entry fun set_prices(caller: &signer, candymachine: address, presale_price: u64, sale_price: u64) acquires ResourceSigners, ModuleData {
        is_owner(caller);

        let resource_signer = get_signer(candymachine);
        let module_data = borrow_global_mut<ModuleData>(address_of(&resource_signer));

        module_data.presale_price = presale_price;
        module_data.sale_price = sale_price;
    }

    /// Set presale_per_wallet + sale_per_wallet
    public entry fun set_limits(caller: &signer, candymachine: address, presale_per_wallet: u64, sale_per_wallet: u64) acquires ResourceSigners, ModuleData {
        is_owner(caller);

        let resource_signer = get_signer(candymachine);
        let module_data = borrow_global_mut<ModuleData>(address_of(&resource_signer));

        module_data.presale_per_wallet = presale_per_wallet;
        module_data.sale_per_wallet = sale_per_wallet;
    }

    /// Set presale_price + sale_price
    public entry fun set_start_timestamp(caller: &signer, candymachine: address, presale_start: u64, sale_start: u64) acquires ResourceSigners, ModuleData {
        is_owner(caller);

        let resource_signer = get_signer(candymachine);
        let module_data = borrow_global_mut<ModuleData>(address_of(&resource_signer));

        module_data.presale_start = presale_start;
        module_data.sale_start = sale_start;
    }

    /// Set Collection Metadata
    public entry fun set_collection_meta(caller: &signer, candymachine: address, maximum: u64, uri: vector<u8>, description: vector<u8>) acquires ResourceSigners, ModuleData {
        is_owner(caller);

        let resource_signer = get_signer(candymachine);
        let module_data = borrow_global_mut<ModuleData>(address_of(&resource_signer));

        module_data.collection_maximum = maximum;

        token::mutate_collection_uri(
            &resource_signer,
            module_data.collection_name,
            string::utf8(uri)
        );

        token::mutate_collection_description(
            &resource_signer,
            module_data.collection_name,
            string::utf8(description)
        );

        token::mutate_collection_maximum(
            &resource_signer,
            module_data.collection_name,
            maximum
        );
    }

    /// Set Tokens Metadata. Aplied only for not minted tokens
    public entry fun set_tokens_meta(
        caller: &signer,
        candymachine: address,
        name: vector<u8>,
        description: vector<u8>,
        base_uri: vector<u8>,
        numerator: u64,
        denominator: u64
    ) acquires ResourceSigners, ModuleData {
        is_owner(caller);

        let resource_signer = get_signer(candymachine);
        let module_data = borrow_global_mut<ModuleData>(address_of(&resource_signer));

        module_data.token_prefix = string::utf8(name);
        module_data.token_desc = string::utf8(description);
        module_data.base_uri = string::utf8(base_uri);
        module_data.royalty_numerator = numerator;
        module_data.royalty_denominator = denominator;
    }

    /// Change Description for specified token. Token must be minted.
    public entry fun change_token_description(
        caller: &signer,
        candymachine: address,
        tokenNumber: u64,
        description: vector<u8>
    ) acquires ResourceSigners, MintedTokens {
        is_owner(caller);

        let resource_signer = get_signer(candymachine);
        let minted_tokens = borrow_global<MintedTokens>(address_of(&resource_signer));

        let token_data_id = vector::borrow(&minted_tokens.tokens, tokenNumber - 1);

        token::mutate_tokendata_description(
            &resource_signer,
            *token_data_id,
            string::utf8(description)
        );
    }

    /// Change URI for specified token. Token must be minted.
    public entry fun change_token_uri(
        caller: &signer,
        candymachine: address,
        tokenNumber: u64,
        uri: vector<u8>
    ) acquires ResourceSigners, MintedTokens {
        is_owner(caller);

        let resource_signer = get_signer(candymachine);

        let minted_tokens = borrow_global<MintedTokens>(address_of(&resource_signer));
        let token_data_id = vector::borrow(&minted_tokens.tokens, tokenNumber - 1);

        token::mutate_tokendata_uri(
            &resource_signer,
            *token_data_id,
            string::utf8(uri)
        );
    }

    /// Change Royalty for specified token. Token must be minted.
    public entry fun change_token_royalty(
        caller: &signer,
        candymachine: address,
        tokenNumber: u64,
        payee_address: address,
        numerator_points: u64,
        denominator_points: u64
    ) acquires ResourceSigners, MintedTokens {
        is_owner(caller);

        let resource_signer = get_signer(candymachine);
        let minted_tokens = borrow_global<MintedTokens>(address_of(&resource_signer));

        let royalty = token::create_royalty(numerator_points, denominator_points, payee_address);
        let token_data_id = vector::borrow(&minted_tokens.tokens, tokenNumber - 1);

        token::mutate_tokendata_royalty(
            &resource_signer,
            *token_data_id,
            royalty
        );
    }
}
