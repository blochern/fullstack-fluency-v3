// import dependencies
import express from 'express';
import dotenv from 'dotenv';
import pkg from 'pg';

const { Pool } = pkg;

dotenv.config();

const pool = new Pool({
    connectionString: process.env.database_url
});

const app = express();

const port = process.env.port;

// middlewares
app.use(express.json(), express.static('client'));

// get all route
app.get("/icecream", (req, res) => {
    pool.query("select * from icecream")
        .then((results) => {
            res.send(results.rows); return;
        })
        .catch((error) => {
            console.error(error.message);
            res.sendStatus(500); return;
        });
});

// get one route
app.get("/icecream/:id", (req, res) => {
    const { id } = req.params;
    pool.query("select * from icecream where id = $1", [id])
    .then((results) => {
        if (results.rowCount < 1) {
            res.status(404).send("Not found"); return;
        }
        res.send(results.rows[0]); return;
    })
    .catch((error) => {
        console.error(error.message);
        res.sendStatus(500); return;
    });
});

// listener
app.listen(port, () => {
    console.log("Server.js running, port " + port);
})