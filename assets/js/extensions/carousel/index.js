
// load sliders
let sliders = document.querySelectorAll('*[data-slider]');

// items loaded
let loaded = false, cached = {slides : []};

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

function slide(wrapper, items, prev, next)
{
  let posX1 = 0,
      posX2 = 0,
      posInitial,
      posFinal,
      threshold = 100,
      slides = items.getElementsByClassName('slide'),
      slidesLength = slides.length,
      slideSize = items.getElementsByClassName('slide')[0].offsetWidth,
      firstSlide = slides[0],
      lastSlide = slides[slidesLength - 1],
      cloneFirst = firstSlide.cloneNode(true),
      cloneLast = lastSlide.cloneNode(true),
      index = 0,
      allowShift = true;

  // do we have data-active
  if (items.hasAttribute('data-active'))
  {
    let active = Number(items.getAttribute('data-active'));

    slides = Array.prototype.map.call(slides, (e)=>{ return e; });

    if (typeof slides[active] != 'undefined' && active > 0)
    {
      posInitial = items.offsetLeft;
      items.style.left = '-' + (Math.abs(lastSlide.offsetWidth) * (active + 1)) + "px";
      index = active;
      //items.removeAttribute('data-active');
    }

    if (!loaded)
    {
      // Clone first and last slide
      loaded = true;
    }
    else
    {
      //items.style.left = '0px';
      if (active === 0)
      {
        index = 0;
        posInitial = items.offsetLeft;
        items.style.left = - (Math.abs(slideSize)) + "px";
      }
    }
  }

  items.appendChild(cloneFirst);
  items.insertBefore(cloneLast, firstSlide);
  wrapper.classList.add('loaded');

  // add count
  addCount();

  // Mouse and Touch events
  //items.onmousedown = dragStart;
  
  // Touch events
  // items.addEventListener('touchstart', dragStart);
  // items.addEventListener('touchend', dragEnd);
  // items.addEventListener('touchmove', dragAction);
  
  // Click events
  prev.addEventListener('click', function () { shiftSlide(-1) });
  next.addEventListener('click', function () { shiftSlide(1) });
  
  // Transition events
  items.addEventListener('transitionend', checkIndex);
  
  function dragStart (e) {
    e = e || window.event;
    e.preventDefault();
    posInitial = items.offsetLeft;
    
    if (e.type === 'touchstart') {
      posX1 = e.touches[0].clientX;
    } else {
      posX1 = e.clientX;
      document.onmouseup = dragEnd;
      document.onmousemove = dragAction;
    }
  }

  function dragAction (e) {
    e = e || window.event;
    
    if (e.type === 'touchmove') {
      posX2 = posX1 - e.touches[0].clientX;
      posX1 = e.touches[0].clientX;
    } else {
      posX2 = posX1 - e.clientX;
      posX1 = e.clientX;
    }
    items.style.left = (items.offsetLeft - posX2) + "px";
  }
  
  function dragEnd (e) {
    posFinal = items.offsetLeft;
    if (posFinal - posInitial < -threshold) {
      shiftSlide(1, 'drag');
    } else if (posFinal - posInitial > threshold) {
      shiftSlide(-1, 'drag');
    } else {
      items.style.left = (posInitial) + "px";
    }

    document.onmouseup = null;
    document.onmousemove = null;
  }
  
  function shiftSlide(dir, action)
  {
    items.classList.add('shifting');
    
    if (allowShift) {
      if (!action) { posInitial = items.offsetLeft; }

      if (dir === 1) {
        items.style.left = '-' + (Math.abs(posInitial) + slideSize) + "px";
        index++;
      } else if (dir === -1) {
        items.style.left = (posInitial + slideSize) + "px";
        index--;      
      }
    }
    
    allowShift = false;
  }
    
  function checkIndex (){
    items.classList.remove('shifting');

    if (index === -1) {
      items.style.left = - (slidesLength * slideSize) + "px";
      index = slidesLength - 1;
    }

    if (index === slidesLength)
    {
      console.log(Math.abs(slideSize));
      items.style.left = - (Math.abs(slideSize)) + "px";
      index = 0;
    }
    
    allowShift = true;

    // add count
    addCount();
  }

  function addCount() {
    if (items.hasAttribute('data-has-count'))
    {
      // load count
      document.get('*[data-count="'+items.getAttribute('data-has-count')+'"]', (e)=>{
        e.querySelector('.current').innerText = ((Number(index) + 1));
        e.querySelector('.total').innerText = (slidesLength);
      });
    }
  }
}