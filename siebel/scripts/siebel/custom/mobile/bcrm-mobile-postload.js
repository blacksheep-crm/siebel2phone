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

/*bcrm-mobile-postload.js
* BCRM Postload main function
* DO NOT MODIFY THIS FILE!
* Use hook to custom function container in custom/bcrm-custom-postload.js to run additional custom logic on postload
*/
SiebelApp.EventManager.addListner("postload", BCRMMainPostLoad);
var BCRMGM = false;

function BCRMMainPostLoad(){

    var vn = SiebelApp.S_App.GetActiveView().GetName();
    BCRMTimer = Date.now();
    _$dbg("BCRMMainPostLoad start: " + vn);
    //test user only
    if (SiebelApp.S_App.GetUserName() == "TSMYTHE"){
        //set navigation
		/*
        if (sessionStorage.BCRMNavSet != "true"){
            if (window.innerWidth >= 1024 ){
                try{
                    var svc = SiebelApp.S_App.GetService("BCRM Utilities");
                    var ips = SiebelApp.S_App.NewPropertySet();
                    ips.SetProperty("NewTheme","BCRM Mobile");
                    ips.SetProperty("NewNavigation","Tab");
                    svc.InvokeMethod("SetTheme",ips);
                    document.location.reload();
                    sessionStorage.BCRMNavSet = "true";
                }
                catch(e){
                    console.log("BCRMMainPostLoad: " + e.toString());
                }
            }
        }
		*/
        //check for theme change
        if (SiebelApp.S_App.GetProfileAttr("BCRMRefreshNeeded") == "true" && sessionStorage.BCRMThemeRefreshDone != "true"){

            if (confirm(BCRMGetMsg("BCRM_RELOAD"))){
                sessionStorage.BCRMThemeRefreshDone = "true";
                window.location.reload();
            }
            else{
                sessionStorage.BCRMThemeRefreshDone = "true";
            }

        }
        var utils = new SiebelAppFacade.BCRMMobileUtils();
        utils.GetHammer();

        $("body").addClass("bcrm-body");

        //clean up view
        $("#_sweview").removeAttr("title");
        $("#_sweview").scrollTop(0);
        $("#_sweview").find(".siebui-applet").first().click();
        //support mobile web apps (fullscreen browser)
        var meta = '<meta name="mobile-web-app-capable" content="yes">';
        if ($("head").find("meta[name='mobile-web-app-capable']").length == 0){
            $("head").append(meta);
        }

        meta = '<meta name="viewport" content="width=device-width, initial-scale=1">';

        if ($("head").find("meta[name='viewport']").length == 0){
            $("head").append(meta);
        }
        //avatar
        if ($("#siebui-toolbar-settings").find("span.ToolbarButtonOn").find("img").length > 0){
            var im = $("#siebui-toolbar-settings").find("span.ToolbarButtonOn").find("img");
            if (im.attr("src") != "images/photo.png"){
                im.addClass("bcrm-avatar");
                im.parent().addClass("bcrm-avatar");
                $("li.siebui-toolbar-enable").addClass("bcrm-avatar");
            }
        }
        //get environment

        var am = SiebelApp.S_App.GetActiveView().GetAppletMap();
        //introJs().hideHints();
        _$dbg("BCRMMainPostLoad Environment finish");


        //enable mobile action views
        $("body").find("#bcrm_btn_cont").remove();
        if (typeof(BCRMMACConf[vn]) !== "undefined"){
            var mac = new SiebelAppFacade.BCRMMobileActions();
            mac.MACInit();
            _$dbg("BCRMMainPostLoad Mobile Action finish");
        }
        else{
            //$("body").find("#bcrm_btn_cont").remove();
        }

        //enable  fluid grid layout
        var rwdf = new SiebelAppFacade.BCRMRWDFactory();
        if (vn.indexOf("Home") == -1){ //not for "Home" views
            for (a1 in am){
                if ($.inArray(a1,BCRMRWDBlacklist) == -1 && utils.GetAppletType(am[a1]) == "form"){
                    rwdf.BCRMMakeGridResponsive(am[a1]);
                    _$dbg("BCRMMainPostLoad Grid2RWD finish: " + a1);
                }
            }
        }

        //take care of PDQs
        utils.PDQHandler();
        _$dbg("BCRMMainPostLoad PDQ Handler finish");
        //beautifier
        for (a2 in am){
            utils.Beautifier(a2);
            _$dbg("BCRMMainPostLoad Beautifier finish: " + a2);
        }

        //demo fast home page
        if (vn == "Account Screen Homepage View"){
            utils.GenerateHomePage();
            _$dbg("BCRMMainPostLoad Home Page finish");
        }
        else{
            $("[title-preserved='Account Home']").removeClass("bcrm-home-bg");
            $("[id*='s_S_A']").removeClass("bcrm-home-bgt");
            $(".siebui-applet-buttons").removeClass("bcrm-home-bgt");
            $(".siebui-screen-applet-head").removeClass("bcrm-home-bgt");
            $(".siebui-screen-hp-desc input").removeClass("bcrm-home-bgt");
            $("[title-preserved='Account Home']").find("a").removeClass("bcrm-home-bgt");
            $(".siebui-applet").removeClass("bcrm-home-noshadow");
        }

        //god mode
        /*
        if (!BCRMGM){
        if (typeof(BCRMHammer) !== "undefined"){
            var pel = $(".siebui-nav-hb-btn")[0];
            var hman = new BCRMHammer.Manager(pel,{});
            var hev = new BCRMHammer.Press({time: 1000 });
            hman.add(hev);
            BCRMHammer(pel).off("press");
            hman.on("press",BCRMGodMode);
            BCRMGM = true;
        }
        _$dbg("BCRMMainPostLoad God Mode finish");
        }
        */

        //swipe
        for (a3 in am){
            if (typeof(BCRMSwipeConf[a3]) !== "undefined"){
                utils.AddSwiper(a3);
                _$dbg("BCRMMainPostLoad Swiper finish: " + a3);
            }
        }

        //Intro.js
        var noshow = [];
        if (typeof(localStorage.BCRMINTRONOSHOW) !== "undefined"){
            noshow = localStorage.BCRMINTRONOSHOW.split(",");
        }
        if ($.inArray(vn,noshow) == -1){
            if(typeof(BCRMIntroConf[vn]) !== "undefined"){
                if(BCRMIntroConf[vn].BCRMAutoPlay){
                    utils.PlayIntro(vn);
                }
                _$dbg("BCRMMainPostLoad IntroJs finish");
            }
        }


        //address mapper
        if (utils.GetViewType() == "detailview"){
            for (a4 in am){

                utils.AddressMapper(a4);
                _$dbg("BCRMMainPostLoad Address Mapper finish: " + a4);
            }

        }


        //hide any instance of search results
        setTimeout(function(){
            $("#srchpanecontainer").addClass("bcrm-forcehide");
        },100);

        //hide iHelp applet on home pages for small screens
        if (vn.indexOf("Home") != -1 && window.innerWidth < 768){
            var iha = utils.GetAppletElem("Screen Home Task Assistant List Applet");
            if (iha != null){
                if (iha.length > 0){
                    iha.hide();
                }
            }
        }
        //superlist
        var sli = new SiebelAppFacade.BCRMSuperListApplet();
        for (a5 in am){
            if (utils.GetAppletType(am[a5]) == "list"){
                sli.Attach(a5);
                sli.EnhanceListApplet(a5);
                _$dbg("BCRMMainPostLoad Super List finish: " + a5);
            }
        }

        //call custom function container (in custom/bcrm-custom-postload.js)
        try {
            BCRMCustomPostLoad();
            _$dbg("BCRMMainPostLoad Custom Postload finish");
        } catch (e) {
            // do nothing
        }
    }
    _$dbg("BCRMMainPostLoad end: " + vn);
    BCRMTimer = Date.now();
    $("#maskoverlay").removeClass("bcrm-maskoverlay");
}

BCRMGodMode = function(e){
    if(confirm("Click OK to activate advanced mode, click Cancel to continue.")){
        $("[bcrm-adv='yes']").removeClass("bcrm-forcehide");
        sessionStorage.BCRMADVANCEDMODE = "true";
    }
};
_$dbg("bcrm-mobile-postload.js loaded");
$("#maskoverlay").addClass("bcrm-maskoverlay");