/**
 * MUI CSS/JS ripple module
 * @module ripple
 */

'use strict';


var jqLite = require('./lib/jqLite'),
    util = require('./lib/util'),
    btnClass = 'mui-btn',
    btnFABClass = 'mui-btn--fab',
    rippleClass = 'mui-ripple-effect';


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
  jqLite.on(buttonEl, 'touchstart', eventHandler);
  jqLite.on(buttonEl, 'mousedown', eventHandler);
}


/**
 * Event handler
 * @param {Event} ev - The DOM event
 */
function eventHandler(ev) {
  // only left clicks
  if (ev.button !== 0) return;

  var buttonEl = this;

  // exit if button is disabled
  if (buttonEl.disabled === true) return;

  // de-dupe touchstart and mousedown with 100msec flag
  if (buttonEl.touchFlag === true) {
    return;
  } else {
    buttonEl.touchFlag = true;
    setTimeout(function() {buttonEl.touchFlag = false;}, 100);
  }


  // -------------------------------------

  // add a mouseactive flag handler
  if (buttonEl.mouseactive === undefined) {
    var fn = function() {buttonEl.mouseactive = false;};
    jqLite.on(buttonEl, 'mouseup', fn);
    jqLite.on(buttonEl, 'mouseexit', fn);
  }

  // set mouseactive flag
  buttonEl.mouseactive = true;

  // --------------------------------------
  
  
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

  buttonEl.appendChild(rippleEl);

  // remove 

  requestAnimationFrame(function() {
    jqLite.addClass(rippleEl, 'mui--is-animating mui--is-visible');
  });

  // remove ripple logic
  var isClicked = true,
      inTransition = true;

  function removeRippleEl() {
    var parentNode = rippleEl.parentNode;
    if (parentNode) parentNode.removeChild(rippleEl);
  }
  
  // add handlers to button
  function mouseHandler() {
    isClicked = false;

    // remove handlers
    jqLite.off(buttonEl, 'mouseup', mouseHandler);
    jqLite.off(buttonEl, 'mouseleave', mouseHandler);

    jqLite.removeClass(rippleEl, 'mui--is-visible');

    // remove ripple
    if (!inTransition) removeRippleEl();
  }

  // add handler to button
  jqLite.on(buttonEl, 'mouseup', mouseHandler);
  jqLite.on(buttonEl, 'mouseleave', mouseHandler);

  window.setTimeout(function() {
    inTransition = false;

    // remove ripple
    if (!isClicked) removeRippleEl();
  }, 600);
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
