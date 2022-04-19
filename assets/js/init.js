/**
 * @member loadDatePicker
 */
(function(){

    // load datepicker
    loadDatepicker();

    // update travel time
    let updateTravelDate = (pickerElement, checkInElement, checkOutElement) => {
        // update travel-checkin text
        pickerElement.get('.travel-checkin', (travelCheckInElement) => {
            if (checkInElement.value.length > 1) {
                travelCheckInElement.textContent = checkInElement.value;
                pickerElement.setAttribute('value', checkInElement.value);
            }
        });

        // update travel-checkout text
        pickerElement.get('.travel-checkout', (travelCheckOutElement) => {
            if (checkOutElement.value.length > 1) travelCheckOutElement.textContent = checkOutElement.value;
        });
    };

    // check for datepicker double class
    document.getAll('.datepicker-double', (datePickers)=>{
        datePickers.forEach((pickerElement) => {

            // @var mixed checkoutElement
            let checkOutElement = pickerElement.parentNode.querySelector('*[name="checkout"]'),
                checkInElement  = pickerElement.parentNode.querySelector('*[name="checkin"]');

            // update travel date
            updateTravelDate(pickerElement, checkInElement, checkOutElement);

            // load light picker 
            new Lightpick({
                field: pickerElement,
                secondField: checkOutElement,
                singleDate: false,
                inline:false,
                format: 'M/D/YYYY',
                numberOfColumns:2,
                numberOfMonths:2,
                minDate: new Date(),
                repick: true,
                startDate: checkInElement.value,
                endDate: checkOutElement.value,
                onSelect: function(start, end){

                    // update checkin
                    checkInElement.value = pickerElement.value;

                    if ($(checkOutElement).val() !== "")
                    {
                        if($(checkOutElement).val() === $(checkInElement).val())
                        {
                            let d = new Date(new Date(end).getTime() + (((60 * 60) * 24) * 1000));
                            $(checkOutElement).val((d.getMonth() + 1) + "/" + (d.getDate()) + "/" + d.getFullYear());
                        }
                    }

                    // update travel date
                    updateTravelDate(pickerElement, checkInElement, checkOutElement);
                }
            });
        });
    });

    // check .ui.search.dropdown 
    document.get('.ui.search.dropdown', (e)=>{
        jQuery('.ui.search.dropdown')
        .dropdown({
            fullTextSearch: true
        });
    });

})();


// Select all links with hashes
// $('a[href*="#"]')
//   // Remove links that don't actually link to anything
//   .not('[href="#"]')
//   .not('[href="#0"]')
//   .click(function(event) {
//     // On-page links
//     if (
//       (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, ''))
//       && 
//       (location.hostname == this.hostname)) {
//       // Figure out element to scroll to
//       var target = $(this.hash);
//       target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
//       // Does a scroll target exist?
//       if (target.length) {
//         // Only prevent default if animation is actually gonna happen
//         event.preventDefault();
//         $('html, body').animate({
//           scrollTop: target.offset().top - 150
//         }, 500, function() {
//           // Callback after animation
//           // Must change focus!
//           var $target = $(target);
//           $target.focus();
//           if ($target.is(":focus")) { // Checking if the target was focused
//             return false;
//           } else {
//             $target.attr('tabindex','-1'); // Adding tabindex for elements not focusable
//             $target.focus(); // Set focus again
//           };
//         });
//       }
//     }
// });

// load smooth scroll
function smoothScroll()
{
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
    
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
}

// call smooth scroll
smoothScroll();

// load datepicker
function loadDatepicker()
{
    // check for datepicker class
    document.getAll('.datepicker', (datePickers) => {
        datePickers.forEach((pickerElement) => {
            // 
            let picker = new Lightpick({
                field: pickerElement,
                singleDate: true,
                inline:false,
                format:"MM/DD/YYYY",
                numberOfColumns:1,
                numberOfMonths:1,
                onSelect: function(){
                    let field = picker._opts.field;

                    // has date picker?
                    if (field !== null && field.hasAttribute('data-picker'))
                    {
                        // clicked ?
                        if (field.classList.contains('cout')) field.setAttribute('data-picker-clicked', 'yes');

                        // has callback
                        if (field.hasAttribute('data-callback')) window[field.getAttribute('data-callback')]();

                        // changed
                        document.get(field.getAttribute('data-picker'), (target)=>{

                            // get date
                            let timeStamp = this.getDate()._i,
                            date = new Date(), tmpDate = new Date();
                            date.setTime(timeStamp);

                            if (target.classList.contains('cout'))
                            {
                                // @var bool canContinue
                                let canContinue = true;

                                // check data picker
                                if (target.hasAttribute('data-picker-clicked')) canContinue = false;

                                // check date
                                if (this.getDate().format('MM/DD/YYYY') == target.value) canContinue = true;

                                // can we continue
                                if (canContinue)
                                {
                                    // Create a date for cout
                                    tmpDate.setDate(date.getDate() + 1);

                                    // get month
                                    let dateObject = {
                                        month   : this.getDate()._d.getMonth() + 1,
                                        day     : tmpDate.getDate(),
                                        year    : tmpDate.getFullYear()
                                    };

                                    //console.log(dateObject);

                                    // add zero to month
                                    if (dateObject.month < 10) dateObject.month = '0' + dateObject.month;

                                    // add zero to day
                                    if (dateObject.day < 10) dateObject.day = '0' + dateObject.day;

                                    // set date now
                                    target.value = dateObject.month + '/' + dateObject.day + '/' + dateObject.year;
                                }
                            }
                        });
                    }
                }
            });

            // set date
            if (pickerElement.hasAttribute('data-default'))
            {
                picker.setDate(pickerElement.getAttribute('data-default'));
            }
        });
    });
}