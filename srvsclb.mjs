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
// i= 1
// i= 2
// client: getAPITableTags before
// client: getAPITableTags after:  {
//   tabA: '2020-01-01T00:00:00+08:00',
//   tabB: '2020-01-01T01:00:00+08:00'
// }
// server: changeTableTags {
//   tabA: '2020-04-09T13:51:50+08:00|ReG9rQ',
//   tabB: '2020-01-01T01:00:00+08:00'
// }
// i= 3
// server: changeTableTags {
//   tabA: '2020-04-09T13:51:50+08:00|ReG9rQ',
//   tabB: '2020-04-09T13:51:51+08:00|ABX4Vo'
// }
// i= 4
// client: getAPITableTags before
// client: getAPITableTags after:  {
//   tabA: '2020-04-09T13:51:50+08:00|ReG9rQ',
//   tabB: '2020-04-09T13:51:51+08:00|ABX4Vo'
// }
// client: getAPIData before: tabA
// client: getAPIData before: tabB
// client: getAPIData after: table[tabA] = 1
// client: getAPIData after: table[tabB] = 1
// client: getData {
//   tableName: 'tabA',
//   timeTag: '2020-04-09T13:51:50+08:00|ReG9rQ',
//   data: 'table[tabA] = 1'
// }
// client: getData {
//   tableName: 'tabB',
//   timeTag: '2020-04-09T13:51:51+08:00|ABX4Vo',
//   data: 'table[tabB] = 1'
// }
// i= 5
// server: changeTableTags {
//   tabA: '2020-04-09T13:51:52+08:00|8C0lvy',
//   tabB: '2020-04-09T13:51:51+08:00|ABX4Vo'
// }
// i= 6
// client: getAPITableTags before
// client: getAPITableTags after:  {
//   tabA: '2020-04-09T13:51:52+08:00|8C0lvy',
//   tabB: '2020-04-09T13:51:51+08:00|ABX4Vo'
// }
// client: getAPIData before: tabA
// client: getAPIData after: table[tabA] = 2
// client: getData {
//   tableName: 'tabA',
//   timeTag: '2020-04-09T13:51:52+08:00|8C0lvy',
//   data: 'table[tabA] = 2'
// }
// i= 7
