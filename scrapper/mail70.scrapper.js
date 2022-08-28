require('dotenv-defaults');
const fs = require("fs");
const nodemailer = require("nodemailer");

const today = new Date();
const dayDateToday = 'prediction70_for_' + today.getFullYear()+'_'+(today.getMonth()+1)+'_'+today.getDate() + '.csv';

today.setDate(new Date().getDate()+1); // Tomorrow
const dayDateTomorrow = 'prediction70_for_' + today.getFullYear()+'_'+(today.getMonth()+1)+'_'+today.getDate() + '.csv';

today.setDate(new Date().getDate()+2); // After tomorrow
const dayDateAfterTomorrow =  'prediction70_for_' + today.getFullYear()+'_'+(today.getMonth()+1)+'_'+ today.getDate() + '.csv';

today.setDate(new Date().getDate()+3); // After 3 days
const afterFourDay =  'prediction70_for_' + today.getFullYear()+'_'+(today.getMonth()+1)+'_'+ today.getDate() + '.csv';


today.setDate(new Date().getDate()+4); // After 4 days
const afterFiveDay =  'prediction70_for_' + today.getFullYear()+'_'+(today.getMonth()+1)+'_'+ today.getDate() + '.csv';

const filesDate = [];

filesDate.push(dayDateToday, dayDateTomorrow, dayDateAfterTomorrow, afterFourDay, afterFiveDay)


Feature('mailsaa').tag('@newmail');

Scenario('Send prediction reports to emails', async ({ I}) => {

    const attachmentsFiles = [];
    let transporter = nodemailer.createTransport({
        host: process.env.HOST,
        port:process.env.SECURE,
        secure:process.env.SECURE,
        auth: {
            user:process.env.USERMAIL,
            pass:process.env.PASSMAIL,
        },
    });

    const files = fs.readdirSync('./predictionMatchesNew/csv/');
    console.log(files);

    if (files.length < 1) {
        I.say('Prediction files not found');
        return;
    }

    for(let x = 0 ; x < files.length; x++) {
        attachmentsFiles.push( {filename:files[x], path: './predictionMatchesNew/csv/' + files[x]});
    }


    let info = await transporter.sendMail({
        from: '"🍀 La suerte te Bendiga 🍀" <'+  process.env.FROM_MAIL + '>',
        to: process.env.TO_MAILS,
        bcc: process.env.BCC_MAILS,
        subject: "Predicciones completos 💰💰💰💰",
        text: "Quiero mis 5000 💵 💴 💶 💷",
        attachments: attachmentsFiles,
    });

    I.say('Email was sending');
    console.log(info);

    if (attachmentsFiles) {
        fs.rmSync('./predictionMatchesNew/csv/', { recursive: true });
        I.say('Files delete');
    }

})
