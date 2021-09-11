import { RequestMethod } from '.'

export interface FtxMethods {
  /**
   * Transfer from FTX to OTC.
   *
   * Can only be done on coins with property `canTransferFromFtx`. Query the
   * `/currencies` endpoint for this information.
   *
   */
  transferIn: RequestMethod<
    unknown,
    [
      body: {
        coin: string
        amount: number
      }
    ]
  >
  /**
   * Transfer from OTC to FTX.
   *
   * Can only be done on coins with property `canTransferFromFtx`. Query the
   * `/currencies` endpoint for this information.
   *
   */
  transferOut: RequestMethod<
    unknown,
    [
      body: {
        coin: string
        amount: number
      }
    ]
  >
}
