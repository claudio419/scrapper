require('dotenv-defaults');
const fs = require("fs");
const nodemailer = require("nodemailer");


Feature('mails').tag('@mail');

Scenario('Send prediction reports to emails', async ({ I}) => {

    let transporter = nodemailer.createTransport({
        host: process.env.HOST,
        port:process.env.SECURE,
        secure:process.env.SECURE,
        auth: {
            user:process.env.USERMAIL,
            pass:process.env.PASSMAIL,
        },
    });

    const files = fs.readdirSync('./predictionMatches/');

    if (files.length < 1) {
        I.say('Prediction files not found');
        return;
    }

    const attachmentsFiles = [];
    for (let x=0; x <files.length; x++) {
        const attachment = {filename:files[x], path: './predictionMatches/' + files[x]};
        attachmentsFiles.push(attachment);
    }

    let info = await transporter.sendMail({
        from: '"🍀 La suerte te Bendiga 🍀" <'+  process.env.FROM_MAIL + '>',
        to: process.env.TO_MAILS,
        bcc: process.env.BCC_MAILS,
        subject: "Predicciones  💰💰💰💰",
        text: "Cabezon, Ganemos mucho 💵 💴 💶 💷",
        attachments: attachmentsFiles,
    });

    I.say('Email was sending');

    if (attachmentsFiles) {
        fs.rmSync('./predictionMatches/', { recursive: true });
        I.say('Files delete');
    }

})
