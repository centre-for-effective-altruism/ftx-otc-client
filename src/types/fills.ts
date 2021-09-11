import { RequestMethod } from './'

export interface FillsMethods {
  list: RequestMethod<
    Fill[],
    [
      params?: {
        limit: number
      }
    ]
  >
}

export type Fill = {
  id: number
  baseCurrency: string
  quoteCurrency: string
  side: string
  price: number
  size: number
  time: string
}
