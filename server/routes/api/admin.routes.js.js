const adminController = require('../../controllers/admin.controller.js');

module.exports = router => {
    router.get('/dashboard/mandalWise', adminController.mandalDashboard);
    router.get('/dashboard/mandalBus', adminController.busDashboard);
    // router.get('/regs/dashboard', regsController.getDashboard);
    // router.post('/regs/removePlayer', regsController.removePlayer);
}