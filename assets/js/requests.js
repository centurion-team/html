// @var HTTP service
var service = build_http_config();

// @var string url 
var URL = function(){

    // @var string url
    let url = '';

    // check for data-moorexa-appurl
    let element = document.querySelector('*[data-moorexa-appurl]');

    // we good ?
    if (element != null && element.hasAttribute('data-moorexa-appurl')) url = element.getAttribute('data-moorexa-appurl');

    // return string
    return url;

}();

/**
 * @member build_http_config
 * 
 * Build HTTP configuration
 */
function build_http_config()
{
    return $http.config({
        header : {
            'x-request-handler' : 'API',
            'x-public-token' : (function(){

                // @var element 
                const el = document.querySelector('meta[name="public-token"]');

                // are we good ??
                if (el !== null && el.hasAttribute('content')) return el.getAttribute('content');
    
                // default
                return '';
            }())
            // 'Request-Session-Token' : document.querySelector('meta[name="session_public_token"]').getAttribute('content')
        },
        url : document.querySelector('meta[name="services"]').getAttribute('content')
    });
}

/**
 * messaging api
 * @param {*} service 
 * @param {*} method 
 * @returns 
 */
let MAPI = (service, method, header = {}, param = '') => {

    const config = $http.config({
        header : Object.assign({
            'x-meta-service' : service,
            'x-meta-method' : method,
            'Authorization' : 'Bearer 9a15ee530b6a821e31da9b3c81a1fa05f73e1de5'
        }, header),
        url : 'https://messaging.tripmata.com/api' + param
    });

    return {
        get : (callback)=>{
            return config.get('', callback);
        },

        post : (data, callback)=>{
            return config.post('', data, callback);
        }
    }
}

/**
 * @method Sign in an administrator
 * @param {*} e 
 */
function signin(e)
{
    // remove alerts
    resetDefaultAlerts();

    // check the username
    document.get('#username', (inputUsername)=>{

        // get the password
        document.get('#password', (inputPassword)=>{

            // check username and password
            if (inputUsername.value != '' && inputPassword.value != '')
            {
                // call loader
                const loader = buttons.loading(e, 'Please wait..');

                // make request
                service.post('signin', service.ObjectToString({
                    user : inputUsername.value,
                    password : inputPassword.value,
                    args : ''
                }), (response)=>{

                    if (service.connectionError())
                    {
                        loader.hide();
                        buttons.error(e, 'Connection error!');
                    }
                    else
                    {
                        if (response.data.status == 'success')
                        {
                            // change text
                            loader.text('Processing..');

                            // set header
                            $http.header = {
                                'x-request-handler' : 'System'
                            };

                            // set token
                            $http.post(e.getAttribute('data-url'), $http.ObjectToFormData({
                                data : JSON.stringify(response.data.data)
                            }), function(login){

                                loader.hide();

                                // all good 
                                if (login.data.status == 'success')
                                {
                                    buttons.success(e, response.data.message);

                                    // reload now
                                    setTimeout(()=>{
                                        location.reload();
                                    }, 1000);
                                }

                            });
                        }
                        else
                        {
                            loader.hide();

                            // failed
                            buttons.error(e, 'Login unsuccessful').then((data)=>{

                                if (data.status == 1)
                                {
                                    callAlert('error', {wrapper: '#notification-inline', message: response.data.message});
                                }
                            });
                        }
                    }
                });
            }
            else
            {
                // all fields are required
                callAlert('warning', {wrapper:'#notification-inline', message:'All fields are required!'});
            }
        });
    });
}

/**
 * @method findPropertyOrLocation
 * @param {*} query
 */
function findPropertyOrLocation(query, callback)
{
    // make request
    service.get('find-property-or-location?search='+query, (res)=>{
        console.log(res);
    });
}

// make user submissions to external api
// report misconduct
document.get('#reportMisconduct', (element)=>{

    document.forms['reportMisconduct'].action = 'javascript:void';

    element.addEventListener('click', (e)=>{

        let loader = buttons.loading('#reportMisconduct', 'Please wait...');

        // get subject
        let subject = document.get('#subject').value, message = document.get('#message').value;

        // do we have something?
        if (subject.length < 5 || message.length < 5) return (function(){
            loader.hide();
            buttons.error('#reportMisconduct', 'Invalid Character length');
        })();

        // load form 
        let formData = $http.ObjectToFormData({
            identity : document.get('#customerid').value,
            name : document.get('#subject').value,
            reporting : document.get('#propertyid').value,
            message : document.get('#message').value,
            report_to : "tripmata"
        });

        // get attachment
        let files = document.get('#attachments').files;

        // has files
        if (files.length > 0)
        {
            var file = null;
            for (file in files)
            {
                formData.append('attachments[]', files[file]);
            }
        }
        
        // send request.
        MAPI('misconduct', 'report manager')
        .post(formData, (response)=>{
            
            // all done?
            if (response.data.Code == 200)
            {
                loader.hide();
                buttons.success('#reportMisconduct', 'Misconduct submitted');

                // clear all
                document.get('#subject').value = '';
                document.get('#message').value = '';

                // redirect
                setTimeout(()=>{
                    history.back();
                }, 1000);
            }
        });
    });
});

// send message
document.get('#sendMessageToProperty', (element)=>{

    document.forms['sendMessageToPropertyForm'].action = 'javascript:void';

    element.addEventListener('click', (e)=>{

        let loader = buttons.loading('#sendMessageToProperty', 'Please wait...');

        // get subject
        let subject = document.get('#subject').value, message = document.get('#message').value;

        // do we have something?
        if (subject.length < 5 || message.length < 5) return (function(){
            loader.hide();
            buttons.error('#sendMessageToProperty', 'Invalid Character length');
        })();

        // load form 
        let formData = $http.ObjectToFormData({
            sender : document.get('#customerid').value,
            subject : document.get('#subject').value,
            receiver : document.get('#propertyid').value,
            message : document.get('#message').value
        });

        // get attachment
        let files = document.get('#attachments').files;

        // has files
        if (files.length > 0)
        {
            var file = null;
            for (file in files)
            {
                formData.append('attachments[]', files[file]);
            }
        }
        
        // send request.
        MAPI('message', 'send internal message')
        .post(formData, (response)=>{
            
            // all done?
            if (response.data.Code == 200)
            {
                loader.hide();
                buttons.success('#sendMessageToProperty', 'Message sent');

                // clear all
                document.get('#subject').value = '';
                document.get('#message').value = '';
                document.get('#attachments').value = '';

                // redirect
                setTimeout(()=>{
                    if (element.hasAttribute('data-history'))
                    {
                        location.href = element.getAttribute('data-history');
                    }
                }, 1000);
            }
        });
    });
});

// send message to tripmata
document.get('#sendMessageToTripmataForm', (element)=>{

    document.forms['sendMessageToTripmataForm'].action = 'javascript:void';

    element.addEventListener('submit', (e)=>{

        let loader = buttons.loading('#sendMessageToTripmata', 'Please wait...');

        // get subject
        let subject = document.get('#subject').value, message = document.get('#message').value;


        // do we have something?
        if (subject == '' || message == '') return (function(){
            loader.hide();
            buttons.error('#sendMessageToTripmata', 'Invalid Character length');
        })();

        // load form 
        let formData = $http.ObjectToFormData({
            sender : document.get('#customerid').value,
            subject : document.get('#subject').value,
            receiver : 'tripmata',
            message : document.get('#message').value
        });

        // get attachment
        let files = document.get('#attachments').files;

        // has files
        if (files.length > 0)
        {
            var file = null;
            for (file in files)
            {
                formData.append('attachments[]', files[file]);
            }
        }
        
        // send request.
        MAPI('message', 'send internal message')
        .post(formData, (response)=>{
            
            // all done?
            if (response.data.Code == 200)
            {
                loader.hide();
                buttons.success('#sendMessageToTripmata', 'Message sent');

                // clear all
                document.get('#subject').value = '';
                document.get('#message').value = '';
                document.get('#attachments').value = '';

                // redirect
                setTimeout(()=>{
                    if (element.hasAttribute('data-history'))
                    {
                        location.href = element.getAttribute('data-history');
                    }
                }, 1000);
            }
        });
    });

});

let messageNotFound = '<div class="noting-found">\
<span class="noting-found-image"></span>\
<span class="noting-found-content">No message history to show</span>\
</div>';

let statistics = {}, dataCache = {};

// get all messages sent
document.get('#show-messages-sent', ()=>{

    // load message statistics
    loadMessageStatistics(document.get('#customerid').value, ()=>{

        // load more to table
        loadMoreToTable('#show-messages-sent', 'Get internal messages sent', 0, 5);

    });

});

// get all messages received
document.get('#show-messages-received', ()=>{

    // load message statistics
    loadMessageStatistics(document.get('#customerid').value, ()=>{

        // load more to table
        loadMoreToTable('#show-messages-received', 'Get internal messages received', 0, 5);
    });

});

// get all misconduct reported
document.get('#show-misconduct-messages', ()=>{

    // load message statistics
    loadMessageStatistics(document.get('#customerid').value, ()=>{

        // load more to table
        loadMoreToTable('#show-misconduct-messages', 'Misconduct/Get manager reports by guest', 0, 5);

    });

});

// load more to table
function loadMoreToTable(target, method, start, end, ele=null)
{
    // load start and end
    let param = '', customerid = document.get('#customerid').value;

    // load param
    param = '?limit=' + start + ',' + end + '&sort=desc';

    // load element
    let element = document.get(target), loader = null;
    
    // loader
    if (ele !== null) loader = buttons.loading(ele);

    // load message from the serve
    loadMessagesFromServer(method, customerid, param, (data)=>{

        if (data.Code == 200)
        {
            // get ids
            let ids = [];

            data.Data.forEach((row)=>{
                if (target == '#show-messages-received')
                {
                    ids.push(row.Sender);
                }
                else if (target == '#show-misconduct-messages')
                {
                    ids.push(row.Reporting);
                }
                else
                {
                    ids.push(row.Receiver);
                }
            });

            // make request
            service.post('getbulkproperty', service.ObjectToString({
                property_ids : JSON.stringify(ids),
                args : ''
            }), (response)=>{

                if (response.data.status == 'success')
                {
                    // load table information
                    loadTableInformation(data.Data, response.data.data, element, target, start, end, method);

                    if (ele !== null)
                    {
                        loader.hide();
                    }
                }
            });
        }
        else
        {
            element.innerHTML = messageNotFound;
        }
    });
}

// load message information
function viewMessageInformation(btn)
{
    let target = btn.getAttribute('data-res'),
    uid = btn.getAttribute('data-uid');

    document.get('.view-message-modal #modal-content-list', (modalList)=>{

        let date, subject, receiver, messageInfo, attachments, message, sender, reporting;

        // load data cache
        switch (target)
        {
            case '#show-messages-sent':

                // load by uid
                dataCache.data.forEach((row)=>{

                    if (row.ID == uid)
                    {
                        subject = row.Subject;
                        messageInfo = row.Message;
                        date = new Date(parseInt(row.Date) * 1000).toLocaleDateString("en-US");

                        // load attachments
                        if (typeof row.Attachments != 'undefined')
                        {
                            attachments = '';
                            row.Attachments.forEach((attachment)=>{
                                let aName = attachment.Path.substring(attachment.Path.lastIndexOf('/') + 1);
                                attachments += '<a href="'+attachment.Path+'" target="_blank" style="text-decoration:underline; color:var(--signal-color)">'+aName+'</a>';
                            });
                        }
                        else
                        {
                            attachments = 'None';
                        }   

                        // load receiver 
                        if (row.Receiver != 'tripmata')
                        {
                            receiver = dataCache.prop[row.Receiver].Name;
                        }
                        else
                        {
                            receiver = 'Tripmata';
                        }

                        return false;
                    }

                });

                message = '<li>\
                    <span>Date :</span>\
                    <p id="date">'+date+'</p>\
                </li>\
                <li>\
                    <span>Subject :</span>\
                    <p id="subject">'+subject+'</p>\
                </li>\
                <li>\
                    <span>Receiver :</span>\
                    <p id="sender">'+receiver+'</p>\
                </li>\
                <li>\
                    <span>Message :</span>\
                    <p id="message">'+messageInfo+'</p>\
                </li>\
                <li>\
                    <span>Attachments :</span>\
                    <p style="display: flex; flex-direction: column;">\
                        '+attachments+'\
                    </p>\
                </li>';

                // add to modal list
                modalList.innerHTML = message;
            break;

            case '#show-messages-received':

                // load by uid
                dataCache.data.forEach((row)=>{

                    if (row.ID == uid)
                    {
                        subject = row.Subject;
                        messageInfo = row.Message;
                        date = new Date(parseInt(row.Date) * 1000).toLocaleDateString("en-US");

                        // load attachments
                        if (typeof row.Attachments != 'undefined')
                        {
                            attachments = '';
                            row.Attachments.forEach((attachment)=>{
                                let aName = attachment.Path.substring(attachment.Path.lastIndexOf('/') + 1);
                                attachments += '<a href="'+attachment.Path+'" target="_blank" style="text-decoration:underline; color:var(--signal-color)">'+aName+'</a>';
                            });
                        }
                        else
                        {
                            attachments = 'None';
                        }   

                        // load sender 
                        if (row.Sender != 'tripmata')
                        {
                            sender = dataCache.prop[row.Sender].Name;
                        }
                        else
                        {
                            sender = 'Tripmata';
                        }

                        return false;
                    }

                });

                message = '<li>\
                    <span>Date :</span>\
                    <p id="date">'+date+'</p>\
                </li>\
                <li>\
                    <span>Subject :</span>\
                    <p id="subject">'+subject+'</p>\
                </li>\
                <li>\
                    <span>Sender :</span>\
                    <p id="sender">'+sender+'</p>\
                </li>\
                <li>\
                    <span>Message :</span>\
                    <p id="message">'+messageInfo+'</p>\
                </li>\
                <li>\
                    <span>Attachments :</span>\
                    <p style="display: flex; flex-direction: column;">\
                        '+attachments+'\
                    </p>\
                </li>';

                // add to modal list
                modalList.innerHTML = message;

            break;

            case '#show-misconduct-messages':

                // load by uid
                dataCache.data.forEach((row)=>{

                    if (row.ID == uid)
                    {
                        subject = row.Name;
                        messageInfo = row.Message;
                        date = new Date(parseInt(row.Date) * 1000).toLocaleDateString("en-US");

                        // load attachments
                        if (typeof row.Attachments != 'undefined')
                        {
                            attachments = '';
                            row.Attachments.forEach((attachment)=>{
                                let aName = attachment.Path.substring(attachment.Path.lastIndexOf('/') + 1);
                                attachments += '<a href="'+attachment.Path+'" target="_blank" style="text-decoration:underline; color:var(--signal-color)">'+aName+'</a>';
                            });
                        }
                        else
                        {
                            attachments = 'None';
                        }   

                        // load reporting 
                        if (row.Reporting != 'tripmata')
                        {
                            reporting = dataCache.prop[row.Reporting].Name;
                        }
                        else
                        {
                            reporting = 'Tripmata';
                        }

                        return false;
                    }

                });

                message = '<li>\
                    <span>Date :</span>\
                    <p>'+date+'</p>\
                </li>\
                <li>\
                    <span>Subject :</span>\
                    <p>'+subject+'</p>\
                </li>\
                <li>\
                    <span>Reporting :</span>\
                    <p>'+reporting+'</p>\
                </li>\
                <li>\
                    <span>Message :</span>\
                    <p>'+messageInfo+'</p>\
                </li>\
                <li>\
                    <span>Attachments :</span>\
                    <p style="display: flex; flex-direction: column;">\
                        '+attachments+'\
                    </p>\
                </li>';

                // add to modal list
                modalList.innerHTML = message;
            break;
        }
    });
}

// load table information
function loadTableInformation(Data, Properties, element, target, start, end, method, action = false)
{
    let header = '\
    <th>SN</th>\
    <th>Subject</th>\
    <th>Receiver</th>\
    <th>Message</th>\
    <th>Action</th>\
    ';

    // switch
    if (target == '#show-messages-received')
    {
        header = '\
        <th>SN</th>\
        <th>Subject</th>\
        <th>Sender</th>\
        <th>Message</th>\
        <th>Action</th>'; 
    }

    // switch
    if (target == '#show-misconduct-messages')
    {
        header = '\
        <th>SN</th>\
        <th>Subject</th>\
        <th>Reporting</th>\
        <th>Message</th>\
        <th>Action</th>'; 
    }

    let table = '<table class="table" cellspacing="0">\
    <thead>\
    <tr>\
    '+header+'\
    </tr>\
    </thead>\
    <tbody>';


    let max = statistics[target];

    let count = parseInt(start) + 1;

    // load data cache
    dataCache['data'] = Data;
    dataCache['prop'] = Properties;

    Data.forEach((row)=>{

        let Name = (row.Receiver == 'tripmata' ? 'Tripmata' : (typeof Properties[row.Receiver] != 'undefined' ? Properties[row.Receiver].Name : 'N/A')),
        Subject = row.Subject;

        if (target == '#show-messages-received')
        {
            Name = (row.Sender == 'tripmata' ? 'Tripmata' : (typeof Properties[row.Sender] != 'undefined' ? Properties[row.Sender].Name : 'N/A'));
            
            if (Subject == null)
            {
                Subject = 'no-reply';
            }
        }

        if (target == '#show-misconduct-messages')
        {
            Name = (typeof Properties[row.Reporting] != 'undefined' ? Properties[row.Reporting].Name : 'N/A');
            Subject = row.Name;
        }

        table += '<tr>';
        table += '<td>'+(count)+'</td>';
        table += '<td>'+Subject+'</td>';
        table += '<td>'+(Name)+'</td>';
        table += '<td><p>'+(row.Message.substring(0, 50)) + (row.Message.length > 50 ? ' <a href="" class="text-signal" style="letter-spacing:5px" title="view more">....</a>' : '')+'</p></td>';
        // table += '<td>'+(new Date(parseInt(row.Date) * 1000).toLocaleDateString("en-US"))+'</td>';
        table += '<td style="display:flex;">';
        if (target == '#show-messages-received')
        {
            table += '<button type="button" data-target="reply-message" data-uid="'+row.ID+'" data-receiver="'+row.Sender+'" class="text-signal" style="border:none; background:transparent; white-space: nowrap; cursor:pointer; margin-right:10px;"><i class="icon ion-reply"></i> reply</button>';
        }
        table += '<button type="button" data-target="view-message" data-uid="'+row.ID+'" data-res="'+target+'" class="text-signal" style="border:none; background:transparent; white-space: nowrap; cursor:pointer;"><i class="icon ion-eye"></i> view</button>';
        table += '</tr>';

        // increment count
        count += 1;
    });

    // load prev
    let prev_start = (start - 5), prev_end = (end - 5);

    // update now
    start = end;
    end = start + end;
    let button = '<button class="btn btn-secondary btn-curve" onclick="loadMoreToTable(\''+target+'\', \''+method+'\', '+start+', '+end+', this)" style="min-width:50px">Load More</button>';

    // gotten to max?
    if (start > 5)
    {
        button = '<button class="btn btn-signal btn-curve" onclick="loadMoreToTable(\''+target+'\', \''+method+'\', '+prev_start+', '+prev_end+', this)" style="min-width:50px; margin-right:10px;">Previous</button>' + (start > max ? '' : button);
    }

    // can we show button
    if (max <= 5) button = ''; 

    // table footer
    table += '</tbody>';

    // close out
    table += '</table>';

    // add button
    table += '<div class="btn-group" style="display:flex; margin-top:20px;">'+button+'</div>';

    // add to e
    element.innerHTML = table;

    // reply
    document.getAll('*[data-target="reply-message"]', (checkBtn)=>{
        checkBtn.forEach((btn) => {
            btn.addEventListener('click', ()=>{
                // get the modal element
                document.get('.change-avaliability-modal', (modal)=>{
                    modal.style.display = 'flex';
    
                    setTimeout(()=>{
                        modal.style.opacity = 1;
                    }, 100);

                    // set uid
                    document.get('#messageuid').value = btn.getAttribute('data-uid');
                    document.get('#message-receiver').value = btn.getAttribute('data-receiver');
    
                    // hide checker
                    document.getAll('*[data-target="close-aval-modal"]', (closeBtn)=>{
                        closeBtn.forEach((cb)=>{
                            cb.addEventListener('click', ()=>{
                                modal.style.opacity = 0;
                                setTimeout(()=>{
                                    modal.style.display = 'none';
                                }, 400);
                            });
                        });
                    });
                });
            });
        });
    });

    // view
    document.getAll('*[data-target="view-message"]', (checkBtn)=>{
        checkBtn.forEach((btn) => {
            btn.addEventListener('click', ()=>{

                // load view 
                viewMessageInformation(btn);

                // get the modal element
                triggerModal('.view-message-modal');
            });
        });
    });

    // process reply
    document.get('#reply-internal-message', (form)=>{
        form.addEventListener('submit', (e)=>{
            e.preventDefault();

            let reply = document.get('#reply-message-box').value;
            
            // can we proceed
            if (reply != '')
            {
                let button = form.get('button'),
                loader = buttons.loading(button, 'Please wait..');

                //
                // load form 
                let formData = $http.ObjectToFormData({
                    sender : document.get('#customerid').value,
                    receiver : document.get('#message-receiver').value,
                    message : reply,
                    messageuid : document.get('#messageuid').value
                });

                // get attachment
                let files = document.get('#attachments').files;

                // has files
                if (files.length > 0)
                {
                    var file = null;
                    for (file in files)
                    {
                        formData.append('attachments[]', files[file]);
                    }
                }
                
                // send request.
                MAPI('message', 'Reply to internal message')
                .post(formData, (response)=>{
                    
                    // all done?
                    if (response.data.Code == 200)
                    {
                        loader.hide();
                        buttons.success(button, 'Message sent');
                        document.get('#reply-message-box').value = '';
                        document.get('#attachments').value = '';

                        // load message statistics
                        loadMessageStatistics(document.get('#customerid').value, ()=>{});

                        setTimeout(()=>{
                            document.get('.change-avaliability-modal', (modal)=>{
                                modal.style.opacity = 0;
                                setTimeout(()=>{
                                    modal.style.display = 'none';
                                }, 400);
                            });
                        }, 1000);
                    }
                });
            }
        });
    });
}

// load message statistics
function loadMessageStatistics(customerid, callback)
{
    loadMessagesFromServer('Get messages stats', customerid, '', (data)=>{

        document.get('#inbox-messages').innerText = data.MessageReceived;
        document.get('#sent-messages').innerText = data.MessageSent;
        document.get('#misconduct-messages').innerText = data.MisconductSent;

        // load stats
        statistics['#show-messages-sent'] = parseInt(data.MessageSent);
        statistics['#show-messages-received'] = parseInt(data.MessageReceived);
        statistics['#show-misconduct-messages'] = parseInt(data.MisconductSent);

        // load callback
        callback.call(this);

    });
}

// this function would load messages from the server
function loadMessagesFromServer(method, identity, param, callback)
{
    let service = 'message';

    // check for '/'
    if (method.indexOf('/') > 0)
    {
        method = method.split('/');
        service = method[0];
        method = method[1];
    }

    // load request
    MAPI(service, method, {
        'x-meta-id' : identity
    }, param)
        .get((response)=>{
            
            callback.call(this, response.data);
    });
}