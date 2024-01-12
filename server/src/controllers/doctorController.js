import Sequelize from 'sequelize'
import models from '../models/index.js'

const Op = Sequelize.Op

export const index = async (req, res) => {
  const { q } = req.query
  const searchQuery = q ? {name: {[Op.like]: `%${q.replace(' ', '')}%`}} : {}
  
  try {
    const doctors = await models.User.findAll({
      where: {
        userType: 'doctor',
        ...searchQuery
      },
      include: [
        {model: models.Profile}
      ],
      attributes: {
        exclude: ['password']
      }
    })

    return res.status(200).json(doctors)
  }
  catch(e) {
    return res.status(500).json(e)
  }
}