let pass1 = document.getElementById("pass1");
let pass2 = document.getElementById("pass2");
console.log(pass1.innerText);
console.log(pass2.innerText);
let msg = document.getElementById("message");
pass2.onkeypress = function(){
    console.log(pass1.value);
    if(pass1.value!=pass2.value){
       
        msg.innerHTML= "Passwords Do not match"
    }
    else{
        msg.innerHTML= "Passwords Match!"
    }
}

