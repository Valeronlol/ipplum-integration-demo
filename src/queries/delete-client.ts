import { httpCall } from '../utils'

export interface FindPublicClientDto {
    id?: string
    externalId?: string
}

const query = `
    mutation DeletePublicClient($findPublicClientDto: GetPublicClientDto!) {
        DeletePublicClient(findPublicClientDto: $findPublicClientDto)
    }
`

const operationName = 'DeletePublicClient'

export default async (findPublicClientDto: FindPublicClientDto) => {
    const body = JSON.stringify({
        query,
        operationName,
        variables: { findPublicClientDto },
    })
    const result = await httpCall(body)
    return result?.data?.[operationName] ?? null
}
