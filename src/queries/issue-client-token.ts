import { httpCall } from '../utils'

export interface IssueClientAuthTokenDto {
    clientId: string
    currencyKey: string
    gameId: string
}

const query = `
    mutation IssueClientAuthToken($issueClientAuthTokenDto: IssueClientAuthTokenDto!) {
        IssueClientAuthToken(issueClientAuthTokenDto: $issueClientAuthTokenDto) {
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
    }
`

const operationName = 'IssueClientAuthToken'

export default async (issueClientAuthTokenDto: IssueClientAuthTokenDto) => {
    const body = JSON.stringify({
        query,
        operationName,
        variables: { issueClientAuthTokenDto },
    })
    const result = await httpCall(body)
    return result?.data?.[operationName] ?? null
}
