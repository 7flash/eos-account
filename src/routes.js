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
  const { publicKey } = req.body

  if (!publicKey) {
    return next(new Error('The "publicKey" parameter is required'))
  }

  const serviceAccount = process.env.serviceAccount
  const eos = getEosInstance()

  const accountName = generateAccountName(publicKey)

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
        bytes: 8192
      })
    })

    return res.json({ accountName, transaction_id })
  } catch (error) {
    return res.json({ error: error.toString() })
  }
})

export default routes;
