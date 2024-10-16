# Требовния к софту для тестовог запуска
- Nodejs v22 ([свежая версия нужна для fetch](https://nodejs.org/api/globals.html#fetch)). Если не хотите ставить свежую ноду локально, можете использовать [NVM](https://github.com/nvm-sh/nvm)

# Установка и запуск
- `npm install`
- `cp .env.example .env`
- `npm run start`


# Возможные виды JWT ключей
1. PARTNER_TOKEN - Партнерский ключ, который генерируется в админке в разделе: Справочник -> Партнеры -> Обновить Ключ. Должен храниться в защищеном хранилище и не должен попасть на фронтенд.
2. CLIENT_TOKEN - Короткоживущий клиенский ключ, выписываемый чкерез бекенд, методом IssueClientAuthToken, для отдельно взятой игры при начале игровой сессии. Может быть передан на фронтенд игрока.


# Описание методов Ipplum

1. CreatePublicClient. Регистрация нового игрока в системе.
Принимаемые параметры:
- `externalId`(обязательный) - primary_id из вашей БД
- `nickname`(обязательный) - ник который будет отображаться в чате, если это приватная информация, то можно генерить случаный UUID или случайный никнейм
- `rankName`(обязательный) - название ранга в системе, в данный момент "VIP_WL" и "DEFAULT_WL", если нужны дополнительные, то добавляются через админку.
- `comment`(опциональный)
- `locale`(опциональный)

Обязательный заголовок: `Authorization: Bearer [PARTNER_TOKEN]`

Возвращаемые параметры:
```
{
    id
    externalId
    isActive
    locale
    nickname
    lastAuthKeyIssuedAt
    comment
    createdAt
    updatedAt
    rank {
        id
        name
    }
}
```


2. UpdatePublicClient. Обновление профиля игрока в системе.
Обязательный заголовок: `Authorization: Bearer [PARTNER_TOKEN]`
Параметры поиска:
Искать игрока можно либо по айди в Ipplum - `id`, либо по айди вашей системы - `externalId`. 
Принимаемые параметры:
- `nickname`(опциональный)
- `comment`(опциональный)
- `locale`(опциональный)
- `rankName`(опциональный)
Возвращаемые параметры такие же как и при создании.


3. GetPublicClient. Получение профиля игрока.
Обязательный заголовок: `Authorization: Bearer [PARTNER_TOKEN]`
Параметры поиска:
Искать игрока можно либо по айди в Ipplum - `id`, либо по айди вашей системы - `externalId`. 
Возвращаемые параметры такие же как и при создании и обновлении.


4. DeletePublicClient. Деактивация игрока. Фактически это обнуление всех ассоцированных с юзером данных: никнейма, локали. Сохраняется только id и externalId.
Обязательный заголовок: `Authorization: Bearer [PARTNER_TOKEN]`
Искать игрока можно либо по айди в Ipplum - `id`, либо по айди вашей системы - `externalId`. 
Возвращаемые параметры: id деактвированного юзера.


5. IssueClientAuthToken. Выписывает игровой токен с ссылкой на айфрейм.
Обязательный заголовок: `Authorization: Bearer [PARTNER_TOKEN]`
Принимаемые параметры:
- `clientId`(обязательный) - primary_id игрока в БД Ipplum, возвращаемый при создании клиента.
- `gameId`(обязательный) - primary_id игры, получаем со списка игр: GetPublicGamesList
- `currencyKey`(обязательный) - ключ валюты созданный в админке в разделе: Справочник -> Валюты -> Ключ.
Возвращаемые данные:
```
{
    currency
    exp
    gameId
    gameName
    iat
    iframeUrl
    partnerId
    sub
    token
}
```
* Ключ выписывается на 24 часа
* Для одной игры единовременно валиден только один ключ. При выписывании нового, старый протухает.


6. GetPublicGame. Получение детальных данных игры.
Обязательный заголовок: `Authorization: Bearer [PARTNER_TOKEN]`
Принимаемые параметры:
- `getPublicGameId`(обязательный) - primary_id игры
- `locale`(опциональный) - язык информации об игре, по умолчанию EN
Возвращаемые параметры:
```
{
    id
    status
    type
    table {
      id
      name
      placement
      videoStorageArchiveLimitDays
      videoStorageDeleteLimitDays
      partner {
        id
        name
        type
        description
        apiTransport
        image {
          url
          type
          mimetype
        }
      }
    }
    cover {
      url
      mimetype
      type
    }
    gameInfo {
      id
      locale
      description
      name
      shortcut
    }
    videoStreams {
      id
      description
      deviceType
      name
      recognitionCameraUrl
      rtspUrl
      state
      type
    }
  }
}
```
* Обратите внимание что список игр получаем по партнёрскому токену, это означает что это нужно делать бекендом. Это сделано для возможно ассоциации игр со своими внутренними данными, кешированием, маппингом, аналитике, логгированию. Фронтенд должен получать данные игр через ваш бекенд, а не напрямую.
* В данный момент данные этого метода схожи с GetPublicGamesList, но могут быть расширены по требованию партнера. Возможно потребуются для аналитики.


7. GetPublicGamesList. Получение списка игр. Каждый раз когда игрок заходит на страницу со списком игр, получать данные об играх нужно именно из этого метода. Желательно кешировать хотя бы на 5-10 секунд.
Обязательный заголовок: `Authorization: Bearer [PARTNER_TOKEN]`
Параметры фильтрации по играм:
-  наиболее полезеный фильтр на этапе интеграции: `status`(опциональный) - фильтр по состоянию игр
- `type`(опциональный) - поиск игр по типу игры, например если нужно найти только Слоты или только Карточные 
- `limit`(опциональный) - фильтр по коллву игр в ответе, по умолчанию 50, максимум 100.
- `offset`(опциональный) - пагинация
- `ids`(опциональный) - фильтр по определенным id игр
- `search`(опциональный) - поиск игр по вхождению имени
- `locale`(опциональный) - предпочтительная локаль игр

Возвращаемые параметры, массив игр:
```
[
    {
        id
        status
        type
        table {
            id
            name
            placement
            videoStorageArchiveLimitDays
            videoStorageDeleteLimitDays
            partner {
                id
                name
                type
                description
                apiTransport
                image {
                url
                type
                mimetype
                }
            }
        }
        cover {
            url
            mimetype
            type
        }
        gameInfo {
            id
            locale
            description
            name
            shortcut
        }
        videoStreams {
            id
            description
            deviceType
            name
            recognitionCameraUrl
            rtspUrl
            state
            type
        }
    }
    }
]
```
* Обратите внимание что список игр получаем по партнёрскому токену, это означает что это нужно делать бекендом.
* При построении GQL запроса желательно запрашивать не все данные из предложенных, а только те что дейтствительно нужны. Это ускорит отображение списка игр.


1. Метод принятия пачки ставок. Либо принимаются все, либо отклоняеются все.
- partnerApiUrl: Путь к API
- partnerToken: Bearer token
Отправляемые параметры:
```
{
    bets: [
        {
            betValue: float[]
            betId: string
            betAmount: uInt32
        }
    ],
    roundId: string
    clientId: string
    gameId: string
}
```

Ожидаемый ответ:
```
{
    remainingBalance: uInt32
}
```

2. Метод завершения ставок.
- partnerApiUrl: Путь к API
- partnerToken: Bearer token
Отправляемые параметры:
```
{
    bets: [
        {
            winning: uInt32 // 0 если проиграл, больше 0 если выиграл.
            betId: string
            clientId: string
        }
    ]
}
```

Ожидаемый ответ:
```
{
    data: [
        {
            remainingBalance: uInt32
            clientId: string
        }
    ]
}
```

3. Метод отмены ставок.
- partnerApiUrl: Путь к API
- partnerToken: Bearer token
Отправляемые параметры:
```
{
  bets: [
    {
      betId: string
      clientId: string
    }
  ]
}
```

Ожидаемый ответ:
```
{
    data: [
        {
            remainingBalance: uInt32
            clientId: string
        }
    ]
}
```

4. Метод получения свободного баланса игрока.
Отправляемые параметры:
- partnerApiUrl: Путь к API
- partnerToken: Bearer token
```
{
    clientId: string
}
```

Ожидаемый ответ:
```
{
    remainingBalance: uInt32
}
```
