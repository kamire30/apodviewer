/* Events */

document.getElementById("move-back").addEventListener("click", function(){move_back()});
document.getElementById("move-forward").addEventListener("click", function(){move_forward()});
document.getElementById("submit-btn").addEventListener("click", function(){search_apod(document.getElementById("search-bar").value)});
document.getElementById("reset-btn").addEventListener("click", function(){reset_apod()});
window.addEventListener('scroll', () => {
    document.body.style.setProperty('--scroll', window.pageYOffset / (document.body.offsetHeight - window.innerHeight));
  }, false);

document.onkeydown = checkKey;

$("#click-for-more").click(function() {
    $('html,body').animate({
        scrollTop: $("#bottom-page").offset().top},
        'slow');
});


/* Functions */

var move_date = 1;

function checkKey(e) {

    e = e || window.event;

    if (e.keyCode == '37') {
        move_back()
    } else if (e.keyCode == '39') {
        move_forward()
    }
}



function reset_apod(){
    move_date = 1;
    
    const today = new Date();
    const yesterday = new Date();

    yesterday.setDate(today.getDate() - 1);

    let today_day = String(today.getDate());
    let today_month = String(today.getMonth()+1);
    let today_year = String(today.getFullYear());

    let yesterday_day = String(yesterday.getDate());
    let yesterday_month = String(yesterday.getMonth()+1);
    let yesterday_year = String(yesterday.getFullYear());


    if (today_day.length == 1) {
        today_day = `0${today_day}`
    }
    if (yesterday_day.length == 1) {
        yesterday_day = `0${yesterday_day}`
    }
    if (today_month.length == 1) {
        today_month = `0${today_month}`
    }
    if (yesterday_month.length == 1) {
        yesterday_month = `0${yesterday_month}`
    };

    const yesterday_arg = `${yesterday_year}-${yesterday_month}-${yesterday_day}`;
    const today_arg = `${today_year}-${today_month}-${today_day}`

    fetch_images(yesterday_arg, today_arg, "n");
}



function search_apod(value) {
    const x = new Date();
    const search_date = new Date(String(value));
    const search_date_yesterday = new Date();
    const search_date_tmrw = new Date();

    const today = new Date();
    const mseconds = today.getTime() - search_date.getTime();
    const no_of_days = Math.ceil(mseconds / (86400000));

    move_date = no_of_days;

    search_date_yesterday.setDate(x.getDate() - move_date);
    search_date_tmrw.setDate(x.getDate() - move_date + 2);

    let yesterday_day = String(search_date_yesterday.getDate());
    let yesterday_month = String(search_date_yesterday.getMonth()+1)
    let yesterday_year = String(search_date_yesterday.getFullYear());

    let tmrw_day = String(search_date_tmrw.getDate());
    let tmrw_month = String(search_date_tmrw.getMonth()+1)
    let tmrw_year = String(search_date_tmrw.getFullYear());


    if (yesterday_day.length == 1) {
        yesterday_day = `0${yesterday_day}`
    }
    if (tmrw_day.length == 1) {
        tmrw_day = `0${tmrw_day}`
    }
    if (yesterday_month.length == 1) {
        yesterday_month = `0${yesterday_month}`
    }
    if (tmrw_month.length == 1) {
        tmrw_month = `0${tmrw_month}`
    };

    const tmrw_arg = `${tmrw_year}-${tmrw_month}-${tmrw_day}`;
    const yesterday_arg = `${yesterday_year}-${yesterday_month}-${yesterday_day}`

    if (move_date >= 3) {
        fetch_images(yesterday_arg, "n", tmrw_arg);
    } else {
        fetch_images(yesterday_arg, "n", "n");
    }
}



function update_current_day() {
    const today = new Date();
    const year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();

    if (month < 10) {
        month = "0" + month;
    }

    if (day < 10) {
        day = '0' + day;
     }

    const arg = `${year}-${month}-${day}`
    document.getElementById("search-bar").setAttribute("max", arg);
}



function fetch_images(yesterday, today, tomorrow) {
    fetch(`/.netlify/functions/fetch_images?start_date=${yesterday}&today_date=${today}&tomorrow_date=${tomorrow}`)
        .then(res => res.json())
        .then(data => {

            if (move_date == 1 || move_date == 2) {
                const img = document.getElementById("tmrw-img");
                const vid = document.getElementById("tmrw-vid");
            
                img.style.opacity = 100;
                img.style.position = "static";
                vid.style.opacity = 0;
                vid.style.position = "absolute";
                img.src = "static/imgs/red-gradient.gif";

                if (move_date == 1) {
                    document.getElementById("move-forward").disabled = true;
                } else {
                    document.getElementById("move-forward").disabled = false;
                }
            }


            if (data.length == 1) {
                move_back()
            }

            document.getElementById("title-text").innerHTML = data[1]["title"];

            var photographer = "placeholder";
            if (data[1]["copyright"] == undefined) {
                photographer = "None Found"
            } else {
                photographer = data[1]["copyright"];
            }

            document.getElementById("photographer").innerHTML = photographer;

            if (photographer.length > 25) {
                document.getElementById("camera-h4").innerHTML = `Photographer: ${photographer.substring(0, 25) + "..."}`;
            } else {
                document.getElementById("camera-h4").innerHTML = `Photographer: ${photographer}`;
            };
            
            const link_div = document.getElementById("link-div");
            const media_stat = document.getElementById("media-h4");
            const version_stat = document.getElementById("version-h4");
            const explanation = document.getElementById("apod-explanation-p");

            link_div.setAttribute("href", data[1]["hdurl"]);
            media_stat.innerHTML = `Media Type: ${data[1]["media_type"]}`;
            version_stat.innerHTML = `Service Version: ${data[1]["service_version"]}`;
            explanation.innerHTML = data[1]["explanation"];

            if (data[1]["media_type"] == "video") {
                const img = document.getElementById("today-img");
                const vid = document.getElementById("today-vid");

                img.style.opacity = 0;
                img.style.position = "absolute";
                vid.style.opacity = 1;
                vid.style.position = "static";
                vid.src = data[1]["url"];
                document.getElementById("date-text").innerHTML = data[1]["date"];
            }
            else {
                const img = document.getElementById("today-img");
                const vid = document.getElementById("today-vid");
            
                img.style.opacity = 100;
                img.style.position = "static";
                vid.style.opacity = 0;
                vid.style.position = "absolute";

                document.getElementById("today-img").src = data[1]["url"];
                document.getElementById("date-text").innerHTML = data[1]["date"];
            }

            if (data[0]["media_type"] == "video") {
                const img = document.getElementById("yesterday-img");
                const vid = document.getElementById("yesterday-vid");

                img.style.opacity = 0;
                img.style.position = "absolute";
                vid.style.opacity = 0.6;
                vid.style.position = "static";
                vid.src = data[0]["url"];
            } 
            else {
                const img = document.getElementById("yesterday-img");
                const vid = document.getElementById("yesterday-vid");

                img.style.opacity = 0.6;
                img.style.position = "static";
                vid.style.opacity = 0;
                vid.style.position = "absolute";

                document.getElementById("yesterday-img").src = data[0]["url"];
            }
            
            if (data[2]["media_type"] == "video") {
                const img = document.getElementById("tmrw-img");
                const vid = document.getElementById("tmrw-vid");

                img.style.opacity = 0;
                img.style.position = "absolute";
                vid.style.opacity = 0.6;
                vid.style.position = "static";
                vid.src = data[2]["url"];
            }
            else {
                const img = document.getElementById("tmrw-img");
                const vid = document.getElementById("tmrw-vid");

                img.style.opacity = 0.6;
                img.style.position = "static";
                vid.style.opacity = 0;
                vid.style.position = "absolute";

                document.getElementById("tmrw-img").src = data[2]["url"];
            }
            
            if (data.length == 3) {
                document.getElementById("tmrw-img").src = data[2]["url"];
            }

            })
}



