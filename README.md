# w-sync-webdata
An operator for data synchronization between nodejs and browser.

![language](https://img.shields.io/badge/language-JavaScript-orange.svg) 
[![npm version](http://img.shields.io/npm/v/w-sync-webdata.svg?style=flat)](https://npmjs.org/package/w-sync-webdata) 
[![license](https://img.shields.io/npm/l/w-sync-webdata.svg?style=flat)](https://npmjs.org/package/w-sync-webdata) 
[![npm download](https://img.shields.io/npm/dt/w-sync-webdata.svg)](https://npmjs.org/package/w-sync-webdata) 
[![npm download](https://img.shields.io/npm/dm/w-sync-webdata.svg)](https://npmjs.org/package/w-sync-webdata) 
[![jsdelivr download](https://img.shields.io/jsdelivr/npm/hm/w-sync-webdata.svg)](https://www.jsdelivr.com/package/npm/w-sync-webdata)

## Documentation
To view documentation or get support, visit [docs](https://yuda-lyu.github.io/w-sync-webdata/WSyncWebdataServer.html).

## Parts
`w-sync-webdata` includes 2 parts: 
* `w-sync-webdata-server`: for nodejs server
* `w-sync-webdata-client`: for nodejs and browser client

## Breaking changes

### Unreleased: diagnostic output without an `error` listener (item 158)
* The `error` events of both parts carry `err`, `tableName`, `timeTag` or the rejected input value, which may hold tokens, user identities or data values. When **no `error` listener** is attached, they were written whole to `console.error` (`console.error('[w-sync-webdata]', { msg, err, tableName, timeTag })`). Now the output goes through `getDiag` of `wsemi` and **by default only a fixed label and a safe summary** is written:
```alias
// before
console.error('[w-sync-webdata]', { msg: 'can not get table data: tabA', err: Error('...token=...'), tableName: 'tabA', timeTag: '...' })
// now
console.error('[w-sync-webdata] can not get table data', { errType: 'Error' })   // server side may also carry errCode, e.g. { errType: 'Error', errCode: 'ENOENT' }
```
* New options of both `WSyncWebdataServer` and `WSyncWebdataClient` (same as `getDiag`):
  * `opt.logDetail`: only the boolean `true` takes effect, the output becomes `console.error(label, detail)` with the whole (masked) event content, for debugging.
  * `opt.funLog(label, safe, detail)`: takes over the output (nothing is written to `console`), `detail` is the whole (masked) event content so you can mask or forward it yourself; its throw and returned rejection are swallowed.
* The constructor notice `instWConverServer / instWConverClient is not an effective object, ...` also goes through the same exit (still `console.log` of a fixed text by default; `opt.funLog` can take it over).
* An attached `error` listener still receives the unchanged event content (`{ msg, err }`, plus `tableName`, `timeTag` for the failed table); only the console fallback changed. If your tooling parsed the old console text, attach an `error` listener or use `opt.funLog`.
* Known remainder: when a listener of your own throws (e.g. `getData`) and no `error` listener is attached, or when the `error` listener itself throws, the thrown value is still written to `console.error` by `wsemi` (`evEmit`), outside this package. Attach an `error` listener to route it to your own handling.

## Installation

### Using npm(ES6 module):
```alias
npm i w-sync-webdata
```

#### Example for server and client:
> **Link:** [[dev source code](https://github.com/yuda-lyu/w-sync-webdata/blob/master/srvscla.mjs)]
```alias

//前後端共用範例
import w from 'wsemi'
import WSyncWebdataServer from './src/WSyncWebdataServer.mjs'
import WSyncWebdataClient from './src/WSyncWebdataClient.mjs'

let ms = []

let ntg = 0
let genTag = () => {
    ntg++
    return `tag-${ntg}`
}

//-------- 後端 ---------

//EventEmitter, 模擬後端推播至前端
let ee = w.evem()

//instWConverServer
let instWConverServer = w.evem()

//wsds
let wsds = new WSyncWebdataServer(
    instWConverServer,
    {
        // fpTableTags: 'tableTags-sync-webdata.json',
        genTag,
    },
)

//tableTagsSrv
let tableTagsSrv = {
    tabA: 'tag-0-a',
    tabB: 'tag-0-b',
}

//initTableTags
wsds.initTableTags(tableTagsSrv)

//readTableTags
console.log('server: nowTableTags', wsds.readTableTags())
ms.push({ 'server nowTableTags': JSON.stringify(wsds.readTableTags()) })

//updateTableTag
setTimeout(() => {
    wsds.updateTableTag('tabA')
    ms.push({ 'server updateTableTag': 'tabA' })
}, 500)
setTimeout(() => {
    wsds.updateTableTag('tabB')
    ms.push({ 'server updateTableTag': 'tabB' })
}, 750)
setTimeout(() => {
    wsds.updateTableTag('tabA')
    ms.push({ 'server updateTableTag': 'tabA' })
}, 1000)

//changeTableTags
wsds.on('changeTableTags', (nowTableTags) => {
    console.log('server: changeTableTags', nowTableTags)

    //server push
    console.log('server: push')
    ms.push({ 'server changeTableTags': JSON.stringify(nowTableTags) })
    ee.emit('push', nowTableTags)

})

//error
wsds.on('error', (err) => {
    console.log('server: error', err)
})

//getAPIData, 模擬後端提供API
let tabsCount = {
    tabA: 0,
    tabB: 0,
}
async function getAPIData(tableName) {
    ms.push({ 'server call getAPIData before': tableName })
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            tabsCount[tableName] += 1
            ms.push({ 'server call getAPIData after': `table[${tableName}] = ${tabsCount[tableName]}` })
            resolve(`table[${tableName}] = ${tabsCount[tableName]}`)
        }, 100)
    })
}

//-------- 前端 ---------

//instWConverClient
let instWConverClient = w.evem()

//wsdc
let wsdc = new WSyncWebdataClient(instWConverClient, {})

//tableTagsCl
let tableTagsCl = {
    tabA: 'tag-0-a',
    tabB: 'tag-0-b',
}

//setTableTags, 模擬前端將tableTags預先或有變更即儲存至localStorage, 啟動時有既有tableTags
wsdc.setTableTags(tableTagsCl)
ms.push({ 'clinet setTableTags': JSON.stringify(tableTagsCl) })

//push, 模擬前端接收後端推播有變更tableTags
ee.on('push', (nowTableTags) => {

    //updateTableTags
    wsdc.updateTableTags(nowTableTags)
    ms.push({ 'clinet updateTableTags': JSON.stringify(nowTableTags) })

})

//refreshState
wsdc.on('refreshState', (msg) => {
    console.log('client: refreshState needToRefresh', msg.needToRefresh)
})

//refreshTable
wsdc.on('refreshTable', (input) => {
    // console.log('client: refreshTable', input)

    //收到有變更tableTags, 模擬呼叫後端API
    console.log('client: getAPIData before: ' + input.tableName)
    ms.push({ 'clinet call getAPIData before': input.tableName })
    getAPIData(input.tableName)
        .then((data) => {
            console.log('client: getAPIData after: ' + data)
            ms.push({ 'clinet call getAPIData after': data })
            input.pm.resolve(data) //Use pm.resolve to retrieve the data, and pm.reject the message when get an error.
        })
        .catch((err) => {
            input.pm.reject(err)
        })

})

//getData
wsdc.on('getData', (data) => {
    console.log('client: getData', data)
    //前端取得數據
})

//beforeUpdateTableTags, afterUpdateTableTags
wsdc.on('beforeUpdateTableTags', (msg) => {
    // console.log('client: beforeUpdateTableTags', msg)
})
wsdc.on('afterUpdateTableTags', (msg) => {
    // console.log('client: afterUpdateTableTags', msg)
})

//error
wsdc.on('error', (err) => {
    console.log('client: error', err)
})

setTimeout(() => {
    console.log('ms', ms)
}, 2000)

// server: nowTableTags { tabA: 'tag-0-a', tabB: 'tag-0-b' }
// server: changeTableTags { tabA: 'tag-1', tabB: 'tag-0-b' }
// server: push
// client: refreshState needToRefresh true
// client: getAPIData before: tabA
// client: getAPIData after: table[tabA] = 1
// client: getData { tableName: 'tabA', timeTag: 'tag-1', data: 'table[tabA] = 1' }
// server: changeTableTags { tabA: 'tag-1', tabB: 'tag-2' }
// server: push
// client: refreshState needToRefresh true
// client: getAPIData before: tabB
// client: getAPIData after: table[tabB] = 1
// client: getData { tableName: 'tabB', timeTag: 'tag-2', data: 'table[tabB] = 1' }
// server: changeTableTags { tabA: 'tag-3', tabB: 'tag-2' }
// server: push
// client: refreshState needToRefresh true
// client: getAPIData before: tabA
// client: getAPIData after: table[tabA] = 2
// client: getData { tableName: 'tabA', timeTag: 'tag-3', data: 'table[tabA] = 2' }
// ms [
//   { 'server nowTableTags': '{"tabA":"tag-0-a","tabB":"tag-0-b"}' },
//   { 'clinet setTableTags': '{"tabA":"tag-0-a","tabB":"tag-0-b"}' },
//   { 'server updateTableTag': 'tabA' },
//   { 'server changeTableTags': '{"tabA":"tag-1","tabB":"tag-0-b"}' },
//   { 'clinet updateTableTags': '{"tabA":"tag-1","tabB":"tag-0-b"}' },
//   { 'clinet call getAPIData before': 'tabA' },
//   { 'server call getAPIData before': 'tabA' },
//   { 'server updateTableTag': 'tabB' },
//   { 'server call getAPIData after': 'table[tabA] = 1' },
//   { 'clinet call getAPIData after': 'table[tabA] = 1' },
//   { 'server changeTableTags': '{"tabA":"tag-1","tabB":"tag-2"}' },
//   { 'clinet updateTableTags': '{"tabA":"tag-1","tabB":"tag-2"}' },
//   { 'clinet call getAPIData before': 'tabB' },
//   { 'server call getAPIData before': 'tabB' },
//   { 'server updateTableTag': 'tabA' },
//   { 'server call getAPIData after': 'table[tabB] = 1' },
//   { 'clinet call getAPIData after': 'table[tabB] = 1' },
//   { 'server changeTableTags': '{"tabA":"tag-3","tabB":"tag-2"}' },
//   { 'clinet updateTableTags': '{"tabA":"tag-3","tabB":"tag-2"}' },
//   { 'clinet call getAPIData before': 'tabA' },
//   { 'server call getAPIData before': 'tabA' },
//   { 'server call getAPIData after': 'table[tabA] = 2' },
//   { 'clinet call getAPIData after': 'table[tabA] = 2' }
// ]
```
