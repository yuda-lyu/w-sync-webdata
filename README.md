# w-sync-webdata
An operator for data synchronization between nodejs and browser.

![language](https://img.shields.io/badge/language-JavaScript-orange.svg) 
[![npm version](http://img.shields.io/npm/v/w-sync-webdata.svg?style=flat)](https://npmjs.org/package/w-sync-webdata) 
[![license](https://img.shields.io/npm/l/w-sync-webdata.svg?style=flat)](https://npmjs.org/package/w-sync-webdata) 
[![gzip file size](http://img.badgesize.io/yuda-lyu/w-sync-webdata/master/dist/w-sync-webdata-server.umd.js.svg?compression=gzip)](https://github.com/yuda-lyu/w-sync-webdata)
[![npm download](https://img.shields.io/npm/dt/w-sync-webdata.svg)](https://npmjs.org/package/w-sync-webdata) 
[![jsdelivr download](https://img.shields.io/jsdelivr/npm/hm/w-sync-webdata.svg)](https://www.jsdelivr.com/package/npm/w-sync-webdata)

## Documentation
To view documentation or get support, visit [docs](https://yuda-lyu.github.io/w-sync-webdata/WSyncWebdataServer.html).

## Parts
`w-sync-webdata` includes 2 parts: 
* `w-sync-webdata-server`: for nodejs server
* `w-sync-webdata-client`: for nodejs and browser client

## Installation
### Using npm(ES6 module):
> **Note:** `w-sync-webdata-server` and `w-sync-webdata-client` is mainly dependent on `lodash` and `wsemi`.

```alias
npm i w-sync-webdata
```

#### Example for server push:
> **Link:** [[dev source code](https://github.com/yuda-lyu/w-sync-webdata/blob/master/srvscla.mjs)]
```alias
import events from 'events'
import WSyncWebdataServer from './src/WSyncWebdataServer.mjs'
import WSyncWebdataClient from './src/WSyncWebdataClient.mjs'


//-------- back-end ---------

//EventEmitter, Simulated back-end push notification to front-end.
let ee = new events.EventEmitter()

//wsds
let wsds = new WSyncWebdataServer()

//tableTagsSrv
let tableTagsSrv = {
    tabA: '2020-01-01T00:00:00+08:00',
    tabB: '2020-01-01T01:00:00+08:00',
}

//initTableTags
wsds.initTableTags(tableTagsSrv)

//readTableTags
console.log('server: nowTableTags', wsds.readTableTags())

//updateTableTag
setTimeout(() => {
    wsds.updateTableTag('tabA')
}, 500)
setTimeout(() => {
    wsds.updateTableTag('tabB')
}, 750)
setTimeout(() => {
    wsds.updateTableTag('tabA')
}, 1000)

//changeTableTags
wsds.on('changeTableTags', (nowTableTags) => {
    console.log('server: changeTableTags', nowTableTags)

    //server push
    console.log('server: push')
    ee.emit('push', nowTableTags)

})

//error
wsds.on('error', (err) => {
    console.log('server: error', err)
})

//getAPIData, Simulated back-end API for data transfer
let tabsCount = {
    tabA: 0,
    tabB: 0,
}
async function getAPIData(tableName) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            tabsCount[tableName] += 1
            resolve(`table[${tableName}] = ${tabsCount[tableName]}`)
        }, 100)
    })
}

//-------- front-end ---------

//wsdc
let wsdc = new WSyncWebdataClient()

//tableTagsCl
let tableTagsCl = {
    tabA: '2020-01-01T00:00:00+08:00',
    tabB: '2020-01-01T01:00:00+08:00',
}

//setTableTags, Simulated tableTags saved in cookie or localStorage, you can load tableTags and set directly.
wsdc.setTableTags(tableTagsCl)

//push, Simulate receiving an updating tableTags of event which send from back-end.
ee.on('push', (nowTableTags) => {

    //updateTableTags
    wsdc.updateTableTags(nowTableTags)

})

//refreshState
wsdc.on('refreshState', (msg) => {
    console.log('client: refreshState needToRefresh', msg.needToRefresh)
})

//refreshTable
wsdc.on('refreshTable', (input) => {
    //console.log('client: refreshTable', input)

    //Call API when receiving an updating tableTags of event
    console.log('client: getAPIData before: ' + input.tableName)
    getAPIData(input.tableName)
        .then((data) => {
            console.log('client: getAPIData after: ' + data)
            input.pm.resolve(data) //Use pm.resolve to retrieve the data, and pm.reject the message when get an error.
        })
        .catch((err) => {
            input.pm.reject(err)
        })

})

//getData
wsdc.on('getData', (data) => {
    console.log('client: getData', data)
    //Update data, save or transfer it to vuex etc.
})

//error
wsdc.on('error', (err) => {
    console.log('client: error', err)
})

// server: nowTableTags {
//   tabA: '2020-01-01T00:00:00+08:00',
//   tabB: '2020-01-01T01:00:00+08:00'
// }
// server: changeTableTags {
//   tabA: '2020-04-09T12:56:49+08:00|wbYkvr',
//   tabB: '2020-01-01T01:00:00+08:00'
// }
// server: push
// client: refreshState needToRefresh true
// client: getAPIData before: tabA
// client: getAPIData after: table[tabA] = 1
// client: getData {
//   tableName: 'tabA',
//   timeTag: '2020-04-09T12:56:49+08:00|wbYkvr',
//   data: 'table[tabA] = 1'
// }
// server: changeTableTags {
//   tabA: '2020-04-09T12:56:49+08:00|wbYkvr',
//   tabB: '2020-04-09T12:56:50+08:00|96hE94'
// }
// server: push
// client: refreshState needToRefresh true
// client: getAPIData before: tabB
// client: getAPIData after: table[tabB] = 1
// client: getData {
//   tableName: 'tabB',
//   timeTag: '2020-04-09T12:56:50+08:00|96hE94',
//   data: 'table[tabB] = 1'
// }
// server: changeTableTags {
//   tabA: '2020-04-09T12:56:50+08:00|PjJF80',
//   tabB: '2020-04-09T12:56:50+08:00|96hE94'
// }
// server: push
// client: refreshState needToRefresh true
// client: getAPIData before: tabA
// client: getAPIData after: table[tabA] = 2
// client: getData {
//   tableName: 'tabA',
//   timeTag: '2020-04-09T12:56:50+08:00|PjJF80',
//   data: 'table[tabA] = 2'
// }
```

#### Example for client polling:
> **Link:** [[dev source code](https://github.com/yuda-lyu/w-sync-webdata/blob/master/srvsclb.mjs)]
```alias
import WSyncWebdataServer from './src/WSyncWebdataServer.mjs'
import WSyncWebdataClient from './src/WSyncWebdataClient.mjs'

//log time
let i = 0
console.log('i=', i)
let ts = setInterval(() => {
    i += 1
    console.log('i=', i)
    if (i >= 7) {
        clearInterval(ts)
    }
}, 1000)

//-------- back-end ---------

//wsds
let wsds = new WSyncWebdataServer()

//tableTagsSrv
let tableTagsSrv = {
    tabA: '2020-01-01T00:00:00+08:00',
    tabB: '2020-01-01T01:00:00+08:00',
}

//initTableTags
wsds.initTableTags(tableTagsSrv)

//readTableTags
console.log('server: nowTableTags', wsds.readTableTags())

//updateTableTag
setTimeout(() => {
    wsds.updateTableTag('tabA')
}, 2400)
setTimeout(() => {
    wsds.updateTableTag('tabB')
}, 3600)
setTimeout(() => {
    wsds.updateTableTag('tabA')
}, 4800)

//changeTableTags
wsds.on('changeTableTags', (nowTableTags) => {
    console.log('server: changeTableTags', nowTableTags)
    //This example does not push to front-end, wait polling form the front-end.
})

//error
wsds.on('error', (err) => {
    console.log('server: error', err)
})

//getAPITableTags, Simulated back-end API for sending table timestamp.
async function getAPITableTags() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(wsds.getTableTags())
        }, 100)
    })
}

//getAPIData, Simulated back-end API for sending table data.
let tabsCount = {
    tabA: 0,
    tabB: 0,
}
async function getAPIData(tableName) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            tabsCount[tableName] += 1
            resolve(`table[${tableName}] = ${tabsCount[tableName]}`)
        }, 100)
    })
}

//-------- front-end ---------

//optc
let optc = {
    usePollingTableTags: true, //Enable the polling the table timestamp.
}

//wsdc
let wsdc = new WSyncWebdataClient(optc)

//tableTagsCl
let tableTagsCl = {
    tabA: '2020-01-01T00:00:00+08:00',
    tabB: '2020-01-01T01:00:00+08:00',
}

//setTableTags, Loaded tableTags directly if cache (cookie or localStorage) is available in front-end.
wsdc.setTableTags(tableTagsCl)

//Simulate mouseover event of front-end in node.js, and call pollingTableTags for triggering.
let n = 0
let t = setInterval(() => {
    n += 1
    wsdc.pollingTableTags()
    if (n >= 65) {
        clearInterval(t)
    }
}, 100)

//refreshTags
wsdc.on('refreshTags', ({ pm }) => {
    //console.log('client: refreshTags')

    //getAPITableTags
    console.log('client: getAPITableTags before')
    getAPITableTags()
        .then((nowTableTags) => {
            console.log('client: getAPITableTags after: ', nowTableTags)
            pm.resolve(nowTableTags)
        })
        .catch((err) => {
            pm.reject(err)
        })

})

//refreshState
wsdc.on('refreshState', (msg) => {
    console.log('client: refreshState needToRefresh', msg.needToRefresh)
})

//refreshTable
wsdc.on('refreshTable', (input) => {
    //console.log('client: refreshTable', input)

    //Call API when receiving an updating tableTags of event.
    console.log('client: getAPIData before: ' + input.tableName)
    getAPIData(input.tableName)
        .then((data) => {
            console.log('client: getAPIData after: ' + data)
            input.pm.resolve(data) //Use pm.resolve to retrieve the data, and pm.reject the message when get an error.
        })
        .catch((err) => {
            input.pm.reject(err)
        })

})

//getData
wsdc.on('getData', (data) => {
    console.log('client: getData', data)
    //Update data, save or transfer it to vuex etc.
})

//error
wsdc.on('error', (err) => {
    console.log('client: error', err)
})

// i= 0
// server: nowTableTags {
//   tabA: '2020-01-01T00:00:00+08:00',
//   tabB: '2020-01-01T01:00:00+08:00'
// }
// client: getAPITableTags before
// client: getAPITableTags after:  {
//   tabA: '2020-01-01T00:00:00+08:00',
//   tabB: '2020-01-01T01:00:00+08:00'
// }
// client: refreshState needToRefresh false
// i= 1
// i= 2
// client: getAPITableTags before
// client: getAPITableTags after:  {
//   tabA: '2020-01-01T00:00:00+08:00',
//   tabB: '2020-01-01T01:00:00+08:00'
// }
// client: refreshState needToRefresh false
// server: changeTableTags {
//   tabA: '2022-03-02T14:41:07+08:00|yzlAPz',
//   tabB: '2020-01-01T01:00:00+08:00'
// }
// i= 3
// server: changeTableTags {
//   tabA: '2022-03-02T14:41:07+08:00|yzlAPz',
//   tabB: '2022-03-02T14:41:08+08:00|LZmkJV'
// }
// i= 4
// client: getAPITableTags before
// client: getAPITableTags after:  {
//   tabA: '2022-03-02T14:41:07+08:00|yzlAPz',
//   tabB: '2022-03-02T14:41:08+08:00|LZmkJV'
// }
// client: refreshState needToRefresh true
// client: getAPIData before: tabA
// client: getAPIData before: tabB
// client: getAPIData after: table[tabA] = 1
// client: getAPIData after: table[tabB] = 1
// client: getData {
//   tableName: 'tabA',
//   timeTag: '2022-03-02T14:41:07+08:00|yzlAPz',
//   data: 'table[tabA] = 1'
// }
// client: getData {
//   tableName: 'tabB',
//   timeTag: '2022-03-02T14:41:08+08:00|LZmkJV',
//   data: 'table[tabB] = 1'
// }
// i= 5
// server: changeTableTags {
//   tabA: '2022-03-02T14:41:10+08:00|NDGfpO',
//   tabB: '2022-03-02T14:41:08+08:00|LZmkJV'
// }
// i= 6
// client: getAPITableTags before
// client: getAPITableTags after:  {
//   tabA: '2022-03-02T14:41:10+08:00|NDGfpO',
//   tabB: '2022-03-02T14:41:08+08:00|LZmkJV'
// }
// client: refreshState needToRefresh true
// client: getAPIData before: tabA
// client: getAPIData after: table[tabA] = 2
// client: getData {
//   tableName: 'tabA',
//   timeTag: '2022-03-02T14:41:10+08:00|NDGfpO',
//   data: 'table[tabA] = 2'
// }
// i= 7
```
