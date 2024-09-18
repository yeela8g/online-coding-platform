const express = require('express');
const router = express.Router();

const {getCodeBlock, changeCodeBlock} = require('./controller.js');

router.route('/blockcode/:blockcodeId').get(getCodeBlock);
router.route('/blockcode/:blockcodeId').put(changeCodeBlock);
module.exports = router;