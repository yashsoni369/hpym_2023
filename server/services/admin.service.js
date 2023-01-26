const logger = require('../utility/logger').logger;
const registerationModel = require('../models/registeration')
const samparkSchema = require('../models/sampark');
const mongoose = require('mongoose')

const adminService = {};

adminService.regsByMandal = async (req, res) => {
  try {
    var dash = await registerationModel.aggregate([
      {
        '$lookup': {
          'from': 'samparks',
          'localField': 'samparkId',
          'foreignField': '_id',
          'as': 'sampark'
        }
      }, {
        '$unwind': {
          'path': '$sampark'
        }
      }, {
        '$project': {
          'sampark.Sabha': 1,
          'isNew': 1,
          'newMember': {
            '$cond': [
              {
                '$eq': [
                  '$isNew', true
                ]
              }, 1, 0
            ]
          },
          'oldMember': {
            '$cond': [
              {
                '$eq': [
                  '$isNew', false
                ]
              }, 1, 0
            ]
          }
        }
      }, {
        '$group': {
          '_id': '$sampark.Sabha',
          'New': {
            '$sum': '$newMember'
          },
          'Existing': {
            '$sum': '$oldMember'
          }
        }
      }
    ]);
    return { statusCode: 200, message: 'Regs Dashboard', data: dash, res }
  } catch (e) {
    return { statusCode: 500, message: 'Internal Server Error', data: '', res, error: e }
  }
}

adminService.busCountData = async (req,res) =>{
  try {
    var dash = await registerationModel.aggregate([
      {
        '$lookup': {
          'from': 'samparks', 
          'localField': 'samparkId', 
          'foreignField': '_id', 
          'as': 'sampark'
        }
      }, {
        '$unwind': {
          'path': '$sampark'
        }
      }, {
        '$project': {
          'sampark.Sabha': 1, 
          'isNew': 1, 
          'transport': 1, 
          'byBus': {
            '$cond': [
              {
                '$eq': [
                  '$transport', 'Bus'
                ]
              }, 1, 0
            ]
          }, 
          'bySelf': {
            '$cond': [
              {
                '$eq': [
                  '$transport', 'Self'
                ]
              }, 1, 0
            ]
          }
        }
      }, {
        '$group': {
          '_id': '$sampark.Sabha', 
          'byBus': {
            '$sum': '$byBus'
          }, 
          'bySelf': {
            '$sum': '$bySelf'
          }
        }
      }
    ]);
    return { statusCode: 200, message: 'Bus Dashboard', data: dash, res }
  } catch (e) {
    return { statusCode: 500, message: 'Internal Server Error', data: '', res, error: e }
  }
}

module.exports = adminService;