const { authenticateUser } = require('../controllers/auth.controller');

const router = require('express').Router();

router.post("/callback", authenticateUser);

module.exports = router;