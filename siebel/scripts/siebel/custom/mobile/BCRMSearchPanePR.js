
var BCRMSearchPRConfig = {
        "Contacts":{
            "Title":["Last Name",", ","First Name"],
            "Summary":["default"],
            "Tooltip":"yes"
        },
		"Accounts":{
			"Title":["Account Name",", ","City"],
            "Summary":["default"],
            "Tooltip":"yes"
		}
};


if (typeof(SiebelAppFacade.BCRMSearchPanePR) === "undefined") {

    SiebelJS.Namespace("SiebelAppFacade.BCRMSearchPanePR");
    define("siebel/custom/mobile/BCRMSearchPanePR", ["siebel/searchpanerenderer"],
        function () {
            SiebelAppFacade.BCRMSearchPanePR = (function () {

                function BCRMSearchPanePR(pm) {
                    SiebelAppFacade.BCRMSearchPanePR.superclass.constructor.apply(this, arguments);
                }

                SiebelJS.Extend(BCRMSearchPanePR, SiebelAppFacade.SearchPaneRenderer);

                BCRMSearchPanePR.prototype.Init = function () {
                    SiebelAppFacade.BCRMSearchPanePR.superclass.Init.apply(this, arguments);
                    console.log("BCRMSearchPanePR.Init");
                    var pm = this.GetPM();
                    pm.AddMethod("InvokeMethod",this.PMHelper,{sequence:false,scope:this});

                };

                BCRMSearchPanePR.prototype.ShowUI = function () {
                    SiebelAppFacade.BCRMSearchPanePR.superclass.ShowUI.apply(this, arguments);
                    //DONE: remove link from Siebel Find tab and hide tab
                    console.log("BCRMSearchPanePR.ShowUI");
                    if ($("#searchpanetabs li").length == 1){
                        $("#searchpanetabs li a").off("click");
                        $("#searchpanetabs").hide();
                    }
					$("#srchpanecontainer").addClass("forcehide");
                };

                BCRMSearchPanePR.prototype.BindData = function (bRefresh) {
                    SiebelAppFacade.BCRMSearchPanePR.superclass.BindData.apply(this, arguments);
                    
					var pm = this.GetPM();
                    var app = SiebelApp.S_App.GetAppName();
                    var cfg = this.GetConfig(app);
                    var ph = pm.Get("GetPlaceholder");
                    var rs = pm.Get("GetRawRecordSet");
                    var tbl = $("table#" + ph);
                    var i = 0;
                    if (typeof(cfg) !== "undefined"){
                        if (rs.length > 0){
                            var dt = rs[0]["Url"];
                            var props = this.GetProps(dt);
                            var objname = props["DspName"];
                            var ocfg = cfg[objname];
                            if (typeof(ocfg) !== "undefined"){
                                for (r in rs){
                                    var ft = rs[r]["Summary"];
                                    if (typeof(ft) !== "undefined"){

                                        var fields = this.FieldExtractor(ft);
                                        var newtitle = "";
                                        //generate new title
                                        var tt = ocfg["Title"];
                                        for (j = 0; j < tt.length; j+=2){
                                            newtitle += fields[tt[j]];
                                            if (typeof(tt[j+1]) !== "undefined"){
                                                newtitle += tt[j+1];
                                            }
                                        }
                                        var ri = i + 1;
                                        var cell = tbl.find("td#" + ri + "_" + ph +"_title");
                                        cell.find("a").text(newtitle);

                                        //mouseover
                                        if (typeof(ocfg["Tooltip"]) !== "undefined"){
                                            if (ocfg["Tooltip"] == "yes"){
                                                var mo = "";
                                                for (f in fields){
                                                    mo += f;
                                                    mo += ": ";
                                                    mo += fields[f];
                                                    mo += "\n";
                                                }
                                                cell.attr("title",mo);
                                            }
                                        }

                                    }

                                    i++;

                                }
                            }
                            var that = this;
                            var observer = null;
                            BCRMSearchPanePRCounter = 0;
                            BCRMSearchPaneExpanded = false;
                            if (true){
                                observer = new MutationObserver(function(mutations) {

                                    var sp = $("#srchpanecontainer");
                                    var cl = sp.attr("class");
                                    //BCRMSearchPaneExpanded = false;
                                    if (cl.indexOf("forcehide") == -1){
                                        BCRMSearchPanePRCounter++;
                                        if (BCRMSearchPanePRCounter == 1){
                                            if (!BCRMSearchPaneExpanded){
                                                BCRMSearchPaneExpanded = true;
                                                setTimeout(that.ExpandSummary(),500);
                                                observer.disconnect();
                                            }
                                        }
                                    }

                                });
                                var fi = pm.Get("GetFullId");
                                var otarget = document.querySelector("#srchpanecontainer");
                                observer.observe(otarget,{attributes:true});

                                sessionStorage.BCRMMutationObserverSearchPane = "enabled";
                            }
                        } //end if more than one record

                        if (rs.length == 1){
                            //auto drilldown
                            //DONE: drilldown if only 1 record
							/*
                            var cell = tbl.find("td#" + "1" + "_" + ph +"_title");
                            setTimeout(function(){
                                cell.find("a").click();
                                $("#srchpanecontainer").addClass("forcehide");
                            },500);
							*/
                        }
                    }

                };

                BCRMSearchPanePR.prototype.BindEvents = function () {
                    SiebelAppFacade.BCRMSearchPanePR.superclass.BindEvents.apply(this, arguments);
                    console.log("BCRMSearchPanePR.BindEvents");
					var pm = this.GetPM();
					pm.OnControlEvent("FindCategories");
                };

                BCRMSearchPanePR.prototype.EndLife = function () {
                    SiebelAppFacade.BCRMSearchPanePR.superclass.EndLife.apply(this, arguments);
                    console.log("BCRMSearchPanePR.EndLife");
                };

                BCRMSearchPanePR.prototype.PMHelper = function (m,i,d,r){
                    if (m == "Search"){
                        $("#srchpanecontainer").removeClass("bcrm-forcehide");
                        if (!BCRMSearchPaneExpanded){
                            //BCRMSearchPaneExpanded = true;
                            setTimeout(this.ExpandSummary(),500);
                        }
                    }
					if (m == "Drilldown"){
						$("#srchpanecontainer").addClass("bcrm-forcehide");
					}
                };

                BCRMSearchPanePR.prototype.ExpandSummary = function (){
                        if ($("section.siebui-search-pane-inline").length == 0){
                        //console.log("SearchPanePR: ExpandSummary");

                        var pm = this.GetPM();
                        var ph = pm.Get("GetPlaceholder");
                        var rs = pm.Get("GetRawRecordSet");
                        var tbl = $("table#" + ph);
                        var i = 0;
                        if (rs.length > 1){
                            for (r in rs){
                                var ri = i + 1;
                                var icon = tbl.find("td#" + ri + "_" + ph +"_CDIcon");
                                icon.find("span.siebui-icon-arrowsm-right").click();
                                i++;
                            }
                        }
                        $("section.siebui-search-pane-inline").css("width","500px");
                    }

                };

                BCRMSearchPanePR.prototype.FieldExtractor = function(s){
                    var fsep = "  ";
                    var vsep = "::";
					if (s.indexOf(":SEP") >= 0){
						fsep = ":SEPNEXT:";
						vsep = ":SEP:";
					}
                    var fields = {};
                    var f = s.split(fsep);
                    for (i = 0; i < f.length; i++){
                        var fn = f[i].split(vsep)[0];
                        var fv = f[i].split(vsep)[1];
                        if (typeof(fv) === "undefined"){
                            fv = "";
                        }
                        if(fn.indexOf("<") > -1){
                            var tmp = new DOMParser().parseFromString(fn, 'text/html');
                            fn = tmp.body.textContent || "";
                        }
                        if (fn != ""){
                            fields[fn] = fv;
                        }
                    }
                    return fields;
                };

                BCRMSearchPanePR.prototype.GetProps = function(s){
                    var fsep = "#";
                    var vsep = "=";
                    var fields = {};
                    var f = s.split(fsep);
                    for (i = 0; i < f.length; i++){
                        var fn = f[i].split(vsep)[0];
                        var fv = f[i].split(vsep)[1];
                        fields[fn] = fv;
                    }
                    return fields;
                };

                BCRMSearchPanePR.prototype.GetConfig = function(app){
                    return BCRMSearchPRConfig;
                };
                return BCRMSearchPanePR;
            }()
                );
            return "SiebelAppFacade.BCRMSearchPanePR";
        })
}
console.log("BCRMSearchPanePR.js loaded");
