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

 
const appendEditModal = () => {
  let title = document.getElementById('modaltitle');
  let x = document.createTextNode("Edit :");
  title.appendChild(x);
  let editForm = document.getElementById('placeholder');
  const $form = document.createElement('form');
  $form.setAttribute('method',"put");
  $form.setAttribute('id',"editcommentForm");
  $form.setAttribute('action',"/update");
  let form_group = document.createElement('div');
  form_group.setAttribute('class',"form-group");
  let nameLabel= document.createElement('label')
  nameLabel.innerText = 'name'
  form_group.append(nameLabel)
  
  $input = document.createElement('input')
  $input.setAttribute('type','text')
  $input.setAttribute('class','form-control')
  $input.setAttribute('name','client-name')
  $input.setAttribute('placeholder','enter name')
  $input.setAttribute('required','')
  form_group.append($input)
  
  let form_group2 = document.createElement('div');
  form_group2.setAttribute('class',"form-group");
  let commentLabel= document.createElement('label')
  commentLabel.innerText = 'comments'
  form_group.append(commentLabel)
  $input2 = document.createElement('textarea')
  $input2.setAttribute('id','editInputs')
  $input2.setAttribute('class','form-control')
  $input2.setAttribute('name','comment')
  $input2.setAttribute('placeholder','enter comments')
  $input2.setAttribute('rows','3')
    form_group2.append($input2)

  let submit = document.createElement('button')
  submit.setAttribute('id','edit-btn')
  submit.setAttribute('type','submit')
  submit.setAttribute('class','btn btn-primary btn-lg btn-block')
  submit.innerText = 'submit'




  $form.appendChild(form_group)
  $form.appendChild(form_group2)
  $form.appendChild(submit)
  editForm.appendChild($form);

}

//update comment modal functionality
const displayUpdateModal= id =>{
   // call appendEditModal here
  appendEditModal();
  let newId=id;
  var modal = document.querySelector('.modal');




  function attachModalListeners() {
    console.log('attached')
    document.querySelector('.close_modal').addEventListener('click', toggleModal);
    document.querySelector('.close_modal').addEventListener('click', console.log('it was .. clicked'));

    document.querySelector('.overlay').addEventListener('click', toggleModal);
    document.getElementById('edit-btn').addEventListener('click', EditComment);

  }
  
  function detachModalListeners() {
    document.querySelector('.close_modal').removeEventListener('click', toggleModal);
    document.querySelector('.overlay').removeEventListener('click', toggleModal);
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
        body : new URLSearchParams(formData)
  })
       .then(response => response.json())

      .then(function (response) {
        if (response.status === 'success') {
         toggleModal()
         updateDomComment(newId, response.data.comment)
         tSuccess.open();
         setTimeout(tSuccess.close, 3000);  
        }
       

      })
      .catch(err => {
        toggleModal()
        tError.open();
        setTimeout(tError.close, 3000);  
      });
  }
   toggleModal();
}
//end Update comment modal functionality


//here is the delete modal
const modal = (() => {
  const modal = document.querySelector(".modal");
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
   
    const setModalStatus = () => {

      modaltitle.innerHTML = status;
    };

    toggleModal();
    setModalStatus();
  }

  attachListeners();

  return {
    displayModal  
  }
})();
//end delete modal functionality

const updateDomComment = (id, response) => {
  const elem = document.getElementById(`${id}`);
  let updated= elem.childNodes[3].innerHTML;
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
        let node = document.getElementById("placeholder");
 
        while (node.hasChildNodes()) {
          node.removeChild(node.lastChild);
      }
        if (response.status === 'success') {
          removeComment(id);
        }
        console.log('this is the issue when it pops up')
        modal.displayModal(response.status);
      })
      .catch(err => {
        let node= document.getElementById("placeholder");
        while (node.hasChildNodes()) {
          node.removeChild(node.lastChild);
      }
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