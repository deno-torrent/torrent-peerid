import { Buffer } from './deps.ts'
import {
  decodeUrlBinary,
  getAzStyleClientInfo,
  getShadowStyleClientInfo,
  isAzStyle,
  isShadowStyle,
  isUrlEncoded
} from './util.ts'
/**
 * 解码 PeerId
 * @param source PeerId, 可以是 Uint8Array, Buffer, string
 */
export function decodePeerId(source: Uint8Array | Buffer | string) {
  if (typeof source === 'string') {
    // 判断string是否是%nn编码, 如果是则解码
    if (isUrlEncoded(source)) {
      source = decodeUrlBinary(source)
    } else {
      source = new TextEncoder().encode(source)
    }
  } else if (source instanceof Buffer) {
    source = source.bytes()
  }

  // 校验source长度
  if (source.length < 20) {
    throw new Error('source length must be greater than 20')
  }

  // https://wiki.theory.org/BitTorrentSpecification
  // peer_id: 20-byte string used as a unique ID for the client. This is usually the same peer_id that is transmitted in tracker requests (but not always e.g. an anonymity option in Azureus)
  // 截取前20个字节
  source = source.slice(0, 20)

  // 如果是Azureus风格的PeerId
  if (isAzStyle(source)) {
    return getAzStyleClientInfo(source)
  }

  // 如果是Shadow风格的PeerId
  if (isShadowStyle(source)) {
    return getShadowStyleClientInfo(source)
  }

  // 如果是其他风格的PeerId
  return undefined
}

// export function encodePeerId(peerId: PeerId): Uint8Array {}

// function parseAZStyleClientVersion(version: string): string {}

// function parseShadowStyleClientVersion(version: string): string {}
