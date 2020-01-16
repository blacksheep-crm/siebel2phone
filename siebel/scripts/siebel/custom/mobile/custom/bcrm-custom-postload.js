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
//container function for custom postload stuff

function BCRMCustomPostLoad(){

        var utils = new SiebelAppFacade.BCRMMobileUtils();

        //get environment
        var vn = SiebelApp.S_App.GetActiveView().GetName();
        var am = SiebelApp.S_App.GetActiveView().GetAppletMap();
		
		BCRMCustomSampleFunction();

}

BCRMCustomSampleFunction = function(){
	//console.log("BCRMCustomSampleFunction");
	//do your thing
};


//Example custom icon function for super list applets

SiebelAppFacade.BCRMSuperListApplet.prototype.CustomIcon = function (pm,idx){
	var ic = $("<div data-bcrm='custom' class='bcrm-custom-icon-example'></div>");
    var icon = $("<span>" + idx + "</span>");
    $(ic).append(icon);
    return ic; 
};

//Custom button extension function
SiebelAppFacade.BCRMMobileActions.prototype.CreateCustomButton = function(i,mconf,method,la,fa,has_slave,link){
	var custombtn = $("<li id='bcrm_custom_btn' class='bcrm-big-btn bcrm-custom-btn' bcrm-order='" + i + "' bcrm-method='" + method + "'><content class='bcrm-custom-btn-content'>:)</li>");
	custombtn.on("click",function(e){
		alert("Custom Button clicked");
	});
	return custombtn;
};

//last line
console.log("bcrm-custom-postload.js loaded");