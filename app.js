function log(x){
    console.log(x)
}
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose= require('mongoose');

mongoose.connect('mongodb://localhost:27017/feedbacks',{useNewUrlParser: true});
var app = express();

var Schema = mongoose.Schema;
var feedbackSchema= new Schema({
    name:  {
      type: String,
      required: 'enter a name'      
    },
    email: {
      type: String,
      required: 'enter an email'   
    },
    comment: {
      type: String 
    }  
  });

var feedbacks = mongoose.model('feedbacks', feedbackSchema);

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.resolve(__dirname, 'public')));

app.post('/route', function (req, res) {
    var f= new feedbacks;
    f.name = req.body['client-name'];
    f.email = req.body['client-email'];
    f.comment = req.body.comment;
    f.save(function(err, data){ 
        if (err){
            res.send({
                status:'failure',
                error: err
            });
            return;
        }
        res.json({
            comments: [{
              name: f.name,
              email: f.email,
              comment: f.comment
            }],
            status: 'success'
        });
    });
});

app.get('/route',  function(req, res) {
    feedbacks.find({}, function(error, comments) {
      res.json({
        comments,
        status: 'sucess'
      });
    });
});

app.listen(process.env.PORT || 3000, process.env.IP || '0.0.0.0' );