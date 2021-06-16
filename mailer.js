const nodemailer = require("nodemailer");

//Using nodemailer library to send emails after verifiying the IPN
module.exports = async function (recipientEmail, trxStatus, itemName, amount, invoiceId ) {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    let testAccount = await nodemailer.createTestAccount();
  
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass, // generated ethereal password
      },
    });
  
    // send mail with defined transport object
    try{
      let info = await transporter.sendMail({
        from: '"FOD Speakers" <fod@example.com>', // sender address
        to: recipientEmail, // list of receivers
        subject: `Transaction ${trxStatus}`, // Subject linewith transaction status
        text: "", // plain text body
        html: `
        <b>Thank You For Shopping with FOD Speaker</b>
         <p>Transaction status:${trxStatus}</p>
         <p>Order Item:${itemName}</p>
         <p>Amount: ${amount}</p>
         <p>Invoice ID: ${invoiceId}</p>
         `, // html body
      });

      
      console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  
    // Preview only available when sending through an Ethereal account
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    }
    catch (err){
        console.log(err);
    }
  
}
  


  