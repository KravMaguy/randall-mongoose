const mongoose = require('mongoose');

const { feedbackSchema } = require('./model.js');
const Feedbacks = mongoose.model('feedbacks', feedbackSchema);

const addComment = (req, res) => {
  const feedback = new Feedbacks;
  feedback.name = req.body['client-name'];
  feedback.email = req.body['client-email'];
  feedback.comment = req.body.comment;
  feedback.save(function (err, { name, email, comment }) {
    if (err) {
      res.send({
        status: 'failure',
        error: err
      });
      return;
    }
    res.json({
      comments: [{ name, email, comment }],
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
  Feedbacks.findByIdAndRemove({_id: req.params.id})
    .then(function(res){
    res.json({
     
      status: 'sucessfully deleted'
    })
  })
};

module.exports = { addComment, getComments, deleteComment };
