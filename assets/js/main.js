// get element
const getElement = function(selector, callback = null){

    // make query
    const element = typeof selector !== 'string' ? selector : this.querySelector(selector);

    // load callback
    if (callback !== null && element !== null) callback.call(this, element);

    // return element
    return element;
};

// get all elements
const getAllElements = function(identifier, callback = null){

    // find element
    const elements = Array.prototype.map.call(this.querySelectorAll(identifier), (e)=>{ return e; });

    // call callback
    if (elements.length > 0 && callback !== null) callback.call(this, elements);

    // return element
    return elements;
};

// let's define how we want to use querySelector
Document.prototype.get = Element.prototype.get = getElement;

// let's define how we want to use queryAllSelector
Document.prototype.getAll = Element.prototype.getAll = getAllElements;

// show modal for element
Element.prototype.showModal = function () {
    this.classList.remove('animate-modal-out');
    this.classList.add('animate-modal');
};

// hide modal for element
Element.prototype.hideModal = function (callback=null) {
    this.classList.add('animate-modal-out');
    setTimeout(()=>{
        this.classList.remove('animate-modal');
        if (callback !== null) callback.call(this);
    },600);
};

// logs
const logs = {

    // page did load
    init : ()=> {
        console.info('Welcome to TripMata, Powered by WekiWork Creative Lab.');

        // switch password type for forms
        switchPasswordType();
    },

    // all good
    loaded : () => {
        console.info('Everything looks good. Please enjoy your browsing experience.');
    },

    // support
    support : () => {
        console.info('Please send an email to [support@wekiwork.com] if you experence any difficulty using the web app. Yours truly!');
    }
};

// just init log
logs.init();

// get content before
let contentBefore = '';

// load buttons
const buttons = {

    // loading button
    loading : function(target, content = '')
    {
        // cache button
        let buttonReference = null;

        // show loader now
        document.get(target, (button)=>{

            // cache content before
            contentBefore = button.innerHTML;

            // disable button
            button.setAttribute('disabled', 'yes');

            // set ref
            buttonReference = button;

            // load loader
            button.innerHTML = '<span class="inline-loader-text"><div class="spinner-border text-light spinner-button loader"></div> <span data-spinner="text">'+content+'</span></span>';
        });

        // return function
        return {
            hide : function(delay = 0){

                if (buttonReference !== null)
                {
                    // return back to base
                    setTimeout(()=>{
                        buttonReference.innerHTML = this.content;
                        buttonReference.removeAttribute('disabled');

                        // load resolve
                        //resolve(buttonReference);

                    }, delay);
                }
            },

            // change text content
            text : function(content, delay=0)
            {
                const promise = new Promise((resolve, reject) => {
                    if (buttonReference !== null)
                    {
                        setTimeout(()=>{
                            buttonReference.get('*[data-spinner="text"]', (spinnerText)=>{
                                spinnerText.innerHTML = content;
                                // load resolve
                                resolve(buttonReference);
                            });
                        }, delay);
                    }
                    else
                    {
                        reject('Could not proceed.');
                    }
                });

                // return promise
                return promise;
            },

            // cache content
            content : contentBefore
        }
    },

    // success button
    success : function(target, content, delay = 3000)
    {
        const promise = new Promise((resolve, reject)=>{

            // show success button now
            document.get(target, (button)=>{

                setTimeout(()=>{

                    // cache content before
                    contentBefore = contentBefore == '' ? button.innerHTML : contentBefore;

                    // load text
                    button.innerHTML = content;

                    // change class
                    button.classList.add('btn-success-theme');

                    // disable button
                    button.setAttribute('disabled','true');

                    // resolve
                    resolve({status:1, btn: button});

                    // remove
                    setTimeout(()=>{

                        // remove disabled button
                        button.removeAttribute('disabled');
                        button.classList.remove('btn-success-theme');
                        button.innerHTML = contentBefore;

                        // reset content before
                        contentBefore = '';

                        // resolve
                        resolve({status:2, btn: button});

                    }, delay);

                }, 0);

            });

        });

        // return promise
        return promise;
    },

    // error button
    error : function(target, content, delay = 3000)
    {
        const promise = new Promise((resolve, reject)=>{

            // show success button now
            document.get(target, (button)=>{

                setTimeout(()=>{

                    // cache content before
                    contentBefore = contentBefore == '' ? button.innerHTML : contentBefore;

                    // load text
                    button.innerHTML = content;

                    // change class
                    button.classList.add('btn-danger-theme');

                    // all good
                    resolve({status:1, btn: button});

                    // disable button
                    button.setAttribute('disabled','true');

                    // remove
                    setTimeout(()=>{

                        // remove disabled button
                        button.removeAttribute('disabled');
                        button.classList.remove('btn-danger-theme');
                        button.innerHTML = contentBefore;

                        // reset content before
                        contentBefore = '';

                        // all good
                        resolve({status:2, btn: button});

                    }, delay);

                }, 0);

            });

        });

        // return promise
        return promise;
    }
}

// switch password types
function switchPasswordType()
{
    document.getAll('.control-password', (switcherArray)=>{

        // loop through
        switcherArray.forEach((element)=>{

            // listen for click events
            element.addEventListener('click', ()=>{
                if (element.firstElementChild.hasAttribute('data-changed'))
                {
                    element.firstElementChild.removeAttribute('data-changed');
                    element.firstElementChild.className = element.getAttribute('data-default');

                    // change type to password
                    element.parentNode.get('input', (e)=>{e.type = 'password';});
                }
                else
                {
                    element.firstElementChild.setAttribute('data-changed', 'yes');
                    element.firstElementChild.className = element.getAttribute('data-changed');

                    // change type to text
                    element.parentNode.get('input', (e)=>{e.type = 'text';});
                }
            });

        });
    });
}

// events
const events = {
    roles : {
        uncheckAll : function(action = null){

            // helper function
            const helper = function(target, element, checked = false)
            {
                if (action === true) {
                    if (!element.hasAttribute('data-clicked')) element.setAttribute('data-clicked','yes');
                    element.click();
                }

                // clicked
                element.addEventListener('click', ()=>{

                    // manage toggle
                    if (element.hasAttribute('data-clicked')) {
                        checked = true;
                        element.textContent = 'Uncheck all';
                        if (element.hasAttribute('data-clicked')) element.removeAttribute('data-clicked');
                    }
                    else
                    {
                        element.setAttribute('data-clicked', 'yes');
                        element.textContent = 'Check all';
                        checked = false;
                    }

                    // look for data-access=read
                    document.getAll('*[data-access="'+target+'"]', function(elements){
                        elements.forEach(input => { input.checked = checked; });
                    });
                });
            };

            // look for read button
            document.get('#uncheck-all-read', function(element){
                // load helper
                helper('read', element, false);
            });

            // look for write button
            document.get('#uncheck-all-write', function(element){
                // load helper
                helper('write', element, false);
            });
        },

        matchAccess : function(){

            // look for data attr
            document.getAll('*[data-access]', function(elements){
                // load all
                elements.forEach(element => {

                    // listen for change event
                    element.addEventListener('change', ()=>{

                        // change children also
                        changeChildWithDataParent(element);
                    });
                });
            });

            // change child
            function changeChildWithDataParent(element)
            {
                // load all children
                document.getAll('*[data-parent="'+element.id+'"]', function(children){

                    // load all
                    children.forEach(child => {
                        child.checked = element.checked;
                    });
                });
            }
        },

        loadRef : function()
        {
            // @var array refArray
            let refArray = [], refKeys = [];

            // Run query
            document.getAll('*[data-ref]', function(elements){

                // loop through
                elements.forEach((element) => {

                    // create object
                    let objectWrapper = Object.create(null);
                    objectWrapper.NavRef = element.getAttribute('data-ref');

                    // can save
                    let canSave = true;

                    // check refKeys
                    if (refKeys.indexOf(objectWrapper.NavRef) >= 0) {
                        objectWrapper = refArray[refKeys.indexOf(objectWrapper.NavRef)];
                        canSave = false;
                    }
                    else
                    {
                        refKeys.push(objectWrapper.NavRef);
                    }

                    // check access
                    switch (element.getAttribute('data-access'))
                    {
                        // read
                        case 'read':
                            objectWrapper.read = element.checked == true ? 1 : 0;
                            break;

                        // write
                        case 'write':
                            objectWrapper.write = element.checked == true ? 1 : 0;
                            break;
                    }

                    // push object
                    if (canSave) refArray.push(objectWrapper);

                });
            });

            // return array
            return refArray;
        }
    }
};

// preloader
const preloader = {
    inline : {
        cache : {},
        target : null,
        show : function(target){

            let object = function(){};

            // get element
            document.get(target, (e)=>{

                // cache body
                object.target = e;

                // set preloader
                e.setAttribute('data-preloader-inline', 'yes');

                // can we cache the body?
                if (typeof this.cache[target] == 'undefined')
                {
                    this.cache[target] = e.innerHTML;
                }

                object.cache = this.cache[target];

                // reset
                e.innerHTML = '<div class="preloader-line"></div>\
                <div class="preloader-line"></div>\
                <div class="preloader-line"></div>';

                // show element
                if (e.hasAttribute('data-preloader-inline')) e.removeAttribute('data-preloader-inline');
            });

            // bind others
            object.constructor = this.constructor;
            object.error = this.error;
            object.hide = this.hide;

            // return instance
            return object;
        },
        hide : function(){
            if (this.target != null) this.target.innerHTML = this.cache;
        },
        error : function(errorText){
            if (this.target != null) this.target.innerHTML = '<div class="error-screen">\
            <span class="error-icon"></span>\
            <span class="error-text">'+errorText+'</span></div>';
        }
    }
}

// modal
const modal = {
    show : function(title, message, type = 'error')
    {
        document.get('*[data-target="modal-message"]', (modalContainer)=>{

            // remove style
            modalContainer.removeAttribute('style');

            // Add it's titel
            modalContainer.querySelector('h2').innerText = title;

            // add it's message
            modalContainer.querySelector('p').innerText = message;

            // update modal-icon
            modalContainer.querySelector('*[data-modal="'+type+'"]').style.display = 'block';

            // show modal
            modalContainer.classList.add('show');

            // toggle modal
            toggleModalMessage(modalContainer);

        });
    }
};

// listen for all onload call functions
window.onload = function(){
    // look for all onload call
    document.getAll('*[data-onload-call]', function(functions){

        functions.forEach(element => {

            // @var string funcName
            const funcName = element.getAttribute('data-onload-call');

            // check if function exists
            if (typeof window[funcName] == 'function') window[funcName]();
        });
    });

    // load images on page load
    document.getAll('img.page-load', (imgs)=>{
        // load all images
        imgs.forEach((img)=>{
            img.src = img.getAttribute('data-src');
            img.removeAttribute('data-src');
        });
    });

    // load lozad
    const observer = lozad();
    observer.observe();

};

// Show delete modal
function showDeleteModal(ev)
{
    // manage delete modal trigger
    document.get('.delete-modal', modal => {

        // hide modal function
        const hideModal = ()=>{
            modal.style.opacity = 0;
            setTimeout(() => { modal.style.display = 'none'; }, 600);
            modal.removeAttribute('data-clicked');
        };

        // hide modal if body of delete modal has been clicked
        modal.addEventListener('click', (ev)=>{
            if (ev.target.classList.contains('delete-modal')) return hideModal();
        });

        // hide modal if the cancel button has been clicked
        modal.get('button.cancel', button => {
            button.addEventListener('click', hideModal);
        });

        if (!modal.hasAttribute('data-clicked'))
        {
            ev.preventDefault();
            modal.style.display = 'flex';
            modal.setAttribute('data-clicked', 'yes');
            setTimeout(()=>{ modal.style.opacity = 1;}, 200);

            let dm = ev.target;
            let action = dm.hasAttribute('data-listen') ? dm.getAttribute('data-listen').toUpperCase() : 'DELETE';

            // track delete
            modal.get('button.delete', btnDelete => {

                // get the input box
                modal.get('.body input', inputBox => {

                    // update input box
                    inputBox.setAttribute('placeholder', "Enter "+action+" here");

                    // update title
                    if (dm.hasAttribute('data-title')) 
                    {
                        modal.get('header h2', (header)=>{
                            // set app title
                            header.innerText = dm.getAttribute('data-title');
                        });
                    }

                    // update action in body
                    modal.get('.body b', (actionContainer)=>{
                        actionContainer.innerText = "'"+action+"'";
                    });
                
                    // get the form
                    modal.get('form', formElement => {
                
                        // manage click event
                        btnDelete.addEventListener('click', (e)=>{
                            e.preventDefault();
                
                            // check inout value
                            if (inputBox.value.toUpperCase().trim() == action)
                            {
                                // does delete modal have data-method?
                                if (dm.hasAttribute('data-method')) formElement['REQUEST_METHOD'].value = dm.getAttribute('data-method');
                
                                // load all data-input
                                if (dm.hasAttribute('data-input'))
                                {
                                    const inputJson = JSON.parse(dm.getAttribute('data-input'));
                                    
                                    // add
                                    if (typeof inputJson == 'object')
                                    {
                                        modal.get('.input-elements', inputElementWrapper => {
                                            inputElementWrapper.innerHTML = '';
                
                                            for (var key in inputJson)
                                            {
                                                var input = document.createElement('input');
                                                input.type = 'hidden';
                                                input.name = key;
                                                input.value = inputJson[key];
                
                                                // add child
                                                inputElementWrapper.appendChild(input);
                                            }
                
                                            // submit form
                                            formElement.submit();
                                        });
                                    }
                                }
                                else
                                {
                                    // submit form
                                    formElement.submit();
                                }
                            }
                        });
                
                    });
                
                });
            });
        }
    });
}

