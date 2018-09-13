import { Router } from 'express';
import { generateAccountName, getEosInstance } from './helpers'

const routes = Router();

/**
 * GET home page
 */
routes.get('/', (req, res) => {
  res.render('index', { title: 'Express Babel' });
});

routes.post('/newaccount', async (req, res) => {
  const { publicKey } = req.body

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

/**
 * GET /list
 *
 * This is a sample route demonstrating
 * a simple approach to error handling and testing
 * the global error handler. You most certainly want to
 * create different/better error handlers depending on
 * your use case.
 */
routes.get('/list', (req, res, next) => {
  const { title } = req.query;

  if (title == null || title === '') {
    // You probably want to set the response HTTP status to 400 Bad Request
    // or 422 Unprocessable Entity instead of the default 500 of
    // the global error handler (e.g check out https://github.com/kbariotis/throw.js).
    // This is just for demo purposes.
    next(new Error('The "title" parameter is required'));
    return;
  }

  res.render('index', { title });
});

export default routes;
