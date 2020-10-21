require('dotenv').config();

const express = require('express');
const Joi = require('joi');
const { nanoid } = require('nanoid');
const { redisClient } = require('./services/redis');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'pug');
app.use(express.static('./public'));

const schema = Joi.object({
    url: Joi.string().trim().uri().required(),
});

app.get('/', (req, res) => {
    res.render('index', {
        count: dbSize
    });
});

app.get('/:url', async (req, res) => {
    redisClient.GET(req.params.url, (err, reply) => {
        if (!reply) {
            res.render('not-found');
        }
        else {
            res.redirect(reply);
        }
    });
});

app.post('/', async (req, res) => {
    try {
        await schema.validateAsync(req.body);
    } catch (error) {
        return res.render('index', {
            error: 'Invalid URL',
            count: dbSize
        });
    }

    const short = nanoid(5).toLowerCase();
    redisClient.EXISTS(short, (err, reply) => {
        if (!reply) {
            redisClient.SET(short, req.body.url);
            res.render('index', {
                result: `http://www.shortify.one/${short}`,
                count: dbSize
            });
        }
        else {
            res.render('index', {
                error: `Wow! You are so lucky to get short URL which already in use. It is 1 in ${Math.pow((26+10), 5)} chanse.`,
                count: dbSize
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
