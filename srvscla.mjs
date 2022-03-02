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

//node --experimental-modules --es-module-specifier-resolution=node srvscla.mjs
