import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import models, { sequelize } from '../models/index.js'

export const register = async (req, res) => {
  const {name, email, password, userType, specialization, address, location, phone, workingHours} = req.body

  try {
    const hashedPassword = await bcrypt.hash(password, 8)

    const user = await models.User.create({
      name,
      email,
      password: hashedPassword,
      userType,
      latitude: location.latitude,
      longitude: location.longitude
    })

    if(userType == 'doctor') {
      const profile = await models.Profile.create({
        userId: user.id,
        specialization,
        address,
        workingHours,
        phone
      })
    }

    const token = jwt.sign({id: user.id, name: user.name, email: user.email}, process.env.JWT_SECRET)
    return res.status(200).json({accessToken: token})
  } 
  catch(error) {
    return res.status(500).json(error)
  }
}

export const login = async (req, res) => {
  const {email, password} = req.body

  try {
    const user = await models.User.findOne({where: {email}})

    if(!user) {
      return res.status(401).json({message: 'البريد الالكتروني او كلمة المرور غير صحيح'})
    }

    const authSuccess = await bcrypt.compare(password, user.password)

    if(authSuccess) {
      const token = jwt.sign({id: user.id, name: user.name, email: user.email}, process.env.JWT_SECRET)
      return res.status(200).json({accessToken: token})
    } else {
      return res.status(401).json({message: 'كلمة المرور او الايميل غير صحيح'})
    }
  }
  catch(error) {
    return res.status(500).json(error)
  }
}

export const me = (req, res) => {
  const user = req.currentUser

  return res.json(user)
}

export const getProfile = async (req, res) => {
  console.log(req.currentUser);
  try {
    const result = await models.User.findOne({
      where: {
        id: req.currentUser.id
      },
      include: [
        {model: models.Profile}
      ],
      attributes: {
        exclude: ['password']
      }
    })
    if (result){
      return res.status(200).json(result)
    } else {
      return res.status(401).json('user not found')
    }
  }
  catch(e) {
    return res.status(500).json(e)
  }
}