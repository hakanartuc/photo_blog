const Database = require('better-sqlite3');
const db = new Database('photoblog_test.db', { verbose: console.log });

class PostService{

    static dropTable(){
        const stmt = db.prepare('DROP TABLE post;');
        stmt.run();
    }
    static createTable(){
        const stmt = db.prepare('CREATE TABLE post (id INTEGER PRIMARY KEY, title TEXT NOT NULL, description TEXT, imagePath TEXT NOT NULL)');
        stmt.run();
    }

static insert(post){
   
    const stmt = db.prepare('INSERT INTO post (title, description, imagePath) VALUES (@title, @description, @imagePath)');
    stmt.run({
        title: post.title,
        description: post.description,
        imagePath: post.imagePath
      });
}

}


module.exports = PostService;