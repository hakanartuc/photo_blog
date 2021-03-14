const Database = require('better-sqlite3');
const db = new Database(global.gConfig.database, { verbose: console.log });
var moment = require('moment');

class PostService {

    static Create(post) {

        if (post.title == '' || post.imagePath == '' || post.date == '')
            return { success: false, message: "Gerekli alanları doldurun." };

        const id = db.prepare('INSERT INTO post (title, description, imagePath, date) VALUES (@title, @description, @imagePath, @date)')
            .run({
                title: post.title,
                description: post.description,
                imagePath: post.imagePath,
                date: moment(post.date).unix()
            })
            .lastInsertRowid;

        if (id < 1)
            return { success: false, message: "Kayıt eklenemedi." };

        if (post.categories.length > 0) {

            const insert = db.prepare('INSERT INTO post_category (post_id, category_id) VALUES (@post_id, @category_id)');
            db.transaction((categories) => {
                for (const category of post.categories) insert.run({ post_id: id, category_id: category });
            });

        }

        if (post.categories.length > 0) {

            const insert = db.prepare('INSERT INTO post_category (post_id, category_id) VALUES (@post_id, @category_id)');
            const insertMany = db.transaction((categories) => {
                for (const category of categories) insert.run({ post_id: id, category_id: category });
            });
            insertMany(post.categories);
        }

        if (post.tags.length > 0) {

            const insert = db.prepare('INSERT INTO post_tag (post_id, tag_id) VALUES (@post_id, @tag_id)');
            const insertMany = db.transaction((tags) => {
                for (const tag of tags) insert.run({ post_id: id, tag_id: tag });
            });
            insertMany(post.tags);
        }
    }

    static getPosts(page, count) {

        page = page < 1 ? 1 : page;
        var offset = (page - 1) * count;
        const stmt = db.prepare('SELECT * FROM post Order By date DESC,title ASC LIMIT ' + count + ' OFFSET ' + offset);
        var posts = stmt.all();

        return posts;
    }

    static getPostCount() {

        const stmt = db.prepare('SELECT COUNT(*) FROM post');
        var count = stmt.all();

        return count;
    }

}


module.exports = PostService;