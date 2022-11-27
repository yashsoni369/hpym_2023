const regsController = require('../../controllers/regs.controller');

module.exports = router => {
    router.get('/regs/autofill', regsController.mobileAutofill);
    router.get('/regs/autofillName', regsController.nameAutofill);
    router.get('/regs/formData', regsController.formDataFromMobile);
    router.post('/regs/register', regsController.register);
    router.get('/regs', regsController.getAll);
    // router.get('/regs/registerations', regsController.getRegisterations);
    // router.get('/regs/dashboard', regsController.getDashboard);
    // router.post('/regs/removePlayer', regsController.removePlayer);
}