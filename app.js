const sender = require('./email-sender');
const config = require('./config');

var email_list = sender.importEmailList(config.email_list_txt);

var pr = function()
{
    return new Promise((resolve, reject) => 
        {
            sender.sendLetters(
                {
                    smtp_config : config.email,
                    email_list  : email_list,
                    text        : config.text,
                    subject     : config.subject,
                    html        : config.html,
                    attachments : config.attachments,
                    headers     : config.headers
                }
            ).then(done => 
                {
                    console.log(done);
                    resolve(true);
                }    
            ).catch(error => 
                {
                    console.log(error);
                    return reject(false);
                }    
            );
        }
    );
}

Promise.all([pr()])
    .then(success =>
        {
            console.log('EXIT');
        }  
    )
    .catch(error => 
        {
            console.log(error);
        }
    );
