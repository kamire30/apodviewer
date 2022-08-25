/* Global Vars */

email_entry = document.getElementById("email");
password_entry = document.getElementById("password");

/* Login & Favourites */

var al = document.getElementById("heart-icon-a");
if(al){
  al.addEventListener('click', function(){favourite_apod()});
}

var el = document.getElementById("submit-button");
if(el){
  el.addEventListener('click', function(){handle_submit()});
}

email_entry.addEventListener('input', (event) => {
    if (email_entry.checkValidity() == false) {
        email_entry.style.color = "red";
        email_entry.style.border = "solid 0.2vw red";
    } else {
        email_entry.style.color = "green";
        email_entry.style.border = "solid 0.2vw green";
    }

    if (email_entry.value == "") {
        email_entry.style.border = "solid 0.2vw white";
    }
}); 

password_entry.addEventListener('input', (event) => {
    if (password_entry.checkValidity() == false) {
        password_entry.style.color = "red";
        password_entry.style.border = "solid 0.2vw red";
    } else {
        password_entry.style.color = "green";
        password_entry.style.border = "solid 0.2vw green";
    }

    if (password_entry.value == "") {
        password_entry.style.border = "solid 0.2vw white";
    }
});

/* Plan 

1. When clicked, if heart is white, then make it red, and vice-versa.
2. If not signed in, direct to sign in page.

*/


function favourite_apod() {
    heart_icon = document.getElementById("heart-icon");
    source = heart_icon.src;

    if (source.includes("white-heart.png")) {
        heart_icon.src = "static/imgs/red-heart.png";
    } else {
        heart_icon.src = "static/imgs/white-heart.png";
    }

    console.log(localStorage.length);
    console.log(sessionStorage.length);

    if ((localStorage.length == 0 && sessionStorage.length == 0) || (localStorage.length == 0 && sessionStorage.length == 1)) {
        location.replace("html/login.html");
    }
}



function handle_submit() {
    fetch(`/.netlify/functions/handle_form?email=${email_entry.value}&pass=${password_entry.value}`) 
        .then(res => res.json())
        .then(data => {
            // Validity Tests
            for (let i = 0; i < data["records"].length; i++) {
                console.log(data["records"][i]["fields"]["email"])
                if (data["records"][i]["fields"]["email"] == email_entry.value) {
                    email_entry.style.color = "red";
                    email_entry.style.borderColor = "red";
                    return
                }
            }
            // Add new data into table
            fetch(`/.netlify/functions/create_record?email=${email_entry.value}&pass=${password_entry.value}`)
                .then(res => res.json())
                .then(data => {
                    fetch(`/.netlify/functions/update_record?field_id=${data["id"]}&email=${email_entry.value}&pass=${password_entry.value}`);
                })
            
        })
}
