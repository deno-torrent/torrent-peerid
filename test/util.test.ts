/**
 * Test decode Azureus style peer id
 */

import { assertEquals, assertThrows } from 'std/assert/mod.ts'
import {
  findAzstyleClientName,
  findShadowStyleClientName,
  isAzStyle,
  isAzStyleVersion,
  isDigit,
  isLetter,
  isLowerCaseLetter,
  isSemanticVersion,
  isShadowStyleVersion,
  isUpperCaseLetter,
  isUrlEncoded,
  randomStr
} from '../src/util.ts'
import { ShadowStyleClient } from '../src/enum.ts'
import { DIGITALS, LOWER_LETTERS, OTHER_CHARS, UPPER_LETTERS } from '../src/constant.ts'

Deno.test('test isUrlEncoded', () => {
  const passCases = ['%2', '%24', '%2B', '%B', '%BD', '%B4', '%Bd', '%b4', '%ba21']
  const failCases = ['%tesd%ss', '%a2^', '%^a2', '^%a2', '']
  passCases.forEach((item) => {
    assertEquals(isUrlEncoded(item), true)
  })
  failCases.forEach((item) => {
    assertEquals(isUrlEncoded(item), false)
  })
})

Deno.test('test isLetter', () => {
  UPPER_LETTERS.forEach((char) => {
    assertEquals(isLetter(char.charCodeAt(0)), true)
  })
  LOWER_LETTERS.forEach((char) => {
    assertEquals(isLetter(char.charCodeAt(0)), true)
  })
  OTHER_CHARS.forEach((char) => {
    assertEquals(isLetter(char.charCodeAt(0)), false)
  })
  DIGITALS.forEach((char) => {
    assertEquals(isLetter(char.charCodeAt(0)), false)
  })
})

Deno.test('test isUpperCaseLetter', () => {
  UPPER_LETTERS.forEach((char) => {
    assertEquals(isUpperCaseLetter(char.charCodeAt(0)), true)
  })
  LOWER_LETTERS.forEach((char) => {
    assertEquals(isUpperCaseLetter(char.charCodeAt(0)), false)
  })
  OTHER_CHARS.forEach((char) => {
    assertEquals(isUpperCaseLetter(char.charCodeAt(0)), false)
  })
  DIGITALS.forEach((char) => {
    assertEquals(isLowerCaseLetter(char.charCodeAt(0)), false)
  })
})

Deno.test('test isLowerCaseLetter', () => {
  UPPER_LETTERS.forEach((char) => {
    assertEquals(isLowerCaseLetter(char.charCodeAt(0)), false)
  })
  LOWER_LETTERS.forEach((char) => {
    assertEquals(isLowerCaseLetter(char.charCodeAt(0)), true)
  })
  OTHER_CHARS.forEach((char) => {
    assertEquals(isLowerCaseLetter(char.charCodeAt(0)), false)
  })
  DIGITALS.forEach((char) => {
    assertEquals(isLowerCaseLetter(char.charCodeAt(0)), false)
  })
})

Deno.test('tes isDigit', () => {
  UPPER_LETTERS.forEach((char) => {
    assertEquals(isDigit(char.charCodeAt(0)), false)
  })
  LOWER_LETTERS.forEach((char) => {
    assertEquals(isDigit(char.charCodeAt(0)), false)
  })
  OTHER_CHARS.forEach((char) => {
    assertEquals(isDigit(char.charCodeAt(0)), false)
  })
  DIGITALS.forEach((char) => {
    assertEquals(isDigit(char.charCodeAt(0)), true)
  })
})

