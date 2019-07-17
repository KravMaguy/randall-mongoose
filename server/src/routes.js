const mongoose = require('mongoose');

const { feedbackSchema } = require('./model.js');
const Feedbacks = mongoose.model('feedbacks', feedbackSchema);

const addComment = (req, res) => {
  const feedback = new Feedbacks;
  feedback.name = req.body['client-name'];
  feedback.email = req.body['client-email'];
  feedback.comment = req.body.comment;

  feedback.save(function (err, { name, email, comment, _id }) {
    if (err) {
      res.send({
        status: 'failure',
        error: err
      });
      return;
    }
    res.json({
      comments: [{ name, email, comment, _id }],
      status: 'success'
    });
  });
};

const getComments = (req, res) => {
  Feedbacks.find({}, function (error, comments) {
    res.json({
      comments,
      status: 'sucess'
    });
  });
};


const deleteComment = (req, res) => {
  Feedbacks.findByIdAndRemove({_id: req.params.id}, function (error, comments) {
    res.json({
      comments,
      status: 'sucess'
      //in the fetch you have to make sure to see that the staus was 
      // really a success and then delete it. 
      // handle the error argument in case of a connection error
      // when you get a response of success or failure that determines the 
      // message in the modal and if its a success remove it.  
    });
  })
};

module.exports = { addComment, getComments, deleteComment };
