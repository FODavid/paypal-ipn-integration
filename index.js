
const express = require('express')
const path = require('path')
const listenerValidator = require('./listener')
const PORT = process.env.PORT || 5000
const {inspect} = require('util')
const app = express()
  

// Needed for the raw encoding of the paypal request object so it would work fine with the prefix
const rawEncode = (obj) => {
  var s = '';
  for (var p in obj) {
      if (obj.hasOwnProperty(p)) {
          s +='&'+p+ '=' + encodeURIComponent(obj[p]);
      }
  }
  return s;
}

app.use(express.static(path.join(__dirname, 'public')))
// Request was structured by paypal to come in a url encoded form, it had to be parse using this
app.use(express.urlencoded()) // for parsing application/x-www-form-urlencoded


// Exposed these endpoints as callback 
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.get('/', (req, res) => res.render('pages/index'))
app.get('/success', (req, res) => res.render('pages/success'))
app.get('/cancel', (req, res) => res.render('pages/index'))
app.post('/listener', (req, res) => {
  console.log("YYYY-LISTENER WORKING")
  
  //Send back empty response as an acknowledgement of the IPN message
  res.send()

  //prefix the returned message with the cmd=_notify-validate variable
let paypalReply= 'cmd=_notify-validate'+rawEncode(req.body);

//prefix the expected message to the body of the request in preparation for validation
console.log(paypalReply);
if(req.body){
  //Call the function to do the validation via API call 
  listenerValidator(req.body, paypalReply);
}

res.end();

})
app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
  


