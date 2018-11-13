const fs     = require('fs');
const path   = require('path');
const mailer = require('nodemailer');

module.exports = {
    importEmailList : importEmailList,
    sendLetters     : sendLetters
}

// parse .txt file and get email addresses array from its content
function importEmailList(path)
{
    if(typeof(path)=="string")
    {
        var list = fs.readFileSync(path).toString().split(/\r?\n/g);
        if(list)
            return list;
        else
            return null;
    }
    throw "No path for email list file.";
}

// send letter to each address in email address list
async function sendLetters(options)
{
    // options : { smtp_config, email_list, subject, text, attachments, html, headers }
    
    // checking for values
    if(
       typeof(options)=="object"&&
       typeof(options.smtp_config)=="object"&&
       typeof(options.email_list)=="object"&&
       typeof(options.subject)=="string"&&
       (typeof(options.text)=="string"||!!options.attachments||typeof(optons.html)=="string")
    )
    {
        var transport   = mailer.createTransport(options.smtp_config),
            sent        = 0,
            not_sent    = 0;
        
        for(var num in options.email_list)
        {
            var address = options.email_list[num];
            await transport.sendMail(_getMessageConfiguration(options.smtp_config.auth.user, address, options.subject, options.text, options.attachments, options.html, options.headers))
                .then(success => 
                    {
                        console.log(`SUCCESS   :   Mail to ${address}`);            
                        sent++;
                    }
                )
                .catch(error => 
                    {
                        console.log(`ERROR     :   Mail to ${address}\n${error}\n\n`);
                        not_sent++;
                    }    
                );
            
            // added a little stopper to keep our email address from adding to spam list
            var timeout = Math.random() * (35 - 25) + 25; // min timeout=25s; max timeout=35;
            console.log(`timeout : ${timeout}s;`);
            var sleep = function(time)
            {
                return new Promise(resolve => 
                    {
                        setTimeout(function(){
                            console.log('time has come.\nsending new letter...\n\n')
                            resolve(true);
                        }, time*1000);
                    }
                );
            }
            await sleep(timeout); // wait for timeout
        }
        return {
            done : sent, // amount of emails which has been successfully sent
            lost : not_sent // amount of email which were not sent because of some error
        }
    }
    throw "Not enough args.";
}

// creates and returns message object 
function _getMessageConfiguration(from, to, subject, text, attachments, html, headers)
{   
    if(typeof(from)=="string"&&typeof(to)=="string"&&typeof(subject)=="string"&&(typeof(text)=="string"||typeof(html)=="string"||typeof(attachments)=="object"))
    {
        return {
            from : from,
            to   : to,
            text : text,
            html : _getHTMLFromFile(html),
            subject     : subject,
            headers     : headers, 
            attachments : (!!attachments) ? _getAttachmentsConfiguration(attachments) : ''
        };
    }
    throw "Not enough args."
}

// creates and returns "attachments" array for message object
// from file at given path or files at given path list
function _getAttachmentsConfiguration(attachments)
{
    var arr = [];
    var addAttachment = function(fpath)
    {
        var name    = path.basename(fpath);
        var content = fs.readFileSync(fpath);
        arr.push({
            filename : name,
            content  : content 
        });
    }
    if(typeof(attachments)=="object")
    {
        for(var el_num in attachments)
        {
            addAttachment(attachments[el_num]);
        }
        return arr;
    }
    else if(typeof(attachments)=="string")
    {
        addAttachment(attachments);
        return arr;
    }
    throw "Invalid argument: attachments.\n";
}

// gets html from file which contains html code
function _getHTMLFromFile(file_path)
{
    return (file_path) ? fs.readFileSync(file_path).toString() : '';
}
