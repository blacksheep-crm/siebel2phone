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

/*bcrm-mobile-postload.js
* BCRM Postload main function
* DO NOT MODIFY THIS FILE!
* Use hook to custom function container in custom/bcrm-custom-postload.js to run additional custom logic on postload
*/
var BCRMTestUser = "TSMYTHE";
/*workaround for 20.9 small screen check, breaks MVG popup on 481px or less width unless using Auto Tile feature*/
if (typeof (SiebelApp.Utils.IsSmallScreen) === "function") {
    var t = SiebelApp.Utils.IsSmallScreen;
    SiebelApp.Utils.IsSmallScreen = function () {
        var e = !window.matchMedia("(min-width: 481px)").matches;
        return function () {
            //replace with actual application name, the following line is an example
            if (SiebelApp.S_App.GetName() != "Siebel Universal Agent") {
                return false;
            }
            else {
                return e;
            }
        }
    }();
}

SiebelApp.EventManager.addListner("postload", BCRMMainPostLoad);

function BCRMMainPostLoad() {
    var vn = SiebelApp.S_App.GetActiveView().GetName();
    BCRMTimer = Date.now();
    _$dbg("BCRMMainPostLoad start: " + vn);
    //swap comments for next lines to run for all users or test user only
    //all users
    //if (SiebelApp.S_App.GetUserName() != ""){
    //test user only
    if (SiebelApp.S_App.GetUserName() == BCRMTestUser) {
        var utils = new SiebelAppFacade.BCRMMobileUtils();
        utils.GetHammer();
        utils.Primer();
        utils.ShowAvatar();
        
        //get applet map
        var am = SiebelApp.S_App.GetActiveView().GetAppletMap();
     
        //enable mobile action views
        $("body").find("#bcrm_btn_cont").remove();
        if (typeof (BCRMMACConf[vn]) !== "undefined") {
            var mac = new SiebelAppFacade.BCRMMobileActions();
            mac.MACInit();
        }

        //enable responsive grid layout for form applets
        var rwdf = new SiebelAppFacade.BCRMRWDFactory();
        if (vn.indexOf("Home") == -1) { //not for "Home" views
            for (a1 in am) {
                if ($.inArray(a1, BCRMRWDExclusionList) == -1 && utils.GetAppletType(am[a1]) == "form") {
                    rwdf.BCRMMakeGridResponsive(am[a1]);
                }
            }
        }

        //take care of PDQs
        utils.PDQHandler();

        //invoke beautifier
        for (a2 in am) {
            utils.Beautifier(a2);
        }

        //demo fast home page (replace view name as needed)
        if (vn == "Account Screen Homepage View") {
            utils.GenerateHomePage();
        }
       
        //swiper
        //swipe left/right to navigate
        //swipe up/down to toggle show more/less
        //selected applets only, see config
               for (a3 in am) {
            if (typeof (BCRMSwipeConf[a3]) !== "undefined") {
                utils.AddSwiper(a3);
            }
        }
     
        //Intro.js
        //show interactive help
        var noshow = [];
        if (typeof (localStorage.BCRMINTRONOSHOW) !== "undefined") {
            noshow = localStorage.BCRMINTRONOSHOW.split(",");
        }
        if ($.inArray(vn, noshow) == -1) {
            if (typeof (BCRMIntroConf[vn]) !== "undefined") {
                if (BCRMIntroConf[vn].BCRMAutoPlay) {
                    utils.PlayIntro(vn);
                }
            }
        }

        //address mapper
        //create map link on any field
        if (utils.GetViewType() == "detailview") {
            for (a4 in am) {
                utils.AddressMapper(a4);
            }
        }

        //superlist
        //makes list applets super
        var sli = new SiebelAppFacade.BCRMSuperListApplet();
        for (a5 in am) {
            if (utils.GetAppletType(am[a5]) == "list") {
                sli.Attach(a5);
                sli.EnhanceListApplet(a5);
            }
        }

        //clean up
        utils.CleanUp();
        
        //call custom function container (in custom/bcrm-custom-postload.js)
        try {
            BCRMCustomPostLoad();
        } catch (e) {
            // do nothing
        }
    }
    _$dbg("BCRMMainPostLoad end: " + vn);
    BCRMTimer = Date.now();
    $("#maskoverlay").removeClass("bcrm-maskoverlay");
}

_$dbg("bcrm-mobile-postload.js loaded");
$("#maskoverlay").addClass("bcrm-maskoverlay");
