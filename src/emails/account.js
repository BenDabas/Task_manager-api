const sgMail = require('@sendgrid/mail');

const sendgridAPIKey = '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';

sgMail.setApiKey(sendgridAPIKey || process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'bendabas1@gmail.com',
        subject: 'Thanks to join in!',
        text: `Welcome to the app, ${name}. Let me know how you get along with the app. `,
    });
};

const sendCanceledEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'bendabas1@gmail.com',
        subject: 'Sorry to see you go!',
        text: `Goodbye ${name} . Hope to see you back sometime soon. Please tell me why you canceled your account`,
    });
};

module.exports = {
    sendWelcomeEmail,
    sendCanceledEmail,
};
