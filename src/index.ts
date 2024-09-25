import { log, getRandomTestUUID, sleep } from './utils'
import { currencyKey, rankNameDefault, rankNameVip } from './constants'

import createPublicClient from './queries/create-client'
import updatePublicClient from './queries/update-client'
import getPublicClient from './queries/get-client'
import deletePublicClient from './queries/delete-client'
import getPublicGame from './queries/get-game'
import issueClientAuthToken from './queries/issue-client-token'
import getPublicGameList, { GameStatus, GameType } from './queries/get-game-list'

async function main() {
    const client = await createPublicClient({
        externalId: getRandomTestUUID(),
        nickname: 'kitty',
        rankName: rankNameDefault,
    })
    log('createPublicClient result:', client)

    await sleep(0.5)

    const updatedClient = await updatePublicClient({ id: client.id }, {
        nickname: 'lucky777',
        locale: 'EN',
        rankName: rankNameVip,
    })
    log('updatePublicClient result:', updatedClient)

    await sleep(0.5)

    const freshClient = await getPublicClient({ externalId: client.externalId })
    log('getPublicClient result:', freshClient)

    await sleep(0.5)

    // 1 - это рулетка, для неё сейчас в админке созданы переводы для RU и EN.
    const game = await getPublicGame({ id: '1', locale: 'RU' })
    log('getPublicGame result:', game)

    await sleep(0.5)

    // Пример: ищем игры в активном статусе или в паузе. С предпочтительной русской локалью. Рулетки или Краши(Авиатор). Максимум 5 штук.
    const games = await getPublicGameList({
        limit: 5,
        locale: 'RU',
        status: [GameStatus.ACTIVE, GameStatus.PAUSE],
        type: [GameType.Roulette, GameType.Crash],
    })
    log('getPublicGameList result:', games)

    await sleep(0.5)

    const roulette = games.find((game: any) => game.type === GameType.Roulette)
    const tokenData = await issueClientAuthToken({
        currencyKey, 
        clientId: freshClient.id,
        gameId: roulette.id,
    })
    log('issueClientAuthToken tokenData:', tokenData)

    await sleep(0.5)

    const deleteResult = await deletePublicClient({ id: freshClient.id })
    log('deleted user id:', deleteResult)
}

main()
