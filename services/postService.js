const Database = require('better-sqlite3');
const db = new Database(global.gConfig.database, { verbose: console.log });
var moment = require('moment'); 

class PostService{

static insert(post){
   
    const stmt = db.prepare('INSERT INTO post (title, description, imagePath, date) VALUES (@title, @description, @imagePath, @date)');
 
    stmt.run({
        title: post.title,
        description: post.description,
        imagePath: post.imagePath,
        date : moment(post.date).unix()
      });
}

static getPosts(page, count){
  
    page = page < 1 ? 1 : page;
    var offset = (page -1) * count;
    const stmt = db.prepare('SELECT * FROM post Order By date DESC,title ASC LIMIT '+ count +' OFFSET ' + offset);
    var posts = stmt.all();

    return posts;
}

static getPostCount(){
  
    const stmt = db.prepare('SELECT COUNT(*) FROM post');
    var count = stmt.all();

    return count;
}

}


module.exports = PostService;