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
            res.render('index', { title: "Shortify My URL", shortUrl: `http://shortify-my-url.herokuapp.com/${short}`});
        }
        else {
            res.send('You were unlucky, try once more.');
        }
    });
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running`);
});
