import 'dotenv/config'
import app from './app.js'
import models, { sequelize } from './models/index.js'

sequelize.sync()
.then(() => {
  app.listen(process.env.PORT, () => {
    console.log('Express Running')
  })
})