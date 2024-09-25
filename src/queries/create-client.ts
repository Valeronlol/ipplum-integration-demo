import { httpCall } from '../utils'

export interface CreatePublicClientDto {
    externalId: string
    nickname: string
    rankName: string
}

const query = `
    mutation CreatePublicClient($createPublicClientDto: CreatePublicClientDto!) {
        CreatePublicClient(createPublicClientDto: $createPublicClientDto) {
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

const operationName = 'CreatePublicClient'

export default async (createPublicClientDto: CreatePublicClientDto) => {
    const body = JSON.stringify({
        query,
        operationName,
        variables: { createPublicClientDto },
    })
    const result = await httpCall(body)
    return result?.data?.[operationName] ?? null
}
