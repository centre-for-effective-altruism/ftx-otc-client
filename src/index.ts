import HmacSHA256 from 'crypto-js/hmac-sha256'
import encodeHex from 'crypto-js/enc-hex'
import got, { Got } from 'got'
import { DateTime } from 'luxon'

import {
  FtxClientOptions,
  HTTPVerb,
  PairsMethods,
  QuotesMethods,
  RequestBody,
  RequestParams,
} from './types'
import { BalancesMethods } from './types/balances'
import { CurrenciesMethods } from './types/currencies'
import { FillsMethods } from './types/fills'
import { FtxMethods } from './types/ftx'
import { WithdrawalsMethods } from './types/withdrawals'

const FTX_OTC_API_URL = `https://otc.ftx.com/api`

export class FtxClientBase {
  private apiKey: string
  private apiSecret: string
  private apiUrl: string

  private httpClient: Got

  constructor(options: FtxClientOptions) {
    this.apiKey = options.apiKey
    this.apiSecret = options.apiSecret
    this.apiUrl = options.apiUrl || FTX_OTC_API_URL
    this.httpClient = got.extend({
      prefixUrl: this.apiUrl,
    })
  }

  /** Return client config */
  get config(): FtxClientOptions {
    return {
      apiKey: this.apiKey,
      apiSecret: this.apiSecret,
      apiUrl: this.apiUrl,
    }
  }

  /** Convenience wrapper for making a GET request */
  protected async get<T>(path: string, params?: RequestParams): Promise<T> {
    return this.request(path, 'get', undefined, params)
  }

  /** Convenience wrapper for making a POST request */
  protected async post<T>(
    path: string,
    body?: RequestBody,
    params?: RequestParams
  ): Promise<T> {
    return this.request(path, 'post', body, params)
  }

  /** Convenience wrapper for making a DELETE request */
  protected async delete<T>(
    path: string,
    body?: RequestBody,
    params?: RequestParams
  ): Promise<T> {
    return this.request(path, 'delete', body, params)
  }

  /**
   * Generic HTTP request handler. Adds required headers
   * to authenticate a request.
   *
   * @param path
   * @param method
   * @param body
   * @returns
   */
  private async request<T>(
    path: string,
    method: HTTPVerb,
    body?: RequestBody,
    params?: RequestParams
  ): Promise<T> {
    // Got doesn't accept a leading slash, in paths
    // but we use the path in our HMAC, so here we enforce it,
    // and then later we'll strip it before passing to Got
    if (!/^\//.test(path)) throw new Error('path requires leading slash')
    // set up header/body data
    const timestamp = DateTime.local().toMillis().toString()
    const signatureBase = [timestamp, method.toUpperCase(), path]
    const jsonBody = body ? JSON.stringify(body) : ''
    if (method === 'post') signatureBase.push(jsonBody)
    // Create the HMAC signature
    const hmac = HmacSHA256(signatureBase.join(''), this.apiSecret)
    const signature = encodeHex.stringify(hmac)

    const headers: Record<string, string> = {
      'FTX-APIKEY': this.apiKey,
      'FTX-TIMESTAMP': timestamp,
      'FTX-SIGNATURE': signature,
    }

    // Build path + querystring
    // Path needs to have leading slash stripped to conform to Got's somewhat
    // strange formatting rules: https://github.com/sindresorhus/got/issues/1283
    const pathAndQuery = `${path.replace(/^\//, '')}${
      params
        ? `?${Object.entries(params).map(([key, value]) => `${key}=${value}`)}`
        : ''
    }`

    switch (method) {
      case 'get': {
        const res: T = await this.httpClient
          .get(pathAndQuery, { headers })
          .json()
        return res
      }
      case 'post':
      case 'delete': {
        headers['Content-Type'] = 'application/json'
        const res: T = await this.httpClient[method](pathAndQuery, {
          headers,
          // use `body` key (string) rather than `json` (object)
          // so that our JSON body exactly matches what we used
          // in our HMAC signature
          body: jsonBody,
        }).json()
        return res
      }
      default:
        throw new Error(`Unsupported method: ${method}`)
    }
  }
}

export class FtxClient extends FtxClientBase {
  constructor(options: FtxClientOptions) {
    super(options)
  }

  public pairs: PairsMethods = {
    list: async () => this.get('/otc/pairs'),
  }

  public quotes: QuotesMethods = {
    get: async (quoteId) => this.get(`/otc/quotes/${quoteId}`),
    list: async () => this.get(`/otc/quotes`),
    create: async (body) => this.post('/otc/quotes', body),
    accept: async (quoteId, body) =>
      this.post(`/otc/quotes/${quoteId}/accept`, body),
    listAccepted: async (params) => this.get(`/otc/quotes/accepted`, params),
    listDeferCostPayments: async (params) =>
      this.get(`/otc/quotes/defer_cost_payments`, params),
    listDeferProceedsPayments: async (params) =>
      this.get(`/otc/quotes/defer_proceeds_payments`, params),
    listSettlements: async (params) =>
      this.get(`/otc/quotes/settlements`, params),
    listCounterpartySettlements: async (params) =>
      this.get(`/otc/quotes/counterparty_settlements`, params),
    setSettlementPriority: async (quoteId, body) =>
      this.post(`/otc/quotes/${quoteId}/set_settlement_priority`, body),
  }

  public fills: FillsMethods = {
    list: async (params) => this.get(`/fills`, params),
  }

  public balances: BalancesMethods = {
    list: async () => this.get(`/balances`),
  }

  public withdrawals: WithdrawalsMethods = {
    list: async (params) => this.get(`/withdrawals`, params),
    create: async (body) => this.post(`/withdrawals`, body),
    cancel: async (body) => this.delete(`/withdrawals`, body),
  }

  public ftx: FtxMethods = {
    transferIn: async (body) => this.post(`/ftx/transfer_in`, body),
    transferOut: async (body) => this.post(`/ftx/transfer_out`, body),
  }

  public currencies: CurrenciesMethods = {
    list: async () => this.get(`/currencies`),
  }
}
