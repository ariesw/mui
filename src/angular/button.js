/**
 * MUI Angular Button Component
 * @module angular/button
 */

import angular from 'angular';

import * as jqLite from '../js/lib/jqLite';


const moduleName = 'mui.button',
      animationDuration = 600;


angular.module(moduleName, [])
  .directive('muiButton', function() {
    return {
      restrict: 'AE',
      scope: {
        type: '@?'
      },
      replace: true,
      template: '<button class="mui-btn" type={{type}} mui-ripple ng-transclude></button>',
      transclude: true,
      link: function(scope, element, attrs) {
        var isUndef = angular.isUndefined,
            el = element[0];

        // disable MUI js
        el._muiDropdown = true;
        el._muiRipple = true;

        // handle disabled attribute
        if (!isUndef(attrs.disabled) && isUndef(attrs.ngDisabled)) {
          element.prop('disabled', true);
        }

        // set button styles        
        angular.forEach(['variant', 'color', 'size'], function(attrName) {
          var attrVal = attrs[attrName];
          if (attrVal) element.addClass('mui-btn--' + attrVal);
        });
      }
    };
  })
  .directive('muiRipple', ['$timeout', function($timeout) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var rippleClass = 'mui-ripple-effect',
            touchEvent;

        touchEvent = ('ontouchstart' in element) ? 'touchstart' : 'mousedown';

        /**
         * onmousedown ripple effect
         * @param  {event} mousedown event
         */
        element.on(touchEvent, function(event) {
          if (element.prop('disabled')) return;

          var offset = jqLite.offset(element[0]),
              xPos = event.pageX - offset.left,
              yPos = event.pageY - offset.top,
              diameter,
              radius;

          diameter = offset.height;
          if (element.hasClass('mui-btn--fab')) diameter = offset.height / 2;
          radius = diameter / 2;

          // ripple Dom position
          var rippleStyle = {
            height: diameter + 'px',
            width: diameter + 'px',
            top: (yPos - radius) + 'px',
            left: (xPos - radius) + 'px'
          };

          var rippleEl = angular.element('<div></div>').addClass(rippleClass);
          for (var style in rippleStyle) {
            rippleEl.css(style, rippleStyle[style]);
          }

          element.append(rippleEl);

          // animate ripple
          var events = 'mouseup mouseleave touchend',
              t0;  // start timer

          /**
           * Mouse event handler
           */
          function mouseHandler() {
            // remove handlers
            element.off(events, mouseHandler);

            // inactivate
            rippleEl.removeClass('mui--active');

            // animate out
            if (new Date - t0 > animationDuration) {
              rippleEl.addClass('mui--animate-out');
            }

            // remove ripple element
            setTimeout(rippleEl.remove, animationDuration);
          }

          // add handler to button
          element.on(events, mouseHandler);

          // start animation
          requestAnimationFrame(function() {
            t0 = new Date;
            rippleEl.addClass('mui--animate-in mui--active');
          });
        });
      }
    }
  }]);


/** Define module API */
export default moduleName;
