import jwt from 'jsonwebtoken'

const isLoggedIn = async (req, res, next) => {
  try {
    if(!req.headers.authorization) {
      return res.status(400).json({message: 'لم يتم توفير رمز الدخول'})
    }

    const token = req.headers.authorization.split(' ')[1]

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    req.currentUser = decoded
    
    next()
  }
  catch(e) {
    return res.status(500).json(e)
  }
}

export default isLoggedIn