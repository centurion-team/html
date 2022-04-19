(function(e){

    // build all alert types
    const ALERT_TYPES = {

        // primary alert
        'primary' : function(message, title=''){
          return '<div class="alert alert-primary alert-dismissable fade show p-3">\
          <button type="button" class="close" data-dismiss="alert">\
          <span>×</span>\
          </button>\
          <strong>'+title+'</strong> '+message+'\
          </div>';
        },

        // secondary alert
        'secondary' : function(message, title=''){
            return '<div class="alert alert-secondary alert-dismissable fade show p-3">\
            <button type="button" class="close" data-dismiss="alert">\
            <span>×</span>\
            </button>\
            <strong>'+title+'</strong> '+message+'\
            </div>';
        },

        // success alert
        'success' : function(message, title=''){
            return '<div class="alert alert-success alert-dismissable fade show p-3">\
            <button type="button" class="close" data-dismiss="alert">\
            <span>×</span>\
            </button>\
            <strong>'+title+'</strong> '+message+'\
            </div>';
        },

        // error alert
        'error' : function(message, title=''){
            return '<div class="alert alert-danger alert-dismissable fade show p-3">\
            <button type="button" class="close" data-dismiss="alert">\
            <span>×</span>\
            </button>\
            <strong>'+title+'</strong> '+message+'\
            </div>';
        },

        // warning alert
        'warning' : function(message, title=''){
            return '<div class="alert alert-warning alert-dismissable fade show p-3">\
            <button type="button" class="close" data-dismiss="alert">\
            <span>×</span>\
            </button>\
            <strong>'+title+'</strong> '+message+'\
            </div>';
        },

        // info alert
        'info' : function(message, title=''){
            return '<div class="alert alert-info alert-dismissable fade show p-3">\
            <button type="button" class="close" data-dismiss="alert">\
            <span>×</span>\
            </button>\
            <strong>'+title+'</strong> '+message+'\
            </div>';
        },

        // warning transparent
        'warning-transparent' : function(message){
            return '<span class="bg-warning-transparent-1 text-warning ml-xl-3 mt-1 d-inline-block mt-xl-0 px-1 rounded-sm">\
            <i class="fa fa-exclamation-circle text-warning fs-12px mr-1"></i>\
            <span class="text-warning">'+message+'</span>\
            </span>';
        },

        // success transparent
        'success-transparent' : function(message){
            return '<span class="bg-success-transparent-1 text-warning ml-xl-3 mt-1 d-inline-block mt-xl-0 px-1 rounded-sm">\
            <i class="fa fa-exclamation-circle text-success fs-12px mr-1"></i>\
            <span class="text-success">'+message+'</span>\
            </span>';
        },

        // error transparent
        'error-transparent' : function(message){
            return '<span class="bg-danger-transparent-1 text-warning ml-xl-3 mt-1 d-inline-block mt-xl-0 px-1 rounded-sm">\
            <i class="fa fa-exclamation-circle text-danger fs-12px mr-1"></i>\
            <span class="text-danger">'+message+'</span>\
            </span>';
        }
    };

    // load all data-alert="inline"
    let alertInline = document.querySelectorAll('*[data-alert="inline"]');

    // timeout
    let callAlertTimeout = null;

    // are we good ?
    if (alertInline.length > 0)
    {
        [].forEach.call(alertInline, (element)=>{

            // get type
            let alertType = element.getAttribute('data-alert-type');

            // load default 
            let defaultText = element.hasAttribute('data-default') ? element.getAttribute('data-default') : null;

            // check content
            if (element.textContent.length > 1)
            {
                // show element
                element.style.display = 'block';

                console.log(alertType, element);

                // call alert 
                call_alert(alertType, {wrapper : element, message: element.textContent});
            }
            else
            {
                // check default
                if (defaultText != null)
                {
                    // show element
                    element.style.display = 'block';
                    element.innerHTML = defaultText;
                }
            }
        });
    }

    // call alert
    function call_alert(type, config = {})
    {
        if (typeof ALERT_TYPES[type] !== 'undefined')
        {
            // clear timeout
            clearTimeout(callAlertTimeout);

            // push alert into
            let wrapper = document.body;

            // check from config
            if (typeof config['wrapper'] != 'undefined')
            {
                wrapper = (typeof(config['wrapper']) == 'string' ? document.querySelector(config['wrapper']) : config['wrapper']);
            }

            // build div
            let div = document.createElement('div');

            // get title
            let title = typeof config['title'] != 'undefined' ? config['title'] : '';

            // add alert
            div.innerHTML = ALERT_TYPES[type](config.message, title);

            // add now
            if (wrapper.nodeName == 'BODY')
            {
                wrapper.insertBefore(div, wrapper.firstElementChild);
            }
            else
            {
                wrapper.innerHTML = '';
                wrapper.appendChild(div);
            }

            // load default 
            let defaultText = wrapper.hasAttribute('data-default') ? wrapper.getAttribute('data-default') : null;

            // load default
            if (defaultText != null)
            {
                div.setAttribute('data-default', defaultText);

                // add default text
                callAlertTimeout = setTimeout(()=>{
                    wrapper.innerHTML = defaultText;
                    div.removeAttribute('data-default');
                }, 5000);
            }
            else
            {
                // hide alert
                callAlertTimeout = setTimeout(()=>{
                    document.query('*[data-dismiss="alert"]', (al)=>{
                        al.click();
                    });
                }, 5000);
            }

            // manage dismiss alert
            dismissAlert();
        }
    }

    // dismiss alerts on click
    function dismissAlert()
    {
        // @var nodes allAlerts
        let allAlerts = document.querySelectorAll('*[data-dismiss="alert"]');

        // are we good ?
        if (allAlerts.length > 0)
        {
            [].forEach.call(allAlerts, (alertElement)=>{

                // listen for click event
                alertElement.addEventListener('click', ()=>{

                    alertElement.parentNode.style.display = 'none';

                    // check parent 
                    if (alertElement.parentNode.parentNode != null)
                    {
                        // check for data-default
                        if (alertElement.parentNode.parentNode.hasAttribute('data-default'))
                        {
                            alertElement.parentNode.parentNode.innerHTML = alertElement.parentNode.parentNode.getAttribute('data-default');
                        }
                    }
                });

            });
        }
    }

    // remove all alerts
    function removeAllAlerts()
    {
        // load alerts
        let alerts = document.querySelectorAll('.alert');

        // check all
        if (alerts.length > 0)
        {
            [].forEach.call(alerts, function(e){

                // check parent node
                let parent = e.parentNode;

                // are we good ?
                if (parent !== null) {

                    // check for default
                    if (e.hasAttribute('data-default'))
                    {
                        e.innerHTML = e.getAttribute('data-default');
                    }
                    else
                    {
                        if (parent.hasAttribute('data-default'))
                        {
                            parent.innerHTML = parent.getAttribute('data-default');
                        }
                        else
                        {
                            parent.removeChild(e);
                        }
                    }
                }
                else
                {
                    parent.removeChild(e);
                }

            });
        }
    }

    // reset default
    function resetDefault()
    {
        // load alerts
        let alerts = document.querySelectorAll('*[data-alert="inline"]');

        // check now
        if (alerts.length > 0)
        {
            [].forEach.call(alerts, (e)=>{

                // check now
                if (e.hasAttribute('data-default'))
                {
                    e.innerHTML = e.getAttribute('data-default');
                }
            });
        }
    }

    // export functions
    e['callAlert'] = call_alert;
    e['removeAlerts'] = removeAllAlerts;
    e['resetDefaultAlerts'] = resetDefault;

})(window);
