import Eos from 'eosjs'

const generateAccountName = (publicKey) => {
  const account = Array.prototype.map.call(
    publicKey.substr(0, 12).toLowerCase(),
    (char) => (Number.isNaN(Number.parseInt(char, 10)) || char < 5) ? char : char - 4
  ).join('')

  return account
}

const getEosInstance = (() => {
  let eosInstance = null

  return () => {
    if (eosInstance === null) {
      eosInstance = Eos({
        chainId: process.env.chainId,
        httpEndpoint: process.env.httpEndpoint,
        keyProvider: process.env.keyProvider
      })
    }
    return eosInstance
  }
})()

module.exports = {
  generateAccountName,
  getEosInstance
}
