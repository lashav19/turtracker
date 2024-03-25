//obfuskert kode for å handle med cookies

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  let expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function checkCookie(val) {
  let cookieVal = getCookie(val);
  if (cookieVal != "") {
   return true
  } else {
   return false
  }
}


function delCookie(name){
  getCookie(name)
  document.cookie = name + "=;"+"expires=Thu, 01 Jan 1970 00:00:00 UTC;"+ ";path=/";
}



const closeBtn = document.querySelector(".btn-close");
if (closeBtn){ // kun hvis close button er present
  closeBtn.addEventListener("click", () => {
    const parent = closeBtn.parentElement;
    if (parent) {
        parent.classList.add("invisible");
      location.reload()
    }
  });
}

function makeDate(dateTime){
  const year = dateTime.getFullYear();
  const month = ('0' + (dateTime.getMonth() + 1)).slice(-2); // Month is zero-based, so add 1
  const day = ('0' + dateTime.getDate()).slice(-2);
  const hours = ('0' + dateTime.getHours()).slice(-2);
  const minutes = ('0' + dateTime.getMinutes()).slice(-2);

  return `${year}-${month}-${day} ${hours}:00`;
}