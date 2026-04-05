const { authenticateUser } = require('../controllers/auth.controller');

const router = require('express').Router();

router.get("/auth", authenticateUser);

module.exports = router;