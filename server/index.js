const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var helmet = require('helmet');
app.use(helmet.hidePoweredBy({ setTo: 'PHP 4.2.0' }));
app.use(helmet.frameguard({action: 'deny'}));
app.use(helmet.xssFilter());
app.use(helmet.noSniff());
app.use(helmet.ieNoOpen());


mongoose.connect('mongodb://localhost:27017/feedbacks',{useNewUrlParser: true});
mongoose.set('useFindAndModify', false);


const app = express();

const { addComment, getComments, deleteComment, updateComment } = require('./src/routes.js');
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(bodyParser.json());
app.use(express.static(path.resolve(__dirname, '../public')));
app.get('/favicon.ico', (req, res, next)=> {
    return res.sendStatus(204);
});

app.post('/add-comment', addComment);
app.get('/comments',  getComments);
app.delete('/delete/:id', deleteComment);
app.put('/update/:id', updateComment);

app.listen(process.env.PORT || 3003, process.env.IP || '0.0.0.0' );