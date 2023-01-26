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
                        '_id': 1,
                        'createdAt': 1,
                        'sampark._id': 1,
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
                        'sampark.Joining Date': 1,
                        'sampark.Birth Date': 1
                    }
                }, {
                    '$lookup': {
                        'from': 'ssl_2022_registerations',
                        'localField': 'sampark.Mobile',
                        'foreignField': 'mobileNo',
                        'as': 'sslData'
                    }
                }, {
                    '$project': {
                        'transport': 1,
                        'isNew': 1,
                        'seva': 1,
                        '_id': 1,
                        'createdAt': 1,
                        'sampark': 1,
                        'sslRegistered': {
                            '$size': '$sslData'
                        }
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



regsService.deRegisterMember = async (req, res) => {
    try {
        var samparkId;
        if (req.body.isNew && req.body.isNew == 'Yes') {
            var sampark = await samparkSchema.findOne({ 'Mobile': req.body.mobileNo, 'In Groups': 'HPYM2023_NEW' });
            samparkId = sampark.id || null;
            await samparkSchema.deleteOne({ _id: mongoose.Types.ObjectId(samparkId) });
        }
        else {
            var sampark = await samparkSchema.findOne({ 'Mobile': req.body.mobileNo });
            samparkId = sampark.id || null;
        }
        var rec = await registerationModel.deleteOne({ samparkId: mongoose.Types.ObjectId(samparkId) })
        // var totalRecords = await samparkSchema.distinct('Sabha', { 'Gender': req.query.gender });
        return { statusCode: 200, message: 'Sabha list', data: rec, res }
    } catch (e) {
        return { statusCode: 500, message: 'Internal Server Error', data: '', res, error: e }
    }
}


regsService.updateSeva = async (req, res) => {
    try {
        if (isNaN(Number.parseInt(req.body.seva))) {
            return { statusCode: 400, message: 'Invalid Seva', data: '', res }
        }
        var resp = await registerationModel.updateOne({ _id: mongoose.Types.ObjectId(req.body.id) }, { $set: { 'seva': req.body.seva } })
        return { statusCode: 200, message: 'Seva Updated', data: resp, res }
    } catch (e) {
        return { statusCode: 500, message: 'Internal Server Error', data: '', res, error: e }
    }
}

regsService.updateTransport = async (req, res) => {
    try {
        var resp = await registerationModel.updateOne({ _id: mongoose.Types.ObjectId(req.body.id) }, { $set: { 'transport': req.body.transport } })
        return { statusCode: 200, message: 'Transport Updated', data: resp, res }
    } catch (e) {
        return { statusCode: 500, message: 'Internal Server Error', data: '', res, error: e }
    }
}

// samparkSchema.aggregate(
//     [
//         {
//             '$group': {
//                 '_id': {
//                     'name': '$Full Name',
//                     'sabha': '$Sabha'
//                 },
//                 'total': {
//                     '$sum': 1
//                 }
//             }
//         }, {
//             '$match': {
//                 '_id': {
//                     '$ne': null
//                 },
//                 'total': {
//                     '$gt': 1
//                 }
//             }
//         }, {
//             '$project': {
//                 'name': '$_id',
//                 'total': 1,
//                 '_id': 0
//             }
//         }
//     ]).exec().then(async d => {
//         console.log(d.filter(dd => dd.total > 1).length);
//         for (const user of d) {
//             var sam = await samparkSchema.find({ 'Full Name': user.name.name.trim() }, { 'Full Name': 1, 'Mobile': 1, 'Sabha': 1, 'In Groups': 1 })
//             var ingroup = sam.find(s => s['In Groups'] == 'HPYM2023_NEW');
//             if (ingroup) {
//                 console.log(sam);
//             }
//         }
//     })

// registerationModel.aggregate([
//     {
//         '$lookup': {
//             'from': 'samparks',
//             'localField': 'samparkId',
//             'foreignField': '_id',
//             'as': 'sampark'
//         }
//     }, {
//         '$match': {
//             'sampark.In Groups': 'HPYM2023_NEW'
//         }
//     }, {
//         '$unwind': {
//             'path': '$sampark'
//         }
//     }, {
//         '$project': {
//             '_id': 1,
//             'sampark._id': 1,
//             'sampark.First Name': 1,
//             'sampark.Last Name': 1,
//             'sampark.Mobile': 1,
//             'sampark.In Groups': 1
//         }
//     }
// ]).exec().then(async (d) => {
//     // all new regs
//     var allNewNums = (d.map(dd => dd.sampark['Mobile'] = dd.sampark['Mobile'].indexOf(0) == '0' ? dd.sampark['Mobile'].substring(1) : dd.sampark['Mobile']));

//     var allOldSame = await samparkSchema.find({ 'Mobile': { $in: allNewNums }, 'In Groups': { $ne: 'HPYM2023_NEW' } });
//     var oldIdsToBeAdded = allOldSame.map(o => o.id);
//     var oldNumbers = allOldSame.map(o => o.Mobile);
//     // console.log(oldIdsToBeAdded);

//     for (var n of d) {
//         if (oldNumbers.includes(n.sampark['Mobile'].indexOf(0) == '0' ? n.sampark['Mobile'].substring(1) : n.sampark['Mobile'])) {
//             console.log('dupes ', n.sampark['First Name'], n.sampark['Mobile'], 'Old Id: ', n._id);
//             var existingId = (allOldSame.find(a => a['Mobile'] == n.sampark['Mobile'])._id);
//             console.log('dupes old', existingId)
//             // var regUpdates = await registerationModel.updateOne({ _id: n._id }, { $set: { samparkId: existingId, isNew: false } });
//             // console.log(regUpdates)
//         }
//     }

// }).catch(e => {

// })

// //Delete starting with 0 || 11 digit number check
// samparkSchema.find({
//     'Mobile': { $exists: true }, 'In Groups': 'HPYM2023_NEW',
//     $expr: { $gt: [{ $strLenCP: '$Mobile' }, 10] }
// }).then(s => {
//     console.log('11 Digit num', s);
//     for (const mem of s) {
//         if (mem['Mobile'].startsWith('0')) {
//             // console.log(mem['Mobile'])
//             // mem.delete();
//         }
//     }
// });

// samparkSchema.aggregate([
//     {
//         '$group': {
//             '_id': '$Mobile',
//             'ids': {
//                 '$push': '$_id'
//             },
//             'totalIds': {
//                 '$sum': 1
//             }
//         }
//     }, {
//         '$match': {
//             'totalIds': {
//                 '$gt': 1
//             }
//         }
//     }, {
//         '$project': {
//             '_id': false,
//             'documentsThatHaveDuplicatedValue': '$ids'
//         }
//     }
// ]).exec().then(async (s) => {
//     console.log(s.length);
//     var arrays = s.map(a => {
//         return a.documentsThatHaveDuplicatedValue;
//     })

//     var arr2 = [].concat(...arrays);

//     console.log(arr2.length)

//     // change find to delete
//     var news = await samparkSchema.find({ _id: { $in: arr2 }, 'In Groups': 'HPYM2023_NEW' });
//     console.log('duplicate mobile new', news);


// })


//move new to old in regs table
// registerationModel.aggregate([
//     {
//         '$lookup': {
//             'from': 'samparks',
//             'localField': 'samparkId',
//             'foreignField': '_id',
//             'as': 'sampark'
//         }
//     }, {
//         '$match': {
//             'sampark.In Groups': {
//                 '$ne': 'HPYM2023_NEW'
//             },
//             'isNew': true
//         }
//     }
// ]).exec().then(async (r) => {
//     console.log('isnew', r.map(d => d['_id']));
//     // var res = await registerationModel.updateMany({ _id: { $in: r.map(d => d['_id']) } }, { $set: { 'isNew': false } })
//     // console.log('update d ', res);
// })

var xlsx = require('node-xlsx');
var fs = require('fs');
var mongoXlsx = require('mongo-xlsx');

// // Find Duplicate by names to excel
// samparkSchema.find({
//     // $and: [
//     //     {'First Name':{'$regex' : 'yash', '$options' : 'i'}},{'Middle Name':{'$regex' : 'suresh', '$options' : 'i'}},{'Last Name':{'$regex' : 'soni', '$options' : 'i'}}
//     //     // ,{'Sabha'}
//     // ]
// }).skip().exec().then(data => {
//     console.log(data.length);
//     /* Generate automatic model for processing (A static model should be used) */
//     var model = [
//         {
//             "displayName": "User Identifier",
//             "access": "id",
//             "type": "string"
//           },
//           {
//             "displayName": "First Name",
//             "access": "First Name",
//             "type": "string"
//           },
//           {
//             "displayName": "Middle Name",
//             "access": "Middle Name",
//             "type": "string"
//           },
//           {
//             "displayName": "Last Name",
//             "access": "Last Name",
//             "type": "string"
//           },
//           {
//             "displayName": "Full Name",
//             "access": "Full Name",
//             "type": "string"
//           },
//           {
//             "displayName": "Mobile",
//             "access": "Mobile",
//             "type": "string"
//           },
//           {
//             "displayName": "Sabha",
//             "access": "Sabha",
//             "type": "string"
//           },
//           {
//             "displayName": "Birth Date",
//             "access": "Birth Date",
//             "type": "string"
//           },
//           {
//             "displayName": "In Groups",
//             "access": "In Groups",
//             "type": "string"
//           },
//           {
//             "displayName": "Gender",
//             "access": "Gender",
//             "type": "string"
//           }
//     ]

//     /* Generate Excel */
//     mongoXlsx.mongoData2Xlsx(data, model,{path:'./'}, function (err, data) {
//         console.log(err);
//         console.log('File saved ');
//     });

// })


const excelToDB = async () => {

    var obj = xlsx.parse('./sym_dump_22_12_22.xlsx'); // parses a file
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

    console.log(jsonMembers.length);

    var newcount = 0;
    // for (const mem of jsonMembers) {

    //     var existing = await samparkSchema.findOne({ 'Member Id': mem['Member Id'], 'In Groups': { $ne: 'HPYM2023_NEW' } });
    //     if (!existing) {
    //         await samparkSchema.create(mem);
    //         newcount++;
    //         console.log("New Entry : " + mem['Full Name'] + " Mandal: " + mem["Sabha"]);
    //     }
    // }
    // console.log('New Entries: ' + newcount);
    // samparkSchema.insertMany(jsonMembers);
}

// excelToDB()
module.exports = regsService;