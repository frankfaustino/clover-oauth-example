require('dotenv').config()
const axios = require('axios')
const app = require('express')()

// ⚙️ Configuration
const { APP_ID, APP_SECRET } = process.env
const PORT = process.env.PORT || 8000
const TARGET_ENV = 'https://sandbox.dev.clover.com' // Sandbox
// const TARGET_ENV = 'https://www.clover.com' // Production

// 🤖 App Endpoint (http://localhost:PORT/)
app.get('/', (_, res) => res.redirect(`${TARGET_ENV}/oauth/authorize?client_id=${APP_ID}`))

// 🤖 App Redirect Endpoint (http://localhost:PORT/oauth_callback/)
app.get('/oauth_callback', async (req, res) => {
  // 🗝 Fetch the access token
  const { data } = await axios
    .get(`${TARGET_ENV}/oauth/token?client_id=${APP_ID}&client_secret=${APP_SECRET}&code=${req.query.code}`)
    .catch(err => res.send(err.message))
  
  if (data && data.access_token) {
    console.log('ACCESS TOKEN: ' + data.access_token)
    res.send(data)
  }
})

app.listen(PORT, () => console.log(`🤖 Express server listening on port ${PORT}`))
