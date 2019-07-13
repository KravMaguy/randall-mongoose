const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/feedbacks',{useNewUrlParser: true});

const app = express();

const { addComment, getComments, deleteComment } = require('./src/routes.js');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.resolve(__dirname, '../public')));

app.post('/add-comment', addComment);
app.get('/comments',  getComments);
app.delete('/',deleteComment);

app.listen(process.env.PORT || 3000, process.env.IP || '0.0.0.0' );