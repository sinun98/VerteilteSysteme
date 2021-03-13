
//delete konto
function deletekonto() {
    var username= readCookie('username');


    //send data to backend
    fetch('http://localhost:3000/api/deleteuser/'+username, {
            method: 'DELETE',

            headers: {

                'content-type': 'application/json',

            }
            
        }).then(res => {
            const status = res.status;

            if (status == 200) {
                document.cookie = "type=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

                location.replace("index.html")

                
                

            }  else {
                alertheader.innerHTML = 'Error';
                alertbox.innerHTML = 'User nicht gefunden.';
            }
        })

    
}

//abmelden
function abmelden() {
    document.cookie = "type=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    location.replace("index.html")
}
//readCookies
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
//changePassword
function changepw() {
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

        //send update pw data
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

function checkaccessmain() {
    //checkaccess
    var type = readCookie('type');
    var username = readCookie('username');

    if (type == "admin") {
        location.replace("admin.html")
    }
    if (type !== "normal") {
        location.replace("index.html")
    }
    if (type == "normal") {
        var usernamespan = document.getElementById('username')
        usernamespan.innerHTML = ' Angemeldet als: ' + username + '&nbsp; &nbsp;';


        //load Termine
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
                    dropdown.innerHTML += "<option>Keine Vorlesungen angelegt. Bitte Admin kontaktieren.</option>";

                } else {
                    var dropdown = document.getElementById("vorlesungselect");
                    //create dropdown 
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
                        const endeye = new Intl.DateTimeFormat('en', {
                            year: 'numeric'
                        }).format(dd)
                        const endemo = new Intl.DateTimeFormat('de', {
                            month: 'numeric'
                        }).format(dd)
                        const endeda = new Intl.DateTimeFormat('en', {
                            day: '2-digit'
                        }).format(dd)
                        const endeformat = `${endeda}.${endemo}.${endeye}`
                        outformatiert = opt.name + " von: " + startformat + " bis " + endeformat
                        outunformatiert = opt.name + ":" + opt.start + ":" + opt.ende
                        dropdown.innerHTML += "<option value=\"" + outunformatiert + "\">" + outformatiert + "</option>";
                    }


                }
            });

        var dropdown = document.getElementById("vorlesungselect");




    }


}

//startfunction delete 
function checkaccessdelete() {
    var type = readCookie('type');
    var username = readCookie('username');
    //check access
    if (type == "admin") {
        location.replace("admin.html")
    }
    if (type !== "normal") {
        location.replace("index.html")
    }
    if (type == "normal") {
        var usernamespan = document.getElementById('username')
        usernamespan.innerHTML = ' Angemeldet als: ' + username + '&nbsp; &nbsp;';


        //load termin backend
        fetch('http://localhost:3000/api/gettermin/'+username, {
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
                    var dropdown = document.getElementById("terminselect");
                    dropdown.innerHTML += "<option>Keine Termine angelegt.</option>";

                } else {
                    var dropdown = document.getElementById("terminselect");
                    for (var i = 0; i < res.length; i++) {
                        //load termine in dropdown
                        var opt = res[i];
                        
                        const d = new Date(opt.tag)
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
                        
                        
                        outformatiert = opt.vorlesung + " am: " + startformat + " um " + opt.uhrzeit +" Uhr"
                        outunformatiert = opt.vorlesung + "/" + opt.tag + "/" + opt.uhrzeit
                        dropdown.innerHTML += "<option value=\"" + outunformatiert + "\">" + outformatiert + "</option>";
                    }


                }
            });

        




    }


}



function checkaccessedit() {
    //check access edit
    var type = readCookie('type');
    var username = readCookie('username');

    if (type == "admin") {
        location.replace("admin.html")
    }
    if (type !== "normal") {
        location.replace("index.html")
    }
    if (type == "normal") {
        var usernamespan = document.getElementById('username')
        usernamespan.innerHTML = ' Angemeldet als: ' + username + '&nbsp; &nbsp;';


        //load Termine
        fetch('http://localhost:3000/api/gettermin/'+username, {
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
                    var dropdown = document.getElementById("terminselect");
                    dropdown.innerHTML += "<option>Keine Termine angelegt.</option>";

                } else {
                    var dropdown = document.getElementById("terminselect");
                    for (var i = 0; i < res.length; i++) {
                        //load in dropdown
                        var opt = res[i];
                        
                        const d = new Date(opt.tag)
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
                        
                        
                        outformatiert = opt.vorlesung + " am: " + startformat + " um " + opt.uhrzeit +" Uhr"
                        outunformatiert = opt.vorlesung + "/" + opt.tag + "/" + opt.uhrzeit
                        dropdown.innerHTML += "<option value=\"" + outunformatiert + "\">" + outformatiert + "</option>";
                    }


                }
            });

        




    }


}



function checkaccessoverview() {
    var type = readCookie('type');
    var username = readCookie('username');

    if (type == "admin") {
        location.replace("admin.html")
    }
    if (type !== "normal") {
        location.replace("index.html")
    }
    if (type == "normal") {
        var usernamespan = document.getElementById('username')
        usernamespan.innerHTML = ' Angemeldet als: ' + username + '&nbsp; &nbsp;';


        //load termine
        fetch('http://localhost:3000/api/gettermin/'+username, {
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
                    table.innerHTML += '<td colspan="4"><p class="text-center" >Keine Termine angelegt.</p></td>';

                } else {
                    var table = document.getElementById("tablebody");
                    for (var i = 0; i < res.length; i++) {
                        //load table
                        var opt = res[i];
                        console.log(opt)
                        const d = new Date(opt.tag)
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
                        
                        
                        
                        table.innerHTML += '<tr><th scope="row">'+(i+1)+'</th><td>'+opt.vorlesung+'</td><td>'+startformat+'</td><td>'+opt.uhrzeit+'</td></tr>';
                    }


                }
            });

        




    }


}

function saveterminfunction() {
    //save termin
    var alertbox = document.getElementById('alerttext');
    var alertheader = document.getElementById('alertheader');

    var vorlesungnamealert = document.getElementById('vorlesungalert');
    vorlesungnamealert.innerHTML = '';

    var uhrzeitalert = document.getElementById('uhrzeitalert');
    uhrzeitalert.innerHTML = '';



    document.getElementById('vorlesungselect').style.borderColor = "black"
    document.getElementById('vorlesungstag').style.borderColor = "black"
    document.getElementById('uhrzeit').style.borderColor = "black"

    var vorlesungselect = document.getElementById('vorlesungselect').value
    var vorlesungstag = document.getElementById('vorlesungstag').value
    var uhrzeit = document.getElementById('uhrzeit').value
    var username = readCookie('username');
    var arr = vorlesungselect.split(':');

    startd = new Date(arr[1]);
    endd = new Date(arr[2]);
    vergleichdate = new Date(vorlesungstag);
    console.log(vorlesungselect)

    //cehck if all fields are filled correct

    if (vorlesungselect == "Keine Vorlesungen angelegt. Bitte Admin kontaktieren.") {

        alertheader.innerHTML = 'Error';
        alertbox.innerHTML = ' Bitte Vorlesung auswählen.';


        document.getElementById('vorlesungselect').style.borderColor = "red"

    } else if (vorlesungstag == "") {

        alertheader.innerHTML = 'Error';
        alertbox.innerHTML = ' Bitte Vorlesungstag eingeben.';


        document.getElementById('vorlesungstag').style.borderColor = "red"

    } else if (vergleichdate > endd || vergleichdate < startd) {

        alertheader.innerHTML = 'Error';
        alertbox.innerHTML = ' Datum ist außerhalb des Vorlesungszeitraumes.';


        document.getElementById('vorlesungstag').style.borderColor = "red"

    } else if (uhrzeit == "") {

        alertheader.innerHTML = 'Error';
        alertbox.innerHTML = ' Bitte Uhrzeit eingeben.';



        document.getElementById('uhrzeit').style.borderColor = "red"

    } else {
        const newtermin = {
            user: username,
            vorlesung: arr[0],
            tag: vorlesungstag,
            uhrzeit: uhrzeit

        }
        //send data to backend
        fetch('http://localhost:3000/api/savetermin', {
            method: 'POST',

            headers: {

                'content-type': 'application/json',

            },
            body: JSON.stringify(newtermin)
        }).then(res => {
            const status = res.status;

            if (status == 200) {

                alertheader.innerHTML = 'Success';
                alertbox.innerHTML = ' Termin erfolgreich gespeichert.';
                cleardate = document.getElementById("vorlesungstag");
                cleardate.value = "";
                
            } else if (status == 403) {

                alertheader.innerHTML = 'Error';
                alertbox.innerHTML = ' Termin existiert bereits.';
                document.getElementById('vorlesungstag').style.borderColor = "red"
                document.getElementById('uhrzeit').style.borderColor = "red"


            } else {
                alertheader.innerHTML = 'Error';
                alertbox.innerHTML = 'Termin konnte nicht gespeichert werden.';
            }
        })

    }





}

function deleteterminfunktion(){
    //delete funktion
    var alertbox = document.getElementById('alerttext');
    var alertheader = document.getElementById('alertheader');

    var vorlesungnamealert = document.getElementById('vorlesungalert');
    vorlesungnamealert.innerHTML = '';

    


    document.getElementById('terminselect').style.borderColor = "black"
    

    var vorlesungselect = document.getElementById('terminselect').value
    var username = readCookie('username');
    var arr = vorlesungselect.split('/');

    vorlesung = arr[0]
    vorlesungstag = arr[1]
    uhrzeit = arr[2]
    



    if (vorlesungselect == "Keine Termine angelegt.") {

        alertheader.innerHTML = 'Error';
        alertbox.innerHTML = ' Bitte Termin anlegen.';


        document.getElementById('terminselect').style.borderColor = "red"

    } 
    else {
        const deletetermin = {
            user: username,
            vorlesung: vorlesung,
            tag: vorlesungstag,
            uhrzeit: uhrzeit

        }
        //send data tp backend
        fetch('http://localhost:3000/api/deletetermin', {
            method: 'DELETE',

            headers: {

                'content-type': 'application/json',

            },
            body: JSON.stringify(deletetermin)
        }).then(res => {
            const status = res.status;

            if (status == 200) {
                location.reload();

                
                

            }  else {
                alertheader.innerHTML = 'Error';
                alertbox.innerHTML = 'Termin konnte nicht gelöscht werden.';
            }
        })

    }


}




function usereditfunction(){
    //Termin edit funktion

    var alertbox = document.getElementById('alerttext');
    var alertheader = document.getElementById('alertheader');

    var vorlesungnamealert = document.getElementById('vorlesungalert');
    vorlesungnamealert.innerHTML = '';

    var uhrzeitalert = document.getElementById('uhrzeitalert');
    uhrzeitalert.innerHTML = '';



    document.getElementById('terminselect').style.borderColor = "black"
    document.getElementById('vorlesungstag').style.borderColor = "black"
    document.getElementById('uhrzeit').style.borderColor = "black"

    var vorlesungselect = document.getElementById('terminselect').value
    var vorlesungstag = document.getElementById('vorlesungstag').value
    var uhrzeit = document.getElementById('uhrzeit').value
    var username = readCookie('username');
    var arr = vorlesungselect.split('/');

    vorlesung = arr[0]
    dateold = arr[1]
    uhrzeitold = arr[2]
    


    //check if all fields are filled
    if (vorlesungselect == "Keine Termine angelegt.") {

        alertheader.innerHTML = 'Error';
        alertbox.innerHTML = ' Bitte Termin anlegen.';


        document.getElementById('terminselect').style.borderColor = "red"

    } else if (vorlesungstag == "") {

        alertheader.innerHTML = 'Error';
        alertbox.innerHTML = ' Bitte Vorlesungstag eingeben.';


        document.getElementById('vorlesungstag').style.borderColor = "red"

    } 
     else if (uhrzeit == "") {

        alertheader.innerHTML = 'Error';
        alertbox.innerHTML = ' Bitte Uhrzeit eingeben.';



        document.getElementById('uhrzeit').style.borderColor = "red"

    } else {
        const edittermin = {
            user: username,
            vorlesung: vorlesung,
            tagold: dateold,
            uhrzeitold: uhrzeitold,
            tag: vorlesungstag,
            uhrzeit: uhrzeit

        }
        //send data to backend 
        fetch('http://localhost:3000/api/edit', {
            method: 'PATCH',

            headers: {

                'content-type': 'application/json',

            },
            body: JSON.stringify(edittermin)
        }).then(res => {
            const status = res.status;

            if (status == 200) {
                location.reload();

                
                

            } 
            else if (status == 403) {
                alertheader.innerHTML = 'Error';
                alertbox.innerHTML = 'Datum bereits belegt.';

               
                

            }  else {
                alertheader.innerHTML = 'Error';
                alertbox.innerHTML = 'Termin konnte nicht geupdatet werden.';
            }
        })

    }
}



//check access overview page
function checkaccessoverviewspezifisch() {
    var type = readCookie('type');
    var username = readCookie('username');

    if (type == "admin") {
        location.replace("admin.html")
    }
    if (type !== "normal") {
        location.replace("index.html")
    }
    if (type == "normal") {
        var usernamespan = document.getElementById('username')
        usernamespan.innerHTML = ' Angemeldet als: ' + username + '&nbsp; &nbsp;';  

    }


}


//overview funktion
function showoverview() {
    var alertbox = document.getElementById('alerttext');
    var alertheader = document.getElementById('alertheader');
    var rahmenbeginn = document.getElementById('rahmenbeginn').value;
    var rahmenende = document.getElementById('rahmenende').value;
    const date1 = new Date(rahmenbeginn)
    const date2 = new Date(rahmenende)
    var username = readCookie('username');
    document.getElementById('rahmenbeginn').style.borderColor = "black"
    document.getElementById('rahmenende').style.borderColor = "black"
    const zeitraum={"von":rahmenbeginn,"bis":rahmenende}
    //check if all fields are filled
    if(rahmenbeginn==""){
        alertheader.innerHTML = 'Error';
        alertbox.innerHTML = ' Bitte Rahmenbeginn auswählen.';
        $('#allertinfo').modal('show');

        


        document.getElementById('rahmenbeginn').style.borderColor = "red"

    }
    else if(rahmenende==""){
        alertheader.innerHTML = 'Error';
        alertbox.innerHTML = ' Bitte Rahmenende auswählen.';
        $('#allertinfo').modal('show');


        document.getElementById('rahmenende').style.borderColor = "red"

    }
    else if(date2<date1){
        alertheader.innerHTML = 'Error';
        alertbox.innerHTML = ' Enddatum ist vor dem Startdatum.';
        $('#allertinfo').modal('show');


        document.getElementById('rahmenende').style.borderColor = "red"

    }
    else{
        //request termin data backend
        fetch('http://localhost:3000/api/getterminspezifisch/'+username, {
            method: 'POST',

            headers: {

                'content-type': 'application/json',

            },
            body: JSON.stringify(zeitraum)
                

            }).then(res => res.json())
            .then(res => {
                const status = res.status;
                console.log(res);
                //check if tipps.json is emty
                if (res.length == 0) {
                    var table = document.getElementById("tablebody");
                    table.innerHTML = '<td colspan="4"><p class="text-center" >Keine Termine gefunden.</p></td>';

                } else {
                    var table = document.getElementById("tablebody");
                    table.innerHTML = '';
                    for (var i = 0; i < res.length; i++) {
                        //create table
                        var opt = res[i];
                        console.log(opt.vorlesung)
                        const d3 = new Date(opt.tag)
                        const startye = new Intl.DateTimeFormat('en', {
                            year: 'numeric'
                        }).format(d3)
                        const startmo = new Intl.DateTimeFormat('de', {
                            month: 'numeric'
                        }).format(d3)
                        const startda = new Intl.DateTimeFormat('en', {
                            day: '2-digit'
                        }).format(d3)
                        const startformat = `${startda}.${startmo}.${startye}`
                        
                        
                        
                        table.innerHTML += '<tr><th scope="row">'+(i+1)+'</th><td>'+opt.vorlesung+'</td><td>'+startformat+'</td><td>'+opt.uhrzeit+'</td></tr>';
                    }


                }
            });







    }


}