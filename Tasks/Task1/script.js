document.getElementById("registerForm").addEventListener("submit", function(event){

event.preventDefault();

let username = document.getElementById("username").value.trim();
let email = document.getElementById("email").value.trim();
let dob = document.getElementById("DOB").value;
let phone = document.getElementById("Phone").value.trim();
let department = document.getElementById("department").value.trim();

let errorMessage = document.getElementById("errorMessage");

errorMessage.style.color = "red";

if(username === "" || email === "" || dob === "" || phone === "" || department === ""){
    errorMessage.textContent = "All fields are required.";
    return;
}

/* simple phone validation */
if(phone.length < 10){
    errorMessage.textContent = "Enter valid phone number.";
    return;
}

fetch("http://localhost:3000/register",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body: JSON.stringify({
username,
email,
dob,
phone,
department
})

})

.then(res => res.text())

.then(data=>{
errorMessage.style.color="green";
errorMessage.textContent=data;
})

.catch(err=>{
errorMessage.textContent="Server error";
console.log(err);
});

});