// trigger modal
document.getAll('*[data-modal="delete"]', deleteModal => {
    // listen for click event
    deleteModal.forEach(dm => {
        dm.setAttribute('onclick', 'showDeleteModal(event); return false;');
    });
});

// format number
function numFormat(x)
{
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// load html content to page
(function () {
    // check for data-include
    let include = document.querySelectorAll('*[data-include]');

    // are we good ?
    if (include.length > 0)
    {
        // get content
        const getContent = function (fileAddress, element) {

            return new Promise((resolve)=>{

                // build http
                const http = new XMLHttpRequest();
                http.open('GET', fileAddress + '.html', true);
                http.onreadystatechange = function (res) {
                    if (http.readyState === 4 && http.status === 200)
                    {
                        resolve({text : http.responseText, element : element});
                    }
                };
                http.send(null);
            });
        };

        // load elements
        Array.prototype.forEach.call(include, (e)=>{
            try
            {
                getContent(e.getAttribute('data-include'), e).then((data)=>{

                    data.element.innerHTML = data.text;

                    // add title
                    if (data.element.hasAttribute('data-title'))
                    {
                        // get title
                        if (data.element.nodeName === 'HEAD')
                        {
                            data.element.querySelector('title').innerText = data.element.getAttribute('data-title');
                        }
                    }

                    // load active links
                    loadAllActiveLinks();
                });
            }
            catch (e) {

            }
        });
    }

    // load destination tabs
    let destinationTabWrapper = document.querySelector('.destination-list-tab');

    // load destination tab body
    let destinationTabBody = document.querySelector('.destination-list-tab-body');

    // are we good ?
    if (destinationTabWrapper !== null && destinationTabBody !== null)
    {
        // get all targets
        const allTargets = destinationTabWrapper.querySelectorAll('*[data-target]');

        // get all roles
        const targetRoles = destinationTabBody.querySelectorAll('*[data-role]');

        // remove active class
        const removeActiveClass = function (element) {
            if (element.classList.contains('active')) element.classList.remove('active');
        };

        // load target
        [].forEach.call(allTargets, (target)=>{

            // listen for click event
            target.addEventListener('click', ()=>{

                // remove active tab
                [].forEach.call(allTargets, removeActiveClass);

                // set active
                target.classList.add('active');

                // remove active body
                [].forEach.call(targetRoles, (e)=>{

                    // remove active class
                    removeActiveClass(e);

                    // set body with target active
                    if (e.getAttribute('data-role') === target.getAttribute('data-target'))
                    {
                        e.classList.add('active');
                    }
                });
            });
        });
    }
}());

// toggle checkbox
function toggleCheckBox(element, target){

    // load target
    element.parentNode.get(target, (checkbox)=>{

        // remove active
        checkbox.classList.remove('checked');
        element.parentNode.get('.text-gray', (e)=>{
            e.classList.remove('active');
        });

        // set active
        if (element.checked) {
            checkbox.classList.add('checked');
            element.parentNode.get('.text-gray', (e)=>{
                e.classList.add('active');
            });
        }
    });
}

// filter page result
function filterResultBy(type, value, e = null)
{
    // get search
    let search = window.location.search;

    // encode value
    value = encodeURIComponent(value);

    // check for question mark
    if (search.indexOf('?') >= 0) 
    {
        // check for type
        if (search.indexOf(type) < 0 && value != '')
        {
            location.href = location.href + '&' + type + '=' + value;
        }
        else
        {
            // get type 
            let typeQuery = location.href.substring(location.href.indexOf('?'));

            // get href before
            let hrefBefore = location.href.substring(0, location.href.indexOf(typeQuery));

            // get url query
            let parsedQuery = parseQuery(typeQuery);

            // check for type
            if (typeof parsedQuery[type] != 'undefined')
            {
                if (type == 'search' || type == 'page' || type == 'tab')
                {
                    parsedQuery[type] = value;

                    // can we delete query
                    if (value == '') delete parsedQuery[type];

                    // get query string
                    let queryString = objectToQuery(parsedQuery);

                    // load location
                    location.href = hrefBefore + (queryString.length > 1 ? ('?' + queryString) : '');
                }
                else
                {
                    // load type array
                    let typeArray = parsedQuery[type].split(',');

                    // element checked
                    if (e.checked)
                    {
                        // do we have this value
                        if (typeArray.indexOf(value) < 0)
                        {
                            // push now
                            typeArray.push(value);

                            // load type array
                            parsedQuery[type] = typeArray.join(',').replace(/^[,]/g, '');

                            // load url
                            location.href = hrefBefore + '?' + objectToQuery(parsedQuery);
                        }
                    }
                    else
                    {
                        // do we have this value
                        if (typeArray.indexOf(value) !== false)
                        {
                            // remove now
                            delete typeArray[typeArray.indexOf(value)];

                            // clean up
                            typeArray = typeArray.filter((val) => { return val != '';});

                            // reset url
                            if (typeArray.length > 0) {

                                // load type array
                                parsedQuery[type] = typeArray.join(',').replace(/[,]{2,}/g, ',').replace(/[,]$/g, '');
                            }
                            else
                            {
                                delete parsedQuery[type];
                            }

                            // get query string
                            let queryString = objectToQuery(parsedQuery);

                            // load url
                            location.href = hrefBefore + (queryString.length > 1 ? ('?' + queryString) : '');
                        }   
                    }
                    
                }
            }
        }
    }
    else
    {
        location.href = location.href + '?' + type + '=' + value;
    }
}

// load all links
function loadAllActiveLinks() {
    document.getAll('a[href]', (links)=>{
        links.forEach((link)=>{
            const href = link.getAttribute('href');
            if (href !== '' && href !== '#')
            {
               if (location.href === link.href) link.classList.add('active');
            }
        });
    });
}

// parse query
// open source. author https://stackoverflow.com/questions/2090551/parse-query-string-in-javascript
// modified by amadi Ifeanyi
function parseQuery(queryString) {
    let query = {}, pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&'), index, queryLength = pairs.length;
    for (index = 0; index < queryLength; index++) {
        let pair = pairs[index].split('=');
        if (pair[0] != '') query[decodeURIComponent(pair[0])] = (pair[1] || '');
    }
    return query;
}

// object to query
function objectToQuery(obj)
{
    let queryArray = [], objectIndex;

    // run for loop
    for (objectIndex in obj) queryArray.push((objectIndex + '=' + obj[objectIndex]));

    // return a string
    return queryArray.join('&');
}

// load filter tabs
(function () {

    // find filter tabs
    document.get('*[data-filter="tabs"]', (filterWrapper)=>{

        // look for callback
        filterWrapper.get('*[data-callback]', (callbackWrapper) => {

            // get callback function
            const callbackFunction = callbackWrapper.getAttribute('data-callback');

            // load data-filter-by
            callbackWrapper.getAll('*[data-filter-by]', function (filterBy) {

                // toggle active state
                const toggleActiveState = function () {
                    filterBy.forEach((element)=>{
                        element.classList.remove('active');
                    });
                };

                // load and listen
                filterBy.forEach(element => {

                    // onclick
                    element.addEventListener('click', ()=>{

                        // toggle visibility
                        toggleActiveState();

                        // set active
                        element.classList.add('active');

                        // load callback
                        if (typeof window[callbackFunction] === 'function'){
                            window[callbackFunction]("tab", element.getAttribute('data-filter-by'));
                        }
                    });
                });
            });

        });
    });

    loadTimeRangeFromDocument();

}());

// copy slides
let slidesCopy = null;

// set active link on all anchor tags
(function () {

    // load active links
    loadAllActiveLinks();

    // load page content
    document.getAll('*[data-page-title="yes"]', (pageTitleElement) => {

        // get search in request
        let search = decodeURI(location.search), query = '', contentText = '<p>No content found for this page found!</p>';

        // look for qn=
        if (search.indexOf('qn=') > 0)
        {
            // update search
            search = search.match(/(\?qn=)+(.*)/);

            // are we good
            if (search !== null && typeof search[2] != '')
            {
                // get the query
                query = search[2];

                // update title
                pageTitleElement.forEach((element) => {
                    element.textContent = query.replace(/[-]/g, ' ');
                });

                // change page title
                document.title = query.replace(/[-]/g, ' ') + ' | TripMata.com';

                // load content
                let http = new XMLHttpRequest();
                http.open('GET', 'get-contents?title='+query, true);
                http.onreadystatechange = function (res) {
                    if (http.readyState === 4 && http.status === 200)
                    {
                        // get json object
                        const json = JSON.parse(http.responseText);

                        // load page content
                        document.get('*[data-page-content="yes"]', (content)=>{

                            setTimeout(()=>{

                                // failed
                                if (json.status == 'error')
                                {
                                    content.innerHTML = contentText;
                                }
                                else
                                {
                                    content.innerHTML = json.data;
                                }

                                // update content text
                                // contentText = (typeof json.data[query] !== 'undefined') ? json.data[query] : contentText;

                                // // can we load html?
                                // if (contentText.match(/(\.html)/))
                                // {
                                //     let http = new XMLHttpRequest();
                                //     http.open('GET', contentText, true);
                                //     http.send(null);
                                //     http.onreadystatechange = function () {
                                //         if (http.readyState === 4 && http.status === 200)
                                //         {
                                //             content.innerHTML = http.responseText;
                                //         }
                                //     };
                                // }
                                // else
                                // {
                                //     content.innerHTML = contentText;
                                // }

                            }, 1000);

                        });
                    }
                };
                http.send(null);
            }
        }
    });

    // data image
    document.getAll('*[data-image]', (elements)=>{

        document.get('.big-screen-slides', (screen)=>{

            // copy
            slidesCopy = screen.innerHTML;

            elements.forEach((element)=>{
                element.addEventListener('click', ()=>{

                    //screen.innerHTML = '';
                    //screen.innerHTML = '';

                    // load slider
                    let slider = screen.querySelector('.slider');

                    // load items
                    let sliderItems = slider.querySelector('.items'),
                        prev = slider.querySelector('.prev'),
                        next = slider.querySelector('.next');

                    sliderItems.setAttribute('data-active', element.getAttribute('data-image'));

                    // screen.style.display = 'flex';
                    screen.showModal();

                    slide(slider, sliderItems, prev, next);

                    // fix images
                    // load lozad
                    const observer = lozad();
                    observer.observe();

                });
            });

        });
    });

    // manage view modal
    document.getAll('.view-modal', (modals)=>{

       // close modal
       const closeModal = (modal)=>{
         modal.hideModal();
       };

       // check all
        modals.forEach(function (modal) {
            modal.addEventListener('click', (e)=>{
                if (e.target == modal) closeModal(modal);
            });

            // look for the close button
            modal.get('*[data-close-btn="close"]', (closeElement)=>{
                closeElement.addEventListener('click', ()=>{
                    closeModal(modal);
                });
            });
        });
    });

    // load category range
    document.getAll('.category-range > .range', (ranges)=>{
        ranges.forEach((range)=>{
            if (range.hasAttribute('data-value'))
            {
                // clear range
                range.innerHTML = '';

                // get value
                let rangeValue = Number(range.getAttribute('data-value'));

                // create node
                let rangeElement = document.createElement('div');
                rangeElement.className = 'range-gauge';
                rangeElement.style.width = (rangeValue > 100 ? 100 : rangeValue) + '%';

                // determine gauge
                if (rangeValue <= 50) rangeElement.classList.add('average');

                // append now
                range.append(rangeElement);
            }
        });
    });

    // load all data checkbox
    document.getAll('*[data-checkbox]', (checkboxes)=>{

        // loop through
        checkboxes.forEach((input)=>{

            // build container
            let checkboxElement = document.createElement('div'),
            checkElement = document.createElement('i'),
            checkboxTextElement = document.createElement('span');
            checkboxTextElement.className = 'data-checkbox-text';
            checkElement.className = 'icon ion-android-done';
            checkboxElement.className = 'data-checkbox hide';
            checkboxElement.append(checkElement);
            input.parentNode.append(checkboxElement);

            // add text
            if (input.hasAttribute('data-text'))
            {
                checkboxTextElement.innerText = input.getAttribute('data-text');
                // add now
                input.parentNode.append(checkboxTextElement);
            }

            // reset
            input.checked = false;

            // can we check
            if (input.hasAttribute('data-checked') && (input.getAttribute('data-checked') === 'yes') )
            {
                input.checked = true;
                checkboxElement.className = 'data-checkbox show';
            }

            // button clicked
            input.parentNode.addEventListener('click', ()=>{
                input.checked = !input.checked;
                checkboxElement.className = 'data-checkbox hide';
                if (input.checked) checkboxElement.className = 'data-checkbox show';
            });
        });

        // data-checkbox-input
        document.get('*[data-checkbox-input]', (checkboxInputElement)=>{

            checkboxInputElement.addEventListener('keyup', (e)=>{
                if (e.keyCode === 13 || e.key.toUpperCase() === 'ENTER')
                {
                    const target = checkboxInputElement.getAttribute('data-checkbox-input');

                    // Create checkbox group
                    let checkboxGroupElement = document.createElement('div'),
                    checkboxInput = document.createElement('input');
                    checkboxGroupElement.className = 'checkbox-group';
                    checkboxInput.type = 'checkbox';
                    checkboxInput.setAttribute('data-checkbox', checkboxInputElement.value);
                    checkboxInput.checked = true;
                    checkboxGroupElement.append(checkboxInput);

                    let checkboxElement = document.createElement('div'),
                        checkElement = document.createElement('i'),
                        checkboxTextElement = document.createElement('span');
                    checkboxTextElement.className = 'data-checkbox-text';
                    checkElement.className = 'icon ion-android-done';
                    checkboxElement.className = 'data-checkbox show';
                    checkboxTextElement.innerText = checkboxInputElement.value;
                    checkboxElement.append(checkElement);
                    checkboxGroupElement.append(checkboxElement);
                    checkboxGroupElement.append(checkboxTextElement);

                    // add
                    document.get(target, (parent)=>{
                        parent.append(checkboxGroupElement);
                        checkboxInputElement.value = '';

                        // button clicked
                        checkboxGroupElement.addEventListener('click', ()=>{
                            checkboxInput.checked = !checkboxInput.checked;
                            checkboxElement.className = 'data-checkbox hide';
                            if (checkboxInput.checked) checkboxElement.className = 'data-checkbox show';
                        });
                    });

                }
            });
        });
    });

    // manage listing banner image
    document.get('#banner_image', (file)=>{

        // check for change event
        file.addEventListener('change', ()=>{

            // do we have a file
            if (file.files.length > 0)
            {
                // load banner image
                document.get('#banner-display', (display)=>{

                    let fileReader = new FileReader();
                    fileReader.onload = function(e){
                        display.src = e.target.result;
                        display.style.display = 'block';
                    };

                    fileReader.readAsDataURL(file.files[0]);
                });
            }
        });
    });

    // add additional image
    document.get('#add-additional-image', (imageBtn)=>{

        // add image
        imageBtn.addEventListener('change', ()=>{

            // create element
            let listingImage = document.createElement('div'),
                deleteImage = document.createElement('div'),
                label = document.createElement('label'),
                img = document.createElement('img'),
                input = document.createElement('input'),
                currentIndex = 1;

            // load additional list image
            document.get('.additional-images-list', (additionalImage)=>{

                // get current index
                if (additionalImage.hasAttribute('data-index')) currentIndex = Number(additionalImage.getAttribute('data-index')) + 1;

                // update
                additionalImage.setAttribute('data-index', currentIndex);

                // add classes
                listingImage.className = 'listing-image-list';
                deleteImage.className = 'delete-image';
                deleteImage.innerText = 'x';
                listingImage.appendChild(deleteImage);
                label.setAttribute('for', 'image' + currentIndex);
                input.type = 'file';
                input.id = 'image' + currentIndex;
                input.style.display = 'none';
                input.files = imageBtn.files;
                input.setAttribute('accept', '.jpg,.png,.jpeg,.gif');
                input.name = 'image[]';
                img.src = '';
                label.appendChild(img);
                label.appendChild(input);
                listingImage.appendChild(label);

                // update input
                input.addEventListener('change', ()=>{
                    // load image preview
                    let fileReader = new FileReader();
                    fileReader.onload = function(e){
                        img.setAttribute('src', e.target.result);
                    };
                    fileReader.readAsDataURL(input.files[0]);
                });

                // add image list
                additionalImage.appendChild(listingImage);

                // load image preview
                let fileReader = new FileReader();
                fileReader.onload = function(e){
                    img.setAttribute('src', e.target.result);
                };
                fileReader.readAsDataURL(input.files[0]);

                // load delete function
                deleteListingImage();
            });
        });
    });

    // add more entry
    document.getAll('.form-inline-input > .info > .add-btn', (addBtn)=>{

        // loop through
        addBtn.forEach((btn)=>{

            // manage click event
            btn.addEventListener('click',  ()=>{

                // load parent wrapper
                let parentNode = btn.parentNode.parentNode;

                // load first child
                let firstChild = parentNode.firstElementChild;

                // create element
                let container = document.createElement('div');
                container.className = firstChild.className;

                // load all contents
                container.innerHTML = firstChild.innerHTML;

                // remove all values from input
                container.getAll('input', (inputs)=>{
                    inputs.forEach((input)=>{ input.value = ''; });
                });

                // append container
                parentNode.insertBefore(container, parentNode.lastElementChild);
            });
        });
    });

    // change category
    document.get('#switch-category', (categoryBtn)=>{

        // click
        categoryBtn.addEventListener('click', ()=>{

            // load category
            document.get('.box-content-form-input #category', (categoryInput)=>{

                // check value
                let loader;

                if (categoryInput.value != '')
                {
                    // button loading
                    loader = buttons.loading(categoryBtn);

                    // update category input
                    document.get('#category-input', (input)=>{input.value = categoryInput.value; });

                    // update category text
                    document.getAll('.category-text', (categoryTexts)=>{

                        // hide loader
                        loader.hide();

                        // replace now
                        categoryTexts.forEach((categoryText)=>{categoryText.innerText = categoryInput.value;});

                        // all good
                        buttons.success(categoryBtn, 'Switched.');
                    });
                }
            });
        });
    });

    // manage dashboard user navigation
    document.get('.app-user-navigation .app-user', (userNavWrapper)=>{

        // helper function
        const showNavWrapper = (e)=>{

            if (!userNavWrapper.hasAttribute('data-show'))
            {
                userNavWrapper.get('ul', (ul)=>{
                    ul.style.display = 'block';
                    userNavWrapper.setAttribute('data-show', 'yes');
                    setTimeout(()=>{
                        ul.style.opacity = '1';
                        ul.style.transform = 'translateY(0px)';
                    }, 100);
                });
            }
            else
            {
                // ok check
                userNavWrapper.get('ul', (ul) => {
                    ul.style.opacity = '0';
                    ul.style.transform = 'translateY(20px)';
                    userNavWrapper.removeAttribute('data-show');
                });
            }
        };


        // listen for event
        userNavWrapper.addEventListener('click', showNavWrapper);

    });

    // manage amount to fund checkbox
    document.getAll('*[name="amount-to-fund"]', (radioElements)=>{
        // manage other input
        let otherInputElement = {
            element: null,
            show : function () {
                document.get('.other-input', (otherInput)=>{
                   this.element = otherInput;
                   this.element.style.display = 'flex';
                   otherInput.get('input', (input)=>{
                    input.setAttribute('required', 'yes');
                   });
                });
            },
            hide : function () {
                if (this.element !== null) {
                    this.element.style.display = 'none';
                    this.element.get('input', (input)=>{
                        input.removeAttribute('required');
                    });
                }
            }
        };

        // find all
        radioElements.forEach((radioElement)=>{
            if (radioElement.checked)
            {
                // hide other input element
                otherInputElement.hide();

                if (radioElement.id === 'other')
                {
                    // show now
                    otherInputElement.show();
                }
            }

            // manage change event
            radioElement.addEventListener('change', ()=>{
                if (radioElement.id !== 'other')
                {
                    otherInputElement.hide();
                }
                else
                {
                    otherInputElement.show();
                }
            });
        });
    });

    // manage booking tracker
    document.get('.close-booking-tracker', (tracker) => {
        // manage click event 
        tracker.addEventListener('click', ()=>{
            document.get('.booking-tracker', (bookingTracker)=>{
                bookingTracker.style.transform = 'translateY(200px)';
                // hide booking tracker
                setTimeout(()=>{ bookingTracker.style.display = 'none'; }, 700);
            });
        });
    });

    // show booking tracker
    document.get('.booking-tracker.show', (bookingTracker)=>{
        // show booking tracker
        setTimeout(()=>{
            bookingTracker.style.display = 'flex';

            // show tracker
            setTimeout(()=>{
                bookingTracker.style.transform = 'translateY(0px)';
            }, 100);

        },400);
    });

    // manage modal message 
    document.get('.modal-message-container', (modalContainer)=>{
        toggleModalMessage(modalContainer);
    });

    // who are we booking for?
    document.getAll('input[name="booking_for"]', (inputElement)=>{

        // get guest email label
        document.get('label[for="guest_email"]', (guestLabel)=>{

            inputElement.forEach((element)=>{

                // listen for change event
                element.addEventListener('change', (e)=>{

                    // hide guest email label
                    guestLabel.style.display = 'none';

                    // show guest email label
                    if (element.value == 'someone_else') guestLabel.style.display = 'block';
                });
            }); 

        });
        
    });

    // who is paying?
    document.getAll('input[name="traveling"]', (inputElement)=>{

        // get corporate member element
        document.get('.who_is_paying_wrapper', (corporateMember)=>{

            if (corporateMember.hasAttribute('data-corporate-member') && corporateMember.getAttribute('data-corporate-member') == 'yes')
            {
                inputElement.forEach((element)=>{

                    // listen for change event
                    element.addEventListener('change', (e)=>{
                        
                        // hide corporate member element
                        corporateMember.style.display = 'none';
    
                        // show corporate member wrapper
                        if (element.value == 'yes') corporateMember.style.display = 'block';
                    });
                }); 
            }
            
        });
        
    });

    // change resevation dates
    document.getAll('.change-reservation-dates', (triggerElements)=>{
        triggerElements.forEach((triggerElement)=>{
            triggerElement.addEventListener('click', (e)=>{
                e.preventDefault();

                // show reservation container
                document.get('.change-reservation-container', (container)=>{
                    container.style.display = 'block';
                    container.get('.modal-message-container', (modalContainer)=>{
                        modalContainer.removeAttribute('style');
                    });
                });
            });
        });
    });

    // manage stays picker
    document.getAll('.stays-picker-row', (pickerRows) => {

        // helper function
        let addCount = function(row, field)
        {
            // get current value
            let currentValue = Number(field.value) + 1;

            // update field
            field.value = currentValue;

            // update value
            updateValue(field);
        };

        let reduceCount = function(row, field)
        {
            // get current value
            let currentValue = Number(field.value) - 1;

            // less than zero
            currentValue = (currentValue <= 0 ? 0 : currentValue);

            // update field
            field.value = currentValue;

            // update value
            updateValue(field);
        };

        let updateValue = function(field)
        {
            // read target
            let target = field.getAttribute('data-target');

            // update target
            document.get('input[name="'+target+'"]', (input)=>{

                // update value
                input.value = Number(field.value);

                // get input target
                if (input.hasAttribute('data-target'))
                {
                    target = input.getAttribute('data-target');

                    // manage target
                    document.get('.' + target, (displayTarget) => {

                        switch (target)
                        {
                            case 'travel-adult':
                                displayTarget.innerHTML = (input.value <= 1 ? (input.value + ' Adult') : (input.value + ' Adults'));
                            break;

                            case 'travel-children':
                                displayTarget.innerHTML = (input.value > 1 ? (input.value + ' Children') : (input.value + ' Child'));
                            break;

                            case 'travel-room':
                                displayTarget.innerHTML = (input.value > 1 ? (input.value + ' Rooms') : (input.value + ' Room'));
                            break;
                        }
                    }); 
                }
            });
        };

        // loop through
        pickerRows.forEach((pickerRow)=>{

            // look for controller-field
            pickerRow.get('.controller-field', (field)=>{

                field.addEventListener('keyup', (e)=>{
                    if (e.code == 'ArrowUp' || e.keyCode == 38) addCount(pickerRow, field);
                    if (e.code == 'ArrowDown' || e.keyCode == 40) reduceCount(pickerRow, field);

                    if (isNumber(e)) updateValue(field);
                });

                // left button clicked
                pickerRow.get('.left-btn', (leftBtn)=>{
                    leftBtn.addEventListener('click', ()=>{ reduceCount(pickerRow, field); });
                });

                // right button clicked
                pickerRow.get('.right-btn', (rightBtn)=>{
                    rightBtn.addEventListener('click', ()=>{ addCount(pickerRow, field); });
                });
            });

        }); 
    });

    // trigger stay picker
    loadStaysPicker();

    // load all href
    loadAllDataHref();

    // add loader to buttons
    document.getAll('*[data-btn]', (btns)=>{
        btns.forEach((btn) => {
            btn.addEventListener('click', ()=>{

                // get parent
                let parent = btn.parentNode;

                // check if parent is a form
                if (parent !== null && parent.nodeName == 'FORM')
                {
                    btn.parentNode.addEventListener('submit', (e)=>{
                        buttons.loading(btn, btn.getAttribute('data-btn'));
                    });
                }
                else
                {
                    if (btn.hasAttribute('data-parent'))
                    {
                        // load parent
                        document.get(btn.getAttribute('data-parent'), (parent) => {
                            parent.addEventListener('submit', (e)=>{
                                buttons.loading(btn, btn.getAttribute('data-btn'));
                            });
                        });
                    }
                    else
                    {
                        btn.addEventListener('click', (e)=>{
                            buttons.loading(btn, btn.getAttribute('data-btn'));
                        });
                    }
                    
                }
                
            });
        });
    });

    // load countdown
    document.get('*[data-countdown]', (countdown)=>{
        // get count
        let count = Number(countdown.getAttribute('data-countdown'));
        // load countdown
        setInterval(()=>{
            let currentCount = (count - 1), text = (currentCount > 1 ? 'seconds' : 'second');
            // update countdown
            countdown.innerHTML = currentCount + ' ' + text;
            // update count
            count = currentCount;
            // reload page
            if (currentCount == 0) location.reload();
        },2000);
    });

    // send background mail
    document.get('*[data-mail-client]', (element)=>{
        
        // get callback
        let callback = element.getAttribute('data-mail-client');

        // are we good ?
        if (callback != '')
        {
            // get http
            let http = (window.ActiveXObject) ? new ActiveXObject("XMLHTTP.Microsoft") : new XMLHttpRequest();

            // send request
            http.open("GET", callback, true);
            http.setRequestHeader("Request-Session-Token", document.querySelector('*[name="session_public_token"]').getAttribute('content'));
            http.send(null);
        }
    });

    // add corporate member
    document.get('.add-corporate-member input[name="customer"]', (inputElement)=>{

        // load customer id
        inputElement.parentNode.get('input[name="customerid"]', (customerInputElement)=>{

            // send request
            let request = (value, url, callback)=>{

                // laod form data
                const form = new FormData;
                form.append('value', value);
                form.append('REQUEST_METHOD', '@findCorporateMember');

                // get http
                let http = (window.ActiveXObject) ? new ActiveXObject("XMLHTTP.Microsoft") : new XMLHttpRequest();

                // initiate request
                http.open('POST', url, true);
                http.onreadystatechange = function(){
                    if (http.status == 200 && http.readyState == 4) 
                    {
                        callback.call(this, JSON.parse(http.responseText));
                    }
                };

                // send
                http.send(form);
            };

            // please wait
            let please_wait = (container) => {

                // show container
                container.classList.add('show');

                // show inline preloader
                preloader.inline.show(container);

            };  

            // populate data
            let populateData = (container, data, inputElement) => {

                // hide preloader
                container.innerHTML = '<ul><ul>';

                // get list container
                container.get('ul', (listCointainer)=>{

                    // get index
                    let index;

                    // build list
                    for (index in data)
                    {
                        // create li and a 
                        let li = document.createElement('li'), a = document.createElement('a');

                        // add content
                        a.innerHTML = '<h4>'+(data[index].name + ' ' + data[index].surname)+'</h4>\
                        <footer>\
                            <div>\
                                <i class="icon ion-ios-email"></i> <span>'+(data[index].email)+'</span>\
                            </div>\
                            <div>\
                                <i class="icon ion-ios-telephone"></i> <span>'+((data[index].phone))+'</span>\
                            </div>\
                        </footer>';

                        // update anchor tag
                        a.setAttribute('href', 'javascript:void(0)');
                        a.setAttribute('data-customerid', data[index].customerid);

                        // manage click event
                        a.addEventListener('click', ()=>{

                            // hide list container
                            container.classList.remove('show');

                            // clear list container
                            listCointainer.innerHTML = '';

                            // update search entry
                            inputElement.value = a.querySelector('h4').innerText;

                            // update customerid entry
                            customerInputElement.value = a.getAttribute('data-customerid');

                        });

                        // append anchor tag
                        li.append(a);

                        // add to list container
                        listCointainer.append(li);
                    }

                });

            };

            document.get('.member-list-search', (listSearchContainer) => {

                // listen for keyup event
                inputElement.addEventListener('keyup', ()=>{

                    // Add please wait
                    please_wait(listSearchContainer);

                    // request for data
                    request(inputElement.value, inputElement.parentNode.action, (response)=>{

                        if (response.status == 'error') {

                            listSearchContainer.classList.remove('show');

                            // stop preloader
                            preloader.inline.hide(listSearchContainer);
                        }
                        else
                        {
                            // populate data
                            populateData(listSearchContainer, response.data, inputElement);
                        }
                    });

                });

            });
        });

    });

    // manage profile image
    document.get('.profile-header-img input', (filePicker)=>{
        
        // laod profile button
        document.get('.save-profile-btn', (profileBtn)=>{

            // file picker
            filePicker.addEventListener('change', ()=>{
                
                // show profile button
                profileBtn.style.display = 'flex';

                // update display image
                let fileReader = new FileReader();
                fileReader.onload = function(e){
                    filePicker.parentNode.firstElementChild.src = e.target.result;
                };

                fileReader.readAsDataURL(filePicker.files[0]);
            });

        });

    });

    // load image picker
    document.getAll('*[data-image="picker"] input', (imagePickers)=>{
        imagePickers.forEach((picker)=>{
            picker.addEventListener('change', ()=>{
                // look for image
                picker.parentNode.get('img', (img)=>{
                    img.style.display = 'block';

                    let fileReader = new FileReader();
                    fileReader.onload = function(e){
                        img.src = e.target.result;
                    };
                    fileReader.readAsDataURL(picker.files[0]);
                });
            });
        });
    });

    // copy selection
    document.getAll('*[data-copy]', (copyElements) => {
        copyElements.forEach((element)=>{
            // clicked
            element.addEventListener('click', ()=>{
                // get the code element
                let codeElement = document.getElementById(element.getAttribute('data-copy'));

                // are we good ?
                if (codeElement != null) {

                    // copy text
                    codeElement.select();
                    codeElement.setSelectionRange(0, 99999);

                    // copy element
                    document.execCommand("copy");

                    // update text
                    element.innerText = 'copied!';
                    element.setAttribute('style', 'background:var(--green-color-one);');

                    // update text after 2 seconds
                    setTimeout(() => {
                        element.innerText = 'copy';
                        element.removeAttribute('style');
                        codeElement.blur();
                    }, 2000);
                }
            });
        });
    });

    // manage settings btn
    document.get('.manage-settings-btn', (btn)=>{

        // button clicked
        // btn.addEventListener('click', ()=>{
        //     // check page logo
        //     document.get('*[name="page_logo"]', (logo)=>{
        //         if (logo.files.length == 0)
        //         {

        //             alert();
        //         }
        //     });
        // });

    });

    // manage loader
    document.get('.loader-wrapper', (loader)=>{

        // hide children
        setTimeout(()=>{

            [].forEach.call(loader.children, (child, index)=>{
                setTimeout(()=>{
                    child.style.opacity = '0';
                }, Math.abs(((index + 1) * 200)));
            });

            // hide loader
            setTimeout(()=>{
                loader.style.opacity = '0';
                document.get('.fixed-item-list-height', (ele)=>{
                    ele.style.height = 'auto';
                });
                setTimeout(()=>{
                    loader.style.display = 'none';
                }, 500);
            }, 500);

        }, 300);
    });

    // process more action form
    document.get('.more-action-form select', (selectElement)=>{

        // check if changed
        selectElement.addEventListener('change', ()=>{
            if (selectElement.value != 'checkin')
            {
                // submit form
                selectElement.parentNode.submit();
            }
        });
    });

    // hide contact modal
    document.get('.contact-close-button button', (contactButton)=>{
        // button clicked
        contactButton.addEventListener('click', ()=>{
            let contactModal = contactButton.parentNode.parentNode;

            // fade out
            contactModal.style.opacity = 0;

            // wait to remove
            setTimeout(()=>{
                contactModal.style.display = 'none';
            },450);
        });
    });

    // show avaliability button
    document.getAll('.availability-form input, .availability-form select', (formElement)=>{

        // get button
        document.get('.availability-form .btn:disabled', (button)=>{

            // listen for change event
            formElement.forEach((element)=>{

                // add attribute
                if (element.hasAttribute('data-picker')) element.setAttribute('data-callback', 'showAvaliabilityButton');

                // show form
                element.addEventListener('change', ()=>{

                    // add loader
                    let loader = buttons.loading(button);

                    // remove disabled
                    setTimeout(()=>{
                        loader.hide();
                        button.removeAttribute('disabled');
                    },500);
                    
                });
            });
        });
    });

    // manage last minute counter
    document.get('.deal-counter', (counterElement)=>{
        // check for data-time attr
        if (counterElement.hasAttribute('data-time')) 
        {
            // Set the date we're counting down to
            let countDownDate = new Date(counterElement.getAttribute('data-time')).getTime();

            let now = new Date().getTime();

            // Update the count down every 1 second
            let x = setInterval(function() {

                // Get today's date and time
                let now = new Date().getTime();

                // Find the distance between now and the count down date
                let distance = (now < countDownDate) ? countDownDate - now : (now - countDownDate);

                // Time calculations for hours, minutes and seconds
                let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                let seconds = Math.floor((distance % (1000 * 60)) / 1000);

                // add zero
                hours = hours < 10 ? '0' + hours : hours;
                minutes = minutes < 10 ? '0' + minutes : minutes;
                seconds = seconds < 10 ? '0' + seconds : seconds;

                // Display the result in the element with id="demo"
                counterElement.innerHTML = hours + ":"
                + minutes + ":" + seconds;

                // If the count down is finished, write some text
                if (distance < 0) {
                    clearInterval(x);
                    window.reload();
                }
            }, 1000);
            
        }
    });

    checkAnotherDate();

    // search modal
    document.get('*[data-target="search-modal"]', (searchModal)=>{
        searchModal.addEventListener('click', ()=>{
            let loader = buttons.loading(searchModal);

            // show search-modal
            setTimeout(()=>{
                document.get('.search-modal', (modal)=>{
                    modal.style.display = 'flex';
                    setTimeout(()=>{
                        modal.style.opacity = 1;
                    }, 100);
    
                    // hide checker
                    modal.getAll('*[data-target="close-search-modal"]', (closeBtn)=>{
                        closeBtn.forEach((cb)=>{
                            cb.addEventListener('click', ()=>{
                                modal.style.opacity = 0;
                                if (loader !== null) loader.hide();
                                setTimeout(()=>{
                                    modal.style.display = 'none';
                                }, 400);
                            });
                        });
                    });
                });
            }, 1000);
        });
    });

    // load explore modal
    document.getAll('*[data-explore-modal="yes"]', (exploreModals)=>{

        document.get('.explore-modal-wrapper', (modalWrapper)=>{

            // load title
            modalWrapper.get('.explore-header-content h2', (modalTitle)=>{

                // load content
                modalWrapper.get('.explore-modal-content', (modalContent)=>{

                    // load footer buttons
                    modalWrapper.getAll('.explore-modal-footer a', (modalFooterButtons)=>{

                        let hideModal = ()=>{
                            modalWrapper.style.opacity = 0;
                            setTimeout(()=>{
                                modalWrapper.style.display = 'none';
                            },400);
                        };

                        document.get('button[data-parent=".availability-form"]', (availabilityButton)=>{

                            exploreModals.forEach((anchorElement)=>{

                                // link clicked
                                anchorElement.addEventListener('click', (e)=>{
                                    e.preventDefault();
    
                                    // load title
                                    modalTitle.innerHTML = anchorElement.getAttribute('data-name');
                                    document.get('[data-target="box-main-modal-title"]', (boxTitle)=>{
                                        boxTitle.innerHTML = modalTitle.innerHTML;
                                    }); 
                    
                                    // show the modal
                                    modalWrapper.style.display = 'flex';
    
                                    setTimeout(()=>{
    
                                        modalWrapper.style.opacity = 1;
    
                                        // load rooms
                                        getPropertyRoom(anchorElement.getAttribute('data-id'), anchorElement.href);

                                        // availability button clicked
                                        availabilityButton.addEventListener('click', (e)=>{
                                            e.preventDefault();
            
                                            // add loader
                                            let loader = buttons.loading(availabilityButton, 'Please wait..');
            
                                            // set data
                                            modalContent.setAttribute('data-checkin', $('#p-checkin-in-date').val());
                                            modalContent.setAttribute('data-checkout', $('#p-checkin-out-date').val());
                                            modalContent.setAttribute('data-adults', $('#p-adults').val());
                                            modalContent.setAttribute('data-rooms', $('#p-rooms').val());
            
                                            // close the modal
                                            document.get('[data-target="close-aval-modal"]', (closeButton)=>{
                                                setTimeout(()=>{
                                                    closeButton.click();
                                                    loader.hide();

                                                    // load rooms
                                                    getPropertyRoom(anchorElement.getAttribute('data-id'), anchorElement.href);

                                                }, 1000);
                                            });
                                        });
    
                                    }, 100);
                                    
    
                                    // hide now
                                    modalWrapper.addEventListener('click', (e)=>{
                                        if (e.target == modalWrapper)
                                        {
                                            hideModal();
                                        }
                                    });
    
                                    // load link
                                    modalFooterButtons[0].href = anchorElement.href;
    
                                    modalWrapper.get('.btn-close', (closeBtn)=>{
    
                                        closeBtn.addEventListener('click', ()=>{
                                            hideModal();
                                        });
    
                                    });
                                });
                            });
                        });

                    });

                });

            });

        });

    });

    // stick at position
    document.getAll('.stick-at-position', (elements)=>{

        elements.forEach((element)=>{

            // get the position
            let yPos = element.offsetTop - 50, yWidth = element.scrollWidth;

            // set the position
            if (element.hasAttribute('data-scroll-position'))
            {
                yPos = Number(element.getAttribute('data-scroll-position'));
                yWidth = Number(element.getAttribute('data-scroll-width'));
            }
            else
            {
                element.setAttribute('data-scroll-position', yPos);
                element.setAttribute('data-scroll-width', yWidth);
            }

            /*
            // track scroll
            window.onscroll = function()
            {
                // Get current yOffset
                let scrollPostion = window.pageYOffset;

                // less than
                if (scrollPostion < yPos)
                {
                    if (element.hasAttribute('data-scroll-pass'))
                    {
                        // remove attr
                        element.removeAttribute('data-scroll-pass');
                        element.classList.remove('sticky-element');

                        // remove style
                        element.removeAttribute('style');
                    }
                }
                else if (scrollPostion >= yPos)
                {
                    element.classList.add('sticky-element');
                    element.setAttribute('data-scroll-pass', 'yes');
                    // set the width
                    element.style.width = yWidth + 'px';
                }
            };
            */

        });

    });

    // get all inputs 
    document.getAll('.support-form .input', (elements)=>{

        document.get('.support-form .btn', (button)=>{

            let toggleButton = function()
            {
                let validInput = 0;

                elements.forEach((element)=>{

                    if (element.hasAttribute('type'))
                    {
                        if (element.type == 'email')
                        {
                            // match the email address
                            if (element.value.match(/([^@]+)[@]{1}([^.|@]+)[.]\w{1,}/g))
                            {
                                validInput++;
                            }
                        }
                        else if (element.value.length > 3)
                        {
                            validInput++;
                        }
                    }
                    else
                    {
                        if (element.value.length >= 5)
                        {
                            validInput++;
                        }
                    }

                });

                // can be active
                if (validInput == elements.length)
                {
                    button.removeAttribute('disabled');
                }
                else
                {
                    button.setAttribute('disabled', 'yes');
                }
            };

            elements.forEach((element)=>{

                element.addEventListener('input', ()=>{
                    toggleButton();
                });
    
            });
        });
    });

    // shake chat icon
    document.get('.need-help-sticky .need-help-icon .ion', (shakeIcon)=>{

        let shakeInterval = setInterval(()=>{
            if (shakeIcon.classList.contains('shake'))
            {
                shakeIcon.classList.remove('shake');
            }
            else
            {
                shakeIcon.classList.add('shake');
            }
        }, 2000);
    });

    // show element
    document.getAll('*[data-visible-after]', (element)=>{
        element.forEach((e)=>{
            setTimeout(()=>{

                e.style.height = 'auto';

            }, Number(e.getAttribute('data-visible-after')));
        });
    });

    // read all inputs for submit button
    document.getAll('.read-all-input input', (inputs)=>{

        inputs.forEach((input)=>{

            input.addEventListener('keypress', (e)=>{
                if (e.charCode == 0 || e.keyCode == 13 || e.key == 'Enter')
                {
                    document.get('.read-all-input button', (btn)=>{
                        btn.click();
                    });
                }
            });

        });
    });
    
    // load search result
    document.get('.elastic-search', (input)=>{

        input.parentNode.get('.search-dropdown', (dropdown)=>{

            let preload = preloader.inline.show(dropdown), timeout, canReplace = false;

            // listen for event
            input.addEventListener('input', (e)=>{
                dropdown.style.display = 'block';
                clearTimeout(timeout);

                // check input
                if (input.value.trim() == '') 
                {
                    dropdown.style.display = 'none';
                    canReplace = false;
                }
                else
                {
                    // load preloader
                    if (canReplace == true)
                    {
                        canReplace = false;
                        // dropdown.innerHTML = '';
                        preload = preloader.inline.show(dropdown);
                    }

                    // send request after 1 second
                    timeout = setTimeout(()=>{
                        findPropertyOrLocation(input.value, (result)=>{

                            // do we have something ?
                            if (result.data.length > 0)
                            {
                                canReplace = true;
                                preload.hide();
                                dropdown.innerHTML = '';

                                // create entry
                                let entry = document.createElement('a'),
                                entryIcon = document.createElement('i'),
                                entryText = document.createElement('span');

                                // update entry
                                entry.href = 'javascript:void(0)';
                                entryIcon.className = 'ion ion-android-search';
                                entryText.innerText = '"'+input.value+'"';
                                entry.style = 'color:var(--signal-color);'

                                entry.appendChild(entryIcon);
                                entry.appendChild(entryText);
                                dropdown.appendChild(entry);

                                entry.addEventListener('click', ()=>{
                                    dropdown.style.display = 'none';
                                    canReplace = false;
                                });

                                result.data.forEach((row)=>{

                                    let a = document.createElement('a'),
                                    icon = document.createElement('i'),
                                    span = document.createElement('span');
                                    a.href = 'javascript:void(0)';
                                    icon.className = 'ion ion-android-pin';
                                    span.innerText = row.name;
                                    a.setAttribute('data-href', row.name);
                                    
                                    if (row.type == 'property')
                                    {
                                        icon.className = 'ion ion-android-home';
                                    }

                                    // append child
                                    a.appendChild(icon);
                                    a.appendChild(span);

                                    // trigger click
                                    a.addEventListener('click', ()=>{
                                        input.value = a.getAttribute('data-href');
                                        dropdown.style.display = 'none';
                                        canReplace = false;
                                    });

                                    // append link
                                    dropdown.appendChild(a);
                                });
                            }
                            else
                            {
                                preload.hide();
                            }
                        });
                    }, 1000);
                    
                }
            });
        }); 
        
    });

}());

function findPropertyOrLocation(query, callback)
{
    let http = (window.ActiveXObject) ? window.ActiveXObject('XMLHTTP.Microsoft') : new XMLHttpRequest();
    let type = document.get('[name="hall_type"]');
    type = type != undefined ? 'hall' : '';
    http.open('GET', document.get('meta[name="base-url"]').getAttribute('content') + 'find-property-or-location?search='+encodeURIComponent(query)+'&type=' + type, true);
    http.onreadystatechange = function()
    {
        if (http.readyState == 4 && http.status == 200)
        {   
            callback.call(this, JSON.parse(http.responseText.trim()));
        }
    };
    http.send(null);
}

// load time range from document.
function loadTimeRangeFromDocument()
{
    // find time range
    document.getAll('.time-range', (range)=>{
        range.forEach(function (element) {
            // check for start and end
            if (element.hasAttribute('data-start') && element.hasAttribute('data-end'))
            {
                // load time
                loadTimeRange(element, element.getAttribute('data-start'), element.getAttribute('data-end'));
            }
        });
    });
}

// check another date
function checkAnotherDate()
{
    // check another date for reservation
    document.getAll('*[data-target="check-another-date"]', (checkBtn)=>{

        checkBtn.forEach((btn) => {
            btn.addEventListener('click', ()=>{
                // get the modal element
                document.get('.change-avaliability-modal', (modal)=>{
                    modal.style.display = 'flex';
                    let loader = null;
    
                    setTimeout(()=>{
                        
                        if (btn.classList.contains('btn')) 
                        {
                            setTimeout(()=>{
                                modal.style.opacity = 1;
                            }, 500);
                            loader = buttons.loading(btn);
                        }
                        else
                        {
                            modal.style.opacity = 1;
                        }
                    }, 100);
    
                    // hide checker
                    document.getAll('*[data-target="close-aval-modal"]', (closeBtn)=>{
                        closeBtn.forEach((cb)=>{
                            cb.addEventListener('click', ()=>{
                                modal.style.opacity = 0;
                                if (loader !== null) loader.hide();
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
};

// load all data href
function loadAllDataHref()
{
    document.getAll('*[data-href]', (hrefs)=>{

        hrefs.forEach((href)=>{
            // clicked
            href.addEventListener('click', ()=>{
                location.href = href.getAttribute('data-href');
            });
        });
    });
}

// get property room
function getPropertyRoom(propertyId, href)
{
    // get http
    let http = (window.ActiveXObject) ? new ActiveXObject("XMLHTTP.Microsoft") : new XMLHttpRequest();

    // get app url
    let appUrl = document.querySelector('meta[name="base-url"]').getAttribute('content');

    document.get('.explore-modal-content', (content)=>{

        // add loader
        content.innerHTML = '<div class="loader-wrapper" style="background:none;">\
        <div class="loader"></div>\
        </div>';

        // build form data
        let formData = new FormData();

        // set all
        formData.append('checkindate', content.getAttribute('data-checkin'));
        formData.append('checkoutdate', content.getAttribute('data-checkout'));
        formData.append('rooms', content.getAttribute('data-rooms'));
        formData.append('adults', content.getAttribute('data-adults'));

        // send request
        http.open("POST", appUrl + 'property-rooms/' + propertyId, true);
        http.setRequestHeader("Request-Session-Token", document.querySelector('*[name="session_public_token"]').getAttribute('content'));
        http.send(formData);
        http.onreadystatechange = function(){
            if (http.readyState == 4 && http.status == 200)
            {
                content.innerHTML = http.responseText;

                // load lozad
                const observer = lozad();
                observer.observe();

                // load href
                loadAllDataHref();

                // load sliders
                let sliders = document.querySelectorAll('*[data-slider]');

                // are we good ?
                if (sliders.length > 0)
                {
                    [].forEach.call(sliders, function (slider) {

                        let sliderItems = slider.querySelector('.items'),
                            prev = slider.querySelector('.prev'),
                            next = slider.querySelector('.next');

                        slide(slider, sliderItems, prev, next);
                        
                    });
                }

                // load action btn
                content.get('#view-action-btn', (e)=>{
                    e.href = href;
                    e.addEventListener('click', (ee)=>{
                        e.style.color = '#fff !important';
                        buttons.loading(e, 'Please wait..');
                    });
                });

                // load date checker modal
                checkAnotherDate();

                // load smooth scroll
                smoothScroll();

                content.get('.vertical-filter-tabs', (tab)=>{
                    let pointerCalled = false, tabOffset = (tab.offsetTop);

                    // create a new element
                    let tabElement = document.createElement('div');
                    tabElement.innerHTML = tab.innerHTML;
                    tabElement.className = tab.className;
                    tabElement.style.visibility = 'hidden';

                    // track scroll
                    $(content).scroll(()=>{
                        let scrollPostion = $(content).scrollTop();

                        if (scrollPostion >= tabOffset) 
                        {
                            pointerCalled = false;
                            tab.classList.add('vertical-filter-tabs-sticky');
                            tab.parentNode.insertBefore(tabElement, tab);
                        }
                        else
                        {
                            if (scrollPostion < tabOffset)
                            {
                                if (pointerCalled === false)
                                {
                                    tab.classList.remove('vertical-filter-tabs-sticky');
                                    pointerCalled = true;
                                    tab.parentNode.removeChild(tabElement);
                                    pointerCalled = true;
                                }
                            }
                        }
                    });

                });
                
            }
        };

    });
}

// show avaliability button
function showAvaliabilityButton()
{
    // get button
    document.get('.availability-form .btn:disabled', (button)=>{

        // add loader
        let loader = buttons.loading(button);

        // remove disabled
        setTimeout(()=>{
            loader.hide();
            button.removeAttribute('disabled');
        },500);
    });
}

// show contact modal
function showContactModal()
{
    document.get('.contact-modal', (contactModal)=>{
        // show now
        contactModal.style.display = 'flex';

        // fade in
        setTimeout(()=>{
            contactModal.style.opacity = 1;
        },100);
    });
}

// trigger stays picker
function loadStaysPicker()
{
    document.getAll('.staypicker-trigger', (stayPickers)=>{

        stayPickers.forEach((stayPicker)=>{
            stayPicker.parentNode.get('.stays-picker', (stayPickerDropdown)=>{

                // allowed classes
                let allowedClasses = [
                    'travel-children', 
                    'stays-picker', 
                    'stays-picker-row', 
                    'controller',
                    'left-btn',
                    'icon ion-minus',
                    'controller-field',
                    'right-btn',
                    'icon ion-plus'
                ];
    
                // hide picker
                let hidePicker = ()=>{
                    stayPicker.removeAttribute('data-clicked');
                    stayPicker.get('.see-more', (seeMore)=>{
                        seeMore.style.transform = 'rotate(0deg)';
                    });
                    
                    // hide dropdown
                    stayPickerDropdown.classList.remove('show');
                };
    
                // clicked?
                stayPicker.addEventListener('click', ()=>{
                    if (!stayPicker.hasAttribute('data-clicked'))
                    {   
                        stayPicker.setAttribute('data-clicked', 'yes');
                        stayPicker.get('.see-more', (seeMore)=>{
                            seeMore.style.transform = 'rotate(180deg)';
                        });
    
                        // show dropdown
                        stayPickerDropdown.style.display = 'flex';
                        setTimeout(()=>{
                            stayPickerDropdown.classList.add('show');
                        },50);
    
                        // listen for body click
                        document.body.addEventListener('click', (e)=>{
                            let target = e.target.className;
                            // allowed classes
                            if (allowedClasses.indexOf(target) < 0) hidePicker();
                        });
                    }
                    else
                    {
                        hidePicker();
                    }
                });
    
            });
        });
    });
}

// toggle modal message
function toggleModalMessage(modalContainer)
{
    const hideModalContainer = ()=>{
        modalContainer.style.opacity = '0';
        setTimeout(()=>{
            modalContainer.style.display = 'none';
        }, 600);
    };

    // modal container clicked
    modalContainer.addEventListener('click', (e)=>{
        if (e.target == modalContainer) hideModalContainer();
    });

    // button clicked
    modalContainer.get('.btn', (btnClose)=>{
        btnClose.addEventListener('click', hideModalContainer);
    });
}

// load time range
function loadTimeRange(element, start, end) {

    // get start array
    let [startHour, startMin] = start.split(':'), [endHour, endMin] = end.split(':');

    // load total seconds
    const totalSeconds = 86400; // 100%

    // draw labels
    let labelStart = document.createElement('label'), labelEnd = document.createElement('label'), seperator = document.createElement('div');

    // add label text
    labelStart.textContent = (startHour > 12 ? (startHour - 12) : startHour) + ':' + startMin + (Number(startHour) < 12 ? ' AM' : ' PM');
    labelEnd.textContent = (endHour > 12 ? (endHour - 12) : endHour) + ':' + endMin + ((Number(endHour) < 12 ? (12 + Number(endHour)) : Number(endHour)) >= 12 ? ' PM' : ' AM');

    // get total seconds in start hour
    startHour = (60 * 60) * Number(startHour);

    // get total seconds in start min
    startMin = 60 * Number(startMin);

    // get total seconds in end hour
    endHour = (60 * 60) * (Number(endHour) < 12 ? (12 + Number(endHour)) : Number(endHour));

    // get total seconds in end min
    endMin = 60 * Number(endMin);

    // load start and stop seconds
    start = (startHour + startMin);
    end = (endHour + endMin);

    // get start percentage
    let startPercentage = Math.ceil((start * 100) / totalSeconds);

    // get end percentage
    let endPercentage = Math.ceil((end * 100) / totalSeconds);

    // get base width
    const baseWidth = element.offsetWidth;

    // start pointer from??
    const startPointerFrom = (baseWidth * startPercentage) / 100;

    // end pointer in
    const endPointerIn = (baseWidth * endPercentage) / 100;

    // get new width
    const newWidth = (endPointerIn - startPointerFrom);

    // draw loaded
    let wrapper = document.createElement('div'), range = document.createElement('div');
    wrapper.className = 'loaded';
    wrapper.style.width = baseWidth + 'px';
    range.style.width = newWidth + 'px';
    range.className = 'range-inner';
    range.style.left = startPointerFrom + 'px';
    wrapper.append(range);

    // draw label container
    let labelContainer = document.createElement('div');
    labelContainer.className = 'label-container';
    // labelContainer.style.width = baseWidth + 'px';
    labelContainer.style.left = (startPointerFrom + (newWidth / 4)) + 'px';
    labelContainer.append(labelStart);
    seperator.innerText = '-';
    labelContainer.append(seperator);
    // labelEnd.style.left = (startPointerFrom + (newWidth - 5)) + 'px';
    labelContainer.append(labelEnd);

    // add wrapper
    element.innerHTML = '';
    element.append(labelContainer);
    element.append(wrapper);
}

// close image display
function closeImageDisplay() {
    document.get('.big-screen-slides', (screen)=>{
        // screen.style.display = 'none';
        screen.hideModal(()=>{
            screen.innerHTML = slidesCopy;
        });
    });
}

// trigger modal
function triggerModal(selector) {
    // try find
    document.get(selector, (modal)=>{
        modal.showModal();
    });
}

// trigger delete for listing image
function deleteListingImage() {

    // delete additional list images
    document.getAll('.additional-images-list > .listing-image-list > .delete-image', (imageElements)=>{

        // remove image element
        imageElements.forEach((element)=>{
            element.addEventListener('click', ()=>{
                element.parentNode.parentNode.removeChild(element.parentNode);
            });
        });
    });
}

// allow numbers only
function isNumber(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}

// process property form
function processPropertyForm(e)
{
    e.preventDefault();

    // perform checks
    let checker = {
        banner : document.querySelector('input[name="banner"]'),
        title : document.querySelector('input[name="title"]'),
        description : document.querySelector('textarea[name="description"]'),
        address : document.querySelector('textarea[name="address"]'),
        additional_images : document.querySelectorAll('.additional-images-list input[type="file"]'),
        contact_phone : document.querySelector('input[name="contact_phone_name[]"]'),
        contact_phone_number : document.querySelector('input[name="contact_phone_number[]"]'),
        contact_email_name : document.querySelector('input[name="contact_email_name[]"]'),
        contact_email : document.querySelector('input[name="contact_email[]"]'),
        facilities : document.querySelector('input[name="facility[]"]:checked'),
        checkin_start : document.querySelector('input[name="checkin_start"]'),
        checkin_end : document.querySelector('input[name="checkin_end"]'),
        checkout_start : document.querySelector('input[name="checkout_start"]'),
        checkout_end : document.querySelector('input[name="checkout_start"]'),
        extra_child_fee : document.querySelector('input[name="extra_child_fee"]'),
        accept_terms : document.querySelector('#accept-terms')
    };

    // input helper function
    let inputHelperFunction = (input)=>{

        // scroll to view
        window.scroll({ 
            top: (input.parentNode.offsetTop) - 100,
            left: 0, 
            behavior: 'smooth' 
        });

        // change border color
        input.style.borderColor = 'var(--signal-color)';

        // remove style
        input.addEventListener('change', ()=>{
            if (input.value.length > 1) input.removeAttribute('style');
        });
    };

    // counnter
    let successful = 0;

    // check banner
    if (checker.banner != null && checker.banner.files.length == 0)
    {
        modal.show('Missing Title Image', 'Please attach a banner image to continue.');

        // scroll to view
        window.scroll({ 
            top: (checker.banner.parentNode.offsetTop) - 100,
            left: 0, 
            behavior: 'smooth' 
        });

        // change border color
        checker.banner.parentNode.style.borderColor = 'var(--signal-color)';

        // remove style
        checker.banner.addEventListener('change', ()=>{
            checker.banner.parentNode.removeAttribute('style');
        });

        // stop here
        return false;
    }
    else
    {
        // increment counter
        successful++;
    }

    // check title
    if (checker.title != null && checker.title.value == '')
    {
        modal.show('Missing Property Name', 'Please enter a title for this property.');

        // call helper function
        inputHelperFunction(checker.title);

        // stop here
        return false;
    }
    else
    {
        // increment counter
        successful++;
    }

    // check description
    if (checker.description != null && checker.description.value == '')
    {
        modal.show('Missing Property Description', 'Please enter a detailed description for this property.');

        // call helper function
        inputHelperFunction(checker.description);

        // stop here
        return false;
    }
    else
    {
        // increment counter
        successful++;
    }

    // check other images
    if (checker.additional_images != null && checker.additional_images.length == 0)
    {
        modal.show('Missing Additional Images', 'There should be at least one additional picture in this category.');

        // scroll to view
        window.scroll({ 
            top: (document.querySelector('.additional-images-list').parentNode.parentNode.offsetTop) - 200,
            left: 0, 
            behavior: 'smooth' 
        });

        // stop here
        return false;
    }
    else
    {
        // increment counter
        successful++;
    }

    // check address
    if (checker.address != null && checker.address.value == '')
    {
        modal.show('Missing Property Address', 'Please enter a direct address to this property.');

        // call helper function
        inputHelperFunction(checker.address);

        // stop here
        return false;
    }
    else
    {
        // increment counter
        successful++;
    }

    // check contact phone
    if (checker.contact_phone != null && checker.contact_phone.value == '')
    {
        modal.show('Missing Contact Name', 'Please provide a contact name eg. support, helpdesk.');

        // call helper function
        inputHelperFunction(checker.contact_phone);

        // stop here
        return false;
    }
    else
    {
        // increment counter
        successful++;
    }

    // check contact phone number
    if (checker.contact_phone_number != null && checker.contact_phone_number.value == '')
    {
        modal.show('Missing Contact Phone', 'Please provide a contact phone for "'+checker.contact_phone.value+'"');

        // call helper function
        inputHelperFunction(checker.contact_phone_number);

        // stop here
        return false;
    }
    else
    {
        // increment counter
        successful++;
    }

    // check contact email name
    if (checker.contact_email_name != null && checker.contact_email_name.value == '')
    {
        modal.show('Missing Contact Email', 'Please provide a contact email name eg. support, helpdesk.');

        // call helper function
        inputHelperFunction(checker.contact_email_name);

        // stop here
        return false;
    }
    else
    {
        // increment counter
        successful++;
    }

    // check contact email
    if (checker.contact_email != null && checker.contact_email.value == '')
    {
        modal.show('Missing Contact Email', 'Please provide a contact email for "'+checker.contact_email_name.value+'" eg. example@yourdomain.com.');

        // call helper function
        inputHelperFunction(checker.contact_email);

        // stop here
        return false;
    }
    else
    {
        // increment counter
        successful++;
    }

    // check facility
    if (checker.facilities == null)
    {
        modal.show('Missing Property Facility', 'Please select at least one facility for this property, or add to the list from the input field provided.');

        // scroll to view
        window.scroll({ 
            top: (document.querySelector('.facility-form').parentNode.offsetTop) - 200,
            left: 0, 
            behavior: 'smooth' 
        });

        // stop here
        return false;
    }   
    else
    {
        // increment counter
        successful++;
    }

    // check checkin start
    if (checker.checkin_start != null && checker.checkin_start.value == '')
    {
        modal.show('Missing Checkin Start Time', 'Please provide a default check in start time for this property.');

        // call helper function
        inputHelperFunction(checker.checkin_start);

        // stop here
        return false;
    }
    else
    {
        // increment counter
        successful++;
    }

    // check checkin end
    if (checker.checkin_end != null && checker.checkin_end.value == '')
    {
        modal.show('Missing Checkin End Time', 'Please provide a default check in end time for this property.');

        // call helper function
        inputHelperFunction(checker.checkin_end);

        // stop here
        return false;
    }
    else
    {
        // increment counter
        successful++;
    }

    // check checkout start
    if (checker.checkout_start != null && checker.checkout_start.value == '')
    {
        modal.show('Missing Checkout Start Time', 'Please provide a default check out start time for this property.');

        // call helper function
        inputHelperFunction(checker.checkout_start);

        // stop here
        return false;
    }
    else
    {
        // increment counter
        successful++;
    }

    // check checkout end
    if (checker.checkout_end != null && checker.checkout_end.value == '')
    {
        modal.show('Missing Checkout End Time', 'Please provide a default check out end time for this property.');

        // call helper function
        inputHelperFunction(checker.checkout_end);

        // stop here
        return false;
    }
    else
    {
        // increment counter
        successful++;
    }

    // check extra child fee
    if (checker.extra_child_fee != null && checker.extra_child_fee.value == '')
    {
        modal.show('Missing Extra Child Fee', 'Please specify a fee for an extra child.');

        // call helper function
        inputHelperFunction(checker.extra_child_fee);

        // stop here
        return false;
    }
    else
    {
        // increment counter
        successful++;
    }

    // check extra_child_fee
    if (checker.accept_terms != null && checker.accept_terms.checked == false)
    {
        modal.show('Agreement not signed', 'Before you proceed, please read our terms & condition, and click on the checkbox to continue.');

        // stop here
        return false;
    }
    else
    {
        // increment counter
        successful++;
    }

    // are we good ?
    if (successful == 16)
    {
        document.get('form[name="property_form"]', (form)=>{
            buttons.loading(e.target);
            form.submit();
        });
    }
}

// process vehicle form
function processVehicleForm(e)
{
    e.preventDefault();

    // perform checks
    let checker = {
        banner : document.querySelector('input[name="banner"]'),
        title : document.querySelector('input[name="title"]'),
        description : document.querySelector('textarea[name="description"]'),
        seats : document.querySelector('input[name="seats"]'),
        color : document.querySelector('input[name="color"]'),
        address : document.querySelector('textarea[name="address"]'),
        additional_images : document.querySelectorAll('.additional-images-list input[type="file"]'),
        contact_phone : document.querySelector('input[name="contact_phone_name[]"]'),
        contact_phone_number : document.querySelector('input[name="contact_phone_number[]"]'),
        contact_email_name : document.querySelector('input[name="contact_email_name[]"]'),
        contact_email : document.querySelector('input[name="contact_email[]"]'),
        facilities : document.querySelector('input[name="facility[]"]:checked'),
        checkin_start : document.querySelector('input[name="checkin_start"]'),
        checkin_end : document.querySelector('input[name="checkin_end"]'),
        checkout_start : document.querySelector('input[name="checkout_start"]'),
        checkout_end : document.querySelector('input[name="checkout_end"]'),
        km_avaliable : document.querySelector('input[name="km_avaliable"]'),
        price : document.querySelector('input[name="price"]'),
        accept_terms : document.querySelector('#accept-terms')
    };

    // input helper function
    let inputHelperFunction = (input)=>{

        // scroll to view
        window.scroll({ 
            top: (input.parentNode.offsetTop) - 100,
            left: 0, 
            behavior: 'smooth' 
        });

        // change border color
        input.style.borderColor = 'var(--signal-color)';

        // remove style
        input.addEventListener('change', ()=>{
            if (input.value.length > 1) input.removeAttribute('style');
        });
    };

    // counnter
    let successful = 0;

    // check banner
    if (checker.banner != null && checker.banner.files.length == 0)
    {
        modal.show('Missing Title Image', 'Please attach a banner image to continue.');

        // scroll to view
        window.scroll({ 
            top: (checker.banner.parentNode.offsetTop) - 100,
            left: 0, 
            behavior: 'smooth' 
        });

        // change border color
        checker.banner.parentNode.style.borderColor = 'var(--signal-color)';

        // remove style
        checker.banner.addEventListener('change', ()=>{
            checker.banner.parentNode.removeAttribute('style');
        });

        // stop here
        return false;
    }
    else
    {
        // increment counter
        successful++;
    }

    // check title
    if (checker.title != null && checker.title.value == '')
    {
        modal.show('Missing Vehicle Title', 'Please enter a title for this vehicle.');

        // call helper function
        inputHelperFunction(checker.title);

        // stop here
        return false;
    }
    else
    {
        // increment counter
        successful++;
    }

    // check description
    if (checker.description != null && checker.description.value == '')
    {
        modal.show('Missing Vehicle Description', 'Please enter a detailed description for this vehicle.');

        // call helper function
        inputHelperFunction(checker.description);

        // stop here
        return false;
    }
    else
    {
        // increment counter
        successful++;
    }

    // check seats
    if (checker.seats != null && checker.seats.value == '')
    {
        modal.show('Missing Vehicle Seats', 'Please enter the maximum occupancies for this vehicle.');

        // call helper function
        inputHelperFunction(checker.seats);

        // stop here
        return false;
    }
    else
    {
        // increment counter
        successful++;
    }

    // check color
    if (checker.color != null && checker.color.value == '')
    {
        modal.show('Missing Vehicle Color', 'Please enter the color for this vehicle.');

        // call helper function
        inputHelperFunction(checker.color);

        // stop here
        return false;
    }
    else
    {
        // increment counter
        successful++;
    }

    // check other images
    if (checker.additional_images != null && checker.additional_images.length == 0)
    {
        modal.show('Missing Additional Images', 'There should be at least one additional picture in this category.');

        // scroll to view
        window.scroll({ 
            top: (document.querySelector('.additional-images-list').parentNode.parentNode.offsetTop) - 200,
            left: 0, 
            behavior: 'smooth' 
        });

        // stop here
        return false;
    }
    else
    {
        // increment counter
        successful++;
    }

    // check address
    if (checker.address != null && checker.address.value == '')
    {
        modal.show('Missing Vehicle Pickup Address', 'Please enter a direct address to this vehicle for pickup.');

        // call helper function
        inputHelperFunction(checker.address);

        // stop here
        return false;
    }
    else
    {
        // increment counter
        successful++;
    }

    // check contact phone
    if (checker.contact_phone != null && checker.contact_phone.value == '')
    {
        modal.show('Missing Contact Name', 'Please provide a contact name eg. support, helpdesk.');

        // call helper function
        inputHelperFunction(checker.contact_phone);

        // stop here
        return false;
    }
    else
    {
        // increment counter
        successful++;
    }

    // check contact phone number
    if (checker.contact_phone_number != null && checker.contact_phone_number.value == '')
    {
        modal.show('Missing Contact Phone', 'Please provide a contact phone for "'+checker.contact_phone.value+'"');

        // call helper function
        inputHelperFunction(checker.contact_phone_number);

        // stop here
        return false;
    }
    else
    {
        // increment counter
        successful++;
    }

    // check contact email name
    if (checker.contact_email_name != null && checker.contact_email_name.value == '')
    {
        modal.show('Missing Contact Email', 'Please provide a contact email name eg. support, helpdesk.');

        // call helper function
        inputHelperFunction(checker.contact_email_name);

        // stop here
        return false;
    }
    else
    {
        // increment counter
        successful++;
    }

    // check contact email
    if (checker.contact_email != null && checker.contact_email.value == '')
    {
        modal.show('Missing Contact Email', 'Please provide a contact email for "'+checker.contact_email_name.value+'" eg. example@yourdomain.com.');

        // call helper function
        inputHelperFunction(checker.contact_email);

        // stop here
        return false;
    }
    else
    {
        // increment counter
        successful++;
    }

    // check facility
    if (checker.facilities == null)
    {
        modal.show('Missing Vehicle Features', 'Please select at least one feature for this vehicle, or add to the list from the input field provided.');

        // scroll to view
        window.scroll({ 
            top: (document.querySelector('.facility-form').parentNode.offsetTop) - 200,
            left: 0, 
            behavior: 'smooth' 
        });

        // stop here
        return false;
    }   
    else
    {
        // increment counter
        successful++;
    }

    // check checkin start
    if (checker.checkin_start != null && checker.checkin_start.value == '')
    {
        modal.show('Missing Checkin Start Time', 'Please provide a default check in start time for this vehicle.');

        // call helper function
        inputHelperFunction(checker.checkin_start);

        // stop here
        return false;
    }
    else
    {
        // increment counter
        successful++;
    }

    // check checkin end
    if (checker.checkin_end != null && checker.checkin_end.value == '')
    {
        modal.show('Missing Checkin End Time', 'Please provide a default check in end time for this vehicle.');

        // call helper function
        inputHelperFunction(checker.checkin_end);

        // stop here
        return false;
    }
    else
    {
        // increment counter
        successful++;
    }

    // check checkout start
    if (checker.checkout_start != null && checker.checkout_start.value == '')
    {
        modal.show('Missing Checkout Start Time', 'Please provide a default check out start time for this vehicle.');

        // call helper function
        inputHelperFunction(checker.checkout_start);

        // stop here
        return false;
    }
    else
    {
        // increment counter
        successful++;
    }

    // check checkout end
    if (checker.checkout_end != null && checker.checkout_end.value == '')
    {
        modal.show('Missing Checkout End Time', 'Please provide a default check out end time for this property.');

        // call helper function
        inputHelperFunction(checker.checkout_end);

        // stop here
        return false;
    }
    else
    {
        // increment counter
        successful++;
    }

    // check kilometer
    if (checker.km_avaliable != null && checker.km_avaliable.value == '')
    {
        modal.show('Missing Avaliable Kilometer', 'Please specify the remaining kilometer avaliable for this vehicle.');

        // call helper function
        inputHelperFunction(checker.km_avaliable);

        // stop here
        return false;
    }
    else
    {
        // increment counter
        successful++;
    }

    // check price
    if (checker.price != null && checker.price.value == '')
    {
        modal.show('Missing price per kilometer', 'Please specify a cost per kilometer eg. NGN 10,000.');

        // call helper function
        inputHelperFunction(checker.price);

        // stop here
        return false;
    }
    else
    {
        // increment counter
        successful++;
    }

    // check extra_child_fee
    if (checker.accept_terms != null && checker.accept_terms.checked == false)
    {
        modal.show('Agreement not signed', 'Before you proceed, please read our terms & condition, and click on the checkbox to continue.');

        // stop here
        return false;
    }
    else
    {
        // increment counter
        successful++;
    }

    // are we good ?
    if (successful == 19)
    {
        buttons.loading(e.target, 'Please wait..');

        document.get('form[name="vehicle_form"]', (form)=>{
            buttons.loading(e.target);
            form.submit();
        });
    }
}

// process booking form
function processBookingForm(e, ele)
{
    e.preventDefault();

    // check type
    if (ele.type == 'submit')
    {
        // perform checks
        let checker = {
            firstname : document.querySelector('input[name="firstname"]'),
            lastname : document.querySelector('input[name="lastname"]'),
            phone : document.querySelector('input[name="phone"]'),
            arrivalTime : document.querySelector('input[name="arrival_time"]'),
            accept_terms : document.querySelector('#accept-terms'),
            fullname : document.querySelector('input[name="fullname"]')
        };

        // input helper function
        let inputHelperFunction = (input)=>{

            // scroll to view
            window.scroll({ 
                top: (input.parentNode.offsetTop) - 100,
                left: 0, 
                behavior: 'smooth' 
            });

            // change border color
            input.style.borderColor = 'var(--signal-color)';

            // remove style
            input.addEventListener('change', ()=>{
                if (input.value.length > 1) input.removeAttribute('style');
            });
        };

        // counnter
        let successful = 0;

        // check firstname
        if (checker.firstname != null && checker.firstname.value == '')
        {
            modal.show('Missing Firstname', 'Please provide your firstname or login to autofill.');

            // call helper function
            inputHelperFunction(checker.firstname);

            // stop here
            return false;
        }
        else
        {
            // increment counter
            successful++;
        }

        // check lastname
        if (checker.lastname != null && checker.lastname.value == '')
        {
            modal.show('Missing Lastname', 'Please provide your lastname or login to autofill.');

            // call helper function
            inputHelperFunction(checker.lastname);

            // stop here
            return false;
        }
        else
        {
            // increment counter
            successful++;
        }

        // check email
        // if (checker.email != null && checker.email.value == '')
        // {
        //     modal.show('Missing Email', 'Please provide your email address or login to autofill.');

        //     // call helper function
        //     inputHelperFunction(checker.email);

        //     // stop here
        //     return false;
        // }
        // else
        // {
        //     // increment counter
        //     successful++;
        // }

        // confirm email
        // if (checker.email_again != null && checker.email_again.value == '')
        // {
        //     modal.show('Missing Email Confirmation', 'Please confirm your email address or login to autofill.');

        //     // call helper function
        //     inputHelperFunction(checker.email_again);

        //     // stop here
        //     return false;
        // }
        // else
        // {
        //     // increment counter
        //     successful++;
        // }

        // // confirm email again
        // if (checker.email_again.value != checker.email.value)
        // {
        //     modal.show('Email Does not match', 'Please confirm your email address or login to autofill.');

        //     // call helper function
        //     inputHelperFunction(checker.email_again);

        //     // stop here
        //     return false;
        // }
        
        // confirm phone
        if (checker.phone != null && checker.phone.value == '')
        {
            modal.show('Missing Telephone', 'Please provide your telephone number or login to autofill.');

            // call helper function
            inputHelperFunction(checker.phone);

            // stop here
            return false;
        }
        else
        {
            // increment counter
            successful++;
        }

        // confirm arrival time
        if (checker.arrivalTime != null && checker.arrivalTime.value == '')
        {
            modal.show('Missing Arrival Time', 'Please specify a time you will be arriving to the property.');

            // call helper function
            inputHelperFunction(checker.arrivalTime);

            // stop here
            return false;
        }
        else
        {
            // increment counter
            successful++;
        }

        // confirm fullname
        if (checker.fullname != null && checker.fullname.value == '')
        {
            modal.show('Missing Fullname', 'Please provide your fullname or login to autofill. We would extract from the firstname and lastname you provide. Please close this alert to confirm.');

            // call helper function
            inputHelperFunction(checker.fullname);

            // set firstname and lastname
            checker.fullname.value = checker.firstname.value + ', ' + checker.lastname.value;

            // stop here
            return false;
        }
        else
        {
            // increment counter
            successful++;
        }

        // confirm accept_terms
        if (checker.accept_terms != null && checker.accept_terms.checked == false)
        {
            modal.show('Terms not agreed', 'Please agree to terms and condition for this reservation. You should read the terms and condition before your proceed. Thank you!');

            // call helper function
            inputHelperFunction(checker.accept_terms);

            // stop here
            return false;
        }
        else
        {
            // increment counter
            successful++;
        }

        // are we good ?
        if (successful == 6)
        {
            buttons.loading(ele, 'Please wait..');

            // submit form
            document.get('form[name="booking_form"]', (form)=>{
                form.submit();
            });
        }
    }
}

// switch password types
function showPassword(e)
{
    if (e.hasAttribute('data-changed'))
    {
        e.removeAttribute('data-changed');
        e.className = 'icon ion-ios-eye';

        // change type to password
        e.parentNode.get('input', (e)=>{e.type = 'password';});
    }
    else
    {
        e.setAttribute('data-changed', 'yes');
        e.className = 'icon ion-eye-disabled';

        // change type to text
        e.parentNode.get('input', (e)=>{e.type = 'text';});
    }
}

// close mobile menu
function closeMobileMenu()
{
    document.get('.mobile-menu-wrapper', (wrapper)=>{
        wrapper.style.transform = 'translateX(100%)';
    });
}

// show mobile menu
function showMobileMenu()
{
    document.get('.mobile-menu-wrapper', (wrapper)=>{

        if (!wrapper.hasAttribute('style'))
        {
            wrapper.style.display = 'block';

            setTimeout(()=>{
                wrapper.style.transform = 'translateX(0%)';
            }, 50);
        }
        else
        {
            wrapper.style.transform = 'translateX(0%)';
        }
        
    });
}

// close search container
function closeSearchContainer()
{
    document.get('.search-container', (search)=>{

        // SLIDE OUT
        search.style.transform = 'translateX(100%)';

        // hide after 0.5s
        setTimeout(()=>{
            search.style.display = 'none';
        },500);

    });
}

// show search container
function showSearch(element)
{
    // get view
    let view = element.getAttribute('data-view');

    // get target
    let target = (view == 'rentals' || view == 'explore-vehicles') ? 'vehicle' : 'property';

    // load search
    document.get('.search-container', (search)=>{

        // hide all
        search.getAll('.search-list', (searchList)=>{
            searchList.forEach((searchElement)=>{searchElement.classList.remove('active');});
        });

        // show target
        search.get('.'+target, (search)=>{
            search.classList.add('active');
        });

        // show element
        search.style.display = 'flex';

        // show after 0.1s
        setTimeout(()=>{
            
            // SLIDE IN
            search.style.transform = 'translateX(0%)';

            // load date picker
            loadDatepicker();

            // load stay picker
            loadStaysPicker();

        },100);

    });
}

// auto fill names
function autofillFirstAndLastName()
{
    // get firstname
    document.get('#firstname', (firstname)=>{

        // get lastname
        document.get('#lastname', (lastname)=>{

            // get fullname
            document.get('#fullname', (fullname)=>{

                // track firstname
                firstname.addEventListener('blur', (e)=>{
                    // update fullname
                    fullname.value = (firstname.value.length > 0 ? (firstname.value + (lastname.value.length > 0 ? ',' + lastname.value : '')) : '');
                });

                // track lastname
                lastname.addEventListener('blur', (e)=>{
                    // update fullname
                    fullname.value = (firstname.value.length > 0 ? (firstname.value + (lastname.value.length > 0 ? ',' + lastname.value : '')) : '');
                });

            });

        });
    });
}

// load wicked picker
function initWickedPicker()
{
    document.getAll('[data-timepicker="yes"]', (timePickerArray)=>{
        timePickerArray.forEach(timePicker=>{

            // build config
            let config = {
                title : 'TripMata TimePicker',
                showSeconds: false,
                clearable: true,
            };

            if (timePicker.getAttribute('data-value') != '')
            {
                Object.assign(config, {now : timePicker.getAttribute('data-value')});
            }

            $(timePicker).wickedpicker(config);
        });
    });
}

// load mdtimepicker
function initMdTimePicker()
{
    $(document).ready(function(){
        $('#timepicker').mdtimepicker(); //Initializes the time picker
    });
}

// clicked
let clickedDropdown = false;

// open dropdown
function openDropdown(e)
{
    if (clickedDropdown === false) 
    {   
        clickedDropdown = true;

        var element = document.querySelector('#' + e.getAttribute('for')),
        worked = false;

        if(document.createEvent) { // chrome and safari
            var e = document.createEvent("MouseEvents");
            e.initMouseEvent("mouseup", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            worked = element.dispatchEvent(e);
            console.log(element);
        }

        if(!worked) { // unknown browser / error
            alert("It didn't worked in your browser.");
        }
    }
}

// mobile filter
document.get('.mobile-filter-trigger', (mobileFilter)=>{

    let filterParent = mobileFilter.parentNode;
    let icon = mobileFilter.querySelector('#tigger-state');

    // manage trigger
    mobileFilter.addEventListener('click', ()=>{

        // clicked before
        if (mobileFilter.hasAttribute('data-clicked'))
        {
            mobileFilter.removeAttribute('data-clicked');

            // remove attr
            filterParent.removeAttribute('style');

            // change icon
            icon.classList.remove('ion-minus');
            icon.classList.add('ion-plus');
        }
        else
        {
            // not clicked
            mobileFilter.setAttribute('data-clicked', 'yes');

            // expand
            filterParent.style.height = 'auto';

            // change icon
            icon.classList.remove('ion-plus');
            icon.classList.add('ion-minus');
        }
    });

});

// load sticky
document.getAll('.sticky-on-scroll', (stickyElements)=>{
    let index = 1;
    stickyElements.forEach((stickyElement)=>{

        // create new wrapper
        let wrapper = document.createElement("div"), container = document.createElement('div');
        wrapper.className = 'sticky-on-scroll';
        wrapper.style.position = 'fixed';
        stickyElement.classList.remove('sticky-on-scroll');

        // wrapper has sticky right?
        if (stickyElement.classList.contains('sticky-right'))
        {
            wrapper.classList.add('sticky-right');
            stickyElement.classList.remove('sticky-right');
        }

        // set the top offset
        wrapper.setAttribute('data-offset', stickyElement.hasAttribute('data-offset') ? stickyElement.getAttribute('data-offset') : stickyElement.offsetTop);
        wrapper.style.opacity = 0;
        stickyElement.id = 'sticky-index-' + index; 

        // create container
        container.className = 'container';

        // copy content
        container.innerHTML = stickyElement.outerHTML;

        // add container
        wrapper.appendChild(container);

        // add data-id
        wrapper.setAttribute('data-id', stickyElement.id);

        // append now
        stickyElement.parentNode.appendChild(wrapper);

        // increment
        index++;
        
    });

    document.getAll('.sticky-on-scroll', (stickyElements)=>{

        let backgroundColor = document.createElement('div');
        backgroundColor.className = 'sticky-background';

        window.onscroll = function()
        {
            // @var number ypos
            let ypos = window.pageYOffset;
            
            stickyElements.forEach((stickyElement, index)=>{

                // get the offset
                let offset = Number(stickyElement.getAttribute('data-offset'));
                
                // check if we have arrived
                if (ypos >= offset && !stickyElement.hasAttribute('data-reached'))
                {
                    stickyElement.setAttribute('data-reached', 'yes');
                    stickyElement.style.top = '100px';
                    stickyElement.style.opacity = 1;
                    document.getElementById(stickyElement.getAttribute('data-id')).style.opacity = 0;

                    if (index == 1)
                    {
                        stickyElement.parentNode.appendChild(backgroundColor);
                    }
                    
                }

                if (stickyElement.hasAttribute('data-reached') && ypos < offset)
                {
                    stickyElement.removeAttribute('data-reached');
                    stickyElement.style.opacity = 0;
                    document.getElementById(stickyElement.getAttribute('data-id')).style.opacity = 1;

                    if (index == 1)
                    {
                        stickyElement.parentNode.removeChild(backgroundColor);
                    }
                }

            });
        };
    });
});

document.get('#coupon-code', (coupon)=>{

    let couponApplied = false;
    let couponText = '';
    let btn = document.querySelector('*[data-parent="#booking_form"]');

    function manageCouponSubmission(coupon)
    {
        let timeout = null;
        
        coupon.addEventListener('keypress', (e)=>{
            if (coupon.value.trim().length > 1)
            {
                // clear timeout
                clearTimeout(timeout);

                if (e.key == 'Enter' || e.charCode == 0 || e.keyCode == 13){

                    btn.type = 'button';

                    // check
                    checkCouponStatus(
                        document.querySelector('#coupon-code').value,
                        document.querySelector('*[name="id"]').value,
                        document.querySelector('*[name="propertyid"]').value
                    );
                }
                else
                {
                    btn.type = 'submit';

                    timeout = setTimeout(()=>{

                        checkCouponStatus(
                            document.querySelector('#coupon-code').value,
                            document.querySelector('*[name="id"]').value,
                            document.querySelector('*[name="propertyid"]').value
                        );

                    }, 500);
                }
            } 
            else
            {
                btn.type = 'submit'; 

                if (couponApplied)
                {
                    couponApplied = false;
                    document.querySelector('#total_section').innerHTML = couponText;
                    document.querySelector('*[name="couponid"]').value = ''
                }
            }
        });

        coupon.addEventListener('blur', ()=>{

            if (coupon.value.trim().length > 1)
            {
                checkCouponStatus(
                    document.querySelector('#coupon-code').value,
                    document.querySelector('*[name="id"]').value,
                    document.querySelector('*[name="propertyid"]').value
                );
            }
            else
            {
                if (couponApplied)
                {
                    couponApplied = false;
                    document.querySelector('#total_section').innerHTML = couponText;
                    document.querySelector('*[name="couponid"]').value = '';
                }
            }
        });

        // check coupon
        function checkCouponStatus(code, category, property)
        {
            let pre = preloader.inline.show(document.querySelector('#coupon-code').parentNode);
            
            let http = (window.ActiveXObject) ? new ActiveXObject("XMLHTTP.Microsoft") : new XMLHttpRequest();
            let url = document.querySelector('*[data-moorexa-appurl]').getAttribute('data-moorexa-appurl');

            // send request
            http.open("GET",  url + 'check-coupon-status/'+code+'/'+category+'/'+property, true);
            http.setRequestHeader("Request-Session-Token", document.querySelector('*[name="session_public_token"]').getAttribute('content'));
            http.onreadystatechange = function()
            {
                if (http.readyState == 4 && http.status == 200)
                {
                    let response = JSON.parse(http.responseText);

                    // check response
                    if (response.isValid)
                    {
                        let form = new FormData;
                        form.append('checkin', document.querySelector('*[name="checkin"]').value);
                        form.append('checkout', document.querySelector('*[name="checkout"]').value);

                        let http = (window.ActiveXObject) ? new ActiveXObject("XMLHTTP.Microsoft") : new XMLHttpRequest();
                        http.open('POST', url + 'get-updated-status/' + response.id + location.search, true);
                        http.onreadystatechange = function()
                        {
                            if (http.readyState == 4 && http.status == 200)
                            {
                                if (couponText == '')
                                {
                                    couponText = document.querySelector('#total_section').innerHTML;
                                }

                                document.querySelector('#total_section').innerHTML = http.responseText;
                                hidePreloader(pre, code);
                                couponApplied = true;

                                // add coupon id
                                document.querySelector('*[name="couponid"]').value = response.id;

                                btn.type = "submit";

                            }
                        };
                        http.send(form);

                    }
                    else
                    {
                        hidePreloader(pre, code);
                        modal.show("You have a message", response.message, 'error');

                        if (couponApplied)
                        {
                            couponApplied = false;
                            document.querySelector('#total_section').innerHTML = couponText;
                            document.querySelector('*[name="couponid"]').value = '';
                        }
                    }
                }
            };
            http.send(null);
        };

        function hidePreloader(pre, code)
        {
            // end preloader
            pre.hide();

            // add text and recall function
            let coupon = document.querySelector('#coupon-code');
            coupon.value = code;
            manageCouponSubmission(coupon);
        }
        
    }

    // manage submission
    manageCouponSubmission(coupon);
});

// show call phone number
function show_dropdown(target)
{
    document.get(target, (element)=>{
        if (!element.hasAttribute('data-clicked'))
        {
            element.style.display = 'block';
            element.setAttribute('data-clicked', 'yes');
        }
        else
        {
            element.style.display = 'none';
            element.removeAttribute('data-clicked');
        }
        
    });
}