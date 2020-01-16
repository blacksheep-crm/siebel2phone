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

/*bcrm-mobile-actions.js
* Mobile Action ('magic menu') module for blacksheep CRM Mobile for Siebel (Siebel2Phone)
* DO NOT MODIFY THIS FILE!
*/
var BCRMMobileActionsCanSwitch = true;
var BCRMShowSelectionRun = false;
if (typeof(SiebelAppFacade.BCRMMobileActions) === "undefined")  {
    SiebelJS.Namespace("SiebelAppFacade.BCRMMobileActions");

    SiebelAppFacade.BCRMMobileActions = (function () {
        function BCRMMobileActions(options) {}

		BCRMMobileActions.prototype.MagicMobileMenuInit = function() {
			_$dbg("BCRMMobileActions.MagicMobileMenuInit");
			//main init function, establishes menu event handlers
			if (SiebelAppFacade.DecisionManager.IsTouch()){
				if (typeof(BCRMHammer) === "undefined"){
					//work around hammer being unavailable
					BCRMHammer = Hammer;
				}
				var $firstField = $("ul.bcrm-btn-cont > li:eq(0)");
				//$firstField.removeClass("bcrm-inactive");
				//BCRMHammer.defaults.touchAction = 'auto';
				var firstFieldHammer = new BCRMHammer.Manager($firstField.get(0),{});
				BCRMHammer($firstField.get(0)).off("pan");
				BCRMHammer($firstField.get(0)).off("press");
				var ffpan = new BCRMHammer.Pan({
					'pointers': 1, // just detect movement for single pointer
					'threshold': 10, // fire for minimal 10 pixel movement
					'direction': BCRMHammer.DIRECTION_ALL // fire for all directions
				});
				firstFieldHammer.add(ffpan);
				var ffpress = new BCRMHammer.Press({
					'time': 500 // ms to press for showing menu
				});
				firstFieldHammer.add(ffpress);
				var fieldWidth = $firstField.width();
				var fieldHeight = $firstField.height();
				var autoClose;
				var autoReturn;
				//drag/pan event handler
				firstFieldHammer.on('pan', function (ev) {
					$firstField.parent().css('bottom', '').css('right', '').offset({
						'top': ev.center.y + $(document).scrollTop() - (fieldHeight * 1.5),
						'left': ev.center.x + $(document).scrollLeft() - (fieldWidth * 1.5)
					});

				});
				firstFieldHammer.on("panend", function(e){
					autoReturn = setTimeout(function(){
						if ($firstField.parent().css("top") != "" && !$($firstField.siblings()[0]).hasClass("forceactive")){
							$firstField.siblings().removeClass('active');
							$firstField.parent().fadeOut(300);
							setTimeout(function(){
								$firstField.parent().css("top","").css("left","");
								$firstField.parent().fadeIn(300);
							},300);

							clearTimeout(autoReturn);
						}
					},5000);
				});

				// show menu on 'long press'
				firstFieldHammer.on('press', function (ev) {
					ev.srcEvent.preventDefault();
					ev.srcEvent.stopImmediatePropagation();

					$firstField.siblings().addClass('active');

					autoClose = setTimeout(function () {
						$firstField.siblings().removeClass('active');
					}, 5000); // ms for menu to stay visible

				});
			}
			else{ //non-touch screen
				var $firstField = $("ul.bcrm-btn-cont > li:eq(0)");
				$firstField.on('contextmenu', function (ev) {
					ev.preventDefault();
					ev.stopImmediatePropagation();

					$firstField.siblings().addClass('active');

					autoClose = setTimeout(function () {
						$firstField.siblings().removeClass('active');
					}, 5000); // ms for menu to stay visible

				});

			}
			// auto-close menu on selection
			$("ul.bcrm-btn-cont > li > a").click(function (ev) {
				clearTimeout(autoClose);
				clearTimeout(autoReturn);
				$firstField.siblings().removeClass('active');
				$firstField.siblings().removeClass('forceactive');
			});



			// prevent stupid contextmenu from opening on 'long press' event
			$("ul.bcrm-btn-cont > li, ul.bcrm-btn-cont > li > a").on('contextmenu', function(ev) {
				ev.preventDefault();
				ev.stopImmediatePropagation();

				return false;
			});
		};

        BCRMMobileActions.prototype.MACInit = function() {
			//_$dbg("BCRMMobileActions.MACInit");
			//prepare DOM and create new elements for magic menu
			
			var vn = SiebelApp.S_App.GetActiveView().GetName();
			var vconf = BCRMMACConf[vn];
			var mconf = BCRMMagicMenuConf[vconf.conf];
			var link = "1M";
			if (typeof(vconf.link) !== "undefined"){
				link = vconf.link;
			}
			//remove any menu instance
            $("body").children("#bcrm_btn_cont").remove();
            var utils = new SiebelAppFacade.BCRMMobileUtils();
			var vt = utils.GetViewType();
			var am = SiebelApp.S_App.GetActiveView().GetAppletMap();
			//get the only(!) list applet in this view
			var la = SiebelApp.S_App.GetActiveView().GetApplet(utils.GetAppletsByType("list")[0]);
            var lapm = la.GetPModel();
			_$dbg("BCRMMobileActions.MACInit: " + lapm.GetObjName());
			//find slave(form) applet for list
			var labc = lapm.Get("GetBusComp").GetName();
			var fapm;
			var fa;
			var has_slave = false;
			for (a in am){
				if (utils.GetAppletType(a) == "form"){
					if (am[a].GetBusComp().GetName() == labc){
						fapm = am[a].GetPModel();
						fa = am[a];
						has_slave = true;
					}
				}
			}
            
            //hide form (slave) applet
            if (has_slave){
				var fae = utils.GetAppletElem(fa);
				$(fae).hide();
			}
			//add listeners
			//lapm.AddMethod("InvokeMethod",this.MethodHandler,{sequence:true,scope:lapm});
			lapm.AddMethod("InvokeMethod",this.MethodHandler,{sequence:false,scope:lapm});
			lapm.AttachPMBinding("ShowSelection",this.SSMethodHandler,{sequence:false,scope:lapm});
			if (has_slave && typeof(fapm.Get) == "function"){
				//fapm.AddMethod("InvokeMethod",this.MethodHandler,{sequence:true,scope:fapm});
				fapm.AddMethod("InvokeMethod",this.MethodHandler,{sequence:false,scope:fapm});
				//fapm.AttachPMBinding("ShowSelection",this.SSMethodHandler,{sequence:false,scope:fapm});
			}
			
            //massage list applet
            
            //var lact = lapm.Get("GetControls");
            //var lapr = lapm.GetRenderer();
            var lae = utils.GetAppletElem(la);
			lae.find(".ui-jqgrid-bdiv").addClass("bcrm-sli");
			//menu container
            var btnc = $("<ul id='bcrm_btn_cont' class='bcrm-btn-cont'></ul>");
            //hide applet buttons
			
			$(lae).find(".siebui-applet-header").attr("id","bcrm-adv");
			$(lae).find(".siebui-applet-header").attr("bcrm-adv","yes");
			if (sessionStorage.BCRMADVANCEDMODE != "true"){
				$(lae).find(".siebui-applet-header").addClass("bcrm-forcehide");
			}
			if (has_slave){
				$(fae).find(".siebui-applet-header").attr("id","bcrm-adv");
				$(fae).find(".siebui-applet-header").attr("bcrm-adv","yes");
				if (sessionStorage.BCRMADVANCEDMODE != "true"){
					$(fae).find(".siebui-applet-header").addClass("bcrm-forcehide");
				}
			}
			//var btnarr = [];
			
            var that = this;
        
			//Initialize magic menu
			var baseconf = mconf["Base"];
			var btn;
			for (var m = 0; m < baseconf.length; m++){
				btn = this.CreateButton(m+1,mconf,baseconf[m],la,fa,has_slave,link);
				if (typeof(btn) === "undefined"){
					try{
						btn = this.CreateCustomButton(m+1,mconf,baseconf[m],la,fa,has_slave,link);
					}
					catch(e){
						console.log("BCRMMobileActions.MACInit: Error invoking custom button extension function");
					}
				}
				if (typeof(btn) !== "undefined"){
					$(btnc).append(btn);
				}
			}



            //publish and init new button container

            $("body").append(btnc);	
			this.MagicMobileMenuInit();
        };
		
		BCRMMobileActions.prototype.CreateButton = function(i,mconf,method,la,fa,has_slave,link){
			//create button DOM elements
			_$dbg("BCRMMobileActions.CreateButton: " + method);
		var retval;
		
		var that = new SiebelAppFacade.BCRMMobileActions();
		var utils = new SiebelAppFacade.BCRMMobileUtils();
		//New (plus)
		if (method == "NewRecord"){
			var plusbtn = $("<li id='bcrm_plus_btn' class='bcrm-big-btn bcrm-plus-btn' bcrm-order='" + i + "' bcrm-method='" + method + "'><content class='bcrm-plus-btn-content'></li>");
			if(!la.CanInvokeMethod(method)){
				$(plusbtn).addClass("bcrm-inactive");
			}

            $(plusbtn).on("click",function(e){
				BCRMShowSelectionRun = false;
				if(has_slave){
					//fa.InvokeMethod(method);
					var rwd = new SiebelAppFacade.BCRMRWDFactory();
					rwd.MethodHandler.call(fa.GetPModel(),method);
					la.InvokeMethod(method);
				}
				else{
					la.InvokeMethod(method);
				}
				if (has_slave && link != "MM"){
					if (BCRMMobileActionsCanSwitch){
						that.MACReconfigMenu(mconf,mconf[method],la,fa,has_slave,link);
					}
					that.MACSwitch(fa,la);
				}
            });
			retval = plusbtn;
			}
			
			//Create (double-plus)
			if (method == "CreateRecord"){
			var createbtn = $("<li id='bcrm_create_btn' class='bcrm-big-btn bcrm-create-btn' bcrm-order='" + i + "' bcrm-method='" + method + "'><content class='bcrm-create-btn-content'></li>");
			setTimeout(function(){
				if(!la.CanInvokeMethod(method)){
				$(createbtn).addClass("bcrm-inactive");
				}
			},500);
			

            $(createbtn).on("click",function(e){
				
				if(has_slave){
					fa.InvokeMethod(method);
				}
				else{
					la.InvokeMethod(method);
					that.MACReconfigMenu(mconf,mconf[method],la,fa,has_slave,link);
				}
				if (has_slave){
					that.MACReconfigMenu(mconf,mconf[method],la,fa,has_slave,link);
					that.MACSwitch(fa,la);
				}
            });
			retval = createbtn;
			}
		//Query
		if (method == "NewQuery"){
			var querybtn = $("<li id='bcrm_query_btn' class='bcrm-big-btn bcrm-query-btn' bcrm-order='" + i + "' bcrm-method='" + method + "'><content class='bcrm-query-btn-content'></li>");
			if(!la.CanInvokeMethod(method)){
				$(querybtn).addClass("bcrm-inactive");
			}

            $(querybtn).on("click",function(e){
				
				if(has_slave){
					fa.InvokeMethod(method);
				}
				else{
					la.InvokeMethod(method);
					that.MACReconfigMenu(mconf,mconf[method],la,fa,has_slave,link);
				}
				if (has_slave){
					that.MACReconfigMenu(mconf,mconf[method],la,fa,has_slave,link);
					that.MACSwitch(fa,la);
				}
            });
			retval = querybtn;
			}
			//Cancel Query
			if (method == "UndoQuery"){
				var uquerybtn = $("<li id='bcrm_uquery_btn' class='bcrm-big-btn bcrm-uquery-btn' bcrm-order='" + i + "' bcrm-method='" + method + "'><content class='bcrm-uquery-btn-content'></li>");
			
            
            $(uquerybtn).on("click",function(e){
				if (has_slave){
					if(fa.CanInvokeMethod(method)){
						that.MACReconfigMenu(mconf,mconf[method],la,fa,has_slave,link);
						fa.InvokeMethod(method);
					}
					else{
						that.MACReconfigMenu(mconf,mconf[method],la,fa,has_slave,link);
					}
				}
				else{
					if(la.CanInvokeMethod(method)){
						la.InvokeMethod(method);
					}
				}
				if (has_slave){
					that.MACSwitch(la,fa);
				}
            });
			retval = uquerybtn;
			
			}
			//Execute Query
			if (method == "ExecuteQuery"){
		        var equerybtn = $("<li id='bcrm_equery_btn' class='bcrm-big-btn bcrm-equery-btn' bcrm-order='" + i + "' bcrm-method='" + method + "'><content class='bcrm-equery-btn-content'></li>");

				$(equerybtn).on("click",function(e){
				if (has_slave){
					that.MACReconfigMenu(mconf,mconf[method],la,fa,has_slave,link);
					fa.InvokeMethod(method);
				}
				else{
					la.InvokeMethod(method);
				}
				if (has_slave){
					that.MACSwitch(la,fa);
				}
            });
			retval = equerybtn;
			}
			//Edit: this just shows the slave, no method is invoked
		if (method == "EditRecord"){
			var editbtn = $("<li id='bcrm_edit_btn' class='bcrm-big-btn bcrm-edit-btn' bcrm-order='" + i + "' bcrm-method='" + method + "'><content class='bcrm-edit-btn-content'></li>");
			
			if(la.GetPModel().Get("GetRecordSet").length == 0){
				$(editbtn).addClass("bcrm-inactive");
			}

            $(editbtn).on("click",function(e){
                if (has_slave){
					that.MACReconfigMenu(mconf,mconf[method],la,fa,has_slave,link);
					that.MACSwitch(fa,la);
					that.ButtonManager(fa);
				}
            });
			retval = editbtn;
			}
			//Save
			if (method == "WriteRecord"){
		        var savebtn = $("<li id='bcrm_save_btn' class='bcrm-big-btn bcrm-save-btn' bcrm-order='" + i + "' bcrm-method='" + method + "'><content class='bcrm-save-btn-content'></li>");

				$(savebtn).on("click",function(e){
				if (has_slave){
					
					//fa.InvokeMethod(method);
					var rwd = new SiebelAppFacade.BCRMRWDFactory();
					rwd.MethodHandler.call(fa.GetPModel(),method);
					la.InvokeMethod(method);
					if (BCRMMobileActionsCanSwitch){
						that.MACReconfigMenu(mconf,mconf[method],la,fa,has_slave,link);
					}	
				}
				else{
					la.InvokeMethod(method);
				}
				if (has_slave){
					that.MACSwitch(la,fa);
				}
            });
			retval = savebtn;
			}
			//Cancel / Undo Record
			if (method == "UndoRecord"){
				var cancelbtn = $("<li id='bcrm_cancel_btn' class='bcrm-big-btn bcrm-cancel-btn' bcrm-order='" + i + "' bcrm-method='" + method + "'><content class='bcrm-cancel-btn-content'></li>");
			
            
            $(cancelbtn).on("click",function(e){
				if (has_slave){
					if(fa.CanInvokeMethod(method)){
						that.MACReconfigMenu(mconf,mconf[method],la,fa,has_slave,link);
						//fa.InvokeMethod(method);
						var rwd = new SiebelAppFacade.BCRMRWDFactory();
						rwd.MethodHandler.call(fa.GetPModel(),method);
						la.InvokeMethod(method);
					}
					else{
						that.MACReconfigMenu(mconf,mconf[method],la,fa,has_slave,link);
						//la.InvokeMethod(method);
					}
				}
				else{
					if(la.CanInvokeMethod(method)){
						la.InvokeMethod(method);
					}
				}
				if (has_slave){
					that.MACSwitch(la,fa);
				}
            });
			retval = cancelbtn;
			
			}
			//Delete
			if (method == "DeleteRecord"){
				var delbtn = $("<li id='bcrm_del_btn' class='bcrm-big-btn bcrm-del-btn' bcrm-order='" + i + "' bcrm-method='" + method + "'><content class='bcrm-del-btn-content'></li>");
			
			if(!la.CanInvokeMethod(method)){
				$(delbtn).addClass("bcrm-inactive");
			}	
            $(delbtn).on("click",function(e){
				if (has_slave){
					if(fa.CanInvokeMethod(method)){
						//that.MACReconfigMenu(mconf[method]);
						fa.InvokeMethod(method);
					}
					else{
						//that.MACReconfigMenu(mconf[method]);
					}
				}
				else{
					if(la.CanInvokeMethod(method)){
						
						la.InvokeMethod(method);
					}
				}
				that.MACReconfigMenu(mconf,mconf[method],la,fa,has_slave,link);
	

            });
			retval = delbtn;	
			}
			//Expense Spread Demo
			if (method == "OnSpreadRecord"){
				var spreadbtn = $("<li id='bcrm_spread_btn' class='bcrm-big-btn bcrm-spread-btn' bcrm-order='" + i + "' bcrm-method='" + method + "'><content class='bcrm-spread-btn-content'></li>");
			
			if(!la.CanInvokeMethod(method)){
				$(spreadbtn).addClass("bcrm-inactive");
			}	
            $(spreadbtn).on("click",function(e){
					if(la.CanInvokeMethod(method)){
						
						la.InvokeMethod(method);
					}
				


            });
			retval = spreadbtn;	
			}
			//Record Count: demo complex invocation
			if (method == "RecordCount"){
				var countbtn = $("<li id='bcrm_count_btn' class='bcrm-big-btn bcrm-count-btn' bcrm-order='" + i + "' bcrm-method='" + method + "'><content class='bcrm-count-btn-content'></li>");
			
			if(!la.CanInvokeMethod(method)){
				//$(countbtn).addClass("bcrm-inactive");
			}	
            $(countbtn).on("click",function(e){
					if(true){
						var inp = SiebelApp.S_App.NewPropertySet();
						inp.SetProperty("SWEIPS","@0`0`5`0``3``Command`*Browser Applet* *RecordCount*" + la.GetName() + "*Record Count Applet*450*160*true`Method Argument`Record Count Applet`SWESP`true`SWEW`450`SWEH`160`");
						la.GetPModel().ExecuteMethod( "InvokeMethod",method, inp);
					}
				


            });
			retval = countbtn;	
			}
			//Help button, plays intro.js
			if (method == "ShowHelp"){
				var helpbtn = $("<li id='bcrm_help_btn' class='bcrm-big-btn bcrm-help-btn' bcrm-order='" + i + "' bcrm-method='" + method + "'><content class='bcrm-help-btn-content'></li>");
			
			$(helpbtn).on("click",function(e){
					var ff = $("ul.bcrm-btn-cont > li:eq(0)");
					ff.siblings().addClass("forceactive");
					SiebelAppFacade.BCRMMobileUtils.prototype.PlayIntro(SiebelApp.S_App.GetActiveView().GetName());
            });
			retval = helpbtn;
			}
					
			return retval;
		};
		BCRMMobileActions.prototype.MACReconfigMenu = function(mconf,ma,la,fa,has_slave,link){
			//regenerate menu with given configuration
			_$dbg("BCRMMobileActions.MACReconfigMenu");
			$("body").children("#bcrm_btn_cont").remove();
			if (typeof(ma) == "string"){
				ma = mconf[ma];
			}
			var btnc = $("<ul id='bcrm_btn_cont' class='bcrm-btn-cont'></ul>");
			var btn;
			for (j = 0; j < ma.length; j++){
				btn = this.CreateButton(j+1,mconf,ma[j],la,fa,has_slave,link);
				$(btnc).append(btn);
			}	
			$("body").append(btnc);
			this.MagicMobileMenuInit();
		};	

        BCRMMobileActions.prototype.MACSwitch = function(toshow, tohide){
			_$dbg("BCRMMobileActions.MACSwitch");
			//toggle master and slave applets
			if (BCRMMobileActionsCanSwitch){
            var utils = new SiebelAppFacade.BCRMMobileUtils();
            var toshow = utils.GetAppletElem(toshow);
            var tohide = utils.GetAppletElem(tohide);
            toshow.show();
			tohide.hide();
			
			}
        };
		
		BCRMMobileActions.prototype.MethodHandler = function(m,i,c,r){
			//generic method handler
			_$dbg("BCRMMobileActions.MethodHandler: " + m);
			
			if (typeof(m) !== "undefined"){
				if (m != "Drilldown"){
			if (r.ReturnValue == false){
				BCRMMobileActionsCanSwitch = false;
			}
			else{
				BCRMMobileActionsCanSwitch = true;
			}
			
			SiebelAppFacade.BCRMMobileActions.prototype.ButtonManager(this,m,r);
			}}
		};
		
		BCRMMobileActions.prototype.SSMethodHandler = function(m,i,c,r){
			//ShowSelection method handler
			if (!BCRMShowSelectionRun){
				_$dbg("BCRMMobileActions.SSMethodHandler");
				BCRMShowSelectionRun = true;
				SiebelAppFacade.BCRMMobileActions.prototype.ButtonManager(this,"ShowSelection",r);
				
			}
			
		};
		
		BCRMMobileActions.prototype.ButtonManager = function(pm,m,r){
			//toggle active/inactive state for specific buttons
			var utils = new SiebelAppFacade.BCRMMobileUtils();
			pm = utils.ValidateContext(pm);
			try{
				_$dbg("BCRMMobileActions.ButtonManager: " + pm.GetObjName() + " : " + m);
			}catch(e){
				//do nothing
			}
			var editbtn = $("#bcrm_edit_btn");
			var savebtn = $("#bcrm_save_btn");
			var plusbtn = $("#bcrm_plus_btn");
			var delbtn = $("#bcrm_del_btn");
			var spreadbtn = $("#bcrm_spread_btn");
			var utils = new SiebelAppFacade.BCRMMobileUtils();
			var la = SiebelApp.S_App.GetActiveView().GetApplet(utils.GetAppletsByType("list")[0]);
            var lapm = la.GetPModel();
			var count = lapm.Get("GetRecordSet").length;
			var fa;
			//Edit button state depends on list applet record set
			if (count == 0){
				$(editbtn).addClass("bcrm-inactive");
			}
			//last record deleted
			else if (count == 1 && m == "DeleteRecord" && !r.ReturnValue){
				$(editbtn).addClass("bcrm-inactive");
			}
			else{
				$(editbtn).removeClass("bcrm-inactive");
			}
			
			//Save button
			if (utils.GetAppletType(pm) == "form"){
				fa = SiebelApp.S_App.GetActiveView().GetApplet(pm.GetObjName());
				if(!fa.CanInvokeMethod("WriteRecord")){
					$(savebtn).addClass("bcrm-inactive");
				}
				else{
					$(savebtn).removeClass("bcrm-inactive");
				}
			}
			else{
				if(!la.CanInvokeMethod("WriteRecord")){
					$(savebtn).addClass("bcrm-inactive");
				}
				else{
					$(savebtn).removeClass("bcrm-inactive");
				}
			}
			
			//New button
			if(!la.CanInvokeMethod("NewRecord")){
				$(plusbtn).addClass("bcrm-inactive");
			}
			else{
				$(plusbtn).removeClass("bcrm-inactive");
			}
			//Delete button
			if(!la.CanInvokeMethod("DeleteRecord")){
				$(delbtn).addClass("bcrm-inactive");
			}
			else{
				$(delbtn).removeClass("bcrm-inactive");
			}
			//Expense Spread Button
			if(!la.CanInvokeMethod("OnSpreadRecord")){
				$(spreadbtn).addClass("bcrm-inactive");
			}
			else{
				$(spreadbtn).removeClass("bcrm-inactive");
			}
			
		};
        return BCRMMobileActions;
    }());
}
_$dbg("bcrm-mobile-actions.js loaded");
