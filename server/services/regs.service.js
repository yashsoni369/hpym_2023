const logger = require('../utility/logger').logger;
const registerationModel = require('../models/registeration')
const samparkSchema = require('../models/sampark');
const mongoose = require('mongoose')

const regsService = {};

// { 'Full Name': 1, 'Mobile': 1, 'Ref Name': 1, 'FollowUp Name': 1, 'Gender': 1, 'Sabha': 1,'Email':1,'Attending Sabha':1}
regsService.mobileAutofill = async (req, res) => {
    try {
        var mob = req.query.mobileNo;
        if (mob && mob.length >= 3 && mob.length <= 10) {
            var predictions = await samparkSchema.find({ "Mobile": new RegExp('.*' + mob + '.*') }, { 'Full Name': 1, 'Mobile': 1 });
            return { statusCode: 200, message: 'Mobile autofill', data: predictions, res }
        }
        return { statusCode: 404, message: 'No Data found', data: '', res }
    } catch (e) {
        return { statusCode: 500, message: 'Internal Server Error', data: '', res, error: e }

    }
}

regsService.nameAutoFill = async (req, res) => {
    try {
        var name = req.query.name;
        if (name && name.length >= 3) {
            var predictions = await samparkSchema.find({ 'Full Name': { $regex: name.toLowerCase(), "$options": "i" } }, { 'Full Name': 1, 'Mobile': 1, 'Sabha': 1 });
            return { statusCode: 200, message: 'Mobile autofill', data: predictions, res }
        }
        return { statusCode: 404, message: 'No Data found', data: '', res }
    } catch (e) {
        return { statusCode: 500, message: 'Internal Server Error', data: '', res, error: e }

    }
}

regsService.formDataFromMobile = async (req, res) => {
    try {
        var mob = req.query.mobileNo;
        if (mob && mob.length == 10) {
            const id = await alreadyRegistered(req.body.Mobile);
            if (id != 0) {
                return { statusCode: 400, message: 'Member already Registered', data: '', res }
            }
            var member = await samparkSchema.find({ "Mobile": mob }, { 'First Name': 1, 'Middle Name': 1, 'Last Name': 1, 'Mobile': 1, 'Ref Name': 1, 'FollowUp Name': 1, 'Gender': 1, 'Sabha': 1, 'Email': 1, 'Attending Sabha': 1, 'Birth Date': 1 });
            return { statusCode: 200, message: 'Full Details', data: member, res }
        }
        return { statusCode: 404, message: 'No Data found', data: '', res }
    } catch (e) {
        return { statusCode: 500, message: 'Internal Server Error', data: '', res, error: e };
    }
}

regsService.register = async (req, res) => {
    try {
        const id = await alreadyRegistered(req.body.Mobile);
        if (id == 0) {
            var samparkId = req.body.samparkId || '';
            if (req.body.isNew == true) {
                samparkId = await createSamparkEntry(req.body);
            }
            // var lastId = await getLastSSLId();
            var reg = await registerMember(req.body, samparkId);
            if (reg) {
                return { statusCode: 200, message: 'Register Successful', data: reg, res }
            }
            else {
                logger.error(reg);
                return { statusCode: 500, message: 'Error registering player', data: '', res }
            }
        }
        else {
            logger.info('Member Already Registered');
            return { statusCode: 400, message: 'Member already Registered', data: '', res }
        }
    } catch (e) {
        logger.error('Registeration ERror ', e);
        console.log("error", e);
        return { statusCode: 500, message: 'Internal Server Error', data: '', res, error: e }
    }
}

const createSamparkEntry = async (data) => {
    try {
        data['Full Name'] = data['First Name'] + ' ' + data['Middle Name'] + ' ' + data['Last Name'];
        data.isNew ? data['In Groups'] = 'HPYM2023_NEW' : '';
        const member = await samparkSchema.create(data);
        return member.id;
    } catch (error) {
        return null;
    }
}

const registerMember = async (data, samparkId) => {
    try {
        data.samparkId = mongoose.Types.ObjectId(samparkId);
        data.seva = 0;
        const member = await registerationModel.create(data);
        return member;
    } catch (error) {
        return null;
    }
}

const alreadyRegistered = async (mobileNo) => {
    try {
        var samparkData = await samparkSchema.findOne({ Mobile: mobileNo }, { id: 1 });
        if (samparkData) {
            console.log(samparkData);

            var player = await registerationModel.findOne({ samparkId: mongoose.Types.ObjectId(samparkData.id) }, { id: 1 });
            console.log(player);
            if (player != null) {
                return player.id;
            }
            return 0;
        }
        else {
            return 0;
        }
    } catch (error) {
        return 0;
    }
}

// Admin

regsService.getAll = async (req, res) => {
    try {
        var regs = await registerationModel.aggregate(
            [
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
                        'transport': 1,
                        'isNew': 1,
                        'seva': 1,
                        'sampark.First Name': 1,
                        'sampark.Middle Name': 1,
                        'sampark.Last Name': 1,
                        'sampark.Ref Name': 1,
                        'sampark.Sabha': 1,
                        'sampark.Attending Sabha': 1,
                        'sampark.Mobile': 1,
                        'sampark.FollowUp Name': 1,
                        'sampark.Gender': 1,
                        'sampark.Email': 1,
                        'sampark.% Present': 1,
                        'sampark.Joining Date': 1
                    }
                }
            ]
        ).sort({ createdAt: 1 }).exec()
        var totalRecords = await registerationModel.countDocuments({});
        return { statusCode: 200, message: 'Registerations List', data: { regs, totalRecords }, res }
    } catch (e) {
        return { statusCode: 500, message: 'Internal Server Error', data: '', res, error: e }
    }
}

regsService.getSabhaList = async (req, res) => {
    try {

        var totalRecords = await samparkSchema.distinct('Sabha', { 'Gender': req.query.gender });
        return { statusCode: 200, message: 'Sabha list', data: totalRecords.filter(s => s != "" && (req.query.gender == 'Male' ? !s.includes('Yuvati') : s)), res }
    } catch (e) {
        return { statusCode: 500, message: 'Internal Server Error', data: '', res, error: e }
    }
}

// .sort({ createdAt: -1 })
//             .skip(req.params.skip)
//             .limit(req.params.take).exec();

const excelToDB = () => {
    var xlsx = require('node-xlsx');

    var obj = xlsx.parse('./sym.xlsx'); // parses a file
    // console.log(obj[0].data[0]);
    var keys = obj[0].data.shift();
    let memberobj = keys.reduce(function (acc, curr) {
        acc[curr] = '';
        return acc;
    }, {});

    console.log(memberobj);
    var allMembers = obj[0].data

    jsonMembers = [];
    for (let j = 0; j < allMembers.length; j++) {
        var obj = {};
        for (let i = 0; i < keys.length; i++) {

            obj[keys[i]] = allMembers[j][i]
        }

        jsonMembers.push(obj);
    }

    // console.log(jsonMembers);

    // reg.insertMany(jsonMembers);
}

module.exports = regsService;