(function(window) {

  const $body = document.querySelector('body');
  const $areaToast = document.createElement('div');
  $areaToast.classList.add('area-toast');
  $body.appendChild($areaToast);

  function Options() {
    const hasIcon = (content, icon) => {
      const $icon = typeof icon !== 'undefined' ? document.createElement('i') : false;
      $icon ? $icon.className = icon : false;
      $icon ? content.appendChild($icon) : false;
    }

    const hasTimeout = (content, time) => {
      setTimeout(() => {
        content.classList.remove('snap-now-content--state-open');
        content.addEventListener('webkitTransitionEnd', () => content.remove());
      }, time);
    }

    this.hasIcon = hasIcon;
    this.hasTimeout = hasTimeout;
  }

  function getSnap(config, callback) {
    const options = new Options();
    const $divContent = document.createElement('div');
    const classDefault = 'snap-now-content';

    config.icon ? options.hasIcon($divContent, config.icon) : false;
    config.timeout ? options.hasTimeout($divContent, config.timeout) : false;

    $divContent.classList.add(classDefault);
    $divContent.classList.add(classDefault + '--' + config.type);
    $divContent.innerHTML += config.text;

    $areaToast.appendChild($divContent);
    callback($divContent);
  }

  function Snap(options) {

    const open = () => {
      getSnap(options, $divContent => this.content = $divContent);
      this.content.classList.add('snap-now-content--state-open');
    };

    const close = () => {
      this.content.classList.remove('snap-now-content--state-open');
      this.content.addEventListener('webkitTransitionEnd', () => this.content.remove());
    };

    this.open = open;
    this.close = close;
  }

  window.Snap = Snap;
  window.Options = Options;
}(window));


const tSuccess = new Snap({
  type: 'success',
  text: 'Gabriel, seu cadastro foi atualizado com sucesso!',
  icon: 'fa fa-check'
});

const tError = new Snap({
  type: 'error',
  text: 'Cadastro não foi realizado!',
  icon: 'fa fa-ban'
});

const displayUpdateModal= id =>{
  let newId=id;
  var modal = document.querySelector('.editmodal');
  function attachModalListeners(modalElm) {
    modalElm.querySelector('.editclose_modal').addEventListener('click', toggleModal);
    modalElm.querySelector('.editoverlay').addEventListener('click', toggleModal);
    document.getElementById('edit-btn').addEventListener('click', EditComment);

  }
  
  function detachModalListeners(modalElm) {
    modalElm.querySelector('.editclose_modal').removeEventListener('click', toggleModal);
    modalElm.querySelector('.editoverlay').removeEventListener('click', toggleModal);
    document.getElementById('edit-btn').removeEventListener('click', EditComment);

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
  function EditComment(e){
    const formData = new FormData(document.getElementById("editcommentForm"));
    e.preventDefault();
    console.log('inside EditCOmment the id is :'+newId)
        fetch('/update/' + newId, {
      method: 'Put',
    //    headers : {
    //      "Content-Type" : "application/json; charset=utf-8" 
    //  },   
    body : new URLSearchParams(formData)
  })
       .then(response => response.json())

      .then(function (response) {
        if (response.status === 'success') {
         // removeComment(id);
         console.log(response)
         toggleModal()
         updateDomComment(newId, response.data.comment)
         tSuccess.open();
         setTimeout(tSuccess.close, 3000);  
          //let commentVal=document.getElementById('editInputs').value   
        }
       

      })
      .catch(err => {
        console.log('fetch update didn\'t succeed\n' + err);
        //modal.displayModal('failure');
        toggleModal()

        tError.open();
        setTimeout(tError.close, 3000);  
      });
  }
   toggleModal();
}


const modal = (() => {
  const modal = document.querySelector(".modal");
  const iframe = document.getElementById("iframe");
  const modaltitle = document.getElementById("modaltitle");

  const toggleModal = function() {
    const currentState = modal.style.display;
    modal.style.display = currentState === 'none' ? 'block' : 'none';
  };

  const attachListeners = () => {
    modal.querySelector('.close_modal').addEventListener('click', toggleModal);
    modal.querySelector('.overlay').addEventListener('click', toggleModal);
  };

  const displayModal = (status) => {
    modaltitle.innerHTML = status;
    const setModalStatus = () => {
      const successVideo = 'https://giphy.com/embed/l52CGyJ4LZPa0';
      const failureVideo = 'https://giphy.com/embed/EXHHMS9caoxAA';
      iframe.src = status === 'success' ? successVideo : failureVideo;
    };

    toggleModal();
    setModalStatus();
  }

  attachListeners();

  return {
    displayModal  
  }
})();

const updateDomComment = (id, response) => {
  const elem = document.getElementById(`${id}`);
  console.log('updated :')

  let updated= elem.childNodes[3].innerHTML;
  console.log(updated)
  //document.getElementById('editInputs').value.innerHTML=updated;
  console.log('response :')
  console.log(response)
  //var variable = document.getElementById('editInputs').value;
  //document.getElementById('alert').innerHTML = 'The user input is: ' + variable;
  elem.childNodes[3].innerHTML=response;
}

const removeComment = (id) => {
  const elem = document.getElementById(`${id}`);
  elem.parentNode.removeChild(elem);
};

const clearForm = () => {
  document.getElementById("form").reset();
};

const displayComments = ({ comments }) => {
  const commentsElem = document.getElementById("comments");
  commentsElem.innerHTML += comments.reduce((html, comment) => {
    const commentDiv = `
      <div>${comment.email}</div>
      <div>${comment.comment}</div>
    `;
    return html += `
      <li id=${comment._id} class="list-group-item">${commentDiv}
        <button type="button" class="btn btn-danger delete">delete</button>
        <button type="button" class="btn btn-info update">update</button>
      </li>
    `;
  }, '');
};

const getComments = () => {
  fetch('/comments')
    .then(response => response.json())
    .then(displayComments)
    .catch(err => console.log('fetch get didn\'t succeed\n' + err));
};

const postComment = e => {
  e.preventDefault();
  const formData = new FormData(document.getElementById("form"));
  fetch('/add-comment', {
    method: 'post',
    body: new URLSearchParams(formData)
  })
    .then(response => response.json())
    .then(comments => {
      displayComments(comments);
      clearForm();
    })
    .catch(err => console.log('fetch post didn\'t succeed\n' + err));
};

const deleteComment = e => {
  let target = event.target;
  if (target.className.indexOf('delete') != -1) {
    const id = target.parentNode.id;
    fetch('/delete/' + id, {
      method: 'Delete'
    })
      .then(response => response.json())
      .then(function (response) {
        if (response.status === 'success') {
          removeComment(id);
        }
        modal.displayModal(response.status);
      })
      .catch(err => {
        console.log('fetch delete didn\'t succeed\n' + err);
        modal.displayModal('failure');
      });
  }
};

//in here first show the modal with the form and then update it
const updateComment = e => {
 
  let target = event.target;
  console.log(target)
  console.log(target.className.indexOf('update'));
  if (target.className.indexOf('update') != -1) {
    console.log('inside update')
    const id = target.parentNode.id;
    displayUpdateModal(id);
    
  }
};

getComments();
document.getElementById("submit-btn").addEventListener('click', postComment);
document.getElementById("comments").addEventListener('click', deleteComment);
document.getElementById("comments").addEventListener('click', updateComment);