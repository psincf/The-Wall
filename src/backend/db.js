const PostgreSQL = require('pg');
const bcrypt = require('bcrypt');

var client;

const db = {
    client: client,
    init: function() {
        db.client = new PostgreSQL.Client({
            user: 'postgres',
            host: 'localhost',
            database: 'mydb',
            password: 'password',
            port: 5432,
        });
        db.client.connect();
        db.client.query('SELECT NOW()', (err, res) => {
            if (err) {
                console.log(err);
            } else {
                console.log(res.rows[0]);
            }
        })
    },
    init_database: () => {
        db.client.query(`DROP TABLE IF EXISTS users CASCADE;`, (err, res) => {
            if (err) {
                console.log(err);
            } else {
            }
        })
        
        db.client.query(`DROP TABLE IF EXISTS comments CASCADE;`, (err, res) => {
            if (err) {
                console.log(err);
            } else {
            }
        })
        
        db.client.query(`DROP TABLE IF EXISTS messages CASCADE;`, (err, res) => {
            if (err) {
                console.log(err);
            } else {
            }
        })
        
        db.client.query(`CREATE TABLE IF NOT EXISTS users(
                id BIGSERIAL PRIMARY KEY,
                username varchar(40) UNIQUE,
                password_hash varchar(64),
                salt varchar(32)
            );`, (err, res) => {
            if (err) {
                console.log(err);
            } else {
            }
        })
        
        db.client.query(`CREATE TABLE IF NOT EXISTS comments(
                id BIGSERIAL PRIMARY KEY,
                message varchar(255),
                author bigint REFERENCES users,
                date bigint,
                comment_ids bigint[],
                likes bigint[],
                dislikes bigint[]
            );`, (err, res) => {
            if (err) {
                console.log(err);
            } else {
            }
        })
        
        db.client.query(`CREATE TABLE IF NOT EXISTS messages(
                id BIGSERIAL PRIMARY KEY,
                message varchar(255),
                author bigint REFERENCES users,
                date bigint,
                comment_ids bigint[],
                likes bigint[],
                dislikes bigint[]
            );`, (err, res) => {
            if (err) {
                console.log(err);
            } else {
            }
        })

        createSomeUsers(db).then(
            () => { createSomeMessages(db); }
        );
    },
    getTableUsers: () => {
        db.client.query(`
            SELECT *
            FROM users;`
        , (err, res) => {
            if (err) {
                console.log(err);
            } else {
                console.log(res.rows);
            }
        });
    },
    getTableMessages: async () => {
        const query = await db.client.query(`
            SELECT *
            FROM messages;`
        );
        return query.rows;
    },
    getTableMessagesCount: async (count, user_id) => {
        const query = await db.client.query(`
        WITH last_messages AS(
            SELECT m.id, m.message, u.username AS author, m.date, m.comment_ids, array_length(m.likes, 1) AS likes, array_length(m.dislikes, 1) AS dislikes,
            bool_and(
                likes IS NOT NULL AND '` + user_id + `' = ANY(likes)
            ) AS liked,
            bool_and(
                dislikes IS NOT NULL AND '` + user_id + `' = ANY(dislikes)
            ) AS disliked
            FROM messages AS m LEFT OUTER JOIN users AS u ON m.author=u.id
            GROUP BY m.id, u.username
            ORDER BY m.date DESC
            LIMIT ` + count + `
        )
        SELECT *
        FROM last_messages
        ORDER BY date ASC;`
        );
        return query.rows;
    },
    insertUser: async function(username, password) {
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);
        try {
            await db.client.query(`
                INSERT INTO users(username, password_hash, salt)
                VALUES('` + username + "','" + password_hash + "','" + salt + "');"
            )
        } catch(err) {
            return false;
        }
        return true;
    },
    insertMessage: function(message, author, date) {
        message = message.replaceAll("'", "''");
        db.client.query(`
            INSERT INTO messages(message, author, date)
            VALUES('` + message + "','" + author + "','" + date.getTime() + "');"
        , (err, res) => {
            if (err) {
                console.log(err);
            } else {
                
            }
        })
    },
    getLikeCount: async function(message_id) {
        const query = await db.client.query(`
            SELECT COUNT(likes)
            FROM messages
            WHERE id=`+message_id+`;`
        );
        return query.rows;
    },
    getLikes: function(message_id) {
        db.client.query(`
            SELECT likes FROM messages
            WHERE id=` + message_id + ";"
        , (err, res) => {
            if (err) {
                console.log(err);
            } else {
                console.log(res.rows);
            }
        })
    },
    unsetLike: function(user_id, message_id) {
        db.client.query(`
            UPDATE messages SET likes = array_remove(likes, ` + user_id + `::bigint)
            WHERE id = ` + message_id + `;`
        , (err, res) => {
            if (err) {
                console.log(err);
            } else {

            }
        })
    },
    setLike: function(user_id, message_id) {
        db.client.query(`
        UPDATE messages SET likes = array_append(likes, ` + user_id + `::bigint)
            WHERE id = ` + message_id +` AND (likes IS NULL OR NOT '` + user_id + `' = ANY(likes));`
        , (err, res) => {
            if (err) {
                console.log(err);
            } else {

            }
        })
    },
    unsetDislike: function(user_id, message_id) {
        db.client.query(`
            UPDATE messages SET dislikes = array_remove(dislikes, ` + user_id + `::bigint)
            WHERE id = ` + message_id + `;`
        , (err, res) => {
            if (err) {
                console.log(err);
            } else {

            }
        })
    },
    setDislike: function(user_id, message_id) {
        db.client.query(`
            UPDATE messages SET dislikes = array_append(dislikes, ` + user_id + `::bigint)
            WHERE id = ` + message_id +` AND (dislikes IS NULL OR NOT '` + user_id + `' = ANY(dislikes));`
        , (err, res) => {
            if (err) {
                console.log(err);
            } else {

            }
        })
    },
    getUser: async function(username) {
        var query = await db.client.query(`
            SELECT id,username, password_hash, salt
            FROM users
            WHERE username = '` + username + "';"
        ,);
        if (query.rows.length == 1) { return query.rows[0] }
        return false;
    },
    checkUserPassword: async function(username, password) {
        const user = await this.getUser(username);
        if (user) {
            const result = await bcrypt.compare(password, user.password_hash);
            if (result) { return user.id }
            else { return -1 }
        }
    }
}

async function createSomeUsers(db) {
    await db.insertUser("John", "aaa");
    await db.insertUser("David", "aaa");
    await db.insertUser("Fred", "aaa");
    await db.insertUser("James", "aaa");
    await db.insertUser("Anna", "aaa");
    await db.insertUser("Mary", "aaa");
}

function createSomeMessages(db) {
    db.insertMessage("Hi!!", 2, new Date(Date.UTC(2022, 03, 25, 10, 30)))
    db.insertMessage("Hey!!", 1, new Date(Date.UTC(2022, 03, 25, 10, 32)))
    db.insertMessage("What's up?", 5, new Date(Date.UTC(2022, 03, 25, 10, 33)))
    db.setLike(1, 1);
    db.setLike(2, 1);
    db.setLike(3, 1);
    db.insertMessage("Just a test", 6, new Date(Date.UTC(2022, 03, 25, 10, 34)))
    db.insertMessage("That's The Wall", 4, new Date(Date.UTC(2022, 03, 25, 10, 35)))
    db.setLike(1, 5);
    db.setLike(2, 5);
    db.setLike(3, 5);
    db.setLike(4, 5);
    db.setLike(5, 5);
    db.setLike(6, 5);
}

module.exports = db;