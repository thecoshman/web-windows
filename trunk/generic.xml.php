<?php
$window_ID = -1;
if(isset($_POST["window_ID"]) AND $_POST["window_ID"] != null){
  $window_ID = trim($_POST["window_ID"]);
}
// $window_ID can now be 'echoed' into javascript code to allow it affect THIS window
?><?xml version="1.0" encoding="ISO-8859-!"?>
<page>
  <window_title>Grnric web window</window_title>
  <controls>
    <close>enable</close>
    <roll>enable</roll>
  </controls>
  <window_style>
	<width>600px</width>
    <xpos>center</xpos>
    <ypos>5px</ypos>
  </window_style>
  <content>
  </content>
</page>

