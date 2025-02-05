
import pkg from 'pg'
const {Pool} = pkg

const PG_URI = 'postgresql://postgres:Rjpk4SaKFU9UB0gz@db.iplouzmpgowturxalotd.supabase.co:5432/postgres'

const pool = new Pool({
    connectionString: PG_URI,
});

pool.connect((err, client, release) => { if (err) { return console.error('Error acquiring client', err.stack); } console.log('Connected to PostgreSQL'); release(); });

const queryConnection = (async() => {
    try {
        const res = await pool.query('SELECT NOW()');
        console.log('DATABASE SUCCESSFULLY CONNECTED: ', res.rows[0]);
    } catch (err){
        console.error('ERROR IN CONNECTING TO DATABASE');
    }
});

queryConnection();

export default pool;