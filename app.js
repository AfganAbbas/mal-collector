require('./config')
const execScrap = require('./lib/scrape');
const { getConnection, create } = require('./lib/db')
const cron = require('node-cron')
const express = require('express');
const dbname = process.env.DATABASE_NAME
const connection = getConnection()

// connection.connect((err) => {
//     if (err) {
//         console.log('Not connected to database');
//         throw err;
//     } else {
//         console.log('Connected to database');
//     }
// });

create(dbname) // Creating database

connection.changeUser({ database: dbname }, (err) => {
    if (err) throw new Error(err);
})

function createTable() {
    connection.query(`CREATE TABLE IF NOT EXISTS anime (
      id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
      name VARCHAR(100),
      description TEXT,
      main_image_url VARCHAR(100),
      mal_url VARCHAR(100)
    )`, (err) => {
        if (err) throw new Error(err);
        console.log('Table created/exists');
    })
}

createTable();

const app = express();

app.use(express.json())

const insertAnimeQuery = `INSERT INTO anime(name, description, main_image_url, mal_url) VALUES(?,?,?,?)`


function insertAnime(animeObj) {
    const animeArr = Object.values(animeObj)
    connection.query(insertAnimeQuery, animeArr, (err) => {
        if (err) throw new Error(err);
    });
}

const initSchedule = () => {
    let i = 1;
    const schedule = cron.schedule("*/5 * * * * *", function () {
        execScrap(i, insertAnime);
        i++;
    });

    schedule.start()
}

initSchedule();

app.get('/api/v1/anime', (req, res) => {

    connection.query('SELECT * FROM anime', function (error, results) {
        if (error) throw new Error(error);
        res.send(results)
    });

})

app.listen(process.env.CLIENT_PORT, () => {
    console.log(`App started on localhost:${process.env.CLIENT_PORT}`)
})
