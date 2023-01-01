const express = require('express')
const controllers = require('../../controllers/playerController')

const router = express.Router();

router
    .route('/')
    .get(controllers.getPlayerAll)
    .post(controllers.createPlayer)

module.exports = router
