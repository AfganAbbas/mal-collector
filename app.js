require('./config')
const { execScrap } = require('./lib/scrape');
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
      title TEXT,
      description TEXT,
      main_image_url TEXT,
      mal_url TEXT,
      japanese TEXT,
      english TEXT,
      type TEXT,
      episodes TEXT,
      status TEXT,
      aired TEXT,
      premiered TEXT,
      producers TEXT,
      licensors TEXT,
      studios TEXT,
      source TEXT,
      genres TEXT,
      themes TEXT,
      duration TEXT,
      rating TEXT,
      score TEXT
    )`, (err) => {
        if (err) throw new Error(err);
        console.log('Table created/exists');
    })
}

createTable();

const app = express();

app.use(express.json())

const insertAnimeQuery = `INSERT INTO anime SET ?`


function insertAnime(animeObj) {
    connection.query(insertAnimeQuery, animeObj, (err) => {
        // console.log(animeObj, 'animearr');
        if (err) throw new Error(err);
        // connection.end();
    });
}


const getLastAnime = () => {
    return new Promise((resolve, reject)=>{
        connection.query(`SELECT mal_url FROM anime ORDER BY id DESC LIMIT 1`, (error, results) => {
            if (error) {
              reject(error);
            } else {
              resolve(results[0]);
            }
        })
    })
}

const initSchedule = async () => {
    let i=1;
    let out = await getLastAnime();
    if(out) {
        i = parseInt(out.mal_url.split('/').pop())+1;
        console.log(`Starting from last index(${i})...`);
    }
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
