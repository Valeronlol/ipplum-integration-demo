import { httpCall } from '../utils'

export interface GetPublicGameDto {
    id: string
    locale?: string
}

const query = `
    query GetPublicGame($locale: LocaleType, $getPublicGameId: String!) {
        GetPublicGame(locale: $locale, id: $getPublicGameId) {
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
`

const operationName = 'GetPublicGame'

export default async ({ id, locale }: GetPublicGameDto) => {
    const body = JSON.stringify({
        query,
        operationName,
        variables: { getPublicGameId: id, locale },
    })
    const result = await httpCall(body)
    return result?.data?.[operationName] ?? null
}
