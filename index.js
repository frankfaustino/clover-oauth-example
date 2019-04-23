require('dotenv').config()
const axios = require('axios')
const express = require('express')

const TARGET_ENV = 'https://www.clover.com' // Production
// const TARGET_ENV = 'https://sandbox.dev.clover.com' // Sandbox

const { PROD_APP_ID, PROD_APP_SECRET, SANDBOX_APP_ID, SANDBOX_APP_SECRET } = process.env

const app = express()

app.get('/', (req, res) => authenticate(req, res))

const authenticate = async (req, res) => {
  const URL = `${TARGET_ENV}/oauth/authorize?client_id=${PROD_APP_ID}&state=testing123`

  req.query.code ? await requestAPIToken(res, req.query) : await res.redirect(URL)
}

const requestAPIToken = async (res, code) => {
  const URL = `${TARGET_ENV}/oauth/token?client_id=${PROD_APP_ID}&client_secret=${PROD_APP_SECRET}&code=${code}`

  const response = await axios
    .get(URL)
    .catch(err => res.send(err.message))
  
  if (response && response.data) {
    res.send(response.data)
  }
}

const PORT = process.env.PORT || 8000

app.listen(PORT, () => console.log(`🤖 Express server listening on port ${PORT}`))
