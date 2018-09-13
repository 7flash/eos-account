import request from 'supertest';
import app from '../src/app.js';

import dotenv from 'dotenv'
dotenv.config()

jest.setTimeout(30000)

describe('POST /newaccount', () => {
  const publicKey = 'EOS5K6c6VUoFp66t8MTsbddTSxHRtj46ABZsMQ96q1YdobptmURyA'
  const accountName = 'eos1k2c2vuof'

  let response = null

  beforeAll(async () => {
    response =
      await request(app)
        .post('/newaccount')
        .send({ publicKey })
        .expect(200)
  })

  it('should return name of created account', async () => {
    const result = JSON.parse(response.res.text)

    expect(result.accountName).toBe(accountName)
    expect(typeof result.transaction_id).toBe('string')
  })
})
