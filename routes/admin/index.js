const express = require('express');
var router = express.Router();
const path = require('path');
const postService = require('../../services/postService');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('admin/index', {title: 'Admin'});
  });

router.post('/posts/', (req, res) => {
    console.log(req.files.photo);
    let photo = req.files.photo;   
    photo.mv(path.resolve(__dirname, '../../public/images/post', photo.name));

    var post = {
      title: 'Title',
      description:'Description',
      imagePath: photo.name
    };

    //postService.dropTable();
    //postService.createTable();    
    postService.insert(post);
    res.send('respond with a resource');
});

module.exports = router;