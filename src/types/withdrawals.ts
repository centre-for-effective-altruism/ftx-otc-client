import { RequestBody, RequestMethod, RequestParams } from './'

export interface WithdrawalsMethods {
  /** List withdrawals */
  list: RequestMethod<
    Withdrawal[],
    [params?: ListWithdrawalParamsBase | ListWithdrawalParamsStartEndTimes]
  >
  /** Request a withdrawal */
  create: RequestMethod<Withdrawal, [body: CreateWithdrawalBody]>
  /** Cancel a requested withdrawal */
  cancel: RequestMethod<
    CancelWithdrawalResult,
    [
      body: {
        /** withdrawal id */
        id: string
      }
    ]
  >
}

export type Withdrawal = {
  id: number
  coin: string
  address: string
  tag: string
  txid: string
  size: number
  fee: number
  status: string
  time: string
  fastWithdrawal: boolean
  fastWithdrawalFee: number
}

export type CancelWithdrawalResult = null

export interface ListWithdrawalParamsBase extends RequestParams {
  /** default 100, max 200 */
  limit?: number
}

export interface ListWithdrawalParamsStartEndTimes
  extends ListWithdrawalParamsBase {
  /** unix timestamp in seconds. Only fetch deposits on or after this time. Must include end_time. */
  start_time: number
  /** unix timestamp in seconds. Only fetch deposits on or before this time. Must include start_time. */
  end_time: number
}

export interface CreateWithdrawalBody extends RequestBody {
  /** coin */
  coin: string
  /** address */
  address: string
  /** tag, if applicable */
  tag?: string
  /** amount */
  size: number
  /** whether you would like this withdrawal to be processed quickly, for a small fee */
  fastWithdrawal?: boolean
  /** withdrawal password, if set */
  password?: string
  /** two-factor code if you require two-factor authentication for withdrawals */
  code?: string
}
