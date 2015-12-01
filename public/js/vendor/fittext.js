/*!	
* FitText.js 1.0 jQuery free version
*
* Copyright 2011, Dave Rupert http://daverupert.com 
* Released under the WTFPL license 
* http://sam.zoy.org/wtfpl/
* Modified by Slawomir Kolodziej http://slawekk.info
*
* Date: Tue Aug 09 2011 10:45:54 GMT+0200 (CEST)
*/
!function(){var n=function(n,t,e){n.addEventListener?n.addEventListener(t,e,!1):n.attachEvent("on"+t,e)},t=function(n,t){for(var e in t)t.hasOwnProperty(e)&&(n[e]=t[e]);return n};window.fitText=function(e,i,a){var o=t({minFontSize:-1/0,maxFontSize:1/0},a),r=function(t){var e=i||1,a=function(){t.style.fontSize=Math.max(Math.min(t.clientWidth/(10*e),parseFloat(o.maxFontSize)),parseFloat(o.minFontSize))+"px"};a(),n(window,"resize",a)};if(e.length)for(var f=0;f<e.length;f++)r(e[f]);else r(e);return e}}();
