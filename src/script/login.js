// 

if (getCookie("uid")){
    window.location.replace('/')
  }
  const form = document.querySelector('#loginForm')
  form.addEventListener('submit', (event) => {

    event.preventDefault() // stopper formen fra å submitte
    console.log("Submitted");
    const loginButton = document.querySelector('.btn-primary');
    loginButton.innerHTML = '<span class="spinner-border" id="loading"></span>';

    const username = document.querySelector("#username").value
    const password = document.querySelector("#password").value

    

    const xhr = new XMLHttpRequest()
    var reqBody = JSON.stringify({
      username: username,
      password: password
    })
    xhr.open("POST", '/api/login', true)
    xhr.setRequestHeader("Content-type", "application/json");


    xhr.onreadystatechange = function () {


      if (xhr.readyState == 4 && xhr.status == 200) {
        var response = xhr.responseText;
        loginButton.innerHTML = "Logg inn"
        setCookie("uid", response, 2)
        document.location.replace('/')



      } else if (xhr.readyState == 4 && xhr.status != 200) {
        console.error("Error:", xhr.status);
        const alert = document.querySelector(".alert")
        alert.classList.remove("hide")
        alert.classList.add("show")
        loginButton.innerHTML = 'Logg inn';
      }
    };
    
    console.log("request sent");
    xhr.send(reqBody);
  })

