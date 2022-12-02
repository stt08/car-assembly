const path = require('path');
const cors = require('cors');
const express = require('express');
const cookieParser = require('cookie-parser');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(cors());

app.use('/api/users', require('./api/users.js'));
app.use('/api/items', require('./api/items.js'));
app.use('/api/blueprints', require('./api/blueprints.js'));
app.use('/api/products', require('./api/products.js'));

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, '../pages')));
    app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, '../pages/index.html')));
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`[express]: Runs on port ${port}`));
