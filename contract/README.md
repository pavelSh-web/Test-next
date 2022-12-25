### INFO
Аккаунты
> source_account: Аккаунт с которого деплоится контракт, напр. 0xCAFE
> owner: Аккаунт админа, используется для управления контрактом (вызова функций меняющих состояние контракта)
> dev: Сервисный аккаунт для подписи сигнатур. Приват ключ этого аккаунта будет храниться на бекенде
> resource_account: Аккаунт ресурса. На этом аккаунте содержатся данные самого контракта. Считайте это аккаунтом контракта.
   Этот аккаунт управляется програмно, т.е доступа к приватным ключам этого аккаунта нет ни у кого.
   Только этот аккаунт имеет доступ к созданию новых токенов и изменения данных контракта.

### Описание процесса взаимодействия
1. Вызываем `create_resource_account_and_publish_package()` (через CLI или SDK), это создаст resource_account и опубликует код контракта под ним
   Контракт в момент создания создаст данные коллекции и токена коллекции и заберет у source_account право управления ресурсом
2. Вызываем любые методы доступные только админу для изменения состояния контракта
3. Вызываем `init_collection` для создания коллекции и данных
4. Вызываем `mint()` метод с аккаунта получателя НФТ.
   Для этого ему понадобится предварительно сгенерировать сигнатуру разрешающую минт.
   Сгенерировать сигнатуру может только owner. Т.е при взаимодействии через сайт сигнатуру должен сгенерировать бекенд, знающий приват ключ админ аккаунта.

### Локальный деплой через CLI
0. Ставим cargo, aptos_cli и move_cli
1. Создаем аккаунты для тестов и накидываем деньжат. 
    > ./init_dev.sh

2. Прописываем `source_addr` в `Move.toml` файле, вбиваем адрес с которого собираемся деплоить контракт.
   Посмотреть адрес можно после вызова инита. либо в `.aptos/config.yaml` файле в поле `account`.
   Адрес должен начинаться с `0x` (в конфиге опущен)

3. Вызываем создание аккаунта ресурса и публикацию кода под этим аккаунтом
    ВАЖНО: Не забыть обновить адреса аккаунтов в Move.toml файле на актуальные перед запуском
    > aptos move create-resource-account-and-publish-package --seed hex_array:9399 --address-name module_address --profile default --assume-yes
    Соглашаемся дважды. Записываем полученный адрес ресурс. аккаунта, например сюда:
    > feb8ee912b1b32f951e260147ff7b5933acca87b917c226747f69f67595939df
    Ниже везде будет использоваться адрес указанный выше, замените его на свой
    Можно открыть эксплорер и проверить что модуль опубликован
    > https://explorer.aptoslabs.com/account/0xfeb8ee912b1b32f951e260147ff7b5933acca87b917c226747f69f67595939df/modules 

  Есть альтернативный путь, можно сперва создать аккаунт и залить модуль:
    > aptos init --profile module
    > aptos move publish --profile=module --named-addresses module_address=module

4. Запускаем первичный инит. Это создаст коллекцию
    > aptos move run --profile default --function-id feb8ee912b1b32f951e260147ff7b5933acca87b917c226747f69f67595939df::nft_factory::init_collection
    по желанию можно повторить вызов что бы убедиться что овнер изменился
5. Обновляем овнера (аккаунт администратора ресурса), после выполнения этой операции все дальнейшие действия надо будет выполнять из профиля овнера
    > aptos move run --profile default --function-id feb8ee912b1b32f951e260147ff7b5933acca87b917c226747f69f67595939df::nft_factory::set_owner_address --args address:[owner address]
    ex:
    > aptos move run --profile default --function-id feb8ee912b1b32f951e260147ff7b5933acca87b917c226747f69f67595939df::nft_factory::set_owner_address --args address:0x0f0cc971d93849024b03a96a08aea13928399ca1b7160276423b49781e9d596d
    по желанию можно повторить вызов что бы убедиться что овнер изменился

6. Обновляем паблик ключ админ аккаунта (или любого другого аккаунта через который будет генерироваться сигнатура)
    > aptos move run --profile owner --function-id feb8ee912b1b32f951e260147ff7b5933acca87b917c226747f69f67595939df::nft_factory::set_dev_key --args hex:[dev_pk_without_0x]
    ex:
    > aptos move run --profile owner --function-id feb8ee912b1b32f951e260147ff7b5933acca87b917c226747f69f67595939df::nft_factory::set_dev_key --args hex:e8d093e3a004e7d4293a413a8ad820c28b78dbee38b8c3d0a6e64e37b81d1720

7. Аналогично обновляем любые другие поля, например
    > aptos move run --profile owner --function-id feb8ee912b1b32f951e260147ff7b5933acca87b917c226747f69f67595939df::nft_factory::set_sale_status --args u64:1

8. Вызываем `mint_nft` для user1 аккаунта
   - Сперва генерируем сигнатуру
       TODO написать скрипт на TS
       Go to aptos-core/aptos/move-e2e-tests/src/tests/mint_nft.rs
       In function `sample_tutorial_signature`, change the `contract_address`, `user1`, `admin_private_key` to the actual values.
       run `cargo test sample_tutorial_signature -- --nocapture` to generate a valid signature that we'll use in the next step.
   - Запускаем `mint`
       > aptos move run --profile user1 --function-id feb8ee912b1b32f951e260147ff7b5933acca87b917c226747f69f67595939df::nft_factory::mint_nft --args hex:[valid signature]


### HELP
Aptos
https://aptos.dev/tutorials/first-move-module
https://aptos.dev/tutorials/your-first-dapp/

Move
https://github.com/move-language/move/tree/main/language/documentation/tutorial#Step0
https://move-language.github.io/move/functions.html?highlight=acquires#acquires


Гитхаб контракты
Тут чет про стейкинг нфт и токенов
https://github.com/mokshyaprotocol/aptos-token-staking/blob/main/sources/token-staking.move
https://github.com/madrugada-labs/aptos-candidate-staking/blob/master/sources/CandidateStaking.move

Кендис
https://github.com/myastrallabs/stormstout-contract/blob/main/sources/marketplace.move
https://github.com/JustaLiang/aptos-playground/blob/main/move.nft_launchpad/sources/nft_launchpad.move
https://github.com/mokshyaprotocol/candymachine/blob/master/sources/candymachine.move

Фауцет:
```
aptos account fund-with-faucet --account default
```

Компиляция:
```
aptos move compile --named-addresses nft=default
```


Запуск тестов:
```
aptos move test --named-addresses nft=default
```

Публикация:
```
aptos move publish --named-addresses nft=default
```


Запуск команды:
```
aptos move run \
--function-id 'default::message::set_message' \
--args 'string:hello, blockchain'
```
