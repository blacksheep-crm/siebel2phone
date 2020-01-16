/*blacksheep IT consulting Copyright
* Copyright (C) 2016-2019

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"),
to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software,
and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/

/*bcrm-mobile-checkboxpw.js
* BCRM Checkbox Plug-in Wrapper
* DO NOT MODIFY THIS FILE!
* If necessary, deactivate in Manifest and replace with custom PW
*/
if (typeof (SiebelAppFacade.BCRMCheckBoxPW) === "undefined") {

 SiebelJS.Namespace("SiebelAppFacade.BCRMCheckBoxPW");
 define("siebel/custom/mobile/BCRMCheckBoxPW", [],
  function () {
   SiebelAppFacade.BCRMCheckBoxPW = (function () {

    function BCRMCheckBoxPW(pm) {
     SiebelAppFacade.BCRMCheckBoxPW.superclass.constructor.apply(this, arguments);
    }

    SiebelJS.Extend(BCRMCheckBoxPW, SiebelAppFacade.CheckBoxPW);

    BCRMCheckBoxPW.prototype.ShowUI = function () {
	 _$dbg("BCRMCheckBoxPW.AttachPW.ShowUI");
     SiebelAppFacade.BCRMCheckBoxPW.superclass.ShowUI.apply(this, arguments);
	 var cb = this.GetEl();
	 if (cb && cb.length){
		cb.addClass("bcrm-checkbox");
		var cbn = cb.attr("name");
		cb.attr("id",cbn);
		var lbl = $("<label for='" + cbn + "'>");
		cb.after(lbl);
	 }
    };

    return BCRMCheckBoxPW;
   }()
  );
  
  SiebelApp.S_App.PluginBuilder.AttachPW(consts.get("SWE_CTRL_CHECKBOX"), SiebelAppFacade.BCRMCheckBoxPW, function (control, objName) {
	  var retval = false;
	  var utils = new SiebelAppFacade.BCRMMobileUtils();
	  if (utils.GetAppletType(objName) == "form"){
		_$dbg("BCRMCheckBoxPW.AttachPW: " + objName + ":" + control.GetFieldName());
		retval = true;
	  }
   return retval;
  });
  
  return "SiebelAppFacade.BCRMCheckBoxPW";
 })
}
_$dbg("bcrm-mobile-checkboxpw.js loaded");