const loginContainer = document.querySelector("#loginContainer")
const logout = document.querySelector("#logout")

if (getCookie("uid")){
  loginContainer.classList.remove("invisible")
  console.log(true);
} else {
  console.log(false);
  window.location.replace('/login')
  loginContainer.classList.add("invisible")
}


logout.addEventListener('click', () => {
  setCookie("uid", "", 2)
  window.location.replace("/login")
 })


document.getElementById("file-input").addEventListener("change", function() {
    var files = this.files;

    if (files.length > 0) {
        var fileName = files[0].name;
        document.getElementById("file-name").textContent = fileName;
    } else {
        document.getElementById("file-name").textContent = "";
    }
});

const Turer = document.getElementById("Turer")
const turOption = document.getElementById("turOption")

fetch('/api/topper/get')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    // Process the retrieved data
    for (const key in data) {
        if (Object.hasOwnProperty.call(data, key)) {
            turOption.innerHTML += `<option value="">${key}</option>`
            const subValues = data[key];
            Turer.innerHTML += `
            <tr>
            <td>${subValues.vanskelighetsgrad}</td>
            <td>${key}</td>
            <td>${subValues.moh}</td>
            </tr>
            `;
        }
      }
      
  })
  .catch(error => {
    // Handle errors
    console.error('Error:', error);
  });

