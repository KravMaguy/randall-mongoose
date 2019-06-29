const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

mongoose.connect('mongodb://localhost:27017/feedbacks',{useNewUrlParser: true});

const { feedbackSchema } = require('./src/model.js');
const Feedbacks = mongoose.model('feedbacks', feedbackSchema);

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.resolve(__dirname, '../public')));

app.post('/route', function (req, res) {
    const feedback = new Feedbacks;
    feedback.name = req.body['client-name'];
    feedback.email = req.body['client-email'];
    feedback.comment = req.body.comment;
    feedback.save(function(err, data){ 
        if (err){
            res.send({
                status:'failure',
                error: err
            });
            return;
        }
        res.json({
            comments: [{
              name: feedback.name,
              email: feedback.email,
              comment: feedback.comment
            }],
            status: 'success'
        });
    });
});

app.get('/route',  function(req, res) {
    Feedbacks.find({}, function(error, comments) {
      res.json({
        comments,
        status: 'sucess'
      });
    });
});

app.listen(process.env.PORT || 3000, process.env.IP || '0.0.0.0' );