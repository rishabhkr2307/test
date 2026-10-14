const {Pool}=require('pg')
require('dotenv').config();

const pool = new Pool(
    process.env.DATABASE_URL?{ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } }
        : {
            user: process.env.DB_USER, password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT, host: process.env.DB_HOST, database: process.env.DB_NAME,
        }
)



pool.on('error', (err,client)=>{
    console.error("Error:",err);
});

module.exports={
    query: (text,params)=> pool.query(text,params),pool
};