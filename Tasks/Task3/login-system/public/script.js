function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const error = document.getElementById("error");

    
    if (username === "" || password === "") {
        error.innerText = "All fields are required!";
        return;
    }

   
    fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            error.style.color = "green";
            error.innerText = "Login Successful!";
        } else {
            error.style.color = "red";
            error.innerText = data.message;
        }
    })
    
    .catch(err => {
        error.innerText = "Server error!";
    });
}