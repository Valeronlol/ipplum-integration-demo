import { env } from 'node:process'

export const jwt = env.PARTNER_KEY
export const apiUrl = 'https://app-stage.ipplum.com/graphql'
export const currencyKey = 'WL_BYN' // Создан в админке
export const rankNameDefault = 'DEFAULT_WL' // Создан в админке
export const rankNameVip = 'VIP_WL' // Создан в админке