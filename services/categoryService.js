const Database = require('better-sqlite3');
const db = new Database(global.gConfig.database, { verbose: console.log });

class CategoryService {

    Create(category) {

        if (category.name == '')
            return { success: false, message: "Bu kategori adı gereklidir." };


        const row = db.prepare('SELECT COUNT(*) as count FROM category where name = ? ').get(category.name);
        if (row.count > 0)
            return { success: false, message: "Bu kategori zaten ekli." };


        db.prepare('INSERT INTO category (name) VALUES (@name)').run({
            name: category.name
        });

        return { success: true, message: "Kategori eklendi." };
    }

     Update(category) {

        if (category.name == '')
            return { success: false, message: "Bu kategori adı gereklidir." };


        const row = db.prepare('SELECT COUNT(*) as count FROM category where name = @name and id != @id ')
            .get({
                id: category.id,
                name: category.name
            });

        if (row.count > 0)
            return { success: false, message: "Bu kategori zaten ekli." };


        db.prepare('UPDATE category SET name = @name WHERE id = @id').run({
            id: category.id,
            name: category.name
        });

        return { success: true, message: "Kategori güncellendi." };
    }

    Delete(id) {

        if (!id || id < 1)
            return { success: false, message: "Böyle bir kategori bulunamadı." };

        const row = db.prepare('SELECT COUNT(*) as count FROM post_category where category_id = ?')
            .get(category.id);

        if (row.count > 0)
            return { success: false, message: "Bu kategoriye bağlı postlar olduğundan silinemez." };


        db.prepare("DELETE FROM category WHERE id = ?").run(category.id);

        return { success: true, message: "Kategori silindi." };
    }
}

module.exports = CategoryService;