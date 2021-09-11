import { RequestMethod, RequestParams } from '.'

export interface QuotesMethods {
  /** Get a Quote */
  get: RequestMethod<Quote, [quoteId: string | number]>
  /** List Quotes */
  list: RequestMethod<Quote[]>
  /** Accept a Quote */
  accept: RequestMethod<
    Quote,
    [
      quoteId: string | number,
      body?: {
        /** partial size (must be less than quote size) Example: `0.1`. */
        customSize?: number
      }
    ]
  >
  /** Create a Quote */
  create: RequestMethod<
    Quote,
    [
      body:
        | CreateQuoteParamsBaseBaseCurrencySize
        | CreateQuoteParamsBaseQuoteCurrencySize
    ]
  >

  /** List accepted Quotes */
  listAccepted: RequestMethod<
    Quote[],
    [
      params?: {
        /** whether or not the quote was fully settled immediately by both parties */
        settledImmediately?: boolean
        /** whether or not the quote has been fully settled by both parties */
        fullySettled?: boolean
        /** max id to fetch (by default, we will fetch the most recent accepted quotes) */
        before?: number
        limit?: number
      }
    ]
  >
  /** List defer cost payments */
  listDeferCostPayments: RequestMethod<
    DeferCostPayment[],
    [
      params?: {
        /** id of the quote to restrict returned defer costs payments to */
        quoteId?: number | string
        /** max id to fetch (by default, we will fetch the most recent defer cost payments) */
        before?: number | string
        limit: number
      }
    ]
  >
  /** List defer proceeds payments */
  listDeferProceedsPayments: RequestMethod<
    DeferProceedsPayment[],
    [
      params?: {
        /** id of the quote to restrict returned defer costs payments to */
        quoteId?: number
        /** max id to fetch (by default, we will fetch the most recent defer cost payments) */
        before?: number
        limit: number
      }
    ]
  >
  /** List settlements */
  listSettlements: RequestMethod<
    Settlement[],
    [
      params?: {
        /** id of the quote to restrict returned defer costs payments to */
        quoteId?: number
        /** max id to fetch (by default, we will fetch the most recent defer cost payments) */
        before?: number
        limit: number
      }
    ]
  >
  /** List counterparty settlements */
  listCounterpartySettlements: RequestMethod<
    CounterpartySettlement[],
    [
      params?: {
        /** id of the quote to restrict returned defer costs payments to */
        quoteId?: number
        /** max id to fetch (by default, we will fetch the most recent defer cost payments) */
        before?: number
        limit: number
      }
    ]
  >
  /** Set settlement priority */
  setSettlementPriority: RequestMethod<
    Quote,
    [
      quoteId: number | string,
      body?: {
        /** priority of settlement for the quote with id quote_id. If not provided, will set the priority of the quote to the max of all user-unsettled quotes */
        settlementPriority: number
      }
    ]
  >
}

export type Quote = {
  id: number
  baseCurrency: string
  quoteCurrency: string
  side: string
  baseCurrencySize: number
  quoteCurrencySize: number
  price: number
  requestedAt: string
  quotedAt: string
  expiry: string
  filled: boolean
  orderId: number
  counterpartyAutoSettles: boolean
  settledImmediately: boolean
  settlementTime: string
  deferCostRate: number
  deferProceedsRate: number
  settlementPriority: number
  costCurrency: string
  cost?: number
  proceedsCurrency: string
  proceeds: number
  totalDeferCostPaid: number
  totalDeferProceedsPaid: number
  unsettledCost: number
  unsettledProceeds: number
  userFullySettledAt: string
  counterpartyFullySettledAt: string
}

export type DeferCostPayment = {
  id: number
  currency: string
  amount: number
  windowStart: string
  windowEnd: string
  quoteId: number
  deferRate: number
  notionalTarget: number
}

export type DeferProceedsPayment = DeferCostPayment

export type Settlement = {
  id: number
  currency: string
  amount: number
  time: string
  quoteId: number
}

export type CounterpartySettlement = Settlement

/** Base Quote parameters */
export interface CreateQuoteParamsBase extends RequestParams {
  /** base currency */
  baseCurrency: string
  /** quote currency */
  quoteCurrency: string
  /** buy, sell, or twoWay */
  side: 'buy' | 'sell' | 'twoWay'

  /** if true, do not show the quote on the website. If accepted, expire other live quotes with matching apiOnly */
  apiOnly?: boolean
  /** number of seconds until the user must settle the quote cost before they being making defer cost payments */
  secondsUntilSettlement?: number
  /** if the counterparty must auto settle proceeds after the user settles costs */
  counterpartyAutoSettles?: boolean
  /** if true, wait for the price to be generated before returning a response. Defaults to false. */
  waitForPrice?: boolean
}

/** Quote parameters, specifying a base currency size */
export interface CreateQuoteParamsBaseBaseCurrencySize
  extends CreateQuoteParamsBase {
  /** either this or quoteCurrencySize needs to be specified */
  baseCurrencySize: number
}

/** Quote parameters, specifying a quote currency size */
export interface CreateQuoteParamsBaseQuoteCurrencySize
  extends CreateQuoteParamsBase {
  /** either this or baseCurrencySize needs to be specified */
  quoteCurrencySize: number
}
