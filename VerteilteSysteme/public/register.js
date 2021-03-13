document.getElementById('register').addEventListener('click', (event) => {
    //get new input values
    var user = document.getElementById('usernamealert');
    user.innerHTML = '';

    var pw = document.getElementById('passwordalert');
    pw.innerHTML = '';

    var pwwdh = document.getElementById('passwordwdhalert');
    pwwdh.innerHTML = '';

    document.getElementById('password').style.borderColor = "black"
    document.getElementById('username').style.borderColor = "black"
    document.getElementById('passwordwdh').style.borderColor = "black"

    var username = document.getElementById('username').value
    var password = document.getElementById('password').value
    var passwordwdh = document.getElementById('passwordwdh').value
    //check if all fields are filled

    if (username == "") {



        user.innerHTML = ' Bitte Username eingeben.';
        document.getElementById('username').style.borderColor = "red"
    } else if (password == "") {



        pw.innerHTML = ' Bitte Passwort eingeben.';
        document.getElementById('password').style.borderColor = "red"
    } else if (passwordwdh == "") {



        pwwdh.innerHTML = ' Bitte Passwort erneut eingeben.';
        document.getElementById('passwordwdh').style.borderColor = "red"
    } else if (passwordwdh !== password) {



        pwwdh.innerHTML = ' Passwörter stimmen nicht überein.';
        document.getElementById('passwordwdh').style.borderColor = "red"
        document.getElementById('password').style.borderColor = "red"
    } else {



        const values = {
            username: username,
            password: password

        }

        //send register data
        fetch('http://localhost:3000/api/register', {
            method: 'POST',

            headers: {

                'content-type': 'application/json',

            },
            body: JSON.stringify(values)
        }).then(res => {
            console.log(res.body)
            const status = res.status;

            if (status == 403) {
                user.innerHTML = ' User existiert bereits.';
                document.getElementById('username').style.borderColor = "red"
            }


            if (status == 200) {

                //location.replace("user.html")
                res.json().then(json => {

                document.cookie = "username=" + username;
                document.cookie = "type=normal";
                location.replace("calendar.html")


                })
            }
        });
    }
})
//cehck if already logged in 
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