function log(x){
    console.log(x)
}
var express = require('express');
const fetch = require("node-fetch");

var path = require('path');
var bodyParser = require('body-parser');
var mongoose= require('mongoose');
mongoose.connect('mongodb://localhost:27017/feedbacks',{useNewUrlParser: true});
//var mongodb = require('mongodb');
log('connected');
// var dbConn = mongodb.MongoClient.connect('mongodb://localhost:27017',{ useNewUrlParser: true } );
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
    log('I am in post feedback')
    f.save(function(err, data){ 
        if (err){
         //return log(err);
         res.send({
            status:'failure',
            error: err
         })
        }
        log('we succeeded ')
      });

    res.send('Data received:\n' + JSON.stringify({
        data: req.body,
        status: 'success'
    }));
});


// app.get('/view-feedbacks',  function(req, res) {
//     dbConn.then(function(db) {
//         db.collection('feedbacks').find({}).toArray().then(function(feedbacks) {
//             res.status(200).json(feedbacks);
//         });
		
//     }).catch(function(error) {
//         res.json({"message": "Hello json"})
//        });
// });


app.get('/view-feedbacks',  function(req, res) {
    
    feedbacks.find({}, function(error, comments) {
        // console.log(comments); 
        res.json({comments})
    });
});







app.listen(process.env.PORT || 3000, process.env.IP || '0.0.0.0' );