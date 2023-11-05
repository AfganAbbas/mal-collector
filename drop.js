const {deleteDatabase} = require('./lib/db')
require('./config')

const dbname = process.env.DATABASE_NAME

deleteDatabase(dbname);
