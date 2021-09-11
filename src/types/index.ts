export * from './pairs'
export * from './quotes'

export type FtxClientOptions = {
  apiKey: string
  apiSecret: string
  apiUrl?: string
}

export type HTTPVerb = 'get' | 'post' | 'patch' | 'delete'

export type RequestMethod<
  T extends unknown = unknown,
  P extends unknown[] = never[]
> = (...args: P) => Promise<Result<T>>

export type Result<T> = {
  success: boolean
  result: T
}

export interface RequestBody {
  [k: string]: unknown
}

export interface RequestParams {
  [k: string]: unknown
}
