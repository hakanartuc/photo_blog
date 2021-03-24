const express = require('express');
var router = express.Router();
const path = require('path');
const postService = require('../../services/postService');

/* GET home page. */
router.get('/', function(req, res, next) {

    res.render('admin/index', {title: 'Admin',layout: 'admin'});
  });

  router.get('/post/add', function(req,res){
    res.render('admin/postadd', {title: 'Admin'});
  });

  router.get('/posts', function(req, res, next) {
    let page = req.query.page || 1;    
    let count = postService.getPostCount();
    let pageCount = Math.ceil(count / 25);

    var posts = postService.getPosts(page,25);   
       res.render('admin/posts', {posts:posts, currentPage:page, pageCount:pageCount});
     });

router.post('/post/add', (req, res) => {
  
    let photo = req.files.photo;   
    photo.mv(path.resolve(__dirname, '../../public/images/post', photo.name));

    var post = {
      ...req.body,
      imageName: photo.name,
    };

    postService.insert(post);
    
    res.redirect('/admin/posts');
});

module.exports = router;