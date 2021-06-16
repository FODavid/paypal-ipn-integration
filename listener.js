
const axios = require('axios')
const mailer = require('./mailer')
const SANDBOX_VERIFY_URI = "https://ipnpb.sandbox.paypal.com/cgi-bin/webscr/";  

const headers = {
    'User-Agent':'PHP-IPN-VerificationScript',
    'content-type': 'application/x-www-form-urlencoded'
  }
   
  //Sends message back to PayPal
  // API call to verify the IPN message sent from paypal which contains a certain prefix to the original message (PaypalReply)
module.exports = function (info, paypalReply) {
        axios
    .post(SANDBOX_VERIFY_URI, paypalReply,{ 
    headers: headers
    })
    .then(resp => {
    console.log(`XXXX-statusCode: ${resp.status}`)
    let  trxStatus = "Failed";
    const itemName = info.item_name;
    const amount = info.mc_currency + info.payment_gross;
    const invoiceId = info.txn_id;
    const email = info.payer_email;

    if(resp.data === "VERIFIED"){
        trxStatus = "Successful"
        console.log("XXX-RESPONSE VERIFIED");
    }
    if (resp.data === "INVALID"){
        console.log("XXX-RESPONSE INVALID");
    
    }

    mailer(email,trxStatus, itemName, amount, invoiceId);

    })
    .catch(error => {
    console.error(error)
    });
}