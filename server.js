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

// patch one route
app.patch("/icecream/:id", (req, res) => {
    const { id } = req.params;
    const { name, dairy_free, calories } = req.body;

    // if dairy free exists and it's not a boolean, or if calories exists and it's not a number
    if (dairy_free !== undefined && typeof dairy_free !== 'boolean' || calories !== undefined && isNaN(calories)) {
        res.status(404).send("dairy_free must be of type boolean, calories must be of type number"); return;
    }

    pool.query('update icecream set name = coalesce($1, name), dairy_free = coalesce($2, dairy_free), calories = coalesce($3, calories) where id = $4 returning *',
    [name, dairy_free, calories, id])
    .then((results) => {
        if (results.rowCount < 1) {
            res.status(404).send("Not found"); return;
        }
        res.send(results.rows[0]); return;
    })
    .catch((error) => {
        console.error(error.message);
        res.sendStatus(500);
    });
});

// listener
app.listen(port, () => {
    console.log("Server.js running, port " + port);
})