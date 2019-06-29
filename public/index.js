const displayComments = ({ comments }) => {
  const commentsElem = document.getElementById("comments");
  commentsElem.innerHTML += comments.reduce((html, comment) => {
    const commentDiv = `
              <div>${comment.email}</div>
              <div>${comment.comment}</div>
            `;
    return html += `<li class="list-group-item">${commentDiv}</li>`;
  }, '');
};

const getComments = () => {
  fetch('/route')
    .then(response => response.json())
    .then(displayComments)
    .catch(err => console.log('fetch get didn\'t succeed' + err));
};

const postComment = e => {
  e.preventDefault();
  const formData = new FormData(document.getElementById("form"));
  fetch('/route', {
    method: 'post',
    body: new URLSearchParams(formData)
  })
    .then(response => response.json())
    .then(displayComments)
    .catch(err => console.log('fetch post didn\'t succeed' + err));
};

getComments();
document.getElementById("submit-btn").addEventListener('click', postComment);