/**
 * Test decode Azureus style peer id
 */

import { decode } from '../mod.ts'
import { assertEquals } from 'std/assert/mod.ts'
import { AZStyleClient, ShadowStyleClient } from '../src/enum.ts'
import { encodeAzStyle, encodeShadowStyle } from '../src/peerid.ts'

Deno.test('decode Azureus style peer id', () => {
  assertEquals(decode('-AZ2060-4f2f1f2f1f2f'), {
    code: 'AZ',
    name: AZStyleClient.AZ,
    version: '2.0.60'
  })

  assertEquals(decode('-AZ2000-4f2f1f2f1f2f'), {
    code: 'AZ',
    name: AZStyleClient.AZ,
    version: '2.0.0'
  })

  assertEquals(decode('-AZ2001-4f2f1f2f1f2f'), {
    code: 'AZ',
    name: AZStyleClient.AZ,
    version: '2.0.1'
  })

  assertEquals(decode('-ZT0001-4f2f1f2f1f2f'), {
    code: 'ZT',
    name: AZStyleClient.ZT,
    version: '0.0.1'
  })

  assertEquals(decode('-AZ2060-Mb?3kG/qpRd^'), {
    code: 'AZ',
    name: AZStyleClient.AZ,
    version: '2.0.60'
  })
})

Deno.test('decode Shadow style peer id', () => {
  assertEquals(decode('S58B-----fffffffffff'), {
    code: 'S',
    name: ShadowStyleClient.S,
    version: '5.8.11'
  })

  assertEquals(decode('S58------fffffffffff'), {
    code: 'S',
    name: ShadowStyleClient.S,
    version: '5.8.63'
  })

  assertEquals(decode('S58.-----fffffffffff'), {
    code: 'S',
    name: ShadowStyleClient.S,
    version: '5.8.62'
  })

  assertEquals(decode('S581-----fffffffffff'), {
    code: 'S',
    name: ShadowStyleClient.S,
    version: '5.8.1'
  })

  assertEquals(decode('S001-----fffffffffff'), {
    code: 'S',
    name: ShadowStyleClient.S,
    version: '0.0.1'
  })
})

Deno.test('test encodeAzStyle', () => {
  assertEquals(decode(encodeAzStyle('AZ', '2.0.60')), {
    code: 'AZ',
    name: AZStyleClient.AZ,
    version: '2.0.60'
  })

  assertEquals(decode(encodeAzStyle('AZ', '2.0.0')), {
    code: 'AZ',
    name: AZStyleClient.AZ,
    version: '2.0.0'
  })

  assertEquals(decode(encodeAzStyle('AZ', '2.0.6')), {
    code: 'AZ',
    name: AZStyleClient.AZ,
    version: '2.0.6'
  })

  assertEquals(decode(encodeAzStyle('AZ', '0.0.0')), {
    code: 'AZ',
    name: AZStyleClient.AZ,
    version: '0.0.0'
  })
})

Deno.test('test encodeShadowStyle', () => {
  assertEquals(decode(encodeShadowStyle('S', '5.8.11')), {
    code: 'S',
    name: ShadowStyleClient.S,
    version: '5.8.11'
  })

  assertEquals(decode(encodeShadowStyle('S', '0.0.11')), {
    code: 'S',
    name: ShadowStyleClient.S,
    version: '0.0.11'
  })

  assertEquals(decode(encodeShadowStyle('S', '0.0.0')), {
    code: 'S',
    name: ShadowStyleClient.S,
    version: '0.0.0'
  })

  assertEquals(decode(encodeShadowStyle('S', '5.8.0')), {
    code: 'S',
    name: ShadowStyleClient.S,
    version: '5.8.0'
  })

  assertEquals(decode(encodeShadowStyle('S', '5.0.0')), {
    code: 'S',
    name: ShadowStyleClient.S,
    version: '5.0.0'
  })
})
