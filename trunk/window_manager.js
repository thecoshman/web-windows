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

function Window_manager(){
  this.windows = [];
  this.menu_bar = null;
  this.cursor_start_x = null;
  this.cursor_start_y = null;
  
  this.start_menu_bar = function(){
    if(this.menu_bar != null)
    {
      return;
    }
    var tbody = document.getElementsByTagName("body")[0];
    this.menu_bar = document.createElement('div');
    this.menu_bar.className = "menu_bar";
    tbody.appendChild(this.menu_bar);
  }
  this.new_window = function(){
    this.windows[this.windows.length] = new Window(this.windows.length);
    return this.windows[this.windows.length - 1];
  }
  this.get_top_window = function(){
    if(this.windows.length == 0)
    {
      return false;
    }
    var top_window = this.windows[0];
    for(var i = 0; i < this.windows.length; i = i + 1)
    {
      if(this.windows[i].get_zindex() > top_window.get_zindex())
      {
        top_window = this.windows[i];
      }
    }
    return top_window;
  }
  this.is_zindex_free = function(test_zindex){
    for(var i = 0; i < this.windows.length; i = i + 1)
    {
      if(this.windows[i].get_zindex() == test_zindex)
      {
        return false;
      }
    }
    return true;
  }

  this.store_current_mouse = function(e){
    this.cursor_start_x = browser.get_mouse_x(e);
    this.cursor_start_y = browser.get_mouse_y(e);
  }
  this.get_start_mouse_x = function(){
    return this.cursor_start_x;
  }
  this.get_start_mouse_y = function(){
    return this.cursor_start_y;
  }
  return true;
}
var Window_manager = new Window_manager();