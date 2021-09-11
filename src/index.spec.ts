/* eslint-disable jest/no-disabled-tests */
import { FtxClient } from './'
import { Pair, Quote } from './types'

// This tests against a mock version of the API server,
// which doesn't have the actual behaviour (e.g. no real error messages etc)
// It seems better than nothing, but it also seems like it'd
// be good to run the test suites with real data at some stage
const TESTING_API_URL = `https://private-anon-1b2c56cbe9-ftxotcportalapi.apiary-mock.com/api`

const clientConfig = {
  apiKey: 'my-test-api-key',
  apiSecret: 'my-test-api-secret',
  apiUrl: TESTING_API_URL,
}

describe('test client', () => {
  // set up the client pointing to our test API server
  const client = new FtxClient(clientConfig)

  describe('config', () => {
    it('returns the client config', () => {
      const config = client.config
      expect(config).toEqual(clientConfig)
    })
  })

  describe('pairs', () => {
    it('lists trading pairs', async () => {
      const res = await client.pairs.list()
      expect(res.success).toBe(true)
      expect(res.result[0]).toMatchObject<Pair>({
        id: expect.any(String),
        baseCurrency: expect.any(String),
        quoteCurrency: expect.any(String),
      })
    })
  })

  describe('quotes', () => {
    let quoteId: number | undefined
    const quoteMatcher: Partial<Quote> = {
      id: expect.any(Number),
      baseCurrency: expect.any(String),
      // cost: expect.any(Number),
      costCurrency: expect.any(String),
    }

    it('creates a quote', async () => {
      const res = await client.quotes.create({
        baseCurrency: 'BTC',
        quoteCurrency: 'USDT',
        side: 'buy',
        quoteCurrencySize: 1,
        counterpartyAutoSettles: true,
      })
      expect(res.success).toBe(true)
      expect(res.result).toMatchObject(quoteMatcher)
      quoteId = res.result.id
    })

    it('gets a specific quote', async () => {
      if (!quoteId) throw new Error('Quote ID not set')
      const res = await client.quotes.get(quoteId)
      expect(res.success).toBe(true)
      expect(res.result).toMatchObject(quoteMatcher)
    })

    it('lists all quotes', async () => {
      const res = await client.quotes.list()
      expect(res.success).toBe(true)
      expect(res.result[0]).toMatchObject(quoteMatcher)
    })

    it('accepts a quote', async () => {
      if (!quoteId) throw new Error('Quote ID not set')
      const res = await client.quotes.accept(quoteId)
      expect(res.success).toBe(true)
      expect(res.result).toMatchObject(quoteMatcher)
    })

    it('lists recent accepted quotes', async () => {
      const res = await client.quotes.listAccepted()
      expect(res.success).toBe(true)
      expect(res.result[0]).toMatchObject(quoteMatcher)
    })

    it('lists quote defer cost payments', async () => {
      const res = await client.quotes.listDeferCostPayments()
      expect(res.success).toBe(true)
      expect(res.result[0]).toMatchObject({
        id: expect.any(Number),
        currency: expect.any(String),
        amount: expect.any(Number),
        windowStart: expect.any(String),
        windowEnd: expect.any(String),
        quoteId: expect.any(Number),
        deferRate: expect.any(Number),
        notionalTarget: expect.any(Number),
      })
    })

    it('lists quote defer proceeds payments', async () => {
      const res = await client.quotes.listDeferProceedsPayments()
      expect(res.success).toBe(true)
      expect(res.result[0]).toMatchObject({
        id: expect.any(Number),
        currency: expect.any(String),
        amount: expect.any(Number),
        windowStart: expect.any(String),
        windowEnd: expect.any(String),
        quoteId: expect.any(Number),
        deferRate: expect.any(Number),
        notionalTarget: expect.any(Number),
      })
    })

    it('lists settlements', async () => {
      const res = await client.quotes.listSettlements()
      expect(res.success).toBe(true)
      expect(res.result[0]).toMatchObject({
        id: expect.any(Number),
        currency: expect.any(String),
        amount: expect.any(Number),
        time: expect.any(String),
        quoteId: expect.any(Number),
      })
    })

    it('lists counterparty settlements', async () => {
      const res = await client.quotes.listCounterpartySettlements()
      expect(res.success).toBe(true)
      expect(res.result[0]).toMatchObject({
        id: expect.any(Number),
        currency: expect.any(String),
        amount: expect.any(Number),
        time: expect.any(String),
        quoteId: expect.any(Number),
      })
    })

    it('sets settlement priority', async () => {
      const res = await client.quotes.setSettlementPriority(12345)
      expect(res.success).toBe(true)
      expect(res.result).toMatchObject(quoteMatcher)
    })
  })

  describe('fills', () => {
    it('lists fills', async () => {
      const res = await client.fills.list()
      expect(res.success).toBe(true)
      expect(res.result[0]).toMatchObject({
        id: expect.any(Number),
        baseCurrency: expect.any(String),
        quoteCurrency: expect.any(String),
        side: expect.any(String),
        price: expect.any(Number),
        size: expect.any(Number),
        time: expect.any(String),
      })
    })
  })

  describe('balances', () => {
    it('lists balances', async () => {
      const res = await client.balances.list()
      expect(res.success).toBe(true)
      expect(res.result).toMatchObject({
        BTC: {
          currency: expect.any(String),
          total: expect.any(Number),
          locked: expect.any(Number),
          free: expect.any(Number),
          unsettledProceeds: expect.any(Number),
          unsettledCosts: expect.any(Number),
          overall: expect.any(Number),
        },
      })
    })
  })

  describe('withdrawals', () => {
    const withdrawalMatcher = {
      id: expect.any(Number),
      coin: expect.any(String),
      address: expect.any(String),
      tag: expect.any(String),
      txid: expect.any(String),
      size: expect.any(Number),
      fee: expect.any(Number),
      status: expect.any(String),
      time: expect.any(String),
      fastWithdrawal: expect.any(Boolean),
      fastWithdrawalFee: expect.any(Number),
    }

    it('lists withdrawals', async () => {
      const res = await client.withdrawals.list()
      expect(res.success).toBe(true)
      expect(res.result[0]).toMatchObject(withdrawalMatcher)
    })

    it('creates a withdrawal', async () => {
      const res = await client.withdrawals.create({
        coin: 'USDT',
        address: 'test-address',
        size: 1,
      })
      expect(res.success).toBe(true)
      expect(res.result).toMatchObject(withdrawalMatcher)
    })

    it('cancels a withdrawal', async () => {
      const res = await client.withdrawals.cancel({
        id: '12345',
      })
      expect(res.success).toBe(true)
      expect(res.result).toBeNull()
    })
  })
})
/**
 * Currently the test API doesn't have the following endpoints implemented:
 * - /ftx/transfer_in
 * - /ftx/transfer_out
 * - /currencies
 */

describe('live client', () => {
  if (!process.env.FTX_OTC_API_KEY || !process.env.FTX_OTC_API_SECRET) {
    return
  }
  // set up the client pointing to our test API server
  const client = new FtxClient({
    apiKey: process.env.FTX_OTC_API_KEY,
    apiSecret: process.env.FTX_OTC_API_SECRET,
  })

  describe('config', () => {
    it('returns the client config', () => {
      const config = client.config
      expect(config).toEqual({
        apiKey: process.env.FTX_OTC_API_KEY,
        apiSecret: process.env.FTX_OTC_API_SECRET,
        apiUrl: 'https://otc.ftx.com/api',
      })
    })
  })

  describe('pairs', () => {
    it('lists trading pairs', async () => {
      const res = await client.pairs.list()
      expect(res.success).toBe(true)
      expect(res.result[0]).toMatchObject({
        baseCurrency: expect.any(String),
        quoteCurrency: expect.any(String),
      })
    })
  })

  describe('quotes', () => {
    /**
     * You may want to run this one manually to check that we can actually perform
     * mutations on the server, but we probably don't want to run it in every
     * test run
     */
    it.skip('creates a quote', async () => {
      const res = await client.quotes.create({
        baseCurrency: 'BTC',
        baseCurrencySize: 1,
        quoteCurrency: 'USD',
        side: 'buy',
      })
      expect(res.success).toBe(true)
    })

    it('lists all quotes', async () => {
      const res = await client.quotes.list()
      expect(res.success).toBe(true)
    })

    it('lists recent accepted quotes', async () => {
      const res = await client.quotes.listAccepted()
      expect(res.success).toBe(true)
    })

    it.skip('lists quote defer cost payments', async () => {
      const res = await client.quotes.listDeferCostPayments()
      expect(res.success).toBe(true)
    })

    it('lists quote defer proceeds payments', async () => {
      const res = await client.quotes.listDeferProceedsPayments()
      expect(res.success).toBe(true)
    })

    it.skip('lists settlements', async () => {
      const res = await client.quotes.listSettlements()
      expect(res.success).toBe(true)
    })

    it.skip('lists counterparty settlements', async () => {
      const res = await client.quotes.listCounterpartySettlements()
      expect(res.success).toBe(true)
    })
  })

  describe('fills', () => {
    it.skip('lists fills', async () => {
      const res = await client.fills.list()
      expect(res.success).toBe(true)
    })
  })

  describe('balances', () => {
    it('lists balances', async () => {
      const res = await client.balances.list()
      expect(res.success).toBe(true)
    })
  })

  describe('withdrawals', () => {
    it('lists withdrawals', async () => {
      const res = await client.withdrawals.list()
      expect(res.success).toBe(true)
    })
  })
})
