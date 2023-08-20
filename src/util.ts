import { SHADOW_STYLE_VERSION_CHARS, VISIBLE_CHARS } from './constant.ts'
import { AZStyleClient, ShadowStyleClient } from './enum.ts'
import { Client } from './type.ts'

/**
 * 是否是%nn编码
 * nn 为 0-9 a-f A-F的字符,也就是16进制表示
 * @param source
 * @returns
 */
export function isUrlEncoded(source: string) {
  return /^(%[0-9a-f]{1,})+$/i.test(source)
}

/**
 * Azureus风格使用以下编码：'-'，两个字符表示客户端ID，四个ASCII数字表示版本号，'-'，后跟随机数字。
 * 是否是Azureus风格的PeerId
 * e.g. -AZ2060-...
 * @param peerId string 20字节的PeerId
 */
export function isAzStyle(peerId: string): boolean {
  if (peerId.length != 20) {
    throw new Error('peerId length must be 20')
  }

  // 截取前8个字符
  const clientInfo = peerId.substring(0, 8)

  const headTail = [clientInfo[0], clientInfo[7]]

  // 如果头尾都不是 '-', 则不是AZ风格
  if (headTail.some((item) => item !== '-')) {
    return false
  }

  // 如果第4,5个字符不是可显示字符, 则不是AZ风格
  const client = clientInfo.substring(1, 3)
  if (client.split('').some((item) => !isVisible(item.charCodeAt(0)))) {
    return false
  }

  // 如果中间6个字符,某一个不是数字, 则不是AZ风格
  const version = clientInfo.substring(3, 7)
  if (version.split('').some((item) => !isDigit(item.charCodeAt(0)))) {
    return false
  }

  return true
}

/**
 * 获取Azureus风格的客户端代号和版本号
 * @param peerId Uint8Array
 * @returns client cocde, 2 characters; version, 4 characters
 */
export function getAzStyleClient(peerId: string): Client {
  return {
    code: peerId.substring(1, 3),
    name: findAzstyleClientName(peerId.substring(1, 3)),
    version: azStyleVerToSemantic(peerId.substring(3, 7))
  }
}

/**
 * 获取Shadow风格的客户端代号和版本号
 * @param peerId Uint8Array
 * @returns client cocde, 1 character; version, less than 5 characters
 */
export function getShadowStyleClient(peerId: string): Client {
  return {
    code: peerId[0],
    name: findShadowStyleClientName(peerId[0]),
    version: shadowStyleVerToSemantic(peerId.substring(1, 4))
  }
}
/**
 * Shadow的风格使用以下编码：
 * 一个ASCII字母数字用于客户端标识，最多五个字符用于版本号（如果少于五个，则用“-”填充），后跟三个字符（通常为“---”，但并非总是如此），后跟随机字符。
 * 版本字符串中的每个字符表示0到63之间的数字。
 * '0'=0，...，'9'=9，'A'=10，...，'Z'=35，'a'=36，...，'z'=61，'.'=62，'-'=63。
 *
 * 是否是Shadow风格的PeerId
 * @param peerId Uint8Array 20字节的PeerId
 */
export function isShadowStyle(peerId: string): boolean {
  if (peerId.length != 20) {
    throw new Error('peerId length must be 20')
  }

  // 截取第一个字符
  const code = peerId[0]

  // 如果第一个字节不是ascii字母, 则不是Shadow风格
  if (!isLetter(code.charCodeAt(0))) {
    return false
  }

  // 如果第2-4个字节不是可显示字符, 则不是Shadow风格
  const version = peerId.substring(1, 4)

  if (!isShadowStyleVersion(version)) {
    return false
  }

  return true
}

/**
 * 是否是大写字母
 * @param charCode
 */
export function isUpperCaseLetter(charCode: number): boolean {
  const char = String.fromCharCode(charCode)
  return char >= 'A' && char <= 'Z'
}

/**
 * 是否是小写字母
 * @param charCode
 */
export function isLowerCaseLetter(charCode: number): boolean {
  const char = String.fromCharCode(charCode)
  return char >= 'a' && char <= 'z'
}

/**
 * 是否是字母
 * @param charCode
 */
export function isLetter(charCode: number): boolean {
  return isUpperCaseLetter(charCode) || isLowerCaseLetter(charCode)
}

/**
 * 是否是数字
 * @param charCode
 */
export function isDigit(charCode: number): boolean {
  const char = String.fromCharCode(charCode)
  return char >= '0' && char <= '9'
}
/**
 * 是否是可显示字符
 * 可显示字符编号范围是32-126（0x20-0x7E），共95个字符。
 * @param charCode
 */
export function isVisible(charCode: number): boolean {
  return charCode >= 32 && charCode <= 126
}

/**
 * 根据提供的code,查找AZ风格的客户端名称
 * @param code 2 characters
 * @returns client name,如果没有找到,返回undefined
 */
export function findAzstyleClientName(code: string): string | undefined {
  const keys = Object.keys(AZStyleClient)
  const index = keys.indexOf(code)
  if (index === -1) return undefined
  return Object.values(AZStyleClient)[index]
}

/**
 * 根据提供的code,查找Shadow风格的客户端名称
 * @param code 1 character
 * @returns client name,如果没有找到,返回undefined
 */
export function findShadowStyleClientName(code: string): string | undefined {
  const keys = Object.keys(ShadowStyleClient)
  const index = keys.indexOf(code)
  if (index === -1) return undefined
  return Object.values(ShadowStyleClient)[index]
}

/**
 * 是否是语义化版本号,不支持后缀,例如1.2.3-beta
 * @param version
 * @returns
 */
export function isSemanticVersion(version: string) {
  return /^\d{1,2}\.\d{1,2}\.\d{1,2}$/.test(version)
}

export function isAzStyleVersion(version: string) {
  return version.length === 4 && version.split('').every((item) => isDigit(item.charCodeAt(0)))
}

/**
 * 是否是shadow style的版本号
 * @param version
 * @returns
 */

export function isShadowStyleVersion(version: string) {
  return version.length === 3 && version.split('').every((item) => SHADOW_STYLE_VERSION_CHARS.includes(item))
}

/**
 * 产生一个指定长度的随机字符串
 * @returns
 */
export function randomStr(length: number): string {
  if (length <= 0) throw new Error('length must be greater than 0')

  if (length > 99) throw new Error('length must be less than 20')

  let result = ''
  const charCount = VISIBLE_CHARS.length

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charCount)
    result += VISIBLE_CHARS[randomIndex]
  }

  return result
}

/**
 * Semantic风格的版本号转换为Az风格的版本号,'2.0.60' -> '2060'
 * @param ver 语义化版本号 '2.0.60'
 * @returns
 */
export function semanticVerToAzStyle(ver: string): string {
  if (!isSemanticVersion(ver)) throw new Error('invalid Az style version')
  const chars = ver.split('.')
  const major = parseInt(chars[0])
  const minor = parseInt(chars[1])
  const patch = parseInt(chars[2])

  if (major > 9 || major < 0) throw new Error('major version must be 0-9 in Az style version')
  if (minor > 9 || minor < 0) throw new Error('minor version must be 0-9 in Az style version')
  if (patch > 99 || patch < 0) throw new Error('patch version must be 0-99 in Az style version')

  // 注意patch版本号是2位数字,不足2位的需要补0
  const patchStr = patch.toString().padStart(2, '0')
  return `${major}${minor}${patchStr}`
}

/**
 * Az风格的版本号转换为语义化的版本号,'2060' -> '2.0.60'
 * @param ver Az风格的版本号 '2060'
 * @returns
 */
export function azStyleVerToSemantic(ver: string): string {
  if (!isAzStyleVersion(ver)) throw new Error('invalid Az style version')
  const major = parseInt(ver.substring(0, 1))
  const minor = parseInt(ver.substring(1, 2))
  const patch = parseInt(ver.substring(2, 4))

  return [major, minor, patch].join('.')
}

/**
 * 语义化的版本号转换为Shadow风格的版本号,'1.2.11' -> '12B'
 * https://wiki.theory.org/BitTorrentSpecification
 * Each character in the version string represents a number from 0 to 63. '0'=0, ..., '9'=9, 'A'=10, ..., 'Z'=35, 'a'=36, ..., 'z'=61, '.'=62, '-'=63
 * @param ver shadow style version '1.2.B'
 */
export function semanticVerToShadowStyle(ver: string): string {
  if (!isSemanticVersion(ver)) throw new Error('invalid semantic version')

  return ver
    .split('.')
    .map((item) => SHADOW_STYLE_VERSION_CHARS[parseInt(item)])
    .join('')
}

/**
 * 语义化的版本号转换为Shadow风格的版本号,'12B' -> '1.2.11'
 * https://wiki.theory.org/BitTorrentSpecification
 * Each character in the version string represents a number from 0 to 63. '0'=0, ..., '9'=9, 'A'=10, ..., 'Z'=35, 'a'=36, ..., 'z'=61, '.'=62, '-'=63
 * @param ver semantic style version '1.2.11'
 * @returns
 */
export function shadowStyleVerToSemantic(ver: string): string {
  if (!isShadowStyleVersion(ver)) throw new Error('invalid shadow style version')

  const chars = ver.split('')

  return chars.map((item) => SHADOW_STYLE_VERSION_CHARS.indexOf(item)).join('.')
}
