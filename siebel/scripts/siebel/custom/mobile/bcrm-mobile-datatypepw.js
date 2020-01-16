/*blacksheep IT consulting Copyright
* Copyright (C) 2020

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"),
to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software,
and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/

/*bcrm-mobile-datatypepw.js
* BCRM Data Type Plug-in Wrapper
* DO NOT MODIFY THIS FILE!
* If necessary, deactivate in Manifest and replace with custom PW
*/
if (typeof (SiebelAppFacade.BCRMDataTypePW) === "undefined") {

 SiebelJS.Namespace("SiebelAppFacade.BCRMDataTypePW");
 define("siebel/custom/mobile/BCRMDataTypePW", [],
  function () {
   SiebelAppFacade.BCRMDataTypePW = (function () {

    function BCRMDataTypePW(pm) {
     SiebelAppFacade.BCRMDataTypePW.superclass.constructor.apply(this, arguments);
    }

    SiebelJS.Extend(BCRMDataTypePW, SiebelAppFacade.CalculatorPW);

    BCRMDataTypePW.prototype.ShowUI = function () {
		_$dbg("BCRMDataTypePW.ShowUI");
     SiebelAppFacade.BCRMDataTypePW.superclass.ShowUI.apply(this, arguments);
	 var pw = this.GetEl();
	 if (pw && pw.length){
		 if (pw.hasClass("siebui-ctrl-calc")){
			pw.attr("type","number");
		 }
		 
	 }
    }

    return BCRMDataTypePW;
   }()
  );
  
  SiebelApp.S_App.PluginBuilder.AttachPW(consts.get("SWE_CTRL_CALC"), SiebelAppFacade.BCRMDataTypePW, function (control, objName) {
   var retval = false;
   var utils = new SiebelAppFacade.BCRMMobileUtils();
	  if (utils.GetAppletType(objName) == "form"){
	   _$dbg("BCRMDataTypePW.AttachPW: " + objName + ":" + control.GetFieldName());
	   retval = true;
	}
   return retval;
  });
  
  
  return "SiebelAppFacade.BCRMDataTypePW";
 })
}
_$dbg("bcrm-mobile-datatypepw.js loaded");