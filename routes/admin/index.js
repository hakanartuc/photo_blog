const express = require('express');
var router = express.Router();
const path = require('path');


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('admin/index', {title: 'Admin'});
  });

router.post('/posts/', (req, res) => {
    console.log(req.files.photo);
    let photo = req.files.photo;   
    photo.mv(path.resolve(__dirname, '../../public/images/post', photo.name));
    res.send('respond with a resource');
});

module.exports = router;