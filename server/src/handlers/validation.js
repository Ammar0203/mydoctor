const showValidationErrors = (req, res, next) => {
  const errors = req.validationErrors()
  if (errors) {
    const errorsArray = errors.map(err => err.msg)
    return res.status(422).json({message: errorsArray})
  }

  next()
}

const validate = cb => {
  return function (req, res, next) {
    cb(req, res);
    showValidationErrors(req, res, next)
  }
}

export default validate