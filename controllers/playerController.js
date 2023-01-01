const catchAsync = require("../utils/catchAsync")
var { api: logger, apiOutPut: loggerOut } = require("../services/logger")
const db = require('../db/index')
const { player } = db

exports.getPlayerAll = catchAsync(async (req, res, next) => {
  info = await player.findAll()
  if (!info) {
    return next();
  }
  loggerOut.info('show player success')
  logger.info("show player success")
  res.send(info)
})

exports.createPlayer = catchAsync(async (req, res, next) => {
  data  =  req.body;
  info =  await player.create({
    name: data.name,
    age: data.age,
    position: data.position,
    profileImage: data.profileImage,
    tid: data.tid,
  });
  if (!info) {
    return next();
  }
  loggerOut.info('create success')
  logger.info("create success")
  res.status(200).send(info);
});