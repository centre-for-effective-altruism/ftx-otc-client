import { RequestMethod } from './'

export interface BalancesMethods {
  list: RequestMethod<Record<string, Balance>>
}

export type Balance = {
  currency: string
  total: number
  locked: number
  free: number
  unsettledProceeds: number
  unsettledCosts: number
  overall: number
}
