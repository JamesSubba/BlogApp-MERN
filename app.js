const dotenv = require('dotenv')
const express = require('express');
const cors = require('cors');
const router = require('./routes/user-routes');
const blogRouter = require('./routes/blog-routes');

const app = express();

app.use(cors());

app.use(express.json());

dotenv.config({path: './config.env'});

require('./db/connection.js');

app.use('/api/user', router);

app.use('/api/blog', blogRouter);

const PORT = process.env.PORT;

app.listen(PORT,()=> {
    console.log(`server running at port ${PORT}` );
})