// dom queries for chat
const chatList = document.querySelector('.chat-list');
const newChatForm = document.querySelector('.new-chat');
const newNameForm = document.querySelector('.new-name');
const updateMessage = document.querySelector('.update-mssg');
const rooms = document.querySelector('.chat-rooms');

//check local storage for a name
const username = localStorage.username ? localStorage.username : 'Anonymous';

// class instances
const chatUI = new ChatUI(chatList);
const chatroom = new Chatroom('general', username);

//adding new messages to the chat
newChatForm.addEventListener('submit', e => {
  if(loginStatus === 'logged_in') {
    e.preventDefault();
    const message = newChatForm.message.value.trim();
    chatroom.addChat(message)
    .then(() => newChatForm.reset())
    .catch(err => console.log(err.message));
  } else {
    newChatForm.reset();
    changeMessageStyle();
  }
});

//updating username in the chat
newNameForm.addEventListener('submit', e => {
  if(loginStatus === 'logged_in'){
    e.preventDefault();
    const newName = newNameForm.name.value.trim();
    chatroom.updateName(newName);
    newNameForm.reset();
    updateMessage.innerText = `Your name was updated to ${newName}`;
    setTimeout(() => {
        updateMessage.innerText = '';
    }, 3000)
  } else {
    newNameForm.reset();
    changeMessageStyle();
  }
});

//updating rooms in the chat
rooms.addEventListener('click', e => {
  if(e.target.tagName === 'BUTTON' && loginStatus === 'logged_in'){
      chatUI.clear();
      chatroom.updateRoom(e.target.getAttribute('id'));
      chatroom.getChats(chat => {
          chatUI.render(chat);
      })
  } else if(e.target.tagName === 'BUTTON' && loginStatus === 'logged_out') {
    changeMessageStyle();
  }
});

// creating new chat rooms new chat room
const createRoomForm = document.querySelector('#create-form');

createRoomForm.addEventListener('submit', e => {
  e.preventDefault();
  const newRoomTitle = createRoomForm['title'].value.trim();
  addRoom(newRoomTitle)
  .then(() => {
      document.querySelector('#create-card').classList.remove('card-active');
      createRoomForm.reset();
  })
  .catch(err => console.log(err.message));
})

// displaying login cards
document.querySelector('#nav-list').addEventListener('click', e => {
    if(e.target.tagName === 'A'){
      const selector = e.target.getAttribute('data-target');
      if(selector !== null){
          document.querySelector(`#${selector}`).classList.add('card-active');
      }
    }
  })

document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('click', e => {
    if(!card.children[0].contains(e.target)){
      card.classList.remove('card-active');
    }
  })
})





