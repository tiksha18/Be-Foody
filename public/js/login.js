let email = document.querySelector("#email");
let password = document.querySelector("#pw");
let loginButton = document.querySelector(".loginBtn");
let message = document.querySelector("#message");
let forgetPassword = document.querySelector(".forgetPassword");


forgetPassword.addEventListener("click", async function(e)
{
    try
    {
        e.preventDefault();
        if(email.value)
        {
            let obj = await axios.post("http://localhost:3000/api/users/forgetpassword", {email : email.value});
            console.log(obj);
        }
    }
    catch(error)
    {
        console.log(error);
    }
})

loginButton.addEventListener("click", async function(e)
{
    try
    {
        e.preventDefault();
        //alert("Logging In !");
        if(email.value && password.value)
        {
            let obj = await axios.post("http://localhost:3000/api/users/login", {email : email.value, password : password.value});
            console.log(obj);
            if(obj.data.data)
            {
                window.location.href = "/";   // means login hone k baad tum chale jao home page pe
            }
            else
            {
                message.innerHTML = obj.data.message;
            }
        }
    }
    catch(error)
    {
        console.log(error);
    }
})