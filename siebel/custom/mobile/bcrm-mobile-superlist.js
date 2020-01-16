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

/*bcrm-mobile-superlist.js
* BCRM Super List Conversion Utility
* DO NOT MODIFY THIS FILE!
*/
if (typeof(SiebelAppFacade.BCRMSuperListApplet) === "undefined")  {
    SiebelJS.Namespace("SiebelAppFacade.BCRMSuperListApplet");

    SiebelAppFacade.BCRMSuperListApplet = (function () {
        function BCRMSuperListApplet(options) {

        }

        BCRMSuperListApplet.prototype.Attach = function(a){
            var utils = new SiebelAppFacade.BCRMMobileUtils();
            var pm = utils.ValidateContext(a);
			var an = pm.GetObjName();
			_$dbg("BCRMSuperListApplet.Attach: " + an);
            pm.AttachPMBinding("ShowSelection",this.EnhanceListApplet,{sequence:false,scope:pm});
			pm.AddMethod("InvokeMethod",this.PreMethodHandler,{sequence:true,scope:pm});
			pm.AddMethod("InvokeMethod",this.PostMethodHandler,{sequence:false,scope:pm});
            //pm.GetRenderer().constructor.prototype.BindData = this.EnhanceListApplet;
        };
		BCRMSuperListApplet.prototype.PreMethodHandler = function (m,i,c,r){
			var an = this.GetObjName();
				var vn = SiebelApp.S_App.GetActiveView().GetName();
				var utils = new SiebelAppFacade.BCRMMobileUtils();
				var lskey = an + "_" + vn + "_ENHANCE";
				if (utils.GetViewType(vn) == "listview"){
					
				
			if (m == "NewRecord"){
				_$dbg("BCRMSuperListApplet.PreMethodHandler(listview): " + an + " : " + m);
				window.localStorage.setItem(lskey,"FALSE");
				SiebelAppFacade.BCRMSuperListApplet.prototype.EnhanceListApplet(this);
			}
			if (m == "WriteRecord"){
				_$dbg("BCRMSuperListApplet.PreMethodHandler(listview): " + an + " : " + m);
				window.localStorage.setItem(lskey,"TRUE");
				SiebelAppFacade.BCRMSuperListApplet.prototype.EnhanceListApplet(this);
			}
				}
		};
				BCRMSuperListApplet.prototype.PostMethodHandler = function (m,i,c,r){
			var an = this.GetObjName();
			var utils = new SiebelAppFacade.BCRMMobileUtils();
			
				var vn = SiebelApp.S_App.GetActiveView().GetName();
				
				var lskey = an + "_" + vn + "_ENHANCE";
			/*
			if (m == "PositionOnRow000"){
				var ph = this.Get("GetPlaceholder");
				var ae = utils.GetAppletElem(this);
				var tb = ae.find("table#" + ph);
				var id = i.GetProperty("SWER");
				var pr = this.GetRenderer();
				var st = tb.css("transform");
				//var iscroll = pr.GetGrid().data("Iscroll");
				//var s = "td#" + id + "_" + ph + "_SelectAll";
				
				setTimeout(function(){
					//iscroll.scrollToElement($(s)[0], 0, 0, true);
					tb.css("transform",st);
				},2000);
				
				
			 }
			 */
				if (utils.GetViewType(vn) == "listview"){
					
				
			if ( m == "UndoRecord"){
				_$dbg("BCRMSuperListApplet.PostMethodHandler(listview): " + an + " : " + m);
				window.localStorage.setItem(lskey,"TRUE");
				SiebelAppFacade.BCRMSuperListApplet.prototype.EnhanceListApplet(this);
			}
				}
		};
        BCRMSuperListApplet.prototype.EnhanceListApplet = function(a){
            var utils = new SiebelAppFacade.BCRMMobileUtils();
            var pm = null;
            if (typeof(a) === "undefined"){
                pm = this;
            }
            else{
                pm = utils.ValidateContext(a);
            }
			if (pm == null){
				pm = this;
			}
            var fi = pm.Get("GetFullId");
            var ad = $("#s_" + fi + "_div");
            $(ad).removeAttr("title");
            //var pr = pm.GetRenderer();
            var an = pm.GetObjName();
			_$dbg("BCRMSuperListApplet.EnhanceListApplet: " + an);
            var ap = SiebelApp.S_App.GetActiveView().GetApplet(an);
            var bc = ap.GetBusComp().GetName();
            var cfgdata = BCRMSLIConf[an];
            if (typeof(cfgdata) === "undefined"){
                cfgdata = BCRMSLIConf["BC_" + bc];
            }
            if (typeof(cfgdata) === "undefined"){
                cfgdata = BCRMSLIConf["default"];
            }
            var isHome = false;
            var vn = SiebelApp.S_App.GetActiveView().GetName();
            if (vn.indexOf("Home") > -1){
                isHome = true;
            }
            var isQuery = false;
            if (ap.IsInQueryMode()){
                isQuery = true;
            }
            //var that = this;
            if (!isQuery && !isHome && typeof(cfgdata) !== "undefined"){

                var top = cfgdata.top;
                var mid = cfgdata.center;
                var bot = cfgdata.bottom;
                var img = cfgdata.img;
                //var dd = cfgdata.drilldown;
                var pop = cfgdata.popup;
				var act = cfgdata.action;
                var ph = pm.Get("GetPlaceholder");
                var ae = utils.GetAppletElem(pm);
                var el = $("#" + ph);
                var rs = pm.Get("GetRecordSet");
                var lskey = an + "_" + vn + "_ENHANCE";
                //add toggle button
                if ($(ae).find("#bcrm_sli_toggle").length == 0){
                    //$(ae).first(".AppletButtons").prepend("<div id='bcrm_sli_toggle'></div>");
                    $(ae).find(".siebui-applet-header").prepend("<div id='bcrm_sli_toggle'></div>");

                    $(ae).find("#bcrm_sli_toggle").on("click",function(e){
                        if (window.localStorage.getItem(lskey) == "TRUE"){
                            window.localStorage.setItem(lskey,"FALSE");

                        }
                        else if (window.localStorage.getItem(lskey) == "FALSE"){
                            window.localStorage.setItem(lskey,"TRUE");
                        }
                        else{
                            window.localStorage.setItem(lskey,"FALSE");

                        }
                        if (typeof(SiebelApp.OfflineAppSettings) !== "undefined" && SiebelApp.OfflineAppSettings.GetMode() == true){
                            SiebelApp.S_App.GotoView(vn);
                        }
                        else{
                            pm.ExecuteMethod("InvokeMethod","ExecuteQuery");
                        }
                    });
                }

                if (window.localStorage.getItem(lskey) == "TRUE" || window.localStorage.getItem(lskey) == null){
					_$dbg("BCRMSuperListApplet.EnhanceListApplet: Enhancing");
                    $(ae).find("#bcrm_sli_toggle").removeClass("bcrm-sli-toggle-super");
                    $(ae).find("#bcrm_sli_toggle").addClass("bcrm-sli-toggle-list");
                }
                else{
					_$dbg("BCRMSuperListApplet.EnhanceListApplet: Resetting");
                    $(ae).find("#bcrm_sli_toggle").removeClass("bcrm-sli-toggle-list");
                    $(ae).find("#bcrm_sli_toggle").addClass("bcrm-sli-toggle-super");
                    $("#" + ph + "d").find("thead").show();
                    $(ae).find(".bcrm-sli-ct").remove();
                    for (i = 0; i < rs.length; i++){
                        var id = i + 1;
                        var row = $(ae).find("tr#" + id);
                        $(row).removeClass("bcrm-sli-row");
                        $(row).find("td.bcrm-sli-fc").remove();
                        $($(row).find("td")[0]).hide();
                        for (var j = 1; j < $(row).find("td").length; j++){
                            $($(row).find("td")[j]).show();
                        }
                    }
                }

                if (window.localStorage.getItem(lskey) == "TRUE" || window.localStorage.getItem(lskey) == null){
                    $("#" + ph + "d").find("thead").hide();


					var rslen = rs.length;
					_$dbg("BCRMSuperListApplet.EnhanceListApplet: Record Set size: " + rslen);
                    for (i = 0; i < rslen; i++){

                        
                        var top_display = SiebelAppFacade.BCRMSuperListApplet.prototype.GetDisplayValues(top,i,pm);
                        var mid_display = SiebelAppFacade.BCRMSuperListApplet.prototype.GetDisplayValues(mid,i,pm);
                        var bot_display = SiebelAppFacade.BCRMSuperListApplet.prototype.GetDisplayValues(bot,i,pm);

                        var ni = SiebelAppFacade.BCRMSuperListApplet.prototype.GetDisplayValues(img,i,pm);
						//_$dbg("BCRMSuperListApplet.GetDisplayValues: done");
                        var id = i + 1;
                        var row = $(el).find("tr#" + id);
                        //$(row).prepend("<td class='bcrm-sli-fc'>");
						$(row).append("<td class='bcrm-sli-fc'>");
                        var fc = $(row).find("td")[0];
                        var cssHSL = "";
                        //image icon

                        //random icon background color
                        if (img[0] != "function"){

                            cssHSL = "hsl(" + 360 * Math.random() + ',' +
                                (25 + 70 * Math.random()) + '%,' +
                                (50 + 10 * Math.random()) + '%)';

                            $(fc).html("<div class='bcrm-sli-ct'><div class='bcrm-sli-img' id='" + i + "'><p>" + ni + "</p></div><div class='bcrm-sli-dat'></div></div>");
                            $(fc).find(".bcrm-sli-img").css("background-color",cssHSL);


                            if (typeof(rs[i]["SSA Primary Field"]) !== "undefined"){
                                  if (rs[i]["SSA Primary Field"] == "Y"){
                                      $(fc).find(".bcrm-sli-img").addClass("bcrm-img-primary");
                                  }
                            }
                            if (pop[0] != "none"){
                                $(fc).find(".bcrm-sli-img").on("click",function(e){
                                    if (pop[0] == "form"){

                                        var id = $(this).attr("id");
                                        var dt =  $(SiebelAppFacade.BCRMSuperListApplet.prototype.GetDisplayValues(top,parseInt(id),pm)[0]).text();
                                        var form = utils.GetAppletElem(pop[1]);
                                        $(form).find(".siebui-applet-header").hide();
                                        $(form).dialog({
                                            title: dt,
                                            buttons:[{
                                                text: "Toggle Controls",
                                                click: function(e) {
                                                    $(form).find(".siebui-applet-header").toggle();
                                                }
                                            }]
                                        });
                                    }
									if (pop[0] == "function"){
										if(pop[1] == "MultiSelect"){
											//add "Select All" button
											//var sall = $("<div>All</div>");
											//ae.find(".siebui-popup-filter").prepend(sall);
										}
										SiebelAppFacade.BCRMSuperListApplet.prototype[pop[1]].call(this,pm,i,e);
									}
                                });
                            }
                        }
						
                        else{
                            $(fc).html("<div class='bcrm-sli-ct'><div class='bcrm-sli-img bcrm-custom-img'></div><div class='bcrm-sli-dat'></div></div>");
                            $(fc).find(".bcrm-sli-img").append(ni);
                        }


                        //first row
                        $(fc).find(".bcrm-sli-dat").append("<div class='bcrm-sli-top'>");
                        for (var k = 0; k < top_display.length; k++){
                            $(fc).find(".bcrm-sli-top").append(top_display[k]);
                        }

                        //second row
                        $(fc).find(".bcrm-sli-dat").append("<div class='bcrm-sli-mid'>");
                        for (var l = 0; l < mid_display.length; l++){
                            $(fc).find(".bcrm-sli-mid").append(mid_display[l]);
                        }
                        //third row
                        $(fc).find(".bcrm-sli-dat").append("<div class='bcrm-sli-bot'>");
                        for (var m = 0; m < bot_display.length; m++){
                            $(fc).find(".bcrm-sli-bot").append(bot_display[m]);
                        }

                        var tt = new Array();
                        var ct = pm.Get("GetControls");
                        var dn = "";
                        for (dat in rs[i]){
                            if (dat != "SelectAll"){
                            if (rs[i][dat] != ""){
                                dn = dat;
                                if (typeof(ct[dat]) !== "undefined"){
                                    dn = ct[dat].GetDisplayName();
                                }
                                tt.push(dn + ": " + rs[i][dat]);
                            }
							}

                        }
                        tt = tt.join("<br>");
                        $(fc).find(".bcrm-sli-img").attr("title",tt);
                        $(fc).css({"text-align":"left","display":"table-cell"});

                        $(row).addClass("bcrm-sli-row");
						//if (pm.GetObjName() != "Employee Assoc Applet"){
							for (j = 1; j < $(row).find("td").length; j++){
								$($(row).find("td")[j]).hide();
							}
						//}
						//default double tap to drilldown
						try{
						if (typeof(BCRMHammer.Manager) !== "undefined"){
							var hrow = $(fc).find(".bcrm-sli-dat")[0];
							var hdtap = new BCRMHammer.Manager(hrow);
							hdtap.add(new BCRMHammer.Tap({event:"doubletap",taps:2}));
							BCRMHammer(hrow).off("tap");
							hdtap.on("doubletap",function(e){
								if (typeof(act) !== "undefined"){
									if(act[0] == "function"){
										SiebelAppFacade.BCRMSuperListApplet.prototype[act[1]].call(this,pm,i,e);
									}
								}
								else{
									$($(e.target).parent().find("a")[0]).click();
								}
							});
						}
						}
						catch(e){
							console.log("BCRMSuperListApplet: " + e.toString());
						}
                    }
                }
            }
            //if (typeof(SiebelApp.OfflineAppSettings) !== "undefined" && SiebelApp.OfflineAppSettings.GetMode() == true){
            if (!isHome && !isQuery){
                var pr = pm.GetRenderer();
                var gr = pr.GetGrid();
                if ($(gr).parent().height() <= 100){
                    var mult = rs.length <= 5 ? rs.length : 5;
                    $(gr).parents(".ui-jqgrid-bdiv").height((mult*64)+64);
                }
            }
            //}
			if (utils.GetViewType() == "detailview"){
				$(ae).find(".siebui-applet-header").attr("id","bcrm-adv");
				$(ae).find(".siebui-applet-header").attr("bcrm-adv","yes");
				 //$(ae).find(".siebui-applet-header").attr("style","display:none!important");
				 if (sessionStorage.BCRMADVANCEDMODE != "true"){
					$(ae).find(".siebui-applet-header").addClass("bcrm-forcehide");
				 }
			}
        };
		
		BCRMSuperListApplet.prototype.PopDetails = function(pm,idx){
			var html = $("<div class='bcrm-popdetails'>");
			html.html($(this).attr("title"));
			html.dialog({
				title: "Details",
				buttons:[{
                    text: "OK",
					class: "appletButton",
					click: function(e) {
                        $(this).dialog("destroy");
                    }
                }]
			});
		};
		BCRMSuperListApplet.prototype.MultiSelect = function(pm,idx,e){
			e.stopImmediatePropagation();
			// try simulate Siebel framework
			var ap = SiebelApp.S_App.GetActiveView().GetActiveApplet();
			var ip = SiebelApp.S_App.NewPropertySet();
			ip.SetProperty("SWER",$(this).attr("id"));
			ap.InvokeMethod("PositionOnRow100",ip);
		};
		
		BCRMSuperListApplet.prototype.InvokePick = function(pm,idx,e){
			e.pointers[0].stopImmediatePropagation();
			// try simulate Siebel framework
			var ap = SiebelApp.S_App.GetActiveView().GetActiveApplet();
			ap.InvokeMethod("PickRecord");
		};
		
        BCRMSuperListApplet.prototype.GetDisplayValues = function(cfg,idx,a){
			
            var retval = "";
            var temp = new Array();
            var utils = new SiebelAppFacade.BCRMMobileUtils();
            var pm = utils.ValidateContext(a);
            var ph = pm.Get("GetPlaceholder");
            var rs = pm.Get("GetRecordSet");
            var r = rs[idx];
            var rrs = pm.Get("GetRawRecordSet");
            var rr = rrs[idx];
            var el = $("#" + ph);
            var row = $(el).find("tr#" + (idx+1));
            var pr = pm.GetRenderer();
            var ch = pr.GetColumnHelper();
            var cm = ch.GetColMap();
            var cf = ch.GetColField();
            var sep = "";
            var seps = [];
            var ini = 1;
            var sc = 0;
            if (cfg.length > 0){
                switch (cfg[0]){
                    case "concat" :
                        //sep = cfg[1];
                        //debugger;
                        for (var si = 1; si < cfg.length; si += 2){
                            seps.push(cfg[si]);
                        }

                        for (var j = 2; j < cfg.length; j += 2){
                            var ctmp = "";
                            sep = seps[sc];
                            sc++;
                            var field = cfg[j];
                            var value = r[field];
                            if (value == "" || typeof(value) === "undefined"){
                                value = rr[field];
                            }
                            if (value != ""){

                                var ddc;
                                //check drilldown

                                var ci = "";
                                for (col in cf){
                                    if (col == field){
                                        ctmp = cf[col];
                                        break;
                                    }
                                }
                                for (col2 in cm){
                                    if (cm[col2] == ctmp){
                                        ci = col2;
                                        break;
                                    }
                                }

                                var cl = $(row).find("td#" + (idx+1) + "_" + ph + "_" + ci);
                                //var ct = $("<div class='bcrm-sli-dat'>");
                                //IP 15 (dev web client) fix
                                if (SIEBEL_BUILD == "23048/scripts/"){
                                    cl =  $(row).find("td#" + (idx+1) + ci);
                                }
                                if ($(cl).find("a").length > 0){
                                    var dd = $(cl).find("a").clone();
									if (dd.text() != value){
										dd.text(value);
									}
									//var dd = $(cl).find("a").detach();
                                    ddc = $("<div class='bcrm-sli-dr'>");
                                    //$(ddc).find("a").text(value);
                                    $(ddc).prepend(dd);

                                }
                                else if ($(cl).find("img").length > 0){
                                    var di =  $(cl).find("img").clone();
									//var di =  $(cl).find("img").detach();
                                    ddc = $("<div class='bcrm-sli-icon'>");
                                    $(ddc).append(di);
                                }
                                //smart phone number
                                else if (sep.indexOf("phone") > -1 || ci.toLowerCase().indexOf("phone") > -1 || field.toLowerCase().indexOf("phone") > -1){
                                    var pl = $("<a href='tel:" + value + "'>" + value + "</a>");
                                    ddc = $("<div class='bcrm-sli-phone'>");
                                    $(ddc).append(pl);
                                }
                                else if (sep.indexOf("map") > -1){
                                    var ml = $("<a href='" + BCRMGetMsg("GMAPURL") + value + "' target='_blank'>" + value + "</a>");
                                    ddc = $("<div class='bcrm-sli-map'>");
                                    $(ddc).append(ml);
                                }
                                else{
                                    ddc = $("<div class='bcrm-sli-txt'>");
                                    $(ddc).text(value);
                                }
                                var dds = "";
                                if (j < cfg.length-1){
                                    dds = $("<div class='bcrm-sli-sep'>" + sep + "</div>");
                                    temp.push(dds);
                                }
                                temp.push(ddc);


                            }
                        }

                        if ($($(temp[temp.length-1])[0]).attr("class") != "bcrm-sli-sep"){
                            sep = seps[sc];
                            dds = $("<div class='bcrm-sli-sep'>" + sep + "</div>");
                            temp.push(dds);
                        }
                        retval = temp;
                        break;

                    case "columns" :
                        //debugger;
                        seps = [];
                        sc = 0;
                        //sep = cfg[1];
                        for (var si = 1; si < cfg.length; si += 2){
                            seps.push(cfg[si]);
                        }
                        for (var n = 2; n < cfg.length; n += 2){
                            ctmp = "";
                            sep = seps[sc];
                            sc++;
                            var cn = parseInt(cfg[n]);
                            if (typeof(cm["SelectAll"]) !== "undefined"){
                                cn += 1;
                            }
                            var cc = 1;
                            var field = "";
                            var ci = "";
                            for (var col in cm){
                                if (cc == cn){
                                    field = cm[col];
                                    ci = col;
                                }
                                cc++;
                            }

                            var value = "";
                            if (ci != ""){
                                value = r[field];
                            }

                            if (value == "" || typeof(value) === "undefined"){
                                value = rr[field];
                            }
                            if (value != ""){//
                                if (typeof(value) !== "undefined"){

                                    var ddc;
                                    //check drilldown
                                    //var ci = "";

                                    var cl = $(row).find("td#" + (idx+1) + "_" + ph + "_" + ci);
                                    //IP 15 (dev web client) fix
                                    if (SIEBEL_BUILD == "23048/scripts/"){
                                        cl =  $(row).find("td#" + (idx+1) + ci);
                                    }
                                    //var ct = $("<div class='bcrm-sli-dat'>");
                                    if ($(cl).find("a").length > 0){
                                        var dd = $(cl).find("a").clone();
										if (dd.text() != value){
										dd.text(value);
									}
										//var dd = $(cl).find("a").detach();
                                        ddc = $("<div class='bcrm-sli-dr'>");
                                        //$(ddc).find("a").text(value);
                                        $(ddc).prepend(dd);

                                    }
                                    else if ($(cl).find("img").length > 0){
                                        var di =  $(cl).find("img").clone();
										//var di =  $(cl).find("img").detach();
                                        ddc = $("<div class='bcrm-sli-icon'>");
                                        $(ddc).append(di);
                                    }
                                    //smart phone number
                                    else if (sep.indexOf("phone") > -1 || ci.toLowerCase().indexOf("phone") > -1 || field.toLowerCase().indexOf("phone") > -1){
                                        var pl = $("<a href='tel:" + value + "'>" + value + "</a>");
                                        ddc = $("<div class='bcrm-sli-phone'>");
                                        $(ddc).append(pl);
                                    }
                                    else{
                                        ddc = $("<div class='bcrm-sli-txt'>");
                                        $(ddc).text(value);
                                    }
                                    var dds = "";
                                    if (n < cfg.length-1){
                                        dds = $("<div class='bcrm-sli-sep'>" + sep + "</div>");
                                        temp.push(dds);
                                    }
                                    temp.push(ddc);


                                }
                            }
                        }

                        if ($($(temp[temp.length-1])[0]).attr("class") != "bcrm-sli-sep"){
                            sep = seps[sc];
                            dds = $("<div class='bcrm-sli-sep'>" + sep + "</div>");
                            temp.push(dds);
                        }
                        retval = temp;
                        break;

                    case "field" : retval = r[cfg[1]];
                        break;
                    case "initials" : sep = cfg[1];
                        inis = cfg[2];
                        inie = cfg[3];
                        for (var j = 4; j < cfg.length; j++){
                            if (isNaN(parseInt(cfg[j]))){
                                if (rr[cfg[j]] != ""){
                                    temp.push(rr[cfg[j]].substring(inis,inie));
                                }
                            }
                            else{
                                var cni = parseInt(cfg[j]);
                                if (typeof(cm["SelectAll"]) !== "undefined"){
                                    cni += 1;
                                }
                                var fieldi = "";
                                var cci = 1;
                                for (coli in cm){
                                    if (cci == cni){
                                        fieldi = cm[coli];
                                    }
                                    cci++;
                                }
                                if (typeof(rr[fieldi]) !== "undefined"){
                                    temp.push(rr[fieldi].substring(inis,inie));
                                }
                                else{
                                    temp.push("");
                                }

                            }
                        }
                        retval = temp.join(sep);
                        break;
                    case "function" : retval = SiebelAppFacade.BCRMSuperListApplet.prototype[cfg[1]].call(this,pm,idx);
                        break;
                    default: break;
                }

            }
            return retval;
        };

        BCRMSuperListApplet.prototype.OpptyIcon = function(pm,idx){

            var rs = pm.Get("GetRawRecordSet");
            var rev = rs[idx]["Primary Revenue Amount"];
            rev = abbreviateNumber(parseInt(rev));
            var prob = rs[idx]["Primary Revenue Win Probability"];
            //background-image: -webkit-linear-gradient(bottom, #FFD51A 50%, #FAC815 50%);
            //#55a0df 10%, #c5d2dd 10%)
            var bgstyle = "background-image: -webkit-linear-gradient(bottom, #55a0df ";
            bgstyle += parseInt(prob);
            bgstyle += "%, #c5d2dd ";
            bgstyle += parseInt(prob);
            bgstyle += "%)";
            var temp = $("<div data-bcrm='custom' class='bcrm-sli-rev' style='" + bgstyle + "'><p>" + rev + "</p></div>");

            return temp;
        };

 BCRMSuperListApplet.prototype.ActivityTime = function(pm,idx){
            //debugger;
            var rs = pm.Get("GetRawRecordSet");

            var st = rs[idx]["Planned"];
            var sts = "";
            if (typeof(st) !== "undefined"){
                if (st != ""){
                    var std = new Date(st);
                    sts = std.toLocaleString();
                }
            }


            var en = rs[idx]["Planned Completion"];
            var ens = "";
            if (typeof(en) !== "undefined"){
                if (en != ""){
                    var end = new Date(en);
                    ens = end.toLocaleString();
                }
            }

            if (sts != ""){
                sts = std.getHours() + ":" + ("0" + std.getMinutes()).slice(-2) + (typeof(sts.split(" ")[2]) === "undefined" ? "" : (" " + sts.split(" ")[2])) ;
            }

            if (ens != ""){
                if (std.toLocaleDateString() != end.toLocaleDateString()){
                    ens = end.toLocaleDateString() + " " + end.getHours() + ":" + ("0" + end.getMinutes()).slice(-2) + (typeof(ens.split(" ")[2]) === "undefined" ? "" : (" " + ens.split(" ")[2])) ;
                }
                else{
                    ens = end.getHours() + ":" + ("0" + end.getMinutes()).slice(-2) + (typeof(ens.split(" ")[2]) === "undefined" ? "" : (" " + ens.split(" ")[2])) ;
                }

            }

            return $("<div data-bcrm='custom' class='bcrm-sli-time'>" + sts + (ens != "" ? "-" : "") + ens + "</div>");
        };

        BCRMSuperListApplet.prototype.CalendarIcon = function(pm,idx){
            var rs = pm.Get("GetRawRecordSet");
            var st = rs[idx]["Planned"];
            if (typeof(st) === "undefined"){
                st = rs[idx]["Due"];
            }
            if (typeof(st) === "undefined"){
                st = "";
            }
            var dtime = "";
            var dayw = "";
            var monthy = "";
            var dayn = "";
            if (st != ""){
                var dt = new Date(st);
                dtime = dt.toISOString().substring(0,10);;
                dayw = dt.toUTCString().substring(0,3);
                monthy = dt.toLocaleString("en",{month:"short"}) + " '" + dt.getFullYear().toString().substring(2,4);
                dayn = dt.getDate();
            }

            var ic = $("<div data-bcrm='custom' class='bcrm-sli-calc'></div>");
            var icon = $("<time datetime='" + dtime + "' class='bcrm-sli-calicon'><em>" + dayw + "</em><strong>" + monthy + "</strong><span>" + dayn + "</span></time>");
            $(ic).append(icon);
            return ic;

        };

        function abbreviateNumber(number) {
            var SI_POSTFIXES = ["", "k", "M", "G", "T", "P", "E"];
            var tier = Math.log10(Math.abs(number)) / 3 | 0;
            if(tier == 0) return number;
            var postfix = SI_POSTFIXES[tier];
            var scale = Math.pow(10, tier * 3);
            var scaled = number / scale;
            var formatted = scaled.toFixed(1) + '';
            if (/\.0$/.test(formatted))
                formatted = formatted.substr(0, formatted.length - 2);
            return formatted + postfix;
        }

        return BCRMSuperListApplet;
    }());
}
_$dbg("bcrm-mobile-superlist.js loaded");