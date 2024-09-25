import { httpCall } from '../utils'

export interface FindPublicClientDto {
    id?: string
    externalId?: string
}

export interface UpdatePublicClientDto {
    comment?: string
    locale?: string
    nickname?: string
    rankName?: string
}

const query = `
    mutation UpdatePublicClient($findPublicClientDto: GetPublicClientDto!, $updateClientDto: UpdatePublicClientDto!) {
    UpdatePublicClient(findPublicClientDto: $findPublicClientDto, updateClientDto: $updateClientDto) {
        id
        externalId
        isActive
        lastAuthKeyIssuedAt
        locale
        nickname
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

const operationName = 'UpdatePublicClient'

export default async (findPublicClientDto: FindPublicClientDto, updateClientDto: UpdatePublicClientDto) => {
    const body = JSON.stringify({
        query,
        operationName,
        variables: { findPublicClientDto, updateClientDto },
    })
    const result = await httpCall(body)
    console.log(result)
    return result?.data?.[operationName] ?? null
}
