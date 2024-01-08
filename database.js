//#region Firebase Setup

const firebaseConfig = {
    apiKey: "AIzaSyCpeILzMMXol1kCF7GtFyn8Y4tByuTuJoQ",
    authDomain: "engtutor-76917.firebaseapp.com",
    databaseURL: "https://engtutor-76917-default-rtdb.firebaseio.com",
    projectId: "engtutor-76917",
    storageBucket: "engtutor-76917.appspot.com",
    messagingSenderId: "102434478583",
    appId: "1:102434478583:web:f606ae8420f6ac6b4036f2",
    measurementId: "G-TFYMW0Z9F3"
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  
  //Set the database & authentication vars
  const database = firebase.database();  
  const auth = firebase.auth();

//#endregion

//Startup




//Define callbacks
var user; //The current user


//#region Animation
document.getElementById("switch").addEventListener("click", animateSwitch);
div = document.getElementById("switchPanel");
btn = document.getElementById("switch");
display = document.getElementById("info");
errorMSG = document.getElementById("alert"); //The text on the register page that displays errors
errorMSGlog = document.getElementById("alertLog"); //The text on the login page that displays errors


var toggled = true; //Default boolean to check the current position of the panel (default is on sign in page)

function animateSwitch(){
    if(toggled){
        div.classList.remove("switchOn");
        div.classList.add("switchOff");
        toggled = false;

        btn.value = "Log-In!"; //Button text
        display.innerHTML = "Already have an account?" //Statement text
    }else{
        setRegister();
    }
}

function setRegister(){
    div.classList.remove("switchOff");
    div.classList.add("switchOn");
    toggled = true;

    btn.value = "Register Now!"; //Button text
    display.innerHTML = "Don't have an account yet?<br />No problem!" //Statement text
}
//#endregion

//#region Account creation
document.getElementById("createAccount").addEventListener("click", addUser); //Assigning a function to the register button
document.getElementById("login").addEventListener("click", login); //Assigning a function to the login button




const reg_email = document.getElementById("reg_email"); //Variable for the register "Email" field
const reg_pass = document.getElementById("reg_pass"); //Variable for the register "Password" field
const reg_user = document.getElementById("reg_user"); //Variable for the register "User" field

const log_email = document.getElementById("log_email"); //Variable for log in email text box
const log_pass = document.getElementById("log_pass"); //Variable for log in password text box


//Auth functions
function alertGood(obj){ //Make alert text green
    obj.classList.remove("alertBad");
    obj.classList.add("alertGood");
}
function alertBad(val, error){ //Make text alert red
    errorMSG.classList.remove("alertGood");
    errorMSG.classList.add("alertBad");

    val.innerHTML = error;
}


function addUser(){
    errorMSG.innerHTML = null;

    var email;var pass; //Vriables for the input fields values

    //Get the values
    email = reg_email.value; //Assign the email value to variable
    pass = reg_pass.value; //Assign the password value to variable
    


    auth.createUserWithEmailAndPassword(email, pass) //Add the user to the authentication database
    .then((userCredential) => {
        // Signed in 
        var user = userCredential.user;
        
        user.updateProfile({ //Update the username
            displayName: reg_user.value    
        }).then(()=>{
            //After updating the username
        }).catch((error)=>{
            //If it fails
            console.log(error); //Debug
            alertBad();
            errorMSG.innerHTML = error;
        })

        //Reset the inputfields
        reg_email.value = null;
        reg_pass.value = null;
        reg_user.value = null;

        alertGood(errorMSG);
        errorMSG.innerHTML = "A verification email has been sent!"

        verifyEmail();
    })
    .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(error); //Debug
        alertBad(errorMSG,error);
    });
}

//Other  functions
function verifyEmail(){
    firebase.auth().currentUser.sendEmailVerification()
    .then(() => {
        console.log("Verification email has been sent!"); 
    });

}




//#endregion

//#region Account Login...

const dashName = document.getElementById("user");
document.getElementById("logout").addEventListener("click", logOut); //Adding function for btn press
document.getElementById("terminate").addEventListener("click", deleteAccount); //Adding function for btn press

function login(){
    firebase.auth().signInWithEmailAndPassword(log_email.value, log_pass.value)
    .then((userCredential) => {
        //If the account exists...

        user = userCredential.user; //Get the user from firebase

        if(user.emailVerified){ //If the email has been verified for the account
            //temp
            alertGood(errorMSGlog);
            errorMSGlog.innerHTML = (user.displayName + " is now logged in!");

            //Reset the text box's
            log_email.value = null;
            log_pass.value = null;

            //Redirect to the user dashboard
            changePage();

            dashName.innerHTML = user.displayName;
            errorMSGlog.innerHTML = null; //reset msg txt
        }
        else{
            alertBad(errorMSGlog, "The email for this account is not verified yet!");
        }
        
    })
    .catch((error) => {
        //If the user does not exist
        
        alertBad(errorMSGlog, error);

    })
}

function logOut(){
    firebase.auth().signOut().then(() => {
        changePage(); //Sign out the user and return to login page
      }).catch((error) => {
        console.log(error); //There was an issue
      });
      
}

function deleteAccount(){
    user.delete().then(() => {
        changePage(); //Delete the user and return to login page
      }).catch((error) => {
        console.log(error); //There was an issue
      });
}

//#endregion
homePage = document.getElementById("loginFrame");
dashboard = document.getElementById("dashboard");

var loggedIn = false;

function changePage(){ //Toggles visibility of login page vs dashboard
    if(loggedIn){
        homePage.removeAttribute("hidden");
        dashboard.setAttribute("hidden", "hidden");

        loggedIn = false;
    }else{
        dashboard.removeAttribute("hidden");
        homePage.setAttribute("hidden", "hidden");

        loggedIn = true;
    }
}

//Database functions
