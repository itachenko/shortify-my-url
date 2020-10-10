require('dotenv').config();
const express = require('express');
const { options } = require('joi');
const Joi = require('joi');
const morgan = require('morgan');
const { nanoid } = require('nanoid');
const redis = require('redis');

const redisClient = redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
});

redisClient.on('connect', () => {
    console.log(`Connected to the Redis [${process.env.REDIS_HOST}:${process.env.REDIS_PORT}]`);
});
redisClient.on('error', (error) => {
    console.log(error);
});

const app = express();

app.use(morgan('tiny'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.set('view engine', 'pug');
app.use(express.static('./public'));

const schema = Joi.object({
    url: Joi.string().trim().uri().required(),
});

app.get('/', (req, res) => {
    res.render('index', { title: "Shortify My URL" });
});

app.get('/:id', async (req, res) => {
    const shortUrl = req.params.id;
    redisClient.get(shortUrl, (err, reply) => {
        if (!reply) {
            res.render('not-found', {
                title: "Shortify My URL",
                error: `Short URL '${shortUrl}' was not found`
            });
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
        res.status(400).send(error.message);
        return;
    }

    const short = nanoid(5);

    redisClient.get(short, (err, reply) => {
        if (!reply) {
            redisClient.set(short, req.body.url);
            res.render('index', { title: "Shortify My URL", shortUrl: `http://localhost/${short}`});
        }
        else {
            res.send('You were unlucky, try once more.');
        }
    });
});

app.listen(process.env.PORT, () => {
    console.log(`Listening on http://localhost:${process.env.PORT}`);
});
