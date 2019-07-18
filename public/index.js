const displayModal= (status) =>{
  var modal = document.querySelector('.modal');
function attachModalListeners(modalElm) {
  modalElm.querySelector('.close_modal').addEventListener('click', toggleModal);
  modalElm.querySelector('.overlay').addEventListener('click', toggleModal);
}

function detachModalListeners(modalElm) {
  modalElm.querySelector('.close_modal').removeEventListener('click', toggleModal);
  modalElm.querySelector('.overlay').removeEventListener('click', toggleModal);
}

function toggleModal() {
  var currentState = modal.style.display;

  // If modal is visible, hide it. Else, display it.
  if (currentState === 'none') {
    modal.style.display = 'block';
    attachModalListeners(modal);
  } else {
    modal.style.display = 'none';
    detachModalListeners(modal);  
  }
}
 toggleModal();
}

const removeComment= (id) =>{
  console.log('the id is '+id)
  var elem = document.getElementById(`${id}`);
  elem.parentNode.removeChild(elem);
}
const clearForm = () => {
  document.getElementById("form").reset();
}

const displayComments = ({ comments }) => {
  console.log(comments.length)
  const commentsElem = document.getElementById("comments");
  commentsElem.innerHTML += comments.reduce((html, comment) => {
    //console.log(comment)
    //console.log('  ----------------------  ')
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
    .then(clearForm)
    .catch(err => console.log('fetch post didn\'t succeed' + err));
};

//You will build the fetch url dynamically once a button is clicked and you capture
//the id of the li element for the corresponding delete button.
//when you click and the event.target has a class of delete  (this will all be on the server side)
//that is when you have to get the id of the ul element
// (you will have to go up the chain of ancestors to find look into findthenextparent() or something)




const deleteComment= e => {  
  let target = event.target;
      if (target.className.indexOf('delete') != -1) {
        var id = target.parentNode.id;
        console.log(id);

      /* this fetch is incorrect If you look at the fetch in the postComment, you will see you have some parentheses 
      in the wrong location and are missing some also*/

        // fetch( "delete/"+id, {
        //   method: 'DELETE'
        // }).then(response =>
        //   response.json().then(json => {
        //     return json;
        //   })
        // );
        fetch('/delete/'+id, {
          method: 'Delete'
        })
         
          //.then(console.log('hi it done'))
          .then(response => response.json())
           .then(function(response) {
              response.status=='sucess'?(
               console.log('it is'),
               removeComment(id),
               displayModal(response.status)):
               (console.log('it is fail'),
               displayModal(response.status))  
           })

          //remove comment as long as it returned successfull
          //in here have the logic of the modal 
          
          //.then(conditionalchaining(status))

          //.then(status=>console.log(status))
          // .then(status=> function(status){
          //   if (status=='sucess'){
          //     console.log('true')
          //   } else {
          //     console.log('false')
          //   }
          // })
          //.then(removeComment(id))
          .catch(err=> console.log('fetch delete didn\'t succeed'+err))

        //THe below is the fetch to copy
        /*
        fetch('/add-comment', {
          method: 'post',
          body: new URLSearchParams(formData)
        })
          .then(response => response.json())
          .then(displayComments)
          .catch(err => console.log('fetch post didn\'t succeed' + err));*/



      }
};

getComments();
document.getElementById("submit-btn").addEventListener('click', postComment);
document.getElementById("comments").addEventListener('click', deleteComment);
