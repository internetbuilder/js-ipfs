'use strict'

const { CID } = require('multiformats/cid')
const configure = require('../lib/configure')
const { normaliseInput } = require('ipfs-core-utils/src/pins/normalise-input')
const toUrlSearchParams = require('../lib/to-url-search-params')

/**
 * @typedef {import('../types').HTTPClientExtraOptions} HTTPClientExtraOptions
 * @typedef {import('ipfs-core-types/src/pin').API<HTTPClientExtraOptions>} PinAPI
 */

module.exports = configure(api => {
  /**
   * @type {PinAPI["rmAll"]}
   */
  async function * rmAll (source, options = {}) {
    for await (const { path, recursive } of normaliseInput(source)) {
      const searchParams = new URLSearchParams(options.searchParams)
      searchParams.append('arg', `${path}`)

      if (recursive != null) searchParams.set('recursive', String(recursive))

      const res = await api.post('pin/rm', {
        timeout: options.timeout,
        signal: options.signal,
        headers: options.headers,
        searchParams: toUrlSearchParams({
          ...options,
          arg: `${path}`,
          recursive
        })
      })

      for await (const pin of res.ndjson()) {
        if (pin.Pins) { // non-streaming response
          yield * pin.Pins.map((/** @type {string} */ cid) => CID.parse(cid))
          continue
        }
        yield CID.parse(pin)
      }
    }
  }
  return rmAll
})
