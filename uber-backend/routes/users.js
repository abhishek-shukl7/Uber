const express = require('express');
const router = express.Router();

router.get('/ping', (req, res) => {
  res.json({ msg: 'pong' });
});

module.exports = router;
