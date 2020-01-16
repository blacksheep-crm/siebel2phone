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

/*bcrm-mobile-grid2rwd.js
* BCRM Grid to RWD Conversion Utility
* DO NOT MODIFY THIS FILE!
*/
var BCRMRWDNeedsReset = false;
if (typeof(SiebelAppFacade.BCRMRWDFactory) === "undefined")  {
    SiebelJS.Namespace("SiebelAppFacade.BCRMRWDFactory");

    SiebelAppFacade.BCRMRWDFactory = (function () {
        function BCRMRWDFactory(options) {}

        BCRMRWDFactory.prototype.BCRMMakeGridResponsive = function (pm){
			
            var utils = new SiebelAppFacade.BCRMMobileUtils();
            var ts = Date.now();
            var exp = false;  //switch to export applet layout to conf object

            pm = utils.ValidateContext(pm);
            var ae = utils.GetAppletElem(pm);
            var tb = ae.find("table");
            var an = pm.GetObjName();
			_$dbg("BCRMRWDFactory.BCRMMakeGridResponsive: " + an);
            var vn = SiebelApp.S_App.GetActiveView().GetName();
            var cname = an + "__" + vn;
            pm.AddMethod("InvokeMethod",this.MethodHandler,{scope:pm,sequence:false});
            //for detail views, hide button bar
            if (utils.GetViewType() == "detailview"){
                $(ae).find(".siebui-applet-header").attr("id","bcrm-adv");
                //$(ae).find(".siebui-applet-header").attr("style","display:none!important");
                if (sessionStorage.BCRMADVANCEDMODE != "true"){
                    $(ae).find(".siebui-applet-header").addClass("bcrm-forcehide");
                }
            }

            //start
            if (true){

                var appletconfig = this.GetConfig(pm);
                var newgriddiv = this.GetResponsiveGrid(pm,appletconfig);

            }

            //insert responsive grid
            tb.before(newgriddiv);
            //hide original table
            tb.hide();
            
			_$dbg("BCRMRWDFactory.BCRMMakeGridResponsive.Performance: " + an + " : " + (Date.now()-ts) + " ms.");
            //console.log("Applet '" + an + "' is now responsive. This took " + (Date.now()-ts) + " ms.");
            if (exp){
                var x = {};
                x[cname] = appletconfig;
                prompt("Copy Applet Configuration to Clipboard",JSON.stringify(x));
            }
        };
        BCRMRWDFactory.prototype.Reset = function(a){
			_$dbg("BCRMRWDFactory.Reset");
            var utils = new SiebelAppFacade.BCRMMobileUtils();
            var pm = utils.ValidateContext(a);
            var ae = utils.GetAppletElem(pm);
            var tb = ae.find("table");
            var ng = ae.find("#rsl_new_grid");
            if (ng.length == 1) {
                $(ng).find("[data-iname]").each(function (i) {
                    var iname = $(this).attr("data-iname");
                    var type = $(this).attr("data-btype");
                    var t = $(this).detach();
                    $(tb).find("#" + type + "[data-iname='" + iname + "']").before(t);
                });
                $(ng).remove();
            }
        };
        BCRMRWDFactory.prototype.MethodHandler = function(m,i,c,r){
			
            var utils = new SiebelAppFacade.BCRMMobileUtils();
            var rwd = new SiebelAppFacade.BCRMRWDFactory();
            var pm = this;
            var an = pm.GetObjName();
			_$dbg("BCRMRWDFactory.MethodHandler: " + an + " : " + m);
            var ac = "";
            if (m == "NewRecord"){
                 ac = an + "__" + m;
                BCRMRWDNeedsReset = true;
            }
            if (m == "WriteRecord" || m == "UndoRecord"){
                ac = an + "__default";

            }
            if (BCRMRWDNeedsReset) {
                if (typeof (BCRMRWDConf[ac]) !== "undefined") {
                    rwd.Reset(pm);
                    var ngrid = rwd.GetResponsiveGrid(pm, BCRMRWDConf[ac]);
                    var ae = utils.GetAppletElem(pm);
                    //ae.find(".rsl-new-grid").hide();
                    ae.find("table").before(ngrid);

                    if (m == "NewRecord" && BCRMRWDConf[ac].section0.openfirstfield){
                        setTimeout(function(){
                            var ff = $(ngrid.find("[data-btype='bcrm_field']")[0]);
                            if (ff.find("[class*='siebui-icon']").length == 1){
                                ff.find("[class*='siebui-icon']").click();
                            }
                        },500);
                    }
                    if (m == "NewRecord"){
                        setTimeout(function(){
                            introJs().showHints();
                        },100);
                    }
                }
            }
            if (m == "WriteRecord" || m == "UndoRecord") {
                BCRMRWDNeedsReset = false;
            }

        };
        BCRMRWDFactory.prototype.GetResponsiveGrid = function(a,appletconfig){
            //3rd pass
            //now create sections and collect controls
            var acconf = {
                collapsible: true,
                active: 0,
                heightStyle: "content"
            };
            var utils = new SiebelAppFacade.BCRMMobileUtils();
            var pm = utils.ValidateContext(a);
            var ae = utils.GetAppletElem(pm);
            var tb = ae.find("table");
            var cs = pm.Get("GetControls");
            var lbl = [];
            var fld = [];
            var lblid = "";
            var an = pm.GetObjName();
			_$dbg("BCRMRWDFactory.GetResponsiveGrid: " + an);
            var newgriddiv = $("<div id='rsl_new_grid' class='rsl-new-grid'></div>");  //the top container for the "new" grid, replacing the table
            var wrapdiv = "<div class='rsl-new-grid-wrap'></div>"; //container for individual labels/controls
            var cwrapdiv = "<div id='rsl_section_container' class='rsl-new-grid-sc'></div>"; //container for new formsections
            var fs_sel = ".FormSection"; //selector for form sections, for easy replacement
            var field_sel = ".mceGridField"; //selector for grid layout controls/fields (not labels)
            var wrapcount = 0;
            var fieldlist;
            var iname = "";
            var lbltxt = "";
            //get free items (not below any formsection) first
            fieldlist = appletconfig["free"]["fields"];
            for (var fx = 0; fx < fieldlist.length; fx++){
                var fname = fieldlist[fx];
                for (c in cs){
                    if (cs[c].GetFieldName() == fname){
                        var cel = pm.GetRenderer().GetUIWrapper(cs[c]).GetEl();
                        if (typeof(cel) !== "undefined" && $(cel).parent(".siebui-applet-title").length == 0){
                            iname = cs[c].GetInputName();
                            lblid = $(pm.GetRenderer().GetUIWrapper(cs[c]).GetEl()).attr("aria-labelledby");
                            lbltxt = $(pm.GetRenderer().GetUIWrapper(cs[c]).GetEl()).attr("aria-label");
                            break;
                        }
                    }
                }
                var thefield = ae.find("[name='" + iname + "']").parent(field_sel);
                var wrap = $(wrapdiv);
                wrap.attr("id","wrap" + wrapcount);

                if (fld.length == 0){
                    //var thefield = $(this).find(field_sel);
                    if (thefield.length > 0){
                        //lblid = $(thefield.children()[0]).attr("aria-labelledby");
                        if (typeof(lblid) === "undefined"){
                            //dig deeper
                            thefield.children().each(function(z){
                                if (typeof($(this).attr("aria-labelledby")) !== "undefined"){
                                    lblid = $(this).attr("aria-labelledby");
                                }
                            });
                        }
                        //leave a mark
                        if (thefield.parent().find("span[id='bcrm_field']").length == 0){
                            thefield.after("<span id='bcrm_field' data-iname='" + iname + "'></span>");
                        }
                        fld = thefield.detach();
                        fld.attr("data-iname",iname);
                        fld.attr("data-btype","bcrm_field");


                    }
                }
                if (lbl.length == 0){
                    if (lblid != ""){
                        lbl = $(ae).find("[id='" + lblid + "']").parent()[0];
                        if (typeof(lbl) === "undefined"){ //work around misconfigured labels
                            lbl = $(ae).find("div.mceGridLabel:contains('" + lbltxt + "')")[0];
                        }
                        //leave a mark
                        if ($(lbl).parent().find("span[id='bcrm_label']").length == 0){
                            $(lbl).after("<span id='bcrm_label' data-iname='" + iname + "'></span>");
                        }
                        lbl = $(lbl).detach();
                        lbl.attr("data-iname",iname);
                        lbl.attr("data-btype","bcrm_label");
                    }
                }
                if (lbl.length == 1){

                    wrap.append(lbl);
                }
                if (fld.length == 1){

                    wrap.append(fld);
                    $(newgriddiv).append(wrap);
                }

                lbl = [];
                fld = [];
                lblid = "";
                fname = "";
                thefield = null;
                iname = "";
                wrapcount++;
            }
            var hints;
            //get section items
            var cwrap = $(cwrapdiv);
            formsections = appletconfig;
            var seq = 0;
            for (f in formsections){
                if (formsections[f]["seq"] != 999){
                    if (formsections[f]["seq"] > seq){
                        seq = formsections[f]["seq"];
                    }
                }
            }
            seq++;
            for (var k = 0; k < seq; k++){
                for (f in formsections){
                    if (formsections[f]["seq"] == k){
                        fieldlist = formsections[f]["fields"];
                        hints = formsections[f]["hints"];
                        var fsec = $("<h3 id='" + formsections[f]["id"] + "'>" + formsections[f]["caption"] + "</h3><div></div>");
                        for ( fx = 0; fx < fieldlist.length; fx++){
                            fname = fieldlist[fx];
                            for (c in cs){
                                if (cs[c].GetFieldName() == fname){
                                    cel = pm.GetRenderer().GetUIWrapper(cs[c]).GetEl();
                                    if (typeof(cel) !== "undefined" && $(cel).parent(".siebui-applet-title").length == 0){
                                        iname = cs[c].GetInputName();
                                        lblid = $(pm.GetRenderer().GetUIWrapper(cs[c]).GetEl()).attr("aria-labelledby");
                                        break;
                                    }
                                }
                            }
                            thefield = ae.find("[name='" + iname + "']").parent(field_sel);
                            wrap = $(wrapdiv);
                            wrap.attr("id","wrap" + wrapcount);
                            wrapcount++;
                            if (fld.length == 0){
                                //var thefield = $(this).find(field_sel);
                                if (thefield.length > 0){
                                    //lblid = $(thefield.children()[0]).attr("aria-labelledby");
                                    if (typeof(lblid) === "undefined"){
                                        //dig deeper for a label id
                                        thefield.children().each(function(z){
                                            if (typeof($(this).attr("aria-labelledby")) !== "undefined"){
                                                lblid = $(this).attr("aria-labelledby");
                                            }
                                        });
                                    }
                                    //leave a mark
                                    if (thefield.parent().find("span[id='bcrm_field']").length == 0){
                                        thefield.after("<span id='bcrm_field' data-iname='" + iname + "'></span>");
                                    }
                                    fld = thefield.detach();
                                    fld.attr("data-iname",iname);
                                    fld.attr("data-btype","bcrm_field");
                                }
                            }
                            if (lbl.length == 0){
                                if (lblid != ""){
                                    lbl = $(ae).find("[id='" + lblid + "']").parent();
                                    //leave a mark
                                    if ($(lbl).parent().find("span[id='bcrm_label']").length == 0){
                                        $(lbl).after("<span id='bcrm_label' data-iname='" + iname + "'></span>");
                                    }
                                    lbl = $(lbl).detach();
                                    lbl.attr("data-iname",iname);
                                    lbl.attr("data-btype","bcrm_label");
                                }
                                //hints
                                if (typeof(hints) !== "undefined"){
                                    for (h = 0; h < hints.length; h++){
                                        var hi = hints[h];
                                        var ht = "";
                                        if (typeof(hi[fname]) !== "undefined"){
                                            ht = hi[fname];
                                        }
                                        if (ht != ""){
                                            $(lbl).attr("data-hint",ht);
                                            $(lbl).attr("data-hintposition","top-middle");
                                        }
                                    }
                                }
                            }
                            if (lbl.length == 1){

                                wrap.append(lbl);
                            }
                            if (fld.length == 1){

                                wrap.append(fld);
                                $(fsec[1]).append(wrap);

                            }

                            lbl = [];
                            fld = [];
                            lblid = "";
                            fname = "";
                            thefield = null;
                            iname = "";


                        }
                    }
                    if ($(fsec).find(".rsl-new-grid-wrap").length > 0){
                        cwrap.append(fsec);
                    }
                }

            }
            $(newgriddiv).append(cwrap);
            $(newgriddiv).find("#rsl_section_container").accordion(acconf);
            return $(newgriddiv);
        };
        BCRMRWDFactory.prototype.GetConfig = function(a){
            //formsection to accordion transform
            var utils = new SiebelAppFacade.BCRMMobileUtils();
            var pm = utils.ValidateContext(a);
            var ae = utils.GetAppletElem(pm);
            var cs = pm.Get("GetControls");
            var formsections = {};
            var colpos = 0;
            var rowpos = 0;
            var seq = 0;
            var an = pm.GetObjName();
			
            var vn = SiebelApp.S_App.GetActiveView().GetName();
            var cname = an + "__" + vn;
            var dname = an + "__default";
            var tname = an + "__" + utils.GetViewType();
			var useconf = "none";
            var appletconfig = BCRMRWDConf[cname];
            var hasconfig = false;
            if (typeof(appletconfig) === "undefined"){
                appletconfig =  BCRMRWDConf[tname];
            }
			else{
				useconf = cname;
			}
            if(typeof(appletconfig) === "undefined"){
                appletconfig =  BCRMRWDConf[dname];
            }
			else{
				useconf = tname;
			}
            if (typeof(appletconfig) !== "undefined"){
                hasconfig = true;
				if (useconf == "none"){
					useconf = dname;
				}
            }
			
			_$dbg("BCRMRWDFactory.GetConfig: " + an + " : " + useconf);
            var fs_sel = ".FormSection"; //selector for form sections, for easy replacement
            var field_sel = ".mceGridField"; //selector for grid layout controls/fields (not labels)
            var tb = ae.find("table");
            //first pass: markup TR and TD elements and collect formsection info
            tb.find("tr").each(function(i){
                $(this).attr("data-rowpos",rowpos);
                $(this).find("td").each(function(j){
                    //set attributes for each TD
                    $(this).attr("data-colpos",colpos);
                    $(this).attr("data-top",$(this).offset().top);
                    $(this).attr("data-left",$(this).offset().left);
                    $(this).attr("data-width",$(this).width());
                    if (j > 0) { colpos++; }

                    if ($(this).find(fs_sel).length > 0){
                        //if TD hosts a formsection, collect its info into a temp object
                        var td = $(this);
                        var fs = td.find(fs_sel).parent();
                        var fslbl = td.find("span").attr("id");//td.find(fs_sel).text();
                        var colspan = parseInt(td.attr("colspan"));
                        formsections[fslbl] = {};
                        formsections[fslbl]["caption"] = td.find(fs_sel).text();
                        //formsections[fslbl]["color"] = "#" + (j+1).toString() + (j+2).toString() + (j+3).toString();
                        formsections[fslbl]["seq"] = seq;
                        formsections[fslbl]["id"] = td.find("span").attr("id");
                        formsections[fslbl]["fields"] = [];
                        seq++;
                        colpos += colspan;
                        //debugger;
                    }
                });
                colpos = 0;
                rowpos++;
                //add "free" formsection
                formsections["free"] = {"seq":999,"id":"free","caption":"","fields":[]};
            });

            if (seq == 0){
                //applet repo definition has no formsections, but custom config could have
                if (hasconfig){
                    for (acf in appletconfig){
                        if (acf != "free"){
                            seq++;
                        }
                    }
                }
            }
            //2nd pass
            //for each td with an input, "look up" (literally) to which formsection it belongs to
            tb.find("td").each(function(i){
                var td = $(this);
                if (td.find(fs_sel).length == 0 && td.find(field_sel).length == 1){  //only include inputs
                    var r = parseInt(td.parent("tr").attr("data-rowpos"));
                    var cushion = 5;
                    var left = parseInt(td.attr("data-left")) + cushion;
                    var fid = "";
                    for (var ri = r; ri >= 0; ri--){
                        //go upward until we find the formsection
                        var tr = tb.find("tr[data-rowpos='" + ri + "']");
                        tr.find("td").each(function(j){
                            var tdi = $(this);
                            if (tdi.find(fs_sel).length == 1 && fid == ""){
                                var fstart = parseInt(tdi.attr("data-left"));
                                var fend = fstart + parseInt(tdi.attr("data-width"));
                                if (fstart <= left && left <= fend){ //if left (plus cushion) side of control is within the formsection's boundaries
                                    fid = tdi.find("span").attr("id"); //get the formsection id
                                    //break;
                                }
                            }
                        });
                    }
                    if (fid != ""){  //mark each control TD with the formsection id it appears under
                        if (typeof(td.attr("data-fid")) === "undefined"){
                            td.attr("data-fid",fid);
                            //colorize for debugging
                            /*
                             for (f in formsections){
                             if (fid == formsections[f]["id"]){
                             td.css("background",formsections[f].color);
                             }
                             }
                             */
                        }

                    }
                    else{   //control could be "free" , ie not under any formsection
                        fid = "free";
                        td.attr("data-fid",fid);
                    }

                    if (!hasconfig){ //write field list to formsection
                        var inputname = $(td.find(field_sel).children()[0]).attr("name");
                        if (typeof(inputname) !== "undefined"){

                            for (c in cs){
                                if (cs[c].GetInputName() == inputname){
                                    formsections[fid]["fields"].push(cs[c].GetFieldName());
                                }
                            }
                        }

                    }
                    fid = "";
                }
            });

            //use current layout as config if no custom config is present
            if(!hasconfig){
                appletconfig = formsections;
            }
            return appletconfig;
        };
        return BCRMRWDFactory;
    }());
}
_$dbg("bcrm-mobile-grid2rwd.js loaded");