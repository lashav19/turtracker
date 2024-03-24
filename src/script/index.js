const loginContainer = document.querySelector("#loginContainer")
const logout = document.querySelector("#logout")
const Turer = document.getElementById("Turer")
const mineTurer = document.getElementById("mineTurer")
const turOption = document.getElementById("turOption")
const uploadForm = document.getElementById('uploadForm')
const user = getCookie('uid');

function makeDate(dateTime){
  const year = dateTime.getFullYear();
  const month = ('0' + (dateTime.getMonth() + 1)).slice(-2); // Month is zero-based, so add 1
  const day = ('0' + dateTime.getDate()).slice(-2);
  const hours = ('0' + dateTime.getHours()).slice(-2);
  const minutes = ('0' + dateTime.getMinutes()).slice(-2);

  return `${year}-${month}-${day} ${hours}:00`;
}

if (getCookie("uid")){
  loginContainer.classList.remove("invisible")


  logout.addEventListener('click', () => {
    setCookie("uid", "", 2)
    window.location.replace("/login")
   })
   fetch(`/api/turer/${user}`)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    // Process the retrieved data
    for (const key in data){
      if (data.hasOwnProperty(key)){
        const tur = data[key]
        console.log(tur.bilde);
        console.log(tur.tid);
        
        console.log(tur.topp);
        mineTurer.innerHTML += `
        <tr>
        <td>${makeDate(new Date(tur.tid))}</td>
        <td class="text-start">${tur.topp}</td>
        <td class="text-center"><img src="${tur.bilde}" alt="" class="w-25"> </td>
        </tr>
        `;
      }
    }
      
  })
  .catch(error => {
    // Handle errors
    console.error('Error:', error);
  });
  
} else {
  console.log(false);
  window.location.replace('/login')
  loginContainer.classList.add("invisible")
}

function hideModal(element){
  const myModal = document.querySelector(element)
  myModal.classList.remove('show');
  myModal.setAttribute('aria-hidden', 'true');
  var modalBackdrops = document.getElementsByClassName('modal-backdrop');
  for (var i = 0; i < modalBackdrops.length; i++) {
      modalBackdrops[i].parentNode.removeChild(modalBackdrops[i]);
  }
}


// Wait for the DOM content to be fully loaded
document.addEventListener("DOMContentLoaded", () => {


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
            turOption.innerHTML += `<option value="${key}">${key}</option>`
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


  





  // Get the file input element
  const fileInput = document.getElementById("file-input");
  const imagePreview = document.getElementById("image-preview");
  const fileButtonsContainer = document.getElementById("file-buttons");

  // Hide the image preview initially
  imagePreview.style.display = "none";

  // Check if file input exists
  if (fileInput) {
    
      // Set the file input to accept only one file
      fileInput.setAttribute("multiple", "false");

      // Add event listener to the file input
      fileInput.addEventListener("change", () => {
          const files = fileInput.files;

          // Check if files is not undefined and has a length property
          if (files && files.length > 0) {
              const file = files[0];

              // Read the file and create a preview
              const reader = new FileReader();
              reader.onload = (event) => {
                  const previewUrl = event.target.result;
                  // Display the image preview
                  imagePreview.src = previewUrl;
                  imagePreview.style.display = "block"; // Show the image preview
              };
              // Read the file as data URL
              reader.readAsDataURL(file);

              const fileName = file.name;
              // Update the label or any other element to display the file name
              document.getElementById("file-name").textContent = fileName;

              // Check if a delete button already exists
              let deleteButton = document.querySelector(".btn-danger");
              if (!deleteButton) {
                  // Create a button with the specified class and icon
                  deleteButton = document.createElement("button");
                  deleteButton.classList.add("btn", "btn-danger");
                  deleteButton.innerHTML = '<i class="fa fa-trash"></i>';
                  // Append the button to the container
                  fileButtonsContainer.appendChild(deleteButton);
              }

              // Add event listener to the delete button
              deleteButton.addEventListener("click", () => {
                  // Clear the file input, remove the button, and reset the image preview
                  fileInput.value = "";
                  document.getElementById("file-name").textContent = "";
                  fileButtonsContainer.removeChild(deleteButton);
                  imagePreview.src = ""; // Reset the image preview
                  imagePreview.style.display = "none"; // Hide the image preview
              });
          } else {
              // If no file is selected, clear the content
              document.getElementById("file-name").textContent = "";
              // Remove any existing delete button and reset the image preview
              const deleteButton = document.querySelector(".btn-danger");
              if (deleteButton) {
                  fileButtonsContainer.removeChild(deleteButton);
              }
              imagePreview.src = ""; // Reset the image preview
              imagePreview.style.display = "none"; // Hide the image preview
          }
      });
  } else {
      console.error("File input element not found.");
  }
})


uploadForm.addEventListener('submit', (event) => {
    event.preventDefault();
    console.log("submitted");

    const slutt = document.getElementById("slutt").value;
    const today = moment().format('YYYY-MM-DD');
    const dateTime = moment(`${today} ${slutt}`, 'YYYY-MM-DD HH:mm:ss').toISOString();


    const turOption = document.getElementById("turOption"); // Assuming turOption is a valid element
    const bilde = document.getElementById("file-input");

    let formData = new FormData();

    formData.append('uid', user);
    formData.append('end', dateTime);
    formData.append('topp', turOption.value);

    if (bilde.files.length > 0) {
        formData.append('file', bilde.files[0]);
    }

    console.log('FormData:', formData);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/turer/add", true);

    xhr.onload = () => {
        if (xhr.status === 200) {
            console.log("Tur laget", xhr.responseText);
            const alert = document.querySelector(".alert")
            alert.classList.remove("hide")
            alert.classList.add("show")
            hideModal("#lagTur")
        } else {
            console.error("Tur feilet:", xhr.status);
        }
    };

    xhr.onerror = () => {
        console.error("Network error occurred");
    };

    xhr.send(formData);
});


