/* Global Vars */

email_entry = document.getElementById("email");
password_entry = document.getElementById("password");
keep_signed = document.getElementById("keep-signed");

/* Login & Favourites */

var al = document.getElementById("heart-icon-a");
if(al){
  al.addEventListener("click", function(){favourite_apod()});
}

var el = document.getElementById("submit-button");
if(el){
  el.addEventListener("click", function(){signup_submit()});
}

var ol = document.getElementById("login-button");
if(ol){
  ol.addEventListener("click", function(){login_submit()});
}

email_entry.addEventListener("input", (event) => {
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

password_entry.addEventListener("input", (event) => {
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

    if (localStorage.getItem("signedInStatus") != true) {
        location.replace("html/login.html");
    }
}



// Handling sign-ups
function signup_submit() {
    fetch(`/.netlify/functions/handle_form?email=${email_entry.value}&pass=${password_entry.value}`) 
        .then(res => res.json())
        .then(data => {
            // Validity Tests
            for (let i = 0; i < data["records"].length; i++) {
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
                    if (keep_signed.checked == true) {
                        localStorage.setItem("signedInStatus", true);
                        localStorage.setItem("fieldId", data["id"]);
                    } else {
                        sessionStorage.setItem("signedInStatus", true);
                        sessionStorage.setItem("fieldId", data["id"]);
                    }
                    fetch(`/.netlify/functions/update_record?field_id=${data["id"]}&email=${data["fields"]["email"]}&pass=${data["fields"]["password"]}`);
                })
            
        })
}



// Handle login requests
function login_submit() {
    fetch(`/.netlify/functions/handle_form?email=${email_entry.value}&pass=${password_entry.value}`) 
        .then(res => res.json())
        .then(data => {
            const plaintext_password = password_entry.value

            for (let i = 0; i < data["records"].length; i++) {
                // Returned data var declarations
                const returned_email = data["records"][i]["fields"]["email"];
                const returned_pass = data["records"][i]["fields"]["password"];
                const returned_id = data["records"][i]["id"];

                if (returned_email == email_entry.value) {
                    fetch(`/.netlify/functions/validate_login?email=${returned_email}&pass=${returned_pass}&ptext_pass=${plaintext_password}`)
                        .then(res => res.json())
                        .then(valid => {
                            const validity = valid["message"];
                            if (validity == false) {
                                password_entry.style.color = "red";
                                password_entry.style.borderColor = "red";
                                return
                            }
                            else if (validity == true && keep_signed.checked == true) {
                                localStorage.setItem("fieldId", returned_id);
                                localStorage.setItem("signedInStatus", true);
                                location.replace("/");
                                return;
                            } else if (validity == true && keep_signed.checked == false) {
                                sessionStorage.setItem("fieldId", returned_id);
                                sessionStorage.setItem("signedInStatus", false);
                                location.replace("/");
                                return;
                            }
                        })
                }
            }
        })
}