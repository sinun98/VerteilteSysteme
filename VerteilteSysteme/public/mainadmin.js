//admin functions

//abmelden
function abmelden() {
    document.cookie = "type=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    location.replace("index.html")
}

//check if admin access
function checkaccessadminmain() {
    var type = readCookie('type');
    var username = readCookie('username');

    if (type == "normal") {
        location.replace("calendar.html")
    }
    if (type !== "admin") {
        location.replace("index.html")
    }
    if (type == "admin") {
        var usernamespan = document.getElementById('username')
        usernamespan.innerHTML = ' Angemeldet als: ' + username + '&nbsp; &nbsp;';
    }


}

//read Cookies
function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}


//change password function
function changepw() {
    //get values
    var username= readCookie('username');
    var oldpassword = document.getElementById('passwordold').value
    var newpassword = document.getElementById('passwordnew').value
    var newpasswordwdh = document.getElementById('passwordnewwdh').value
    console.log(oldpassword)

    var oldpasswordalert = document.getElementById('passwordoldalert')
    var newpasswordalert = document.getElementById('passwordnewalert')
    var newpasswordwdhalert = document.getElementById('passwordnewwdhalert')

    document.getElementById('passwordold').style.borderColor = "black"
    document.getElementById('passwordnew').style.borderColor = "black"
    document.getElementById('passwordnewwdh').style.borderColor = "black"
    oldpasswordalert.innerHTML = '';
    newpasswordalert.innerHTML = '';
    newpasswordwdhalert.innerHTML = '';
    document.getElementById('successlog').innerHTML = ''; 
    

    //check if all fields are filled
    if (oldpassword == "") {



        oldpasswordalert.innerHTML = ' Bitte altes Passwort eingeben.';
        document.getElementById('passwordold').style.borderColor = "red"
    } else if (newpassword == "") {



        newpasswordalert.innerHTML = ' Bitte neues Passwort eingeben.';
        document.getElementById('passwordnew').style.borderColor = "red"
    } else if (newpasswordwdh == "") {



        newpasswordwdhalert.innerHTML = ' Bitte neues Passwort erneut eingeben.';
        document.getElementById('passwordnewwdh').style.borderColor = "red"
    } else if (newpassword !== newpasswordwdh) {



        newpasswordwdhalert.innerHTML = ' Passwörter stimmen nicht überein.';
        document.getElementById('passwordnew').style.borderColor = "red"
        document.getElementById('passwordnewwdh').style.borderColor = "red"
    } else {


        const values = {
            username: username,
            passwordold: oldpassword,
            passwordnew: newpassword

        }

        //send new data to backend
        fetch('http://localhost:3000/api/updatepw', {
            method: 'POST',

            headers: {

                'content-type': 'application/json',

            },
            body: JSON.stringify(values)
        }).then(res => {
            
            const status = res.status;

            if (status == 403) {
                document.getElementById('passwordoldalert').innerHTML = ' Falsches Passwort.';
                document.getElementById('passwordold').style.borderColor = "red"
            }


            if (status == 200) {
                var txt = document.getElementById('passwordold');
                txt.value = '';
                var txt1 = document.getElementById('passwordnew');
                txt1.value = '';
                var txt2 = document.getElementById('passwordnewwdh');
                txt2.value = '';

                document.getElementById('successlog').innerHTML = 'Password erfolgreich geändert.'; 
            }
        });





    }

}

//save Vorelesung
function savevorlesungfunction(){

    var alertbox = document.getElementById('alerttext');
    var alertheader = document.getElementById('alertheader');

    var vorlesungnamealert = document.getElementById('vorlesungalert');
    vorlesungnamealert.innerHTML = '';

    var startdatealert = document.getElementById('startalert');
    startdatealert.innerHTML = '';

    var enddatealert = document.getElementById('endalert');
    enddatealert.innerHTML = '';

    document.getElementById('vorlesungname').style.borderColor = "black"
    document.getElementById('startdate').style.borderColor = "black"
    document.getElementById('enddate').style.borderColor = "black"

    var vorlesung = document.getElementById('vorlesungname').value
    var startdate = document.getElementById('startdate').value
    var enddate = document.getElementById('enddate').value

    startd = new Date(startdate);
    endd = new Date(enddate);
    //check if all fields are filled correct
    if (vorlesung == "") {

        alertheader.innerHTML = 'Error';
        alertbox.innerHTML = ' Bitte Vorlesungsbezeichnung eingeben.';


        document.getElementById('vorlesungname').style.borderColor = "red"

    } else if (startdate == "") {

        alertheader.innerHTML = 'Error';
        alertbox.innerHTML = ' Bitte Vorlesungsbeginn eingeben.';



        document.getElementById('startdate').style.borderColor = "red"

    } else if (enddate == "") {

        alertheader.innerHTML = 'Error';
        alertbox.innerHTML = ' Bitte Vorlesungsende eingeben.';



        document.getElementById('enddate').style.borderColor = "red"

    } else if (startd > endd) {

        alertheader.innerHTML = 'Error';
        alertbox.innerHTML = ' Enddatum ist vor dem Startdatum.';



        document.getElementById('enddate').style.borderColor = "red"

    } else {
        const newvorlesung = {
            vorlesung: vorlesung,
            start: startdate,
            ende: enddate

        }
        //send data to backend
        fetch('http://localhost:3000/api/savevorlesung', {
            method: 'POST',

            headers: {

                'content-type': 'application/json',

            },
            body: JSON.stringify(newvorlesung)
        }).then(res => {
            const status = res.status;
            if (status == 200) {
                clearname = document.getElementById("vorlesungname");
                clearname.value = "";
                clearstartdate = document.getElementById("startdate");
                clearstartdate.value = "";
                clearenddate = document.getElementById("enddate");
                clearenddate.value = "";
                alertheader.innerHTML = 'Success';
                alertbox.innerHTML = ' Vorlesung erfolgreich gespeichert.';

            } else if (status == 403) {
                alertheader.innerHTML = 'Error';
                alertbox.innerHTML = 'Vorlesung existiert bereits.';


                document.getElementById('vorlesungname').style.borderColor = "red"



            } else {
                alertheader.innerHTML = 'Error';
                alertbox.innerHTML = 'Vorlesung konnte nicht gespeichert werden.';
            }
        })

    }


}

//check admin access 
function checkaccessadminedit() {
    var type = readCookie('type');
    var username = readCookie('username');

    if (type == "normal") {
        location.replace("calendar.html")
    }
    if (type !== "admin") {
        location.replace("index.html")
    }
    if (type == "admin") {
        var usernamespan = document.getElementById('username')
        usernamespan.innerHTML = ' Angemeldet als: ' + username + '&nbsp; &nbsp;';


        //load all Vorlesungen 
        fetch('http://localhost:3000/api/getvorlesungen', {
                method: 'GET',
                mode: 'no-cors',

                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },

            }).then(res => res.json())
            .then(res => {
                const status = res.status;
                
                //check if tipps.json is emty
                if (res.length == 0) {
                    var dropdown = document.getElementById("vorlesungselect");
                    dropdown.innerHTML += "<option>Keine Vorlesung angelegt.</option>";

                } else {
                    //insert into table
                    var dropdown = document.getElementById("vorlesungselect");
                    for (var i = 0; i < res.length; i++) {
                        var opt = res[i];
                        
                        const d = new Date(opt.start)
                        const startye = new Intl.DateTimeFormat('en', {
                            year: 'numeric'
                        }).format(d)
                        const startmo = new Intl.DateTimeFormat('de', {
                            month: 'numeric'
                        }).format(d)
                        const startda = new Intl.DateTimeFormat('en', {
                            day: '2-digit'
                        }).format(d)
                        const startformat = `${startda}.${startmo}.${startye}`


                        const dd = new Date(opt.ende)
                        const startye1 = new Intl.DateTimeFormat('en', {
                            year: 'numeric'
                        }).format(dd)
                        const startmo1 = new Intl.DateTimeFormat('de', {
                            month: 'numeric'
                        }).format(dd)
                        const startda1 = new Intl.DateTimeFormat('en', {
                            day: '2-digit'
                        }).format(dd)
                        const endformat = `${startda1}.${startmo1}.${startye1}`

                        
                        
                        
                        outformatiert = opt.name + " von: " + startformat + " bis " + endformat 
                        outunformatiert = opt.name + "/" + opt.start + "/" + opt.ende
                        
                        dropdown.innerHTML += "<option value=\"" + outunformatiert + "\">" + outformatiert + "</option>";
                    }


                }
            });

        




    }


}

//start funktion edit Vorlesung 
function editvorlesungfunction(){

    //get values
    var alertbox = document.getElementById('alerttext');
    var alertheader = document.getElementById('alertheader');

    var vorlesungnamealert = document.getElementById('vorlesungalert');
    vorlesungnamealert.innerHTML = '';

    var uhrzeitalert = document.getElementById('uhrzeitalert');
    uhrzeitalert.innerHTML = '';



    document.getElementById('vorlesungselect').style.borderColor = "black"
    document.getElementById('startdate').style.borderColor = "black"
    document.getElementById('enddate').style.borderColor = "black"

    var vorlesungselect = document.getElementById('vorlesungselect').value
    var startnew = document.getElementById('startdate').value
    var endnew = document.getElementById('enddate').value
    var username = readCookie('username');
    var arr = vorlesungselect.split('/');

    name = arr[0]
    startold = arr[1]
    endold = arr[2]
    

    //check if all fields are filled

    if (vorlesungselect == "Keine Vorlesung angelegt.") {

        alertheader.innerHTML = 'Error';
        alertbox.innerHTML = ' Bitte Vorlesung anlegen.';


        document.getElementById('vorlesungselect').style.borderColor = "red"

    } else if (startnew == "") {

        alertheader.innerHTML = 'Error';
        alertbox.innerHTML = ' Bitte Startdatum eingeben.';


        document.getElementById('startdate').style.borderColor = "red"

    } 
     else if (endnew == "") {

        alertheader.innerHTML = 'Error';
        alertbox.innerHTML = ' Bitte Enddatum eingeben.';



        document.getElementById('enddate').style.borderColor = "red"

    } else {
        const vorlesung = {
            name: name,
            startold: startold,
            endold: endold,
            startnew: startnew,
            endnew: endnew
            

        }
        //send data to backend
        fetch('http://localhost:3000/api/editvorlesung', {
            method: 'PATCH',

            headers: {

                'content-type': 'application/json',

            },
            body: JSON.stringify(vorlesung)
        }).then(res => {
            const status = res.status;

            if (status == 200) {
                location.reload();

                
                

            }  else {
                alertheader.innerHTML = 'Error';
                alertbox.innerHTML = 'Vorlesung konnte nicht geupdatet werden.';
            }
        })

    }
}



function checkaccessadmindelete() {
    //check access
    var type = readCookie('type');
    var username = readCookie('username');

    if (type == "normal") {
        location.replace("calendar.html")
    }
    if (type !== "admin") {
        location.replace("index.html")
    }
    if (type == "admin") {
        var usernamespan = document.getElementById('username')
        usernamespan.innerHTML = ' Angemeldet als: ' + username + '&nbsp; &nbsp;';


        //get data 
        fetch('http://localhost:3000/api/getvorlesungen', {
                method: 'GET',
                mode: 'no-cors',

                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },

            }).then(res => res.json())
            .then(res => {
                const status = res.status;
                //console.log(res)
                //check if tipps.json is emty
                if (res.length == 0) {
                    var dropdown = document.getElementById("vorlesungselect");
                    dropdown.innerHTML += "<option>Keine Vorlesung angelegt.</option>";

                } else {
                    var dropdown = document.getElementById("vorlesungselect");
                    for (var i = 0; i < res.length; i++) {
                        var opt = res[i];
                        
                        const d = new Date(opt.start)
                        const startye = new Intl.DateTimeFormat('en', {
                            year: 'numeric'
                        }).format(d)
                        const startmo = new Intl.DateTimeFormat('de', {
                            month: 'numeric'
                        }).format(d)
                        const startda = new Intl.DateTimeFormat('en', {
                            day: '2-digit'
                        }).format(d)
                        const startformat = `${startda}.${startmo}.${startye}`


                        const dd = new Date(opt.ende)
                        const startye1 = new Intl.DateTimeFormat('en', {
                            year: 'numeric'
                        }).format(dd)
                        const startmo1 = new Intl.DateTimeFormat('de', {
                            month: 'numeric'
                        }).format(dd)
                        const startda1 = new Intl.DateTimeFormat('en', {
                            day: '2-digit'
                        }).format(dd)
                        const endformat = `${startda1}.${startmo1}.${startye1}`

                        
                        
                        
                        outformatiert = opt.name + " von: " + startformat + " bis " + endformat 
                        outunformatiert = opt.name + "/" + opt.start + "/" + opt.ende
                        
                        dropdown.innerHTML += "<option value=\"" + outunformatiert + "\">" + outformatiert + "</option>";
                    }


                }
            });

        




    }


}


function deletevorlesungfunction(){
    //get values

    var alertbox = document.getElementById('alerttext');
    var alertheader = document.getElementById('alertheader');

    var vorlesungnamealert = document.getElementById('vorlesungalert');
    vorlesungnamealert.innerHTML = '';

    


    document.getElementById('vorlesungselect').style.borderColor = "black"
    

    var vorlesungselect = document.getElementById('vorlesungselect').value
    
    var arr = vorlesungselect.split('/');

    vorlesung = arr[0]
    startdatum = arr[1]
    enddatum = arr[2]
    



    if (vorlesungselect == "Keine Vorlesung angelegt.") {

        alertheader.innerHTML = 'Error';
        alertbox.innerHTML = ' Bitte Vorlesung anlegen.';


        document.getElementById('vorlesungselect').style.borderColor = "red"

    } 
    else {
        const deletevorlesung = {
            
            vorlesung: vorlesung,
            start: startdatum,
            ende: enddatum

        }
        //send delete data to backend 
        fetch('http://localhost:3000/api/deletevorlesung', {
            method: 'DELETE',

            headers: {

                'content-type': 'application/json',

            },
            body: JSON.stringify(deletevorlesung)
        }).then(res => {
            const status = res.status;

            if (status == 200) {
                location.reload();

                
                

            }  else {
                alertheader.innerHTML = 'Error';
                alertbox.innerHTML = 'Vorlesung konnte nicht gelöscht werden.';
            }
        })

    }


}




function checkaccessvorlesungoverview() {
    var type = readCookie('type');
    var username = readCookie('username');

    if (type == "normal") {
        location.replace("calendar.html")
    }
    if (type !== "admin") {
        location.replace("index.html")
    }
    if (type == "admin") {
        var usernamespan = document.getElementById('username')
        usernamespan.innerHTML = ' Angemeldet als: ' + username + '&nbsp; &nbsp;';


        //load vorlesungen and create table
        fetch('http://localhost:3000/api/getvorlesungen', {
                method: 'GET',
                mode: 'no-cors',

                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },

            }).then(res => res.json())
            .then(res => {
                const status = res.status;
                
                //check if tipps.json is emty
                if (res.length == 0) {
                    var table = document.getElementById("tablebody");
                    table.innerHTML += '<td colspan="4">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Keine Vorlesung angelegt.</td>';

                } else {
                    var table = document.getElementById("tablebody");
                    for (var i = 0; i < res.length; i++) {
                        var opt = res[i];
                        
                        const d = new Date(opt.start)
                        const startye = new Intl.DateTimeFormat('en', {
                            year: 'numeric'
                        }).format(d)
                        const startmo = new Intl.DateTimeFormat('de', {
                            month: 'numeric'
                        }).format(d)
                        const startda = new Intl.DateTimeFormat('en', {
                            day: '2-digit'
                        }).format(d)
                        const startformat = `${startda}.${startmo}.${startye}`


                        const dd = new Date(opt.ende)
                        const startye1 = new Intl.DateTimeFormat('en', {
                            year: 'numeric'
                        }).format(dd)
                        const startmo1 = new Intl.DateTimeFormat('de', {
                            month: 'numeric'
                        }).format(dd)
                        const startda1 = new Intl.DateTimeFormat('en', {
                            day: '2-digit'
                        }).format(dd)
                        const endformat = `${startda1}.${startmo1}.${startye1}`

                        
                        
                        
                        
                        
                        
                        
                        table.innerHTML += '<tr><th scope="row">'+(i+1)+'</th><td>'+opt.name+'</td><td>'+startformat+'</td><td>'+endformat+'</td></tr>';
                    }


                }
            });

        




    }


}