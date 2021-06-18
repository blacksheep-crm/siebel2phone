/*blacksheep IT consulting Copyright
* Copyright (C) 2016 - 2021

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"),
to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software,
and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/
if (typeof (SiebelAppFacade.BCRMQuerySrchSpecEnhancerPW) === "undefined") {

    SiebelJS.Namespace("SiebelAppFacade.BCRMQuerySrchSpecEnhancerPW");
    define("siebel/custom/mobile/BCRMQuerySrchSpecEnhancerPW", [],
        function () {
            SiebelAppFacade.BCRMQuerySrchSpecEnhancerPW = (function () {

                function BCRMQuerySrchSpecEnhancerPW(pm) {
                    SiebelAppFacade.BCRMQuerySrchSpecEnhancerPW.superclass.constructor.apply(this, arguments);
                }

                SiebelJS.Extend(BCRMQuerySrchSpecEnhancerPW, SiebelAppFacade.FieldPW);

                BCRMQuerySrchSpecEnhancerPW.prototype.ShowUI = function () {
					_$dbg("BCRMQuerySrchSpecEnhancerPW.ShowUI");
                    //SiebelJS.Log("BCRMQuerySrchSpecEnhancerPW:      ShowUI method reached.");
                    SiebelAppFacade.BCRMQuerySrchSpecEnhancerPW.superclass.ShowUI.apply(this, arguments);
                    var ispopup = false;
                    var pm = this.control.GetApplet().GetPModel();
                    var pr = pm.GetRenderer();
                    var objName = pm.GetObjName();
                    var bo = SiebelApp.S_App.GetActiveBusObj().GetName();
					if (typeof(BCRMPopupNoSearch[objName]) !== "undefined"){
						ispopup = true;
					}
                    if (!ispopup){
                        var cb = pm.Get("GetControls")["QueryComboBox"];
                        if (typeof(cb) === "undefined"){
                            cb = pm.Get("GetControls")["PopupQueryCombobox"];
                        }
                        if (typeof(cb) !== "undefined"){
                            var cbe = pr.GetUIWrapper(cb).GetEl();
                        }

                        var that = this;
                        var pwEl = this.GetEl(); //get DOM element for current control

                        if (pwEl && pwEl.length) {
                            //create date control
                            var dct = $("<input type='date' id='bcrm_date_ctl'>"); //value (not display) format is ALWAYS yyyy-mm-dd
                            $(pwEl).before(dct);
                            $(dct).hide();
                            $(dct).on("change",function(e){
                                var nd = this.value.split("-");
                                //var nv = ("0" + nd.getDate()).slice(-2) + "/" + ("0" + (nd.getMonth()+1)).slice(-2) + "/" + nd.getFullYear();
                                //var nv = ("0" + (nd.getMonth()+1)).slice(-2) + "/" + ("0" + nd.getDate()).slice(-2) + "/" + nd.getFullYear();
                                var nv = nd[1] + "/" + nd[2] + "/" + nd[0];
                                that.SetValue("'" + nv + "'");
                                pwEl.blur();
                                //pm.ExecuteMethod("InvokeMethod","Find");
                            });

                            //cool bombobox
                            var bcb = $("<select id='bcrm_bool_ctl'><option value='*' selected='selected'></option><option value='Y'>Yes</option><option value='N'>No</option></select>");
                            $(pwEl).before(bcb);
                            $(bcb).hide();
                            $(bcb).on("change",function(e){
                                that.SetValue($(this).val());
                                pwEl.blur();
                            });
                        }
                    }
                };

                BCRMQuerySrchSpecEnhancerPW.prototype.BindEvents = function () {
                    //SiebelJS.Log("BCRMQuerySrchSpecEnhancerPW:      BindEvents method reached.");
					_$dbg("BCRMQuerySrchSpecEnhancerPW.BindEvents");
                    SiebelAppFacade.BCRMQuerySrchSpecEnhancerPW.superclass.BindEvents.apply(this, arguments);
					
					try{
					

                    var ispopup = false;

                    var pm = this.control.GetApplet().GetPModel();
                    var pr = pm.GetRenderer();
                    var afi = pm.Get("GetFullId");
                    var ae = $("#s_" + afi + "_div");
                    var savedscol = "";
                    var savedsval = "";
					var ctrls = pm.Get("GetControls");
                        var cb = ctrls["QueryComboBox"];
                        if (typeof(cb) === "undefined"){
                            cb = ctrls["PopupQueryCombobox"];
                        }
                        if (typeof(cb) !== "undefined"){
                            var cbe = pr.GetUIWrapper(cb).GetEl();
                        }

                        var pqe = ctrls["PopupQueryExecute"];
                        if (typeof(pqe) !== "undefined"){
                            var pqel = pr.GetUIWrapper(pqe).GetEl();
                        }
                    var objName = pm.GetObjName();
					var that = this;
					//smart list for popups, we are high-jacking the PW here
					if (typeof(BCRMSLIConf[objName]) !== "undefined"){
						if (BCRMSLIConf[objName].ispopup){
							
							var sli = new SiebelAppFacade.BCRMSuperListApplet();
							ae.find(".ui-jqgrid-bdiv").addClass("bcrm-popup");
							ae.closest(".ui-dialog").addClass("bcrm-popup");
							ae.find(".siebui-popup-btm").addClass("bcrm-popup");
							ae.find("#sieb-ui-popup-mvg-available").addClass("bcrm-popup");
							//ae.find("button:contains(Show Available)").addClass("bcrm-mvg-avail");
							sli.Attach(pm);
							sli.EnhanceListApplet(pm);
							
						if (BCRMSLIConf[objName]["popup"][1] == "MultiSelect"){
							if (typeof(cbe) !== "undefined"){
								var sabtn = $("<button type='button' id='bcrm_select_all' class='bcrm-select-all' bcrm-method='SelectAll'>");
								if (cbe.parent().find("#bcrm_select_all").length == 0){
									cbe.before(sabtn);
									sabtn.on("click",function(e){
									var m = $(this).attr("bcrm-method");
									that.control.GetApplet().InvokeMethod(m);
									if (m == "SelectAll"){
										$(this).attr("bcrm-method","PositionOnRow000");
										//$(this).text("Unselect");
									}
									if (m == "PositionOnRow000"){
										$(this).attr("bcrm-method","SelectAll");
										//$(this).text("Select All");
									}
									
								});
								}
							}
						}
						}
						if (typeof(BCRMPopupNoSearch[objName]) !== "undefined"){
							ispopup = true;
							if (window.innerWidth <= 991){
							var otarget = document.querySelector("#s_" + afi + "_div");
							var bobserver = null;
							bobserver = new MutationObserver(function(mutations) {
								var pt = ae.parent().parent().parent().parent();
								if ($(mutations[0].target).hasClass("NotSelected")){
									//switching to Assoc applet
									pt.find("button[title*='Available']").attr("title","Show Selected");
								}
								else{
									pt.find("button[title*='Selected']").attr("title","Show Available");
								}
								pt.find("button[title*='Available']").addClass("bcrm-shuttle");
								pt.find("button[title*='Available']").addClass("bcrm-shuttle-available");
								pt.find("button.siebui-icon-deleterecords").text("");
								pt.find("button.siebui-icon-deleterecords").addClass("bcrm-shuttle");
								pt.find("button.siebui-icon-deleterecords").addClass("bcrm-shuttle-del");
								pt.find("button.siebui-icon-deleteallrecords").text("");
								pt.find("button.siebui-icon-deleteallrecords").addClass("bcrm-shuttle");
								pt.find("button.siebui-icon-deleteallrecords").addClass("bcrm-shuttle-delall");
								pt.find("button.siebui-icon-closeapplet").text("");
								pt.find("button.siebui-icon-closeapplet").addClass("bcrm-shuttle");
								pt.find("button.siebui-icon-closeapplet").addClass("bcrm-shuttle-close");
								pt.find("button.siebui-icon-addrecords").text("");
								pt.find("button.siebui-icon-addrecords").addClass("bcrm-shuttle");
								pt.find("button.siebui-icon-addrecords").addClass("bcrm-shuttle-add");
                            });

                                
                            bobserver.observe(otarget,{attributes:true});
							}
						}
						var utils = new SiebelAppFacade.BCRMMobileUtils();
						utils.Beautifier(objName);
					}
					else{
						ae.find(".ui-jqgrid-bdiv").removeClass("bcrm-popup");
						ae.closest(".ui-dialog").removeClass("bcrm-popup");
						ae.find(".siebui-popup-btm").removeClass("bcrm-popup");
						ae.find("#sieb-ui-popup-mvg-available").removeClass("bcrm-popup");
						var pt = ae.parent().parent().parent().parent();
						pt.find("button[title*='Available']").removeClass("bcrm-shuttle");
						pt.find("button[title*='Available']").removeClass("bcrm-shuttle-available");
						pt.find("button.siebui-icon-deleterecords").removeClass("bcrm-shuttle");
						pt.find("button.siebui-icon-deleterecords").removeClass("bcrm-shuttle-del");
						pt.find("button.siebui-icon-deleteallrecords").removeClass("bcrm-shuttle");
						pt.find("button.siebui-icon-deleteallrecords").removeClass("bcrm-shuttle-delall");
						pt.find("button.siebui-icon-closeapplet").removeClass("bcrm-shuttle");
						pt.find("button.siebui-icon-closeapplet").removeClass("bcrm-shuttle-close");
						pt.find("button.siebui-icon-addrecords").removeClass("bcrm-shuttle");
						pt.find("button.siebui-icon-addrecords").removeClass("bcrm-shuttle-add");
					}
					
					

                    if (!ispopup){
                        

                        //beta: re-wire Find button
                        var findbtn = pr.GetUIWrapper(ctrls["PopupQueryExecute"]).GetEl();
                        var newfb = $("<button type='button' class='siebui-icon-find' id='bcrm_find_btn'>");
                        if ($(ae).find("#bcrm_find_btn").length == 0){
                            $(findbtn).after(newfb);
                        }
                        $(findbtn).addClass("custom-hidden");
                        $(newfb).on("click",function(e){
                            $(findbtn).click();
                        });



                        var prefix = "*"; //we can get this from Applet User Prop if we want
                        var suffix = "*";
						var sconf;
						var sdef = "";
						//get default search settings from applet conf
						if (typeof(BCRMSLIConf[objName]) !== "undefined"){
							if (typeof(BCRMSLIConf[objName].search) !== "undefined"){
								sconf = BCRMSLIConf[objName].search;
							}
						}	
						if (typeof(sconf) === "undefined"){
							var bcn = "BC_" + pm.Get("GetBusComp").GetName();
							if (typeof(BCRMSLIConf[bcn]) !== "undefined"){
							if (typeof(BCRMSLIConf[bcn].search) !== "undefined"){
								sconf = BCRMSLIConf[bcn].search;
							}
						}	
						}	
						if (typeof(sconf) !== "undefined"){
							sdef = sconf[1];
							//prefix = sconf[0];
							//suffix = sconf[2];
						}	
                        var pwEl = this.GetEl(); //get DOM element for current control
                        var ch = pr.GetColumnHelper();
                        var cm = ch.GetColMap();
                        var cc = ch.GetColControl();

                        //show more button
                        $(ae).find(".siebui-icon-bttns_more").parent().parent().on("click",function(e){
                            var sval = $(pwEl).val();
                            var scol = $(cbe).val();

                            pm.SetProperty("bcrm_current_search",scol + "__" + sval);

                        });
                        $(ae).find(".siebui-icon-bttns_less").parent().parent().on("click",function(e){
                            var sval = $(pwEl).val();
                            var scol = $(cbe).val();

                            pm.SetProperty("bcrm_current_search",scol + "__" + sval);

                        });

                        if (pwEl && pwEl.length) {

                            var sf = "";
                            if (typeof(pm.Get("bcrm_current_search")) !== "undefined"){
                                if (pm.Get("bcrm_current_search") != ""){
                                    savedscol = pm.Get("bcrm_current_search").split("__")[0];
                                    savedsval = pm.Get("bcrm_current_search").split("__")[1];
                                }
                            }
                            
                            if (true){

                                var that = this;
                                pwEl.blur(function(e){
                                    $("#bcrm_find_btn").unbind("click");

                                    var nopp = ["bool","utcdatetime","date","currency","number"];
                                    var ap = that.control.GetApplet();
                                    var fm = ap.GetBusComp().GetFieldMap();
                                    var ctrls = pm.Get("GetControls");
                                    var pr = pm.GetRenderer();
                                    var findbtn = pr.GetUIWrapper(ctrls["PopupQueryExecute"]).GetEl();
                                    var cbeval = $(cbe).val();
                                    var cbef = "";
                                    for (colj in cc){
                                        if (cc[colj].GetDisplayName() == cbeval){
                                            cbef = cc[colj].GetFieldName();
                                            break;
                                        }
                                    }
                                    var dt = fm[cbef].GetDataType();
                                    if ($.inArray(dt,nopp) == -1){
										if (cbef != sdef){
											prefix = "*";
											suffix = "*";
										}
										else{
											prefix = sconf[0];
											suffix = sconf[2];
										}
                                    }

                                    else{
                                        prefix = "";
                                        suffix = "";
                                    }
                                    var curval = $(this).val();
									_$dbg("BCRMQuerySrchSpecEnhancerPW.Blur: " + cbeval + ":" + prefix + $(this).val() + suffix);
                                    if (dt.indexOf("date") == -1){
                                        if (curval.indexOf(prefix[0]) != 0 && curval != ""){
                                            //$(this).val(prefix + $(this).val() + suffix);
                                            that.SetValue(prefix + $(this).val() + suffix);
                                        }
                                    }
                                    ap.GetPModel().SetProperty("bcrm_current_search","");
                                    if (typeof($(e.relatedTarget).attr("class")) !== "undefined"){
                                        if ($(e.relatedTarget).attr("class").indexOf("siebui-icon-find") > -1){
                                            //Find Button was clicked
                                            //pm.ExecuteMethod("InvokeMethod","Find");
                                            $(findbtn).click();
                                            //ap.InvokeMethod("Find");
                                        }
                                        else{
                                            //ap.InvokeMethod("Find");
                                        }
                                    }
                                    else{
                                        //ap.InvokeMethod("Find");
                                        $(findbtn).click();
                                    }
                                    $("#bcrm_find_btn").on("click",function(e){
                                        $(findbtn).click();
                                    });
                                });


                            }



                            if (sf == ""){

                                //set first column as default selection
                                var firstcol;
                                for (col in cm){
                                    if (col != "SelectAll"){
                                        firstcol = col;
                                        break;
                                    }
                                }
						
                                var firstctrl = cc[firstcol];
                                var ch = pr.GetColumnHelper();
                                var ccs = ch.GetColControl();
                                var ap = this.control.GetApplet();
                                var fm = ap.GetBusComp().GetFieldMap();
                                var allcols = [];
                                for (ci in ccs){
                                    if (ci != "SelectAll"){
                                        allcols.push(ccs[ci].GetDisplayName());
                                    }
                                }
								if (sdef != ""){
									for (ci in ccs){ //loop through controls (displayed columns)
                                            if (ccs[ci].GetFieldName() == sdef){
                                                firstctrl = ccs[ci];
                                                break;
                                            }
                                        }
								}	
                                if (typeof(cbe) !== "undefined"){
                                    if (savedscol != ""){

                                        $(cbe).val(savedscol);
                                        $(pwEl).val(savedsval);
                                        for (ci in ccs){ //loop through controls (displayed columns)
                                            if (ccs[ci].GetDisplayName() == savedscol){
                                                fn = ccs[ci].GetFieldName();
                                                dt = fm[fn].GetDataType(); //get control data type
                                                break;
                                            }
                                        }
                                        if (savedscol == "Primary"){
                                            dt = "bool";
                                        }
                                        if (typeof(dt) !== "undefined" && dt.indexOf("date") >= 0){  //date control selected: show date picker
                                            $(ae).find("#bcrm_date_ctl").show();
                                            $(ae).find("#bcrm_bool_ctl").hide();
                                            if (savedsval != ""){
                                                var sda = savedsval.split("/");

                                                //var sdate = new Date(sda[0] + "/" + sda[1] + "/" + sda[2] + " 00:00:00");
                                                $(ae).find("#bcrm_date_ctl").val(sda[2] + "-" + sda[0] + "-" + sda[1]);
                                            }

                                            pwEl.addClass("custom-hidden");
                                        }
                                        else if (dt == "bool"){
                                            $(ae).find("#bcrm_bool_ctl").show();
                                            $(ae).find("#bcrm_bool_ctl").val("*");
                                            $(ae).find("#bcrm_date_ctl").hide();
                                            if (savedsval != ""){
                                                $(ae).find("#bcrm_bool_ctl").val(savedsval);
                                            }
                                            pwEl.addClass("custom-hidden");
                                        }
                                        else{ //back to normal
                                            $(ae).find("#bcrm_date_ctl").hide();
                                            $(ae).find("#bcrm_bool_ctl").hide();
                                            pwEl.removeClass("custom-hidden");
                                        }

                                    }
                                    else{
                                        var cbed = firstctrl.GetDisplayName();
                                        for (ci in ccs){ //loop through controls (displayed columns)
                                            if (ccs[ci].GetDisplayName() == cbed){
                                                fn = ccs[ci].GetFieldName();
                                                dt = fm[fn].GetDataType(); //get control data type
                                                break;
                                            }
                                        }
                                        $(cbe).val(cbed);
                                        if (cbed == "Primary"){
                                            dt = "bool";
                                        }
                                        if (typeof(dt) !== "undefined" && dt.indexOf("date") >= 0){  //date control selected: show date picker
                                            $(ae).find("#bcrm_date_ctl").show();
                                            $(ae).find("#bcrm_bool_ctl").hide();
                                            pwEl.addClass("custom-hidden");
                                        }
                                        else if (dt == "bool"){
                                            $(ae).find("#bcrm_bool_ctl").show();
                                            $(ae).find("#bcrm_bool_ctl").val("*");
                                            $(ae).find("#bcrm_date_ctl").hide();
                                            pwEl.addClass("custom-hidden");
                                        }
                                        else{ //back to normal
                                            $(ae).find("#bcrm_date_ctl").hide();
                                            $(ae).find("#bcrm_bool_ctl").hide();
                                            pwEl.removeClass("custom-hidden");
                                        }
                                    }
                                }
                            }

                            $(cbe).on("change",function(e,ui){

                                if ($(this).val() == ""){
                                    $(pwEl).val("");
                                    $(pwEl).attr("readonly","true");
                                    $(pwEl).attr("aria-readonly","true");
                                    $(pqel).attr("style","display:none!important;");

                                }
                            });

                            $(cbe).on( "autocompleteopen", function( event, ui ) {
                                $(this).autocomplete("option","source",allcols);
                            } );

                            $(cbe).on("autocompleteselect",function(e,ui){
                                var newval = ui.item.value;
                                if (newval != ""){
                                    $(pwEl).removeAttr("readonly");
                                    $(pwEl).attr("aria-readonly","false");
                                    $(pqel).show();
                                    $(pwEl).val("");
                                    var ch = pr.GetColumnHelper();
                                    var ccs = ch.GetColControl();
                                    var ap = SiebelApp.S_App.GetActiveView().GetActiveApplet();
                                    var fm = ap.GetBusComp().GetFieldMap();
                                    var fn = "";
                                    var qc;
                                    var dt;
                                    for (ci in ccs){ //loop through controls (displayed columns)
                                        if (ccs[ci].GetDisplayName() == newval){
                                            fn = ccs[ci].GetFieldName();
                                            dt = fm[fn].GetDataType(); //get control data type
                                            break;
                                        }
                                    }
                                    if (newval == "Primary"){
                                        dt = "bool";
                                    }
                                    if (typeof(dt) !== "undefined" && dt.indexOf("date") >= 0){  //date control selected: show date picker
                                        $(ae).find("#bcrm_date_ctl").show();
                                        $(ae).find("#bcrm_bool_ctl").hide();
                                        pwEl.addClass("custom-hidden");
                                    }
                                    else if (dt == "bool"){
                                        $(ae).find("#bcrm_bool_ctl").show();
                                        $(ae).find("#bcrm_bool_ctl").val("*");
                                        $(ae).find("#bcrm_date_ctl").hide();
                                        pwEl.addClass("custom-hidden");
                                    }
                                    else{ //back to normal
                                        $(ae).find("#bcrm_date_ctl").hide();
                                        $(ae).find("#bcrm_bool_ctl").hide();
                                        pwEl.removeClass("custom-hidden");
                                    }
                                }
                            });
                            if ($(cbe).val() == ""){
                                $(pwEl).val("");
                                $(pwEl).attr("readonly","true");
                                $(pwEl).attr("aria-readonly","true");
                                $(pqel).attr("style","display:none!important;");
                            }
                        }
						var that = this;
						setTimeout(function(){
							$(ae).find("input[aria-labelledby='PopupQuerySrchspec_Label']").focus();
						},500);
                    }
					}//end try
					catch(e){
						console.log(e.toString());
					}
                };//end BindEvents

                return BCRMQuerySrchSpecEnhancerPW;
            }()
                );

            SiebelApp.S_App.PluginBuilder.AttachPW(consts.get("SWE_CTRL_TEXT"), SiebelAppFacade.BCRMQuerySrchSpecEnhancerPW, function (control, objName) {
                    var retval = false;
                    if (SiebelApp.S_App.GetName() != ""){
                        if (control.GetName() == "QuerySrchSpec" || control.GetName() == "PopupQuerySrchspec"){
                            if (typeof(BCRMPopupNoSearch[objName]) === "undefined"){
								_$dbg("BCRMQuerySrchSpecEnhancerPW.AttachPW: " + objName + ":" + control.GetName());
                                retval = true;
                            }
                        }

                    }
                    return retval;
                }
            );
			SiebelApp.S_App.PluginBuilder.AttachPW(consts.get("SWE_CTRL_LABEL"), SiebelAppFacade.BCRMQuerySrchSpecEnhancerPW, function (control, objName) {
                    var retval = false;
                    if (typeof(BCRMPopupNoSearch[objName]) !== "undefined"){
						_$dbg("BCRMQuerySrchSpecEnhancerPW.AttachPW: " + objName + ":" + control.GetName());
						retval = true;
					}
					return retval;
                }
            );
			

            return "SiebelAppFacade.BCRMQuerySrchSpecEnhancerPW";
        })
}
_$dbg("bcrm-mobile-smartfind.js loaded");
