import Sequelize, { DataTypes } from 'sequelize'
import user from './user.js'
import profile from './profile.js'

const sequelize = new Sequelize(
  process.env.DB, 
  process.env.DB_USER, 
  process.env.DB_PASS,
  {
    dialect: 'postgres'
  }
)

const models = {
  User: user(sequelize, DataTypes),
  Profile: profile(sequelize, DataTypes)
}

Object.keys(models).forEach(model => {
  if('associate' in models[model]) {
    models[model].associate(models)
  }
})

sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully')
  })
  .catch((err) => {
    console.error('Unable to connect to the database', err)
  })

export { sequelize }
export default models