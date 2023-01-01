const router = require('express').Router()
// const auth = require('../auth')

// Authentication
// router.use('/auth', require('./auth'))

// Model
router.use('/players', require('./player'))
// router.use('/company', auth.required(['admin', 'staff']), require('./company'))
// router.use('/media', auth.required(), require('./media'))


// Test
// router.use('/test', require('./test'))
// router.use('/test/media', auth.tester(), require('./media'))
// router.use('/test/user', auth.tester(), require('./user'))

module.exports = router