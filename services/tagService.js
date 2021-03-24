const Database = require('better-sqlite3');
const db = new Database(global.gConfig.database, { verbose: console.log });

class TagService {

    Create(tag) {

        if (tag.name == '')
            return { success: false, message: "Etiket adı gereklidir." };


        const row = db.prepare('SELECT COUNT(*) as count FROM tag where name = ? ').get(tag.name);
        if (row.count > 0)
            return { success: false, message: "Bu etiket zaten ekli." };


        db.prepare('INSERT INTO tag (name) VALUES (?)').run(tag.name);

        return { success: true, message: "etiket eklendi." };
    }

    Update(tag) {

        if (tag.name == '')
            return { success: false, message: "Etiket adı gereklidir." };


        const row = db.prepare('SELECT COUNT(*) as count FROM tag where name = @name and id != @id ')
            .get({
                id: tag.id,
                name: tag.name
            });

        if (row.count > 0)
            return { success: false, message: "Bu etiket zaten ekli." };


        db.prepare('UPDATE tag SET name = @name WHERE id = @id')
        .run({
            id: tag.id,
            name: tag.name
        });

        return { success: true, message: "Etiket güncellendi." };
    }

    Delete(id) {

        if (!id || id < 1)
            return { success: false, message: "Böyle bir etiket bulunamadı." };

        db.prepare("DELETE FROM post_tag WHERE tag_id = ?").run(tag.id);
        db.prepare("DELETE FROM tag WHERE id = ?").run(tag.id);

        return { success: true, message: "etiket silindi." };
    }
}