Deno.test('test isShadowStyle', () => {
  const passCases = ['-AZ2060-4f2f1f2f1f2f', '-AB3125-4f2f1f2f1f2f', '-A~2060-4f2f1f2f1f2f']
  const failCases = [
    '-AZAA11-4f2f1f2f1f2f',
    '-AZAAA1-4f2f1f2f1f2f',
    '-AZAAAA-4f2f1f2f1f2f',
    '-11AA11-4f2f1f2f1f2f',
    '-11AAA1-4f2f1f2f1f2f',
    '-11AAAA-4f2f1f2f1f2f'
  ]

  const throwCases = ['', 'A', '1', '--AZ2060-4f2f1f2f1f2f']

  passCases.forEach((peerId) => {
    assertEquals(isAzStyle(peerId), true)
  })

  failCases.forEach((peerId) => {
    assertEquals(isAzStyle(peerId), false)
  })

  throwCases.forEach((peerId) => {
    assertThrows(
      () => {
        isAzStyle(peerId)
      },
      Error,
      'peerId length must be 20'
    )
  })
})

Deno.test('test findAzstyleClientName', () => {
  const passCases = [
    {
      code: 'AZ',
      name: 'Azureus'
    }
  ]

  const failCases = ['Z6', 'X55', 'A6', 'A5', 'A4', 'A3', 'A2', 'A1', 'A0', 'A9', 'A8', 'A7']

  passCases.forEach((item) => {
    assertEquals(findAzstyleClientName(item.code), item.name)
  })

  failCases.forEach((code) => {
    assertEquals(findAzstyleClientName(code), undefined)
  })
})

Deno.test('test findShadowStyleClientName', () => {
  const passCases = Object.keys(ShadowStyleClient).map((key, index) => {
    return {
      code: key,
      name: Object.values(ShadowStyleClient)[index]
    }
  })

  const failCases = ['Z6', 'X55', 'A6', 'A5', 'A4', 'A3', 'A2', 'A1', 'A0', 'A9', 'A8', 'A7', 'F', '6']

  passCases.forEach((item) => {
    assertEquals(findShadowStyleClientName(item.code), item.name)
  })

  failCases.forEach((code) => {
    assertEquals(findShadowStyleClientName(code), undefined)
  })
})

Deno.test('test isSemanticVersion', () => {
  const passCases = ['0.0.0', '1.0.0', '0.0.1', '1.0.11', '1.11.0', '11.0.0', '1.11.11', '11.11.11']

  const failCases = [
    '1',
    '1.0',
    '1.0.0.',
    '1.0.0-alpha.',
    '1.0.0-alpha..1',
    '1.0.0-alpha.1.',
    '1.0.0-alpha.1.1',
    '1.0.0-alpha..1+001',
    '1.0.0-alpha.1+001',
    '1.0.0-alpha.1.1+001'
  ]

  passCases.forEach((version) => {
    assertEquals(isSemanticVersion(version), true)
  })

  failCases.forEach((version) => {
    assertEquals(isSemanticVersion(version), false)
  })
})

Deno.test('test isAzStyleVersion', () => {
  assertEquals(isAzStyleVersion('2060'), true)
  assertEquals(isAzStyleVersion('0000'), true)
  assertEquals(isAzStyleVersion('1000'), true)
  assertEquals(isAzStyleVersion('1100'), true)
  assertEquals(isAzStyleVersion('1110'), true)
  assertEquals(isAzStyleVersion('1111'), true)
  assertEquals(isAzStyleVersion('206'), false)
  assertEquals(isAzStyleVersion('20600'), false)
})

Deno.test('test isShadowStyleVersion', () => {
  assertEquals(isShadowStyleVersion('20-'), true)
  assertEquals(isShadowStyleVersion('20.'), true)
  assertEquals(isShadowStyleVersion('206'), true)
  assertEquals(isShadowStyleVersion(''), false)
  assertEquals(isShadowStyleVersion('20'), false)
  assertEquals(isShadowStyleVersion('2060'), false)
})

Deno.test('test randomStr', () => {
  assertThrows(() => randomStr(-1))
  assertThrows(() => randomStr(0))
  assertEquals(randomStr(1).length, 1)
  assertEquals(randomStr(10).length, 10)
  assertEquals(randomStr(99).length, 99)
  assertThrows(() => randomStr(100))
})
