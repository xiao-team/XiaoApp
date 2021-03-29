// 起代理服务
import express from 'express'
import cors from 'cors'
const Axios = require('axios')

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded())

app.post('/api', async (req, res) => {
  const result = await Axios.get(req.body.url)
  res.json({
    code: 200,
    info: result.data
  })
})


app.listen(4848)
console.log('app.listen(4848)')