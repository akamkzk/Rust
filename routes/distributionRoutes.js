const express = require('express');
const router = express.Router();
const distributionController = require('../controllers/distributionController');
const authMiddleware = require('../middleware/auth');

router.get('/team', authMiddleware, distributionController.getMyTeam);
router.get('/commissions', authMiddleware, distributionController.getCommissionList);
router.get('/commission-stats', authMiddleware, distributionController.getCommissionStats);
router.get('/parent', authMiddleware, distributionController.getParentInfo);
router.post('/withdraw', authMiddleware, distributionController.applyWithdraw);
router.get('/withdraws', authMiddleware, distributionController.getWithdrawList);

module.exports = router;
