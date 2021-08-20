let useranme = document.querySelector("#name");
let email = document.querySelector("#email");
let password = document.querySelector("#pw");
let confirmPassword = document.querySelector("#cpw");
let signupBtn = document.querySelector(".signupBtn");

signupBtn.addEventListener("click", async function(e)
{
    try
    {
        e.preventDefault();
        if(useranme.value && email.value && password.value && confirmPassword.value)
        {
            let signupObj = {
                "name" : useranme.value,
                "email" : email.value,
                "password" : password.value,
                "confirmPassword" : confirmPassword.value
            }
            let obj = await axios.post("http://localhost:3000/api/users/signup", signupObj);
            console.log(obj);
        }
    }
    catch(error)
    {
        console.log(error);
    }
})