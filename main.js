


function registerUser(username, password) {
    fetch('/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      })
      .then(response => response.json())
      .then(data => {
        if (data.message) {
          alert('registration succeed！');
        }
      })
      .catch(error => {
        console.error('registration failed：', error);
      });
}


function loginUser(username, password) {
    fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      })
      .then(response => response.json())
      .then(data => {
        if (data.message) {
          alert('login succeed！');
          
        } else if (data.error) {
          alert('login failed：' + data.error);
        }
      })
      .catch(error => {
        console.error('login failed：', error);
      });
}


function sendMessage(room, message) {
    fetch('/sendMessage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ room, message })
      })
      .then(response => response.json())
      .then(data => {
        if (data.message) {
          console.log('succeed！');
          
        }
      })
      .catch(error => {
        console.error('failed：', error);
      });
}

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');

   
    loginForm && loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        loginUser(username, password);
    });

    registerForm && registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        registerUser(username, password);
    });

    sendButton.addEventListener('click', function(e) {
        const message = messageInput.value;
        const room = 'roomName'; 
        sendMessage(room, message);
    });

    
});
