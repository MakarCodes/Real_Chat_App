class ChatUI {
    constructor(list){
      this.list = list;
    }
    render(data){
        const when = dateFns.distanceInWordsToNow(
            data.created_at.toDate(),
            { addSuffix:true }
            );
        const html = `
        <li class="list-group-item">
            <span class="username">${data.username}</span>
            <span class="message">${data.message}</span>
            <div class="time">${when}</div>
        </li>
        `;
        this.list.innerHTML += html;
    }
    clear(){
        this.list.innerHTML = '';
    }
  }

  // UI login message
const setupLogOutInfo = () => {
    const messageContainer = document.querySelector('.logout-info');
    if(loginStatus === 'logged_out') {
        const div = document.createElement('div');
        div.classList.add('logout-message');
        const html = `
            <h2> Please log into your account to join the chat. </h2>
            <h3> If you don't have account please sign up and then log in. </h3>
            `;
        div.innerHTML = html;
        messageContainer.appendChild(div);
    } else {
        messageContainer.innerHTML = '';
    }
}

const changeMessageStyle = () => {
    document.querySelector('.logout-message').classList.add('alert');
    setTimeout(() => {
      document.querySelector('.logout-message').classList.remove('alert');
    }, 2000)
}


//displaying links depeneding of the status of log

const loggedOutLinks = document.querySelectorAll('.logged-out');
const loggedInLinks = document.querySelectorAll('.logged-in');
const accountDetails = document.querySelector('.account-details');

const setupLinksUI = (user) => {
    if (user) {
        db.collection('users').doc(user.uid).get().then(doc => {
            let html = `
            <div>Logged in as ${user.email}</div>
            <div>${doc.data().nick}</div>
            `;
            accountDetails.innerHTML = html;
        })
        loggedInLinks.forEach(link => link.style.display = 'block');
        loggedOutLinks.forEach(link => link.style.display = 'none');
    } else {
        accountDetails.innerHTML = '';
        loggedInLinks.forEach(link => link.style.display = 'none');
        loggedOutLinks.forEach(link => link.style.display = 'block');
    }
}

// displaying room buttons
async function addRoom (roomTitle){
    const room = {
      title : roomTitle,
      id : roomTitle
    }
    const response = await db.collection('rooms').add(room);
    return response;
  }
  
  function getRooms (callback){
       db.collection('rooms')
      .onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
          if(change.type === 'added'){
            callback(change.doc.data());
          }
        });
    });
  }
  
const removeAddedButtonsAfterLogout = () => {
    db.collection('rooms').get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            if(document.querySelectorAll('.button-chat').length > 3){
                document.querySelector(`#${doc.data().id}`).remove();
            }
        });
    });
}

const updateRoomButtons = (data) => {
    const html = `
    <button class="button-chat" id="${data.id}">#${data.title}</button>
    `;
    const buttonsContainer = document.querySelector('.room-buttons');
    buttonsContainer.innerHTML += html;
}
