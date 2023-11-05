const config = require('../config');
const mysql = require('mysql');


const getConnection = function() {
    const connection = mysql.createConnection(config)
    return connection;
}

const create = async function( dbname ) {
	const connection = getConnection();

	await new Promise( ( resolve, reject ) => {

		connection.query( `CREATE DATABASE IF NOT EXISTS ${ dbname }`, function ( err ) {
            
            connection.end()

			if ( err ) {
				reject( Error( err.stack ) );
			}
            console.log('DB created/exists');
			resolve();
		} );
	} );
};

const deleteDatabase = async function( dbname ) {
	const connection = getConnection();

	await new Promise( ( resolve, reject ) => {
		connection.query( `DROP DATABASE IF EXISTS ${ dbname }`, function( err ) {

			connection.destroy();

			if ( err ) {
				reject( Error( err ) );
			}
            console.log('DB deleted');
			resolve();
		} );
	} );
};


module.exports = {getConnection, create, deleteDatabase}


// getConnection().connect((err) => {
//     if (err) throw new Error(err);
//     console.log('connected to db')
//     getConnection().query('CREATE DATABASE IF NOT EXISTS malscrap', (err) => {
//         if (err) throw new Error(err);
//         console.log('DB created/exists');
//         getConnection().changeUser({ database: 'malscrap' }, (err) => {
//             if (err) throw new Error(err);
//             createTable()
//         })
//     })
// })