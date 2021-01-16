const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'j.sardini@gmail.com',
        subject: 'Thanks for joining!',
        text: `Welcome to the app ${name}. Let me know how you get along with the app.`
    })
}

const sendCancelEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'j.sardini@gmail.com',
        subject: "Sorry you're leaving!",
        text: `Hello ${name}, why are you leaving?`
    });
}

module.exports = {
    sendWelcomeEmail,
    sendCancelEmail
}