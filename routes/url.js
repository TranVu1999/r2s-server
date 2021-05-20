const express = require('express');
const router = express.Router();

const {
    createUrl,
    queryUrl,
    indexpage
} = require('./../controlers/url');

router.post('/create',createUrl);
router.get('/:code',queryUrl);
router.get('/',indexpage);
module.exports = router;