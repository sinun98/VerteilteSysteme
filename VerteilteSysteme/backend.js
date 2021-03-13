// backend.js
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.static("public"));
app.use(require("body-parser").json());


const file = require("./user.json");




//await login data
app.post('/api/login', (req, res) => {

    const data = req.body;
    username = data.username
    pw = data.password


    userCount = file.User.length
    //check for right password
    for (var i = 0; i < userCount; i++) {

        if (file.User[i].name == username) {

            if (file.User[i].password == pw) {
                return res.status(200).json({
                    "type": file.User[i].type,
                    "username": username

                });

            } else {
                return res.status(403).json({
                    "error": "wrong password",

                });
            }


        }



    }
    return res.status(404).json({
        "error": "user not exists"
    });



});

//await register data
app.post('/api/register', (req, res) => {
    const data = req.body;
    username = data.username

    pw = data.password
    var form = '{"name":"' + username + '","type":"normal","password":"' + pw + '","termine":[]}';

    var myObj = JSON.parse(form);


    userCount=file.User.length
    //check if user already exists
    for (var i = 0; i < userCount; i++) {
        if (file.User[i].name == username) {
            return res.status(403).json({
                "error": "user already exists"
            });
        } 
    }
    file.User.push(myObj);
    userCount++;

    return res.status(200).json({
        "success": "new user registered"
    });


});


//save vorelsung
app.post('/api/savevorlesung', (req, res) => {

    const data = req.body;
    vorlesungnew = data.vorlesung
    start = data.start
    ende = data.ende
    var form = '{"name":"' + vorlesungnew + '","start":"'+start+'","ende":"' + ende + '"}';

    var myObj = JSON.parse(form);




    for (var i = 0; i < vorlesungCount; i++) {

        if (vorlesung[i].name == vorlesungnew) {

            return res.status(403).json({
                "error": "already exists",

            });

            


        }



    }
    //save Vorlesung
    file.Vorlesung.push(myObj);
    vorlesungCount++;
    
    return res.status(200).json({
        "success": "saved successful"
    });



});


//save termin
app.post('/api/savetermin', (req, res) => {

    const data = req.body;
    usern=data.user
    vorlesung = data.vorlesung
    tag = data.tag
    uhrzeit = data.uhrzeit
    var form = '{"vorlesung":"' + vorlesung + '","tag":"'+tag+'","uhrzeit":"' + uhrzeit + '"}';

    var myObj = JSON.parse(form);

    var globalob = '{"name":"' + vorlesung + '","dozent":"' + usern + '","datum":"'+tag+'","uhrzeit":"' + uhrzeit + '"}';

    var globalobjson = JSON.parse(globalob);

    userCount = file.User.length
    terminglobalCount = file.alletermine.length

    //check if termin is free  global
    for (var i = 0; i < terminglobalCount; i++) {
        //console.log(file.alletermine[i].datum)
        //console.log(file.alletermine[i].uhrzeit)
        if(file.alletermine[i].datum == tag && file.alletermine[i].uhrzeit == uhrzeit  ){
            return res.status(403).json({
                "error": "already  in use global",
        
            });
        }


    }

    //check if termin is free  personal
    for (var i = 0; i < userCount; i++) {

        if (file.User[i].name == usern) {
       
            let terminCount = file.User[i].termine.length
            for (var uu = 0; uu < terminCount; uu++) {
                if(file.User[i].termine[uu].tag == tag && file.User[i].termine[uu].uhrzeit == uhrzeit  ){
                    return res.status(403).json({
                        "error": "already exists",
                
                    });

                }
            }

            
            for (var ind = 0; ind <= terminCount; ind++) {
           
                
                if(terminCount==0){
                    file.User[i].termine.push(myObj);
                    file.alletermine.push(globalobjson);
                   
                    return res.status(200).json({
                            "success": "successful saved",
                    
                        });

                }
                
            
                //save into right place
                datetemp=file.User[i].termine[ind].tag
                uhrzeittemp=file.User[i].termine[ind].uhrzeit


                const d = new Date(tag)
                const startye = new Intl.DateTimeFormat('en', {
                            year: 'numeric'
                        }).format(d)
                const startmo = new Intl.DateTimeFormat('de', {
                            month: 'numeric'
                        }).format(d)
                const startda = new Intl.DateTimeFormat('en', {
                            day: '2-digit'
                        }).format(d)
                if(uhrzeit=="09:00"){
                    h=9;
                    m=0;

                }else{
                    h=13;
                    m=15;
                }


                const dd = new Date(datetemp)
                const startyed = new Intl.DateTimeFormat('en', {
                            year: 'numeric'
                        }).format(dd)
                const startmod = new Intl.DateTimeFormat('de', {
                            month: 'numeric'
                        }).format(dd)
                const startdad = new Intl.DateTimeFormat('en', {
                            day: '2-digit'
                        }).format(dd)
                if(uhrzeittemp=="09:00"){
                    hd=9;
                    md=0;

                }else{
                    hd=13;
                    md=15;
                }
          
                datetoinsert= new Date(startye,startmo,startda,h,m)
                comparedate=new Date(startyed,startmod,startdad,hd,md)
                if(datetoinsert<=comparedate){
                    file.User[i].termine.splice(ind, 0, myObj);
                    file.alletermine.push(globalobjson);
                   
                    return res.status(200).json({
                        "success": "successful saved",
                
                    });

                }
                tempvar=terminCount-1
                if(ind==tempvar){
                    file.User[i].termine.splice(ind+1, 0, myObj);
                    file.alletermine.push(globalobjson);
              
                    return res.status(200).json({
                        "success": "successful saved",
                
                    });

                }
            }
            

        }
        



    }
    return res.status(404).json({
        "error": "user not found",

    });
    

});

//send all global vorlesungen to client
app.get("/api/getallvorlesungen", (req, res) => {
    vorlesungCount = file.alletermine.length
    if (vorlesungCount == 0) {
        return res.status(404).json({
            "error": "Keine Vorlesungen gespeichert!"
        });
    }
    
    return res.status(200).json(file.alletermine);
});


//send all User saved vorlesungen  to client
app.get("/api/getvorlesungen", (req, res) => {
    vorlesungCount = file.Vorlesung.length
    if (vorlesungCount == 0) {
        return res.status(404).json({
            "error": "Keine Vorlesungen gespeichert!"
        });
    }
    
    return res.status(200).json(file.Vorlesung);
});

//send all saved termins of user
app.get("/api/gettermin/:username", (req, res) => {

    userCount=file.User.length
    for (var i = 0; i < userCount; i++) {
        
        if (file.User[i].name == req.params.username) {
            let terminCount = file.User[i].termine.length
            if(terminCount==0){
                return res.status(404).json([]);
           } 
           
            return res.status(200).json(file.User[i].termine);
            

        }
        
        
        



    }
    return res.status(403).json({
        "error": "User nicht gefunden."
    });
       
   
});


//edit Termin
app.patch("/api/edit", (req, res) => {
    const data = req.body;
    usernamee=data.user
    vorlesung=data.vorlesung
    tagold=data.tagold
    uhrzeitold=data.uhrzeitold
    tag=data.tag
    uhrzeit=data.uhrzeit

    var form = '{"vorlesung":"' + vorlesung + '","tag":"'+tag+'","uhrzeit":"' + uhrzeit + '"}';

    var myObj = JSON.parse(form);

    var globalob = '{"name":"' + vorlesung + '","dozent":"' + usernamee + '","datum":"'+tag+'","uhrzeit":"' + uhrzeit + '"}';

    var globalobjson = JSON.parse(globalob);

    userCount = file.User.length
    terminglobalCount = file.alletermine.length

    console.log(file.alletermine)

    for (var i = 0; i < userCount; i++) {
        //search old Termin
        if (file.User[i].name == usernamee) {
            let terminCount = file.User[i].termine.length
            for (var uuu = 0; uuu < terminCount; uuu++) {
                if(file.User[i].termine[uuu].vorlesung == vorlesung && file.User[i].termine[uuu].tag == tagold && file.User[i].termine[uuu].uhrzeit == uhrzeitold  ){

                    
                    //check if new termin is free local 


                    let terminCount = file.User[i].termine.length
            for (var uu = 0; uu < terminCount; uu++) {
                if( file.User[i].termine[uu].tag == tag && file.User[i].termine[uu].uhrzeit == uhrzeit  ){
                                return res.status(403).json({
                                "error": "already exists",
                
                             });

                }
            }
            file.User[i].termine.splice(uuu, 1);
            terminCount = file.User[i].termine.length
            //check if new termin is global available
            for (var oo = 0; oo < terminglobalCount; oo++) {
                
                if(file.alletermine[oo].datum == tag && file.alletermine[oo].uhrzeit == uhrzeit  ){
                    return res.status(403).json({
                        "error": "already  in use global",
                
                    });
                }
        
        
            }
            //console.log(file.User[i].termine)
            //console.log(file.User[i].termine.length)
            //console.log(uuu)
            //delete old local
            
            
            for (var ind = 0; ind <= terminCount; ind++) {
           
                
                if(terminCount==0){
                    //save new value 
                    file.User[i].termine.push(myObj);

                    //delete old termin global
                    
                    for (var i = 0; i < terminglobalCount; i++) {
                
                        if(file.alletermine[i].datum == tagold && file.alletermine[i].uhrzeit == uhrzeitold  ){
                            file.alletermine.splice(i, 1);
                            break
                        }
                        
        
                    }
                    file.alletermine.push(globalobjson);
                    console.log(file.alletermine)
                   
                    return res.status(200).json({
                            "success": "successful saved",
                    
                        });

                }

                
            
               //search right place 
                datetemp=file.User[i].termine[ind].tag
                uhrzeittemp=file.User[i].termine[ind].uhrzeit


                const d = new Date(tag)
                const startye = new Intl.DateTimeFormat('en', {
                            year: 'numeric'
                        }).format(d)
                const startmo = new Intl.DateTimeFormat('de', {
                            month: 'numeric'
                        }).format(d)
                const startda = new Intl.DateTimeFormat('en', {
                            day: '2-digit'
                        }).format(d)
                if(uhrzeit=="09:00"){
                    h=9;
                    m=0;

                }else{
                    h=13;
                    m=15;
                }


                const dd = new Date(datetemp)
                const startyed = new Intl.DateTimeFormat('en', {
                            year: 'numeric'
                        }).format(dd)
                const startmod = new Intl.DateTimeFormat('de', {
                            month: 'numeric'
                        }).format(dd)
                const startdad = new Intl.DateTimeFormat('en', {
                            day: '2-digit'
                        }).format(dd)
                if(uhrzeittemp=="09:00"){
                    hd=9;
                    md=0;

                }else{
                    hd=13;
                    md=15;
                }
          
                datetoinsert= new Date(startye,startmo,startda,h,m)
                comparedate=new Date(startyed,startmod,startdad,hd,md)
                if(datetoinsert<=comparedate){
                    //replace local 
                    file.User[i].termine.splice(ind, 0, myObj);
                    //replace global
                     //delete old termin global
                    
                     for (var i = 0; i < terminglobalCount; i++) {
                
                        if(file.alletermine[i].datum == tagold && file.alletermine[i].uhrzeit == uhrzeitold  ){
                            file.alletermine.splice(i, 1);
                            break
                            
                        }
                     }


                    file.alletermine.push(globalobjson);
                    console.log(file.alletermine)
                   
                    return res.status(200).json({
                        "success": "successful saved",
                
                    });

                }
                tempvar=terminCount-1
                if(ind==tempvar){
                    //reeplace local
                    file.User[i].termine.splice(ind+1, 0, myObj);

                    //replace global

                    //delete old termin global
                    
                    for (var i = 0; i < terminglobalCount; i++) {
                
                        if(file.alletermine[i].datum == tagold && file.alletermine[i].uhrzeit == uhrzeitold  ){
                            file.alletermine.splice(i, 1);
                            break
                        }
                     }

                    file.alletermine.push(globalobjson);
                    console.log(file.alletermine)



              
                    return res.status(200).json({
                        "success": "successful saved",
                
                    });

                }
            }
            

        
                    


                    

                }
            }

            

            
            return res.status(404).json({
                "error": "Termin nicht gefunden",
        
            });
            

        }

    }

    return res.status(404).json({
        "error": "User nicht gefunden."
    });

   

});


//delete Termin
app.delete("/api/deletetermin", (req, res) => {
    userCount = file.User.length
    const data = req.body;
    usernamee=data.user
    vorlesung=data.vorlesung
    tag=data.tag
    uhrzeit=data.uhrzeit
    terminglobalCount = file.alletermine.length


    var terminIdx=-1;

    for (var i = 0; i < userCount; i++) {

        if (file.User[i].name == usernamee) {
            let terminCount = file.User[i].termine.length
           

            for (var uu = 0; uu < terminCount; uu++) {
                //search index and delete
                if(file.User[i].termine[uu].vorlesung == vorlesung && file.User[i].termine[uu].tag == tag && file.User[i].termine[uu].uhrzeit == uhrzeit  ){
                    
                    terminIdx=uu;
                    break;


                }
                
            }
            
            if (terminIdx === -1) return res.status(404).json({
                "error": "Termin not found"
            });
            file.User[i].termine.splice(terminIdx, 1);
            

            //delete termin global
            
            for (var i = 0; i < terminglobalCount; i++) {
               
                
                if(file.alletermine[i].datum == tag && file.alletermine[i].uhrzeit == uhrzeit  ){
                    console.log('Found match')
                    file.alletermine.splice(i, 1);
                    break
                }
                

            }
            

            
            return res.status(200).json({
                "seccess": "Termin deleted",
        
            });
            

        }

    }

});

//update password
app.post('/api/updatepw', (req, res) => {
    const data = req.body;
    username = data.username

    pwold = data.passwordold
    pwnew=data.passwordnew
    


    userCount=file.User.length
    for (var i = 0; i < userCount; i++) {
        if (file.User[i].name == username) {
            
            //save new pw
            if(file.User[i].password == pwold){
            file.User[i].password=pwnew
                    return res.status(200).json({
                        "success": "pw changed successful"
                    });
                }
            else{
                return res.status(403).json({
                    "error": "altes passwort falsch"
                });

            }
        } 
    }
    

    return res.status(404).json({
        "error": "user not found"
    });


});





//delete Vorlesung
app.delete("/api/deletevorlesung", (req, res) => {
    vorlesungCount = file.Vorlesung.length
    const data = req.body;
    vorlesung=data.vorlesung
    start=data.start
    ende=data.ende
    


    var terminIdx=-1;

    for (var i = 0; i < vorlesungCount; i++) {

        if (file.Vorlesung[i].name == vorlesung && file.Vorlesung[i].start == start && file.Vorlesung[i].ende == ende) {
            
                    
            file.Vorlesung.splice(i, 1);
           
            return res.status(200).json({
                "seccess": "Vorlesung deleted",
        
            });   
            

        }

    }
    if (terminIdx === -1) return res.status(404).json({
        "error": "Termin not found"
    });
    
    

});


//edit Vorlesung
app.patch("/api/editvorlesung", (req, res) => {
    const data = req.body;
    
    vorlesung=data.name
    startold= data.startold
    endold= data.endold
    startnew=data.startnew
    endnew= data.endnew
    

    vorlesungCount = file.Vorlesung.length
    for (var i = 0; i < vorlesungCount; i++) {
        //update
        if (file.Vorlesung[i].name == vorlesung && file.Vorlesung[i].start == startold && file.Vorlesung[i].ende == endold) {
            file.Vorlesung[i].start = startnew
            file.Vorlesung[i].ende = endnew


            return res.status(200).json({
            "success": "successful updated",
                
            });

     

            

            
            
            

        }

    }

    return res.status(404).json({
        "error": "Vorlesung nicht gefunden."
    });

   

});

//delete Konto 
app.delete("/api/deleteuser/:username", (req, res) => {
    username = req.params.username
    userCount=file.User.length
    
    
    

    var terminIdx=-1;

    for (var i = 0; i < userCount; i++) {

        if (file.User[i].name == username) {
            
            terminIdx=i;        
            file.User.splice(i, 1);
            
           
            return res.status(200).json({
                "seccess": "User deleted",
        
            });   
            

        }

    }
    if (terminIdx === -1) return res.status(404).json({
        "error": "User not found"
    });
    
    

});




// get Termin of user
app.post("/api/getterminspezifisch/:username", (req, res) => {
    const data = req.body;
    start=new Date(data.von)
    ende=new Date(data.bis)
    tempp=[]
    

    userCount=file.User.length
    for (var i = 0; i < userCount; i++) {
        
        if (file.User[i].name == req.params.username) {
            let terminCount = file.User[i].termine.length
            if(terminCount==0){
                return res.status(404).json([]);
           }
           else{ 
            
            for(var inttermin=0; inttermin<terminCount; inttermin++) {
                vergleich=new Date(file.User[i].termine[inttermin].tag)
                

                if(vergleich<=ende && vergleich>=start){
                    var form = '{"vorlesung":"' + file.User[i].termine[inttermin].vorlesung + '","tag":"'+file.User[i].termine[inttermin].tag+'","uhrzeit":"' +file.User[i].termine[inttermin].uhrzeit + '"}';

                    var myObj = JSON.parse(form);
        
                    tempp.push(myObj);
                    
                }
                
                
            }
            
            
            return res.status(200).json(tempp);

           }
            

        }
        
        
        



    }
    return res.status(403).json({
        "error": "User nicht gefunden."
    });
       
   
});
app.listen(3000);