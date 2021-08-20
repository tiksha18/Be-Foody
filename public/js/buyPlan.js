let buyPlansButtons = document.querySelectorAll(".signup-button a");
let allLis = document.querySelectorAll(".showcase-ul li");
const stripe = Stripe('pk_test_51JOSOmSAKlgVI5t2kWPvt6SnyC8gq4WhclsZf6rMVck9ELTOVTZIPxMjmbLUFBATvjRKLDzvjzblPhwLChTHSrwZ00fOuwImG1');


for(let i = 0 ; i < buyPlansButtons.length ; i++ )
{
    buyPlansButtons[i].addEventListener("click", async function()
    {
        try
        {
            if(allLis.length < 6)
            {
                window.location.href = "/login";
            }
            else
            {
                // console.log("Bought Plan !");
                let planId = buyPlansButtons[i].getAttribute("planid");
                let session = await axios.post("https://hey-foody.herokuapp.com/api/booking/createPaymentSession", {planId : planId});
                // console.log(session);
                let sessId = session.data.session.id;
                let result = await stripe.redirectToCheckout({sessionId : sessId});
                console.log(result);
            }
        }
        catch(error)
        {
            alert(error.message);
        }
    })
}