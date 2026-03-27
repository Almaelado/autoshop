const mysql=require('mysql2/promise');

// Egy kozos connection pool fut az egesz backend alatt, hogy ne nyisson minden keres uj kapcsolatot.
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER ,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    port: 3306,
    dateStrings: true
});

module.exports=pool;
