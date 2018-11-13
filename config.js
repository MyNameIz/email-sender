module.exports = { 
    email : {
        host : 'host',
        port : 465,
        secure : true,
        pool : true,
        auth : {
            user : 'user@host',
            pass : 'password'
        }
    },

    email_list_txt : 'txtfile', //File which contents email assresses (1 address per 1 line) 

    text : 'Hello, World!',

    html : '',

    subject     : 'Mailing',

    attachments : './SomeFile.docx',

    headers     : ''
}
