import { httpCall } from '../utils'

export interface FindPublicClientDto {
    id?: string
    externalId?: string
}

const query = `
    query GetPublicClient($findPublicClientDto: GetPublicClientDto!) {
        GetPublicClient(findPublicClientDto: $findPublicClientDto) {
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
    }
`

const operationName = 'GetPublicClient'

export default async (findPublicClientDto: FindPublicClientDto) => {
    const body = JSON.stringify({
        query,
        operationName,
        variables: { findPublicClientDto },
    })
    const result = await httpCall(body)
    return result?.data?.[operationName] ?? null
}
