const IPFS = require('ipfs')
const node = new IPFS()

node.once('ready', () => {
  node.cat('QmPLnASLPk1NV6WP23MeyAwcwgDXQQQtK4mFosf6antJky', (err, data) => {
    if (err) return console.error(err)

    // convert Buffer back to string
    console.log(data.toString())
  })
})