import type { AbortOptions } from '../utils'
import { API as BitswapAPI } from '../bitswap'
import { API as RepoAPI } from '../repo'

export interface API<OptionExtension = {}> {
  bitswap: BitswapAPI<OptionExtension>['stat']
  repo: RepoAPI<OptionExtension>['stat']

  /**
   * Return bandwith usage stats
   */
  bw: (options?: BWOptions & OptionExtension) => AsyncIterable<BWResult>
}

export interface BWOptions extends AbortOptions {
  peer?: string
  proto?: string
  poll?: boolean
  interval?: number
}

export interface BWResult {
  totalIn: bigint
  totalOut: bigint
  rateIn: number
  rateOut: number
}
