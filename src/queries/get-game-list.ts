import { httpCall } from '../utils'

export interface GetPublicGamesListDto {
    search?: string
    ids?: string[]
    status?: string[]
    type?: string[]
    locale?: string
    limit?: number
    offset?: number
}

export enum GameStatus {
    DISABLED = 'DISABLED',
    ACTIVE = 'ACTIVE',
    PAUSE = 'PAUSE',
    FINISHED = 'FINISHED',
    ERROR = 'ERROR',
}

export enum GameType {
    Roulette = 'Roulette',
    DragonAndTiger = 'DragonAndTiger',
    Crash = 'Crash',
    Baccarat = 'Baccarat',
    UltPoker = 'UltPoker',
    BlackJack = 'BlackJack',
}

const query = `
query GetPublicGamesList($ids: [String!], $limit: Int, $locale: LocaleType, $offset: Int, $search: String, $status: [GameStatus!], $type: [GameType!]) {
  GetPublicGamesList(ids: $ids, limit: $limit, locale: $locale, offset: $offset, search: $search, status: $status, type: $type) {
    data {
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
}
`

const operationName = 'GetPublicGamesList'

// ids: $ids, limit: $limit, locale: $locale, offset: $offset, search: $search, status: $status, type: $type
export default async ({ ids, limit, locale, offset, search, status, type }: GetPublicGamesListDto) => {
    const body = JSON.stringify({
        query,
        operationName,
        variables: { ids, limit, locale, offset, search, status, type },
    })
    const result = await httpCall(body)
    return result?.data?.[operationName]?.data ?? null
}
