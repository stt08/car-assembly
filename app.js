const cors = require('cors');
const express = require('express');
const cookieParser = require('cookie-parser');
require('dotenv').config()

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(cors());

app.use('/api/users', require('./api/users.js'));
app.use('/api/items', require('./api/items.js')); //api for the items
app.use('/api/blueprints', require('./api/blueprints.js'));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`[express]: Runs on port ${port}`));
