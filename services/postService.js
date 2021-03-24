const Database = require("better-sqlite3");
const db = new Database(global.gConfig.database, { verbose: console.log });
const path = require("path");
var fs = require("fs");
var moment = require("moment");

class PostService {
  Create(post) {
    if (post.title == "" || post.imageName == "" || post.date == "")
      return { success: false, message: "Gerekli alanları doldurun." };

    const id = db
      .prepare(
        "INSERT INTO post (title, description, imageName, date) VALUES (@title, @description, @imageName, @date)"
      )
      .run({
        title: post.title,
        description: post.description,
        imageName: post.imageName,
        date: moment(post.date).unix(),
      }).lastInsertRowid;

    if (id < 1) return { success: false, message: "Kayıt eklenemedi." };

    this.UpdateTags(post);
    this.UpdateCategories(post);

    return { success: true, message: "Kayıt eklendi." };
  }

  Get(id) {
    var post = db.prepare("SELECT * FROM post WHERE id = ?").get(id);
    if (post == null) return null;

    var categories = db
      .prepare(
        "SELECT c.id, c.name FROM post_category pc INNER JOIN category c ON pc.category_id = c.id WHERE pc.post_id = ?"
      )
      .all(id);

    var tags = db
      .prepare(
        "SELECT t.id, t.name FROM post_tag pt INNER JOIN tag t ON pt.tag_id = t.id WHERE pt.post_id = ?"
      )
      .all(id);

    post.categories = categories;
    post.tags = tags;

    return post;
  }

  GetPosts(page, count) {
    page = page < 1 ? 1 : page;
    var offset = (page - 1) * count;
    const stmt = db.prepare(
      "SELECT * FROM post Order By date DESC,title ASC LIMIT " +
        count +
        " OFFSET " +
        offset
    );
    var posts = stmt.all();

    return posts;
  }

  GetArchive() {
    return db
      .prepare(
        'SELECT COUNT(*) as count, strftime("%m-%Y", date) as month-year FROM post GROUP BY strftime("%m-%Y", date) ORDER BY date desc'
      )
      .all();
  }

  GetPostCount() {
    const row = db.prepare("SELECT COUNT(*) as count FROM post").get();

    return row.count;
  }

  Update(post) {
    db.prepare(
      "UPDATE post SET title = @title, description = @description, date = @date WHERE id = @id"
    ).run({
      id: post.id,
      title: post.title,
      description: post.description,
      date: post.title,
    });

    this.UpdateTags(post);
    this.UpdateCategories(post);

    if (post.imageName != "") {
      var oldImageName = db
        .prepare("SELECT imageName from post WHERE id = ?")
        .all(post.id);

      this.DeleteImage(oldImageName);

      db.prepare("UPDATE post SET imageName = @imageName WHERE id = @id").run({
        id: post.id,
        imageName: post.imageName,
      });
    }

    return { success: true, message: "Kayıt güncellendi." };
  }

  UpdateTags(post) {
    db.prepare("DELETE FROM post_tag WHERE post_id = ?").run(post.id);

    if (post.tags.length > 0) {
      const insert = db.prepare(
        "INSERT INTO post_tag (post_id, tag_id) VALUES (@post_id, @tag_id)"
      );
      const insertMany = db.transaction((tags) => {
        for (const tag of tags) insert.run({ post_id: id, tag_id: tag });
      });
      insertMany(post.tags);
    }
  }

  UpdateCategories(post) {
    db.prepare("DELETE FROM post_category WHERE post_id = ?").run(post.id);

    if (post.categories.length > 0) {
      const insert = db.prepare(
        "INSERT INTO post_category (post_id, category_id) VALUES (@post_id, @category_id)"
      );
      const insertMany = db.transaction((categories) => {
        for (const category of categories)
          insert.run({ post_id: id, category_id: category });
      });
      insertMany(post.categories);
    }
  }

  Delete(id) {
    db.prepare("DELETE FROM post_tag WHERE post_id = ?").run(post.id);
    db.prepare("DELETE FROM post_category WHERE post_id = ?").run(post.id);

    var row = db.prepare("SELECT imageName FROM post WHERE id = ?").get(id);

    db.prepare("DELETE FROM post WHERE id = ?").run(id);

    this.DeleteImage(row.imageName);

    return { success: true, message: "Kayıt silindi." };
  }

  DeleteImage(imageName) {
    var fullOldPath = path.resolve(
      __dirname,
      "../../public/images/post",
      imageName
    );

    fs.stat(fullOldPath, function (err, stats) {
      if (!err) fs.unlink(fullOldPath);
    });
  }
}
module.exports = PostService;
