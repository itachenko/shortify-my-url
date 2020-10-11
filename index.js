require('dotenv').config();

const express = require('express');
const Joi = require('joi');
const { nanoid } = require('nanoid');
const redis = require('redis');

const redisClient = redis.createClient(process.env.REDIS_URL);

redisClient.on('connect', () => {
    console.log(`Connected to the Redis.`);
});
redisClient.on('error', (error) => {
    console.log(error);
});

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.set('view engine', 'pug');
app.use(express.static('./public'));

const schema = Joi.object({
    url: Joi.string().trim().uri().required(),
});

app.get('/', (req, res) => {
    res.render('index', { count: dbSize });
});

app.get('/:id', async (req, res) => {
    redisClient.get(req.params.id, (err, reply) => {
        if (!reply) {
            res.render('not-found');
        }
        else {
            res.redirect(reply);
        }
    });
});

app.post('/url', async (req, res) => {
    try {
        await schema.validateAsync(req.body);
    } catch (error) {
        res.render('index', { result: error.message } );
    }

    const short = nanoid(5);
    redisClient.get(short, (err, reply) => {
        if (!reply) {
            redisClient.set(short, req.body.url);
            res.render('index', { result: `http://shortify-my-url.herokuapp.com/${short}`});
        }
        else {
            res.render('index', {
                result: `Wow! You are so lucky to get short URL which already in use. It is 1 in ${Math.pow((26+10), 5)} chanse.`
            });
        }
    });
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running`);
});

let dbSize = 0;
setInterval(() => {
    redisClient.DBSIZE((err, data) => {
        if (err) {
            console.log("An error occured on DBSIZE call");
        }
        dbSize = data;
    })
}, 10000);
