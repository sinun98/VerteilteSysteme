document.getElementById('login').addEventListener('click', (event) => {
    //get new input values
    var user = document.getElementById('usernamealert');
    user.innerHTML = '';

    var pw = document.getElementById('passwordalert');
    pw.innerHTML = '';

    document.getElementById('password').style.borderColor = "black"
    document.getElementById('username').style.borderColor = "black"

    var username = document.getElementById('username').value
    var password = document.getElementById('password').value
    //check if all fields are filled
    if (username == "") {



        user.innerHTML = ' Bitte Username eingeben.';
        
        document.getElementById('username').style.borderColor = "red"
        
    } else if (password == "") {



        pw.innerHTML = ' Bitte Passwort eingeben.';
        
        document.getElementById('password').style.borderColor = "red"
        
    } else {



        const values = {
            username: username,
            password: password

        }

        //send logindata to backend
        fetch('http://localhost:3000/api/login', {
            method: 'POST',

            headers: {

                'content-type': 'application/json',

            },
            body: JSON.stringify(values)
        }).then(res => {
            
            const status = res.status;

            if (status == 404) {
                user.innerHTML = " Benutzer konnte nicht gefunden werden.";
                document.getElementById('username').style.borderColor = "red"
            }
            if (status == 403) {
                pw.innerHTML = " Falsches Passwort! Versuchen Sie es erneut";
                document.getElementById('password').style.borderColor = "red"
                

            }

            if (status == 200) {

                //redirects to the right panel
                res.json().then(json => {

                    if (json.type == "normal") {
                        document.cookie = "username=" + json.username;
                        document.cookie = "type=" + json.type;
                        location.replace("calendar.html")
                    } else {
                        document.cookie = "username=" + json.username;
                        document.cookie = "type=" + json.type;
                        location.replace("admin.html")
                    }

                })
            }
        });
    }
})

//check if already logged in then redirect to panel
function checkaccess() {
    var type = readCookie('type');
    var username = readCookie('username');
    
    if(type == "admin")
    {
        location.replace("admin.html")
        var usernamespan = document.getElementById('username')
        usernamespan.innerHTML = ' Angemeldet als: '+ username+   '&nbsp; &nbsp;';
    }
    if(type == "normal"){
        location.replace("calendar.html")
        var usernamespan = document.getElementById('username')
        usernamespan.innerHTML = ' Angemeldet als: '+ username+   '&nbsp; &nbsp;';
    }
    
    
    
}

//read cookies
function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}