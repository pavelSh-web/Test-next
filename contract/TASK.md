### Минт:
##### Поля
- [x] owner_address
- [x] public_key
- [x] presale_price
- [x] sale_price
- [x] presale_start
- [x] sale_start
- [x] sale_status [OFF, PRESALE, SALE]

##### Методы
- Внутренние методы
  - [x] create_collection(resource_signer, owner_address, dev_public_key)
  - [x] create_token(name, description, uri, max_supply)
  - [x] is_owner(address)
  - [x] check_balance(address)
  - [x] verify_proof_of_knowledge

- Управление контрактом
  - [x] set_owner_address(address)
  - [x] set_payee_address(address)
  - [x] set_dev_key(u64[])
  - [x] set_limits(max_per_presale, max_per_sale)
  - [x] set_prices(presale_price, sale_price)
  - [x] set_start_timestamp(presale_start, sale_start)
  - [x] set_sale_status(OFF | PRESALE | SALE)
  - [x] set_collection_meta(max_supply, uri, description)
  - [x] set_tokens_meta(uri, description, numerator, denominator)
  - [x] change_token_uri(tokenId, string)
  - [x] change_token_description(tokenId, string)
  - [x] change_token_royalty(tokenId, address, amount)
  - [x] withdraw(address, amount)

- Паблик методы
  - [x] (private) safe_mint(receiver, amount)
  - [x] presale_mint(amount, signature)
  - [x] mint(amount, signature)
  - [?] dev_mint(receiver, amount) - Тут загвоздка https://aptos.dev/concepts/coin-and-token/aptos-token/#token-transfer
  
- View методы (невозможно реализовать и вероятно не нужно, т.к задачи которые решаются этими методами в эфире тут решаются иначе)
  - [z] token_of_owner_by_index(owner, index)
  - [z] token_by_index(index)
  - [z] balance_of(owner)
  - [z] owner_of(tokenId)

- Дополнительно:
  - [x] Защитить процесс минта
  - [x] Возможность обновить контракт
  
##### Исключено:
> Скорее невозможно или нужно реализовывать иначе (не контрактом)
- Информация о дневном обороте продаж, и колонка с заработком от нфт в минимуме и максимуме (уточнить что именно за цифры и откуда их брать. Возможно проще доставать это из событий т.к фиг знает откуда у контракта появятся эти данные)
- Информация о количестве транзакций совершенных со смарт-контрактом (стейкинг, распределение роялти, продажа и т.п.) т.к обмен токенами происходит не через контракт (в отличии от эфира)
- Заморозка токенов невозможна на данный момент (https://github.com/aptos-labs/aptos-core/issues/5521)
 
##### Нужен ресерч
- Получить НФТ на кошельке никто не знает как (https://forum.aptoslabs.com/t/get-nft-owned-by-address/113836, https://github.com/aptos-labs/aptos-core/issues/5589)
