//listening for auth changes
auth.onAuthStateChanged(user => {
    if(user) {
        loginStatus = 'logged_in';
        assignNickToLoggedInUser(user);
        getRooms(data => updateRoomButtons(data));
        setupLogOutInfo();
        chatroom.getChats(data => chatUI.render(data));
        setupLinksUI(user);
    } else {
        chatUI.clear();
        setupLogOutInfo();
        setupLinksUI();
        removeAddedButtonsAfterLogout();
        loginStatus = 'logged_out';
    }
  });

  const assignNickToLoggedInUser = (user) => {
    db.collection('users').doc(user.uid).get().then(doc => {
        chatroom.username = doc.data().nick;
    })
}

//signup
const signUpForm = document.querySelector('#signup-form');
let loginStatus = 'logged_out';

signUpForm.addEventListener('submit', e => {
  e.preventDefault();
  const email = signUpForm['signup-email'].value.trim();
  const password = signUpForm['signup-password'].value.trim();
  loginStatus = 'logged_in';
  //sign up user into base
  auth.createUserWithEmailAndPassword(email, password).then(cred => {
  return db.collection('users').doc(cred.user.uid).set({
    nick: signUpForm['nick-name'].value
  });
}).then(() => {
  const signUpCard = document.querySelector('#signup-card');
  document.querySelector('#signup-card').classList.remove('card-active');
  signUpForm.reset();
  signUpForm.querySelector('.error').innerHTML = '';
  }).catch(err => {
    signUpForm.querySelector('.error').innerHTML = err.message;
  });
});

//logout
const logout = document.querySelector('#logout');

logout.addEventListener('click', e => {
  e.preventDefault();
  loginStatus = 'logged_out';
  auth.signOut();
});


//login
const loginForm = document.querySelector('#login-form');

loginForm.addEventListener('submit', e => {
  e.preventDefault();
  const email = loginForm['login-email'].value.trim();
  const password = loginForm['login-password'].value.trim();

  auth.signInWithEmailAndPassword(email, password).then(cred => {
      document.querySelector('#login-card').classList.remove('card-active');
      loginForm.reset();
      loginForm.querySelector('.error').innerHTML = '';
  }).catch(err => {
      loginForm.querySelector('.error').innerHTML = err.message;
  });
})
