const regsService = require('../services/regs.service');
const responseHelper = require('../utility/responseHelper');

const regsController = {};

regsController.mobileAutofill = async (req, res) => {
    var response = await regsService.mobileAutofill(req, res);
    responseHelper.sendResponse(response)
}

regsController.formDataFromMobile = async (req, res) => {
    var response = await regsService.formDataFromMobile(req, res);
    responseHelper.sendResponse(response)
}

regsController.register = async (req, res) => {
    var response = await regsService.register(req, res);
    responseHelper.sendResponse(response)
}

module.exports = regsController;