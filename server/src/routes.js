const mongoose = require('mongoose');

const { feedbackSchema } = require('./model.js');
const Feedbacks = mongoose.model('feedbacks', feedbackSchema);

const addComment = (req, res) => {
  const feedback = new Feedbacks;
  feedback.name = req.body['client-name'];
  feedback.email = req.body['client-email'];
  feedback.comment = req.body.comment;
  feedback._id= req.body._id
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
      status: 'sucessfully deleted'
    });
  })
};

module.exports = { addComment, getComments, deleteComment };
