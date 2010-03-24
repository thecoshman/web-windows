//**********************************************
// Do not remove this notice.
//
// Copyright 2001 by Mike Hall.
// See http://www.brainjar.com for terms of use.
//**********************************************

/*
Copyright 2010 Dan Cosh

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/   
   
// Determine browser and version.
function Browser(){
  var ua, s, i;
  this.isIE = false;
  this.isNS = false;
  this.version = null;
  this.width = null;
  this.height = null;
  this.calculate_width_height = function(){
    if(typeof(window.innerWidth) == "number"){
	  // A non-IE browser
	  // if this.isIE = true {please report this as it may vause this code to brake}
	  this.width = window.innerWidth;
	  this.height = window.innerHeight;
	  return true;
	}
	if(document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)){
	  //IE 6+ in 'standards compliant mode'
      this.width = document.documentElement.clientWidth;
      this.height = document.documentElement.clientHeight;
	  return true;
    }
    if(document.body && (document.body.clientWidth || document.body.clientHeight)){
      //IE 4 compatible
      this.width = document.body.clientWidth;
      this.height = document.body.clientHeight;
	  return true;
    }
	return false;
  }
  this.get_width = function(){
    return this.width;
  }
  this.get_height = function(){
    return this.height;
  }
  this.get_mouse_x = function(e){
    if (browser.isIE){
      return window.e.clientX + document.documentElement.scrollLeft + document.body.scrollLeft;
    }
    if (browser.isNS){
      return e.clientX + window.scrollX;
    }
  }
  this.get_mouse_y = function(e){
    if (browser.isIE){
      return window.e.clientY + document.documentElement.scrollTop  + document.body.scrollTop;
    }
    if (browser.isNS){
      return e.clientY + window.scrollY;
    }
  } 
  ua = navigator.userAgent;
  s = "MSIE";
  if ((i = ua.indexOf(s)) >= 0){
    this.isIE = true;
    this.version = parseFloat(ua.substr(i + s.length));
    return;
  }
  s = "Netscape6/";
  if ((i = ua.indexOf(s)) >= 0){
    this.isNS = true;
    this.version = parseFloat(ua.substr(i + s.length));
    return;
  }
  // Treat any other "Gecko" browser as NS 6.1.
  s = "Gecko";
  if ((i = ua.indexOf(s)) >= 0){
    this.isNS = true;
    this.version = 6.1;
    return;
  }
}
var browser = new Browser();
if(!browser.calculate_width_height()){
  alert("failed to get width and or height of browser");
}