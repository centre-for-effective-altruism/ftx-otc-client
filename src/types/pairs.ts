import { RequestMethod } from '.'

export interface PairsMethods {
  list: RequestMethod<Pair[]>
}

export type Pair = {
  id: number | string
  baseCurrency: string
  quoteCurrency: string
  minSize?: number
  priceStep?: number
  sizeStep?: null
}
