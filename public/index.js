const displayComments = ({ comments }) => {
  console.log(comments.length)
  const commentsElem = document.getElementById("comments");
  commentsElem.innerHTML += comments.reduce((html, comment) => {
    console.log(comment)
    console.log('  ----------------------  ')
    const commentDiv = `
      <div>${comment.email}</div>
      <div>${comment.comment}</div>
    `;
    //the ul element will now have an id equal to what I passed back as part of the response
    //and have a delete button with a class of delete, attach a click event to the button, so that 
    //when you click and the event.target has a class of delete  (this will all be on the server side)
    //that is when you have to get the id of the ul element (you will have to go up the chain of ancestors to find look into findthenextparent() or something)
    //get the id from the parent, do two things
    //1. use fetch to send the id in a delete request to get rid of it in the database, 
    //2.and send a success response that you did it,
    //3.ajnd then when you response back in the callback as long as its a success than remove the element from the dom without refreshing the page.
    //4.notify the user that he did or did not delete it..use a modal or something
    //to accomplish modify index.js routes.js add another endpoint to handle the delete
    // edit: it was later said=
    // I need to correct something you wrote down in your notes earlier. I originally said the id should be put on the li element and that is still true, 
    // because each li element represents a separate comment The ul element is the container for all comments.

    let comments = document.getElementById('comments');
  comments.onclick = function(event) {
      let target = event.target;
      if (target.tagName != 'BUTTON') return;
      fetch( "/delete" + `${comment._id}`, {
        method: 'DELETE'
      }).then(() => {
         console.log('removed');
      }).catch(err => {
        console.log('fetch delete didn\'t succeed' + err)
      })
    }



    return html += `<li id=${comment._id} class="list-group-item">${commentDiv}<button type="button" class="btn btn-danger delete">delete</button></li>`;
  }, '');
};

const getComments = () => {
  fetch('/comments')
    .then(response => response.json())
    .then(displayComments)
    .catch(err => console.log('fetch get didn\'t succeed' + err));
};

const postComment = e => {
  e.preventDefault();
  const formData = new FormData(document.getElementById("form"));
  fetch('/add-comment', {
    method: 'post',
    body: new URLSearchParams(formData)
  })
    .then(response => response.json())
    .then(displayComments)
    .catch(err => console.log('fetch post didn\'t succeed' + err));
};

// const deleteComment = e => {
//   //e.preventDefault();
//   console.log(this)
//   fetch( "/delete" + `${comment._id}`, {
//     method: 'DELETE'
//   }).then(() => {
//      console.log('removed');
//   }).catch(err => {
//     console.log('fetch delete didn\'t succeed' + err)
//   })
// };

getComments();
document.getElementById("submit-btn").addEventListener('click', postComment);
// var els = document.getElementsByClassName("delete");
// console.log(els)
// Array.prototype.forEach.call(els, function(el) {
//   el.addEventListener('click', deleteComment)
// });


