# FTX OTC Client

Client for interacting with the FTX OTC API.

**Note:** This library is in the early stages of development, and has not been
thoroughly tested. I make no claims about it's fitness for trading.

## Installation

```sh
yarn add ftx-otc-client
```

## Usage

See the [FTX OTC API docs](https://ftxotcportalapi.docs.apiary.io/) for a full
list of supported methods.

```ts
import {FtxClient} from 'ftx-otc-client'

// create new client
const ftx = new FtxClient({
  // API key from FTX OTC dashboard
  apiKey: this.apiKey,
  // API secret from FTX OTC dashboard
  apiSecret: this.apiSecret,
  // [Optional]: If you want to point the client to a different API base URL (e.g. for FTX US)
  // Defaults to https://otc.ftx.com/api
  apiUrl: this.apiUrl,
})

const quoteRes = await client.quotes.create({
  baseCurrency: 'BTC',
  quoteCurrency: 'USDT',
  side: 'buy',
  quoteCurrencySize: 1,
  counterpartyAutoSettles: true,
})

if (quoteRes.success) {
  const quote = quoteRes.result
  await client.quotes.accept(quoteId)
}
```

## License

Copyright 2021 Sam Deere

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
