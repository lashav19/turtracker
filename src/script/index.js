const loginContainer = document.querySelector("#loginContainer")
const logout = document.querySelector("#logout")
const Turer = document.getElementById("Turer")
const turOption = document.getElementById("turOption")
const uploadForm = document.getElementById('uploadForm')


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


// Wait for the DOM content to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
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
});







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



  uploadForm.addEventListener('submit', (event) =>{
    event.preventDefault();
    console.log("submitted");
    const slutt = document.getElementById("slutt").value
    const today = moment().format('YYYY-MM-DD');
    const dateTime = moment(`${today} ${slutt}`, 'YYYY-MM-DD HH:mm:ss').format();

    const user = getCookie('uid')

    const bilde = document.getElementById("file-input");

    const xhr = new XMLHttpRequest();
    console.log('UID:', getCookie('uid'));
    console.log('End:', dateTime);
    console.log('Topp:', turOption.value);
    console.log('Bilde:', bilde.files[0]);

    let formData = new FormData()
    formData.append('uid', getCookie('uid'))
    formData.append('end', dateTime)
    formData.append('topp', turOption.value)
    formData.append('file', bilde.files[0])
    console.log(formData.entries());

    xhr.open("POST", "/api/turer/add", true);
    xhr.setRequestHeader("Content-Type", "multipart/form-data"); // Set proper content type

    xhr.onload = () => {
        if (xhr.status === 200) {
            console.log("Tur laget", xhr.responseText);
        } else {
            console.error("Tur feilet:", xhr.status);
        }
    };

    xhr.onerror = () => {
        console.error("Network error occurred");
    };

    // Add error event listener to log error response
    xhr.addEventListener('error', () => {
        console.error('Request failed:', xhr.responseText);
    });

    // Send the XHR request with the FormData payload
    xhr.send(formData);
});