function move_back() {
    update_current_day();
    let x = new Date();
    let tmrw = new Date();
    let yesterday = new Date();

    move_date += 1;

    yesterday.setDate(x.getDate() - move_date);
    tmrw.setDate(x.getDate() - move_date + 2)

    let tmrw_day = String(tmrw.getDate());
    let tmrw_month = String(tmrw.getMonth()+1);
    let tmrw_year = String(tmrw.getFullYear());

    let yesterday_day = String(yesterday.getDate());
    let yesterday_month = String(yesterday.getMonth()+1);
    let yesterday_year = String(yesterday.getFullYear());


    if (tmrw_day.length == 1) {
        tmrw_day = `0${tmrw_day}`
    }
    if (yesterday_day.length == 1) {
        yesterday_day = `0${yesterday_day}`
    }
    if (tmrw_month.length == 1) {
        tmrw_month = `0${tmrw_month}`
    }
    if (yesterday_month.length == 1) {
        yesterday_month = `0${yesterday_month}`
    };

    const yesterday_arg = `${yesterday_year}-${yesterday_month}-${yesterday_day}`;
    const tmrw_arg = `${tmrw_year}-${tmrw_month}-${tmrw_day}`

    if (move_date <= 3) {
        fetch_images(yesterday_arg, "n", "n");
    } else {
        fetch_images(yesterday_arg, "n", tmrw_arg);
    }

}



function move_forward() {
    update_current_day();
    let x = new Date();
    let yesterday = new Date();
    let tmrw = new Date();


    move_date -= 1;
    
    yesterday.setDate(x.getDate() - move_date);

    tmrw.setDate(x.getDate() - move_date + 2);
    let yesterday_day = String(yesterday.getDate());
    let yesterday_month = String(yesterday.getMonth()+1)
    let yesterday_year = String(yesterday.getFullYear());

    let tmrw_day = String(tmrw.getDate());
    let tmrw_month = String(tmrw.getMonth()+1)
    let tmrw_year = String(tmrw.getFullYear());


    if (yesterday_day.length == 1) {
        yesterday_day = `0${yesterday_day}`
    }
    if (tmrw_day.length == 1) {
        tmrw_day = `0${tmrw_day}`
    }
    if (yesterday_month.length == 1) {
        yesterday_month = `0${yesterday_month}`
    }
    if (tmrw_month.length == 1) {
        tmrw_month = `0${tmrw_month}`
    };

    const tmrw_arg = `${tmrw_year}-${tmrw_month}-${tmrw_day}`;
    const yesterday_arg = `${yesterday_year}-${yesterday_month}-${yesterday_day}`

    if (move_date <= 3) {
        fetch_images(yesterday_arg, "n", "n");
    } else {
        fetch_images(yesterday_arg, "n", tmrw_arg);
    }
}


/* On Load */

const today = new Date();
const yesterday = new Date();

yesterday.setDate(today.getDate() - 1);

let today_day = String(today.getDate());
let today_month = String(today.getMonth()+1);
let today_year = String(today.getFullYear());

let yesterday_day = String(yesterday.getDate());
let yesterday_month = String(yesterday.getMonth()+1);
let yesterday_year = String(yesterday.getFullYear());


if (today_day.length == 1) {
    today_day = `0${today_day}`
}
if (yesterday_day.length == 1) {
    yesterday_day = `0${yesterday_day}`
}
if (today_month.length == 1) {
    today_month = `0${today_month}`
}
if (yesterday_month.length == 1) {
    yesterday_month = `0${yesterday_month}`
};

const yesterday_arg = `${yesterday_year}-${yesterday_month}-${yesterday_day}`;
const today_arg = `${today_year}-${today_month}-${today_day}`

fetch_images(yesterday_arg, today_arg, "n");
update_current_day()


