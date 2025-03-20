import w from 'wsemi'
import WSyncWebdataServer from './src/WSyncWebdataServer.mjs'
import WSyncWebdataClient from './src/WSyncWebdataClient.mjs'


//-------- back-end ---------

//EventEmitter, Simulated back-end push notification to front-end.
let ee = w.evem()

//instWConverServer
let instWConverServer = w.evem()

//wsds
let wsds = new WSyncWebdataServer(
    instWConverServer,
    {
        // fpTableTags: 'tableTags-sync-webdata.json',
    },
)

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

//instWConverClient
let instWConverClient = w.evem()

//optc
let optc = {
    usePollingTableTags: false,
}

//wsdc
let wsdc = new WSyncWebdataClient(instWConverClient, optc)

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

//beforeUpdateTableTags, afterUpdateTableTags, beforePollingTableTags, afterPollingTableTags
wsdc.on('beforeUpdateTableTags', (msg) => {
    console.log('client: beforeUpdateTableTags', msg)
})
wsdc.on('afterUpdateTableTags', (msg) => {
    console.log('client: afterUpdateTableTags', msg)
})
wsdc.on('beforePollingTableTags', () => {
    console.log('client: beforePollingTableTags')
})
wsdc.on('afterPollingTableTags', () => {
    console.log('client: afterPollingTableTags')
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
//   tabA: '2022-03-02T15:07:43+08:00|pDTyK1',
//   tabB: '2020-01-01T01:00:00+08:00'
// }
// server: push
// client: beforeUpdateTableTags {
//   oldTableTags: {
//     tabA: '2020-01-01T00:00:00+08:00',
//     tabB: '2020-01-01T01:00:00+08:00'
//   },
//   newTableTags: {
//     tabA: '2022-03-02T15:07:43+08:00|pDTyK1',
//     tabB: '2020-01-01T01:00:00+08:00'
//   }
// }
// client: refreshState needToRefresh true
// client: getAPIData before: tabA
// client: getAPIData after: table[tabA] = 1
// client: getData {
//   tableName: 'tabA',
//   timeTag: '2022-03-02T15:07:43+08:00|pDTyK1',
//   data: 'table[tabA] = 1'
// }
// client: afterUpdateTableTags {
//   oldTableTags: {
//     tabA: '2022-03-02T15:07:43+08:00|pDTyK1',
//     tabB: '2020-01-01T01:00:00+08:00'
//   },
//   newTableTags: {
//     tabA: '2022-03-02T15:07:43+08:00|pDTyK1',
//     tabB: '2022-03-02T15:07:43+08:00|Hkt6GZ'
//   }
// }
// server: changeTableTags {
//   tabA: '2022-03-02T15:07:43+08:00|pDTyK1',
//   tabB: '2022-03-02T15:07:43+08:00|Hkt6GZ'
// }
// server: push
// client: beforeUpdateTableTags {
//   oldTableTags: {
//     tabA: '2022-03-02T15:07:43+08:00|pDTyK1',
//     tabB: '2020-01-01T01:00:00+08:00'
//   },
//   newTableTags: {
//     tabA: '2022-03-02T15:07:43+08:00|pDTyK1',
//     tabB: '2022-03-02T15:07:43+08:00|Hkt6GZ'
//   }
// }
// client: refreshState needToRefresh true
// client: getAPIData before: tabB
// client: getAPIData after: table[tabB] = 1
// client: getData {
//   tableName: 'tabB',
//   timeTag: '2022-03-02T15:07:43+08:00|Hkt6GZ',
//   data: 'table[tabB] = 1'
// }
// client: afterUpdateTableTags {
//   oldTableTags: {
//     tabA: '2022-03-02T15:07:43+08:00|pDTyK1',
//     tabB: '2022-03-02T15:07:43+08:00|Hkt6GZ'
//   },
//   newTableTags: {
//     tabA: '2022-03-02T15:07:43+08:00|DUZiKH',
//     tabB: '2022-03-02T15:07:43+08:00|Hkt6GZ'
//   }
// }
// server: changeTableTags {
//   tabA: '2022-03-02T15:07:43+08:00|DUZiKH',
//   tabB: '2022-03-02T15:07:43+08:00|Hkt6GZ'
// }
// server: push
// client: beforeUpdateTableTags {
//   oldTableTags: {
//     tabA: '2022-03-02T15:07:43+08:00|pDTyK1',
//     tabB: '2022-03-02T15:07:43+08:00|Hkt6GZ'
//   },
//   newTableTags: {
//     tabA: '2022-03-02T15:07:43+08:00|DUZiKH',
//     tabB: '2022-03-02T15:07:43+08:00|Hkt6GZ'
//   }
// }
// client: refreshState needToRefresh true
// client: getAPIData before: tabA
// client: getAPIData after: table[tabA] = 2
// client: getData {
//   tableName: 'tabA',
//   timeTag: '2022-03-02T15:07:43+08:00|DUZiKH',
//   data: 'table[tabA] = 2'
// }
// client: afterUpdateTableTags {
//   oldTableTags: {
//     tabA: '2022-03-02T15:07:43+08:00|DUZiKH',
//     tabB: '2022-03-02T15:07:43+08:00|Hkt6GZ'
//   },
//   newTableTags: {
//     tabA: '2022-03-02T15:07:43+08:00|DUZiKH',
//     tabB: '2022-03-02T15:07:43+08:00|Hkt6GZ'
//   }
// }


//node --experimental-modules srvscla.mjs
