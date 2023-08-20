# [torrent-peerid](https://deno.land/x/dt_torrent_peerid) [![Custom badge](https://img.shields.io/endpoint?url=https%3A%2F%2Fdeno-visualizer.danopia.net%2Fshields%2Flatest-version%2Fx%2Fdt_torrent_peerid%2Fmod.ts)](https://deno.land/x/dt_torrent_peerid)

torrent-peerid is a lightweight Deno library for decode and encode peerid for BitTorrent protocol.

## Usage

### decode

If peerid is not Azureus or Shadow style, return undefined.
Currently does not support the parsing of custom Peerid, and this feature will be implemented in the near future

```ts
import { decode } from "https://deno.land/x/dt_torrent_peerid/mod.ts";

// decode Azureus style peerid
let result = decode('-AZ2060-Mb?3kG/qpRd^')

// output : { code: 'AZ', name: 'Azureus' , version: '2.0.60' }
console.log(result)

// decode Shadow style peerid
result = decode('S58B-----IWl4Z*v.Jul')

console.log(result)
// output : { code: 'S5', name: 'Shadow', version: '5.8.11' }

  
```

### encode

```ts
import { encodeAzStyle, encodeShadowStyle } from "https://deno.land/x/dt_torrent_peerid/mod.ts";

// encode Azureus style peerid
let result = encodeAzStyle('AZ', '2.0.60')
console.log(new TextDecoder().decode(result))

// output : '-AZ2060-K4vXK}wDsk"7'

// encode Shadow style peerid
result = encodeShadowStyle('C', '5.8.11')
console.log(new TextDecoder().decode(result))

// output : 'C58B-----IWl4Z*v.Jul'

```

## Test

```bash
deno task test

# Task test deno test --allow-all
# running 4 tests from ./test/peerid.test.ts
# decode Azureus style peer id ... ok (9ms)
# decode Shadow style peer id ... ok (5ms)
# test encodeAzStyle ... ok (5ms)
# test encodeShadowStyle ... ok (7ms)
# running 12 tests from ./test/util.test.ts
# test isUrlEncoded ... ok (10ms)
# test isLetter ... ok (4ms)
# test isUpperCaseLetter ... ok (5ms)
# test isLowerCaseLetter ... ok (6ms)
# test isDigit ... ok (4ms)
# test isShadowStyle ... ok (6ms)
# test findAzstyleClientName ... ok (5ms)
# test findShadowStyleClientName ... ok (6ms)
# test isSemanticVersion ... ok (5ms)
# test isAzStyleVersion ... ok (5ms)
# test isShadowStyleVersion ... ok (4ms)
# test randomStr ... ok (5ms)
```
