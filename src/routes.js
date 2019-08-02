import { Router } from 'express';
import { generateAccountName, getEosInstance } from './helpers'

const routes = Router();

/**
 * GET home page
 */
routes.get('/', (req, res) => {
  res.render('index', { title: 'Express Babel' });
});

routes.post('/newaccount', async (req, res, next) => {
  const { publicKey, accountName } = req.body

  if (!publicKey) {
    return next(new Error('The "publicKey" parameter is required'))
  }

  if (!accountName) {
    accountName = generateAccountName(publicKey)
  }

  const { serviceAccount, bytesGift, netGift, cpuGift } = process.env
  const eos = getEosInstance()

  try {
    const { transaction_id } = await eos.transaction(tx => {
      tx.newaccount({
        creator: serviceAccount,
        owner: publicKey,
        active: publicKey,
        name: accountName
      })

      tx.buyrambytes({
        payer: serviceAccount,
        receiver: accountName,
        bytes: Number.parseInt(bytesGift)
      })

      tx.delegatebw({
        from: serviceAccount,
        receiver: accountName,
        stake_net_quantity: `${netGift} EOS`,
        stake_cpu_quantity: `${cpuGift} EOS`,
        transfer: 0
      })
    })

    console.log('new account', accountName, publicKey, netGift, cpuGift)

    return res.json({ accountName, transaction_id })
  } catch (error) {
    return res.json({ error: error.toString() })
  }
})

export default routes;
