'use strict'

const { encodeCID, decodeCID } = require('./cid')
const Block = require('ipld-block')

/**
 * @typedef {import('./error').EncodedError} EncodedError
 * @typedef {import('./cid').EncodedCID} EncodedCID
 *
 * @typedef {Object} EncodedRmResult
 * @property {EncodedCID} cid
 * @property {EncodedError|undefined} [error]
 */

/**
 * @typedef {Object} EncodedBlock
 * @property {Uint8Array} data
 * @property {EncodedCID} cid
 */

/**
 * Encodes Block for over the message channel transfer.
 *
 * If `transfer` array is provided all the encountered `ArrayBuffer`s within
 * this block will be added to the transfer so they are moved across without
 * copy.
 *
 * @param {Object} block
 * @param {import('cids')} block.cid
 * @param {Uint8Array} block.data
 * @param {Set<Transferable>} [transfer]
 * @returns {EncodedBlock}
 */
const encodeBlock = ({ cid, data }, transfer) => {
  if (transfer) {
    transfer.add(data.buffer)
  }
  return { cid: encodeCID(cid, transfer), data }
}
exports.encodeBlock = encodeBlock

/**
 * @param {EncodedBlock} encodedBlock
 * @returns {Block}
 */
const decodeBlock = ({ cid, data }) => {
  return new Block(data, decodeCID(cid))
}

exports.decodeBlock = decodeBlock

exports.Block = Block
