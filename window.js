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

function Window(window_id){
  if(window_id == null){
    // A window must be given an ID for it to work.
    // It assumes that it is given a valid ID
    return false;
  }
  this.id = window_id;
  this.base_element, this.window_bar, this.window_title, this.window_buttons, this.window_close, this.window_cont, this.window_cont_buffer = null;
  this.title = "Untitled Window"
  this.xpos = 0;
  this.ypos = 0;
  this.width = "400px";
  this.height = "auto";
  this.enable_close = true;
  this.enable_roll = true;
  this.rolled = false;
  this.zindex = 0;
  this.start_left = 0;
  this.start_top = 0;
  this.position_lock = false;

  /* code for creating the DOM structure */{
  var tbody = document.getElementsByTagName("body")[0];
  this.base_element = document.createElement("div");
  tbody.appendChild(this.base_element);
  this.base_element.className = "window";
  this.base_element.id = "window_" + this.id;
  this.base_element.setAttribute("onmousedown", "Window_manager.windows[" + this.id + "].bring_to_front()");

    this.window_bar = document.createElement('div');
    this.window_bar.className = "window_bar";
    this.window_bar.setAttribute("ondragstart", "return false;");
    this.window_bar.setAttribute("onmousedown", "Window_manager.windows[" + this.id + "].drag_start(event); return false");
    this.window_bar.setAttribute("ondblclick", "Window_manager.windows[" + this.id + "].roll()");
    this.base_element.appendChild(this.window_bar);

      this.window_title = document.createElement("div");
      this.window_title.className = "window_title";
      this.window_title.innerHTML = this.title;
      this.window_bar.appendChild(this.window_title);

      this.window_buttons = document.createElement("div");
      this.window_buttons.className = "window_buttons";
      this.window_bar.appendChild(this.window_buttons);

        this.window_close = document.createElement("div");
        this.window_close.className = "window_button window_close";
        this.window_buttons.appendChild(this.window_close);
        this.window_close.setAttribute("onclick", "Window_manager.windows[" + this.id + "].close()");

    this.window_cont = document.createElement("div");
    this.window_cont.className = "window_cont";
    this.window_cont.id = "window_" + this.id + "_cont";
    this.window_cont.innerHTML = "<p>Yo! what up g-dog!<br/>this is some funky stuff</p>";
    this.base_element.appendChild(this.window_cont);

    this.window_cont_buffer = document.createElement("div");
    this.window_cont_buffer.className = "window_cont_buffer";
    this.window_cont_buffer.id = "window_" + this.id + "_cont_buffer";
    this.window_cont_buffer.innerHTML = "";
    this.base_element.appendChild(this.window_cont_buffer);
  }
  this.set_zindex = function(new_zindex){
    if(Window_manager.is_zindex_free(new_zindex))
    {
      this.zindex = new_zindex;
      this.base_element.style.zIndex = this.zindex;
      return true;
    }
    return false;
  }
  this.get_zindex = function(){
    return this.zindex;
  }
  this.set_xpos = function(value){
    if(this.possition_lock){ return false; }
    if(value == "auto"){
      alert("Currently not sure how to handle a 'left' value being set to auto, this it is not set");
      return false;
    }
    if(value == "center"){
      this.xpos = (browser.width / 2) - (parseInt(this.get_width(),10) / 2) + "px";
    }
    else if(isNaN(parseInt(value)) || !get_unit(value)){
      return false;
    }
	else if(parseInt(value,10) < 0){
	  /* This check stops the window going off the left of the screen */
	  this.xpos = "0px";
	}
	else if((parseInt(value,10) + parseInt(this.get_width(), 10)) > browser.get_width()){
	  /* This check stops the window going off the right of the screen */
	  this.xpos = parseInt(browser.get_width(),10) - parseInt(this.get_width(), 10) + "px";
	}
	else
	{
	  this.xpos = value;
	}
	this.base_element.style.left = this.get_xpos();
    return true;
  }
  this.get_xpos = function(){
    return this.xpos;
  }
  this.set_ypos = function(value){
    if(this.possition_lock){ return false; }
    if(value == "auto")
    {
      alert("Currently not sure how to deal with a 'left' value being set to auto, this it is not set");
      return false;
    }
    else if(value == "center")
    {
      this.ypos = (browser.height / 2) - (this.base_element.offsetHeight / 2) + "px";
    }
    else if(isNaN(parseInt(value)) || !get_unit(value))
    {
      alert("Not a valid unit and/or value");
      return false;
    }
	else if(parseInt(value,10) < 0){
	  /* This check stops the window going of the top of the screen */
	  this.ypos = "0px";
	}
	else
	{
      this.ypos = value;
	}
	this.base_element.style.top = this.get_ypos();
    return true;
  }
  this.get_ypos = function(){
    return this.ypos;
  }
  this.set_width = function(value){
    if(value == "auto")
	{
	  this.width = "auto"; 
	  /* We could now use innerwidth or something like that to determine the actaull width
	   But as most of the time, we would then load content, the width would no longer be correct*/
      return true;
    }
    if(isNaN(parseInt(value)) || !get_unit(value))
	{
      alert("set_width() -> Not a valid unit and/or value");
      return false;
    }
    this.width = value;
	this.base_element.style.width = this.get_width();
    return true;
  }
  this.get_width = function(){
    return this.width;
  }
  this.set_height = function(value){
    if(value == "auto")
	{
	  this.height = "auto";
	  return true;
	}
	if(isNaN(parseInt(value)) || !get_unit(value))
	{
	  alert("Not a valid unit and/or value");
	  return false;
	}
	if((parseInt(this.get_ypos()) + parseInt(this.get_height())) > parseInt(browser.height))
	{
	  this.height = (parseInt(browser.height) - parseInt(this.get_ypos())) + "px";
	  return true;
	}
	this.height = value;
	this.window_cont.style.height = this.get_height()
	return true;
  }
  this.get_height = function(){
    return this.height;
  }
  this.roll = function(){
    if(!this.enable_roll)
    {
      return false;
    }
	if(this.get_width() == "auto")
	{
	  // locks that widt to a set amount, thus stopping the title bar shrinking when rolled 
	  this.set_width(this.window_cont.offsetWidth + "px");
	}
	$(this.window_cont).slideToggle("normal");
    if(this.rolled)
    {
      this.window_bar.className = "window_bar"
	  this.rolled = false;
      return true;
    }
    this.window_bar.className = "window_bar window_bar_rolled";
	this.rolled = true;
	return true;
  }
  this.close = function(){
    if(this.enable_close)
    {
      this.hide();
	  this.base_element.parentNode.removeChild(this.base_element);
	  // remove these elements from the DOM
	  // free up any memory this object holds
	  // inform the window_manager this window has closed so it can tidy uit self up as well
	  return true;
    }
	return false;
  }
  this.disable_control = function(control){
    this.set_control(control, false);
  }
  this.enable_control = function(control){
    this.set_control(control, true);
  }
  this.set_control = function(control, enabled){
    switch(control)
    {
      case "close":
        this.enable_close = enabled;
      break;
      case "roll":
        this.enable_roll = enabled;
      break;
	  default:
        alert("control not found : " + control);
      break;
    }
  }
  this.lock_position = function(){ this.position_lock = true; return this; }
  this.unlock_position = function(){ this.position_lock = false; return this; }
  /* 
  / This function is used for setting specific attributes of the window, not general attributes like
  / the with the standatrd javascript DOM function setAttribute();
  / This function should probably be renamed for sake of confused... maybe set_property()
  */
  this.set_attribute = function(attribute, value){
    // make sure that 'value' is an acepatble format
    value = value.toLowerCase();
    if((value == "auto") || (value == "inherit") || ((value.substring(value.length - 2) == "px") || (value.substring(value.length - 2) == "em") || (value.substring(value.length - 2) == "ex") || (value.substring(value.length - 2) == "in") || (value.substring(value.length - 2) == "cm") || (value.substring(value.length - 2) == "mm") || (value.substring(value.length - 2) == "pt") || (value.substring(value.length - 2) == "pc") && !isNaN(value.substring(0, value.length -2))) || ((value.substring(value.length - 1) == "%") && !isNaN(value.substring(0, value.length -2))))
    {
      switch(attribute)
      {
        case "window_width":
          this.width = value;
	  $(this.base_element).animate({width : this.width}, 0);
        break;
        case "xpos":
          this.xpos = value;
	  $(this.base_element).animate({left : this.xpos}, 250);
        break;
        case "ypos":
          this.ypos = value;
	  $(this.base_element).animate({top : this.ypos}, 250);
        break;
        default:
          alert("Unkown attribute : " + attribute);
      }
      return true;
    }
    else
    {
      return false;
    }
  }
  this.bring_to_front = function(){
    var top_index = Window_manager.get_top_window().get_zindex();
    return this.set_zindex(top_index + 1);
  }
  this.find_xcenter = function(){
    var browser_window_width = 0;
    if (browser.isIE)
    {
      browser_window_width = document.body.offsetWidth;
    }
    else if (browser.isNS)
    {
      browser_window_width = window.innerWidth;
    }
    return (browser_window_width / 2) - (this.base_element.offsetWidth / 2) + "px";
  }
  /*
  / I do not like these three functions (this.xcenter this.ycenter and this.center)
  / I feel that if some one wanted to center the window, they should use the find x/y center function
  / then set the position of the window as such. Whilst it dose mean a further function call for the 
  / application it reduces complexity of this library.
  */
  this.xcenter = function(){
    this.xpos = this.find_xcenter();
    $(this.base_element).animate({left : this.xpos}, "normal");
  }
  this.ycenter = function(){
    var browser_window_height = 0;
    if (browser.isIE)
    {
      browser_window_height = document.body.offsetHeight;
    }
    if (browser.isNS)
    {
      browser_window_height = window.innerHeight;
    }
    this.ypos = (browser_window_height / 2) - (this.base_element.offsetHeight / 2) + "px";
    $(this.base_element).animate({top : this.ypos}, 250);
  }
  this.center = function(){
    var browser_window_height = 0;
    if (browser.isIE)
    {
      browser_window_height = document.body.offsetHeight;
      browser_window_width = document.body.offsetWidth;
    }if (browser.isNS)
    {
      browser_window_height = window.innerHeight;
      browser_window_width = window.innerWidth;
    }
    this.ypos = (browser_window_height / 2) - (this.base_element.offsetHeight / 2) + "px";
    this.xpos = (browser_window_width / 2) - (this.base_element.offsetWidth / 2) + "px";
    $(this.base_element).animate({left : this.xpos, top : this.ypos}, 250);
  }
  // maybe add some sort of check here to try to save the window getting messed up
  this.set_raw_html_content = function(raw_html){
    this.window_cont.innerHTML = raw_html;
	return this;
  }
  this.load_html = function(path_to_file, post_data){
    this.set_raw_html_content("<p>Loading Content . . .</p>");
    this.load_to_buffer(path_to_file, post_data);
    on_change("window_" + this.id + "_cont_buffer", "", 'document.getElementById("window_' + this.id + '_cont").innerHTML = document.getElementById("window_' + this.id + '_cont_buffer").innerHTML; document.getElementById("window_' + this.id + '_cont_buffer").innerHTML = "" ');
	return this;
  }
  this.load_xml = function(path_to_file, post_data, param){
    this.window_cont.innerHTML = "<p>Loading Content . . .</p>";
    this.load_to_buffer(path_to_file, post_data);
	if(param === undefined)
	{}else{
	  alert(param.xpos);
	}
    on_change("window_" + this.id + "_cont_buffer", "", "Window_manager.windows[" + this.id + "].parse_xml(" + param + ")");
	return this;
  }
  this.load_to_buffer = function(path_to_file, post_data){
    this.window_cont_buffer.innerHTML = "";
    ajax = new sack(path_to_file);
    ajax.element = "window_" + this.id + "_cont_buffer";
	if(post_data != "")
	{
	  post_data = post_data + "&window_ID=" + this.id;
	}
	else
	{
	  postdata = "window_ID=" + this.id;
	}
    ajax.runAJAX(post_data);
  }
  this.parse_xml = function(param){
	if(param === undefined)
	{}else{
	  alert(param.xpos);
	}
    var page_tag = this.window_cont_buffer.getElementsByTagName("page")[0];
    if(!page_tag)
    {
	  alert("Error : The XML file that was loaded did not contain a page tag");
      return false;
    }
	var title_tag = page_tag.getElementsByTagName("window_title")[0]; 
	if(title_tag)
	{
      this.title = title_tag.innerHTML;
	  this.window_title.innerHTML = this.title;
	}
	var controls_tag = page_tag.getElementsByTagName("controls")[0];
	if(controls_tag)
	{
	  var roll_tag = controls_tag.getElementsByTagName("roll")[0];
	  if(roll_tag)
	  {
		if(roll_tag.innerHTML == "enable")
        {
          this.enable_control("roll");
        }
          else if(roll_tag.innerHTML == "disable")
        {
          this.disable_control("roll");
        }
	  }
	  var close_tag = controls_tag.getElementsByTagName("close")[0];
	  if(close_tag)
	  {
		if(close_tag.innerHTML == "enable")
        {
          this.enable_control("close");
        }
          else if(close_tag.innerHTML == "disable")
        {
          this.disable_control("close");
        }
	  }
	}
    var style_tag = page_tag.getElementsByTagName("window_style")[0];
	if(style_tag)
	{
	  var width_tag = style_tag.getElementsByTagName("width")[0];
	  if(width_tag)
	  {
	    this.set_width(width_tag.innerHTML);
	  }
	  var height_tag = style_tag.getElementsByTagName("height")[0];
	  if(height_tag)
	  {
	    this.set_height(height_tag.innerHTML);
	  }
	  var xpos_tag = style_tag.getElementsByTagName("xpos")[0];
	  if(xpos_tag)
	  {
	    this.set_xpos(xpos_tag.innerHTML);
	  }
	  var ypos_tag = style_tag.getElementsByTagName("ypos")[0];
	  if(ypos_tag)
	  {
	    this.set_ypos(ypos_tag.innerHTML);
	  }
	}
	var content_tag = page_tag.getElementsByTagName("content")[0];
	if(content_tag)
	{
	  this.window_cont.innerHTML = content_tag.innerHTML;
    }
	this.window_cont_buffer.innerHTML = "";
  }
  this.display = function(){
    $(this.base_element).animate({opacity:1},200)
	return this;
  }
  this.hide = function(){
    $(this.base_element).animate({opacity:0},200)
    return this;
  }
  this.drag_start = function(e){
    // store current veriables
	// ATM the starting mouse possition is stored as part of the window manager, maybe we should create an object
	// that is part of this class, assing it the four variables, then as part of drag stop, clear all those varaibles to
	// free space. Not sure what the more efficient option would be.
    Window_manager.store_current_mouse(e);
    this.start_left = parseInt(this.get_xpos());
    this.start_top = parseInt(this.get_ypos());
    // Capture mousemove and mouseup events on the page.
    document.getElementsByTagName("body")[0].setAttribute("onMouseMove", "Window_manager.windows[" + this.id + "].drag_go(event)");
    document.getElementsByTagName("body")[0].setAttribute("onMouseUp", "Window_manager.windows[" + this.id + "].drag_stop(event)");
	return false;
  }
  this.drag_go = function(e){
    // Move drag element by the same amount the cursor has moved.
    this.set_xpos((this.start_left + browser.get_mouse_x(e) - Window_manager.get_start_mouse_x()) + "px");
	this.set_ypos((this.start_top  + browser.get_mouse_y(e) - Window_manager.get_start_mouse_y()) + "px");
	return false;
  }
  this.drag_stop = function(e){
    // Stop capturing mousemove and mouseup events.
    document.getElementsByTagName("body")[0].setAttribute("onMouseMove", "");
    document.getElementsByTagName("body")[0].setAttribute("onMouseUp", "");
	return false;
  }
  return true;
}
/* Extra functions used by this window code, but usefull for other things as well */
function on_change(div_watch, originally, execute){
  // this function checks if the HTML element (this would usally be a div, but could be anything)
  // has changed from what it originally was, it will the execute a function or a string of code
  // that was passed in as the third peramiter. this is useful when you want to be able to do
  // something when an ajax request updates part of the page.
  if(document.getElementById(div_watch).innerHTML != originally)
  {
    // the div being watched has changed so we should execute the code
     if (typeof(execute) == 'function')
     {
       execute();
     }
     else if (typeof(execute) == 'string')
     {
       eval(execute);
     }
     else
     {
       alert('Passed in paramater of type : ' + typeof(execute));
     }
    return;
  }
  if (typeof(execute) == 'function')
  {
    setTimeout("on_change('" + div_watch + "', '" + originally + "', " + execute + ")", 25);
  }
  else if (typeof(execute) == 'string')
  {
    setTimeout("on_change('" + div_watch + "', '" + originally + "', '" + addslashes(execute) + "')", 25);
  }
  else
  {
    alert('Passed in paramater of type : ' + typeof(execute));
  }
}
function addslashes(str){
  str=str.replace(/\\/g,'\\\\');
  str=str.replace(/\'/g,'\\\'');
  str=str.replace(/\"/g,'\\"');
  str=str.replace(/\0/g,'\\0');
  return str;
}
function get_unit(value){
  if((value == "auto") || (value == "inherit"))
  {
    return value;
  }
  end_of_string = value.substring(value.length - 2);
  if ((end_of_string == "px") || (end_of_string == "em") || (end_of_string == "ex") || (end_of_string == "in") || (end_of_string == "cm") || (end_of_string == "mm") || (end_of_string == "pt") || (end_of_string == "pc"))
  {
    return end_of_string;
  }
  end_of_string = value.substring(value.length - 1);
  if(value.substring(value.length - 1) == "%")
  {
    return end_of_string;
  }
  return false;
}
