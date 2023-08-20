import { Buffer } from './deps.ts'
import { Client } from './type.ts'
import {
  getAzStyleClient,
  getShadowStyleClient,
  isAzStyle,
  isSemanticVersion,
  isShadowStyle,
  isUrlEncoded,
  randomStr,
  semanticVerToAzStyle,
  semanticVerToShadowStyle
} from './util.ts'

/**
 * 解码 PeerId
 * @param source PeerId, 可以是 Uint8Array, Buffer, string
 */
export function decode(source: Uint8Array | Buffer | string): Client | undefined {
  if (source instanceof Buffer) {
    source = new TextDecoder().decode(source.bytes())
  } else if (source instanceof Uint8Array) {
    source = new TextDecoder().decode(source)
  } else if (typeof source === 'string') {
    // 判断string是否是%nn编码, 如果是则解码
    if (isUrlEncoded(source)) {
      source = decodeURIComponent(source)
    }
  } else {
    throw new Error('source type must be Uint8Array | Buffer | string')
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
    return getAzStyleClient(source)
  }

  // 如果是Shadow风格的PeerId
  if (isShadowStyle(source)) {
    return getShadowStyleClient(source)
  }

  // TODO 单独处理其他风格的PeerId
  return undefined
}

/**
 * 编码 PeerId
 * @param param: { code: string, version: number,style: 'az' | 'shadow' }
 */
export function encode({
  code,
  version,
  style = 'az'
}: {
  code: string
  version: string
  style: 'az' | 'shadow'
}): Uint8Array {
  if (!isSemanticVersion(version)) {
    throw new Error('version must be x.x.x, e.g. 2.1.11, major.minor.patch less than 99')
  }

  if (style === 'az') {
    return encodeAzStyle(code, version)
  }

  if (style === 'shadow') {
    return encodeShadowStyle(code, version)
  }

  throw new Error('style must be az or shadow')
}

/**
 * 编码 Azureus 风格的 PeerId
 * @param code  PeerId code e.g. AZ
 * @param version PeerId version e.g. 2060
 *
 * 按照现代的语义化版本号习惯, 命名格式应该是major.minor.patch，每个部分都是数字。
 * Azureus风格的PeerId版本号有4位,按照习惯解析为major.minor.patch 格式
 * major[0-9]，minor[0-9]，patch[0-99]
 * @returns
 */
export function encodeAzStyle(code: string, version: string): Uint8Array {
  // code必须是2位
  if (code.length !== 2) {
    throw new Error('code length must be 2')
  }

  let peerid = `-${code}${semanticVerToAzStyle(version)}-`
  peerid += randomStr(20 - peerid.length)

  return new TextEncoder().encode(peerid)
}

/**
 * 编码 Shadow 风格的 PeerId
 *
 * Shadow的风格使用以下编码：一个ASCII字母数字用于客户端标识，最多五个字符用于版本号（如果少于五个则用“-”填充），后跟三个字符（通常为“---”，但不总是如此），后跟随机字符。
 * 版本字符串中的每个字符表示从0到63的数字。'0'=0，...，'9'=9，'A'=10，...，'Z'=35，'a'=36，...，'z'=61，'.'=62，'-'=63。
 *
 * Shadow风格major[0-63],minor[0-6],patch[0-63]
 *
 * 本方法采用大多数客户端的做法，即major取0-63，minor取0-63，patch取0-63
 * @param code PeerId code e.g. 'S' 代表 'Shadow'
 * @param version ,format: major.minor.patch e.g. 2.1.11, major.minor.patch less than 63
 *
 *
 * @returns
 */
export function encodeShadowStyle(code: string, version: string): Uint8Array {
  if (code.length !== 1) {
    throw new Error('code length must be 1')
  }

  // 如果shaoowStyleVersion不是5位, 则补齐
  // (padded with '-' if less than five characters)
  const shadowStyleVersion = semanticVerToShadowStyle(version).padEnd(5, '-')

  // followed by three characters (commonly '---', but not always the case)
  // 后跟三个字符（通常为“---”，但不总是如此）
  let peerid = `${code}${shadowStyleVersion}---`

  peerid += randomStr(20 - peerid.length)

  return new TextEncoder().encode(peerid)
}
