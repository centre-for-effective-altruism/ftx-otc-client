import { RequestMethod } from '.'

export interface CurrenciesMethods {
  list: RequestMethod<Record<string, Currency>>
}

export type Currency = {
  canFastWithdraw: boolean
  canTransferFromFtx: boolean
  canTransferToFtx: boolean
  defaultShown: boolean
  deferRate: number
  depositEnabled: boolean
  etf: boolean
  exchangeEnabled: boolean
  fastWithdrawalFee: number
  id: string
  isNonUsdFiat: boolean
  maxWithdrawalPrecision: number
  name: string
  otcEnabled: boolean
  usdValue: number
  withdrawalEnabled: boolean
}
