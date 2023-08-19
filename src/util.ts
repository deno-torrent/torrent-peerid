export function isUrlEncoded(source: string) {
  return /%([0-9a-z]{1,})/gi.test(source)
}

/**
 * https://wiki.theory.org/BitTorrentSpecification
 * Note that all binary data in the URL (particularly info_hash and peer_id) must be properly escaped.
 * This means any byte not in the set 0-9, a-z, A-Z, '.', '-', '_' and '~',
 * must be encoded using the "%nn" format, where nn is the hexadecimal value of the byte. (See RFC1738 for details.)
 *
 * 将%nn编码的二进制数据解码成Uint8Array
 * @param source
 */
export function decodeUrlBinary(source: string): Uint8Array {
  // 需要测试,不知道对不对
  return new TextEncoder().encode(decodeURIComponent(source))
}

/**
 * Azureus风格使用以下编码：'-'，两个字符表示客户端ID，四个ASCII数字表示版本号，'-'，后跟随机数字。
 * 是否是Azureus风格的PeerId
 * e.g. -AZ2060-...
 * @param peerId Uint8Array 20字节的PeerId
 */
export function isAzStyle(peerId: Uint8Array): boolean {
  if (peerId.length != 20) {
    throw new Error('peerId length must be 20')
  }

  // 截取前8个字节
  const clientInfo = peerId.slice(0, 8)

  // 如果头尾都不是 '-', 则不是AZ风格
  if ([clientInfo[0], clientInfo[7]].some((item) => String.fromCharCode(item) !== '-')) {
    return false
  }

  // 如果第2,3个字节不是可显示字符, 则不是AZ风格
  if (clientInfo.slice(1, 3).some((item) => !isVisible(item))) {
    return false
  }

  // 如果中间6个字节,某一个不是数字, 则不是AZ风格
  if (clientInfo.slice(1, 7).some((item) => !isDigit(item))) {
    return false
  }

  return true
}

/**
 * 获取Azureus风格的客户端代号和版本号
 * @param peerId Uint8Array
 * @returns client cocde, 2 characters; version, 4 characters
 */
export function getAzStyleClientInfo(peerId: Uint8Array): {
  code: string
  version: string
} {
  if (!isAzStyle(peerId)) {
    throw new Error('peerId is not AzStyleClientPeerId')
  }

  return {
    code: String.fromCharCode(...peerId.slice(1, 3)),
    version: String.fromCharCode(...peerId.slice(3, 7))
  }
}

/**
 * 获取Shadow风格的客户端代号和版本号
 * @param peerId Uint8Array
 * @returns client cocde, 1 character; version, less than 5 characters
 */
export function getShadowStyleClientInfo(peerId: Uint8Array) {
  if (!isShadowStyle(peerId)) {
    throw new Error('peerId is not ShadowStyleClientPeerId')
  }

  return {
    code: String.fromCharCode(...peerId.slice(0, 1)),
    version: String.fromCharCode(...peerId.slice(1, 6)).replace('-', '')
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
export function isShadowStyle(peerId: Uint8Array): boolean {
  if (peerId.length != 20) {
    throw new Error('peerId length must be 20')
  }

  // 截取前5个字节
  const clientInfo = peerId.slice(0, 6)

  // 如果第一个字节不是ascii字母, 则不是Shadow风格
  if (!isLetter(clientInfo[0])) {
    return false
  }

  // 如果后面5个字节不是ascii数字, 则不是Shadow风格
  const version = String.fromCharCode(...clientInfo.slice(1, 6)).replace('-', '')

  if (version.split('').some((item) => !isDigit(item.charCodeAt(0)))) {
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
