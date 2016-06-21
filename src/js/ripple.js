/**
 * MUI CSS/JS ripple module
 * @module ripple
 */

'use strict';


var jqLite = require('./lib/jqLite'),
    util = require('./lib/util'),
    btnClass = 'mui-btn',
    btnFABClass = 'mui-btn--fab',
    rippleClass = 'mui-ripple-effect',
    animationDuration = 600;


/**
 * Add ripple effects to button element.
 * @param {Element} buttonEl - The button element.
 */
function initialize(buttonEl) {
  // check flag
  if (buttonEl._muiRipple === true) return;
  else buttonEl._muiRipple = true;

  // exit if element is INPUT (doesn't support absolute positioned children)
  if (buttonEl.tagName === 'INPUT') return;

  // attach event handler
  if ('ontouchstart' in buttonEl) {
    jqLite.on(buttonEl, 'touchstart', eventHandler);
  } else {
    jqLite.on(buttonEl, 'mousedown', eventHandler);
  }
}


/**
 * Event handler
 * @param {Event} ev - The DOM event
 */
function eventHandler(ev) {
  // only left clicks
  if (ev.type === 'mousedown' && ev.button !== 0) return;

  var buttonEl = this;

  // exit if button is disabled
  if (buttonEl.disabled === true) return;

  // create
  var rippleEl = createEl(ev, buttonEl);

  // add
  buttonEl.appendChild(rippleEl);

  // animate
  animateEl(rippleEl, buttonEl);
}


/**
 * Create ripple element  
 * @param {Element} - buttonEl - The button element.
 */
function createEl(ev, buttonEl) {
  var rippleEl = document.createElement('div');
  rippleEl.className = rippleClass;

  var offset = jqLite.offset(buttonEl),
      xPos = ev.pageX - offset.left,
      yPos = ev.pageY - offset.top,
      diameter,
      radius;

  // get height
  if (jqLite.hasClass(buttonEl, btnFABClass)) diameter = offset.height / 2;
  else diameter = offset.height;

  radius = diameter / 2;
  
  jqLite.css(rippleEl, {
    height: diameter + 'px',
    width: diameter + 'px',
    top: yPos - radius + 'px',
    left: xPos - radius + 'px'
  });

  return rippleEl;
}


/**
 * Animate ripple element
 * @param {Element} rippleEl - The ripple element.
 */
function animateEl(rippleEl, buttonEl) {
  var events = 'mouseup mouseleave touchend',
      t0;  // start timer

  /**
   * Mouse event handler
   */
  function mouseHandler() {
    // remove handlers
    jqLite.off(buttonEl, events, mouseHandler);

    // inactivate
    jqLite.removeClass(rippleEl, 'mui--active');

    // animate out
    if (new Date - t0 > animationDuration) {
      jqLite.addClass(rippleEl, 'mui--animate-out');
    }

    // remove ripple element
    setTimeout(function() {
      var parentNode = rippleEl.parentNode;
      if (parentNode) parentNode.removeChild(rippleEl);
    }, animationDuration);
  }

  // add handler to button
  jqLite.on(buttonEl, events, mouseHandler);

  // start animation
  requestAnimationFrame(function() {
    t0 = new Date;
    jqLite.addClass(rippleEl, 'mui--animate-in mui--active');
  });
}


/** Define module API */
module.exports = {
  /** Initialize module listeners */
  initListeners: function() {
    var doc = document;

    // markup elements available when method is called
    var elList = doc.getElementsByClassName(btnClass);
    for (var i=elList.length - 1; i >= 0; i--) initialize(elList[i]);

    // listen for new elements
    util.onNodeInserted(function(el) {
      if (jqLite.hasClass(el, btnClass)) initialize(el);
    });
  }
};
