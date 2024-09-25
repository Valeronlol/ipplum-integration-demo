import { ok } from 'node:assert/strict'
import { inspect } from 'node:util'
import { randomUUID } from 'node:crypto'
import { scheduler } from 'node:timers/promises'
import { TimerOptions } from 'node:timers'

import { apiUrl, jwt } from './constants'

export const log = (label: string, data: unknown) => console.log(label, inspect(data, { depth: null, colors: true }))

export const getRandomTestUUID = () => `DEMO${randomUUID()}`

export const sleep = (sec: number, options?: TimerOptions): Promise<void> => scheduler.wait(Math.round(sec * 1000), options)

export const httpCall = async (body: BodyInit) => {
    ok(jwt, 'PARTNER_KEY must be provided')

    const headers = {
        'Authorization': `Bearer ${jwt}`,
        'Content-Type': 'application/json',
    }
    const response = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body,
    })
    return response.json()
}
