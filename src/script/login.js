if (getCookie("uid")){
    window.location.replace('/')
  }
  const form = document.querySelector('#loginForm')
  form.addEventListener('submit', (event) => {

    event.preventDefault() // stopper formen fra å submitte
    console.log("Submitted");
    
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
        console.log(response);
        setCookie("uid", response, 2)

      } else if (xhr.readyState == 4 && xhr.status != 200) {
        console.error("Error:", xhr.status);
        const alert = document.querySelector(".alert")
        alert.classList.remove("hide")
        alert.classList.add("show")
      }
    };
    console.log("request sent");
    xhr.send(reqBody);
  })

