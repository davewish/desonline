/**
 * Error handling middleware
 */
export const errorHandler = (err, req, res, next) => {
  console.error(err)

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: err.message,
    })
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized',
    })
  }

  if (err.name === 'ForbiddenError') {
    return res.status(403).json({
      success: false,
      message: 'Forbidden',
    })
  }

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  })
}

/**
 * 404 Not Found handler
 */
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Not Found',
  })
}
