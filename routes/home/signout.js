const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  req.session.destroy( (error) => {
    if (!error) {
      res.redirect('/home');
    }
  });
});

module.exports = router;
