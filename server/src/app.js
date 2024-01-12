import express from 'express'
import logger from 'morgan'
import expressValidator from 'express-validator'
import cors from 'cors'
import routes from './routes/index.js'

const app = express()

app.use(cors({origin: '*'}))
app.use(expressValidator())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/', routes)

app.use((req, res, next) => {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

app.use((err, req, res, next) => {
  return res.status(err.status || 500).json({ message: err.message })
})

export default app