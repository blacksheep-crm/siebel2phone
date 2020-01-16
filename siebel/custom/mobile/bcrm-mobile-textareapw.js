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

/*bcrm-mobile-textareapw.js
* BCRM Text Area Plug-in Wrapper
* DO NOT MODIFY THIS FILE!
* If necessary, deactivate in Manifest and replace with custom PW
*/
if (typeof (SiebelAppFacade.TextAreaDialogPW) === "undefined") {

    SiebelJS.Namespace("SiebelAppFacade.TextAreaDialogPW");
    define("siebel/custom/mobile/TextAreaDialogPW", [],
        function () {
            SiebelAppFacade.TextAreaDialogPW = (function () {

                function TextAreaDialogPW(pm) {
                    SiebelAppFacade.TextAreaDialogPW.superclass.constructor.apply(this, arguments);
                }

                SiebelJS.Extend(TextAreaDialogPW, SiebelAppFacade.FieldPW);

                TextAreaDialogPW.prototype.ShowUI = function () {
                    SiebelAppFacade.TextAreaDialogPW.superclass.ShowUI.apply(this, arguments);
					_$dbg("BCRMTextAreaDialogPW.ShowUI");
                    var pwEl = this.GetEl(); //get DOM element for current control
                    if (pwEl && pwEl.length) { //if DOM element exists
                        //create unique identifier for icon container
                        var uid = "txtarea_" + pwEl.attr("name") + "_icon";
                        // create and append custom icon container
                        // must be <span> because of hardcoded F2 event handler
                        // we will control the actual icon and its position from custom CSS
                        var icon_container = $("<span>");
                        icon_container.attr({"id":uid,"class":"txtarea_icon"});
                        pwEl.parent().append(icon_container);
                        //add class to parent for CSS styling
                        pwEl.parent().addClass("txtarea_container");
                    }
                };

                TextAreaDialogPW.prototype.BindEvents = function () {
					_$dbg("BCRMTextAreaDialogPW.BindEvents");
                    SiebelAppFacade.TextAreaDialogPW.superclass.BindEvents.apply(this, arguments);
                    var pwEl = this.GetEl(); //get DOM element for current control
                    if (pwEl && pwEl.length) { //if DOM element exists
                        //create unique identifier for icon container
                        var uid = "txtarea_" + pwEl.attr("name") + "_icon";
                        var icon = $("#" + uid);
                        var helper = this.Helper("EventHelper");
                        if (helper){ // if we have a helper
                            //manage the click event on the icon via the HandleClick function
                            helper.Manage(icon, "click", {ctx:this}, HandleClick);
                        }
                    }
                };

                function HandleClick(e){
                    e.stopImmediatePropagation(); //prevent bubbles
                    var that = e.data.ctx; //get control instance
                    var txt = that.GetValue();    //get current value
                    var isReadOnly = !!(that.GetEl().attr("aria-readonly") == "true");  //get readonly status
                    var maxlen = parseInt(that.GetEl().attr("maxlength"));
                    var remain = maxlen - parseInt(txt.length);

                    var container = $("<div id='dlg_container'>");    //dialog container
                    var textarea = $("<textarea id='dlg_txtarea' style='width:100%'>");   //new textarea

                    textarea.attr({disabled:isReadOnly});
                    var counter = $("<span id='dlg_counter'>");
                    var dialogcontent = container.append(textarea);   //append ta to container
                    dialogcontent.append(counter);
                    counter.text("characters remaining");  //for testing
                    dialogcontent.dialog({   //create dialog
                        title: that.control.GetDisplayName(),   //use display label for title
                        modal:true,  //modal dialog
                        show:'fade', hide:'fade', //show and hide animations
                        minHeight: 300,  //minimum height
                        minWidth: 300,   //minimum width
                        buttons: [
                            {
                                text:BCRMGetMsg("OK"), //OK button
                                class: "appletButton",
                                click: function() { //when OK button is clicked
                                    //call focus/blur events of PM
                                    that.OnControlEvent(consts.get("PHYEVENT_CONTROL_FOCUS"), that.control);
                                    that.OnControlEvent(consts.get("PHYEVENT_CONTROL_BLUR"), that.control, $(this).find("#dlg_txtarea").val());
                                    //close dialog
                                    $(this).dialog("close");
                                },
                                "style": isReadOnly ? "display:none" : ""
                            },
                            {
                                text: isReadOnly ? BCRMGetMsg("CLOSE") : BCRMGetMsg("CANCEL"),
                                class: "appletButton",
                                click: function (){
                                    $(this).dialog("close");    //close dialog on Cancel
                                }
                            }
                        ],
                        open: function(){
                            var ta = $("#dlg_txtarea");     //get dialog textarea
                            ta.height(ta.parent().height());      //adjust height of ta
                            ta.val(txt);   //set value of ta
                            //counter text
                            $("#dlg_counter").text(remain + " " + BCRMGetMsg("CHARS_REMAINING"));
                            //handle keyup event
                            var helper = that.Helper("EventHelper");
                            helper.Manage(ta,"keyup",{ctx:that},function(){
                                //calculate number of remaining characters
                                remain = maxlen - parseInt($(this).val().length);
                                if(remain < 0){ //if character count is below zero
                                    //truncate string to maximum length
                                    $(this).val($(this).val().substring(0, maxlen));
                                }
                                //update counter text
                                $("#dlg_counter").text(remain + " " + BCRMGetMsg("CHARS_REMAINING"));
                            });
                        },
                        close:function(){
                            $(this).dialog("destroy");
                        },
                        resize:function(){
                            var ta = $("#dlg_txtarea");     //get dialog textarea
                            ta.height(ta.parent().height()-32);      //adjust height of ta minus space for counter
                        }
                    });
                }

                return TextAreaDialogPW;
            }()
                );

            SiebelApp.S_App.PluginBuilder.AttachPW(consts.get("SWE_CTRL_TEXTAREA"), SiebelAppFacade.TextAreaDialogPW, function (control,AppletName) {
				_$dbg("BCRMTextAreaDialogPW.AttachPW: " + AppletName + ":" + control.GetFieldName());
                return true;
            });

            return "SiebelAppFacade.TextAreaDialogPW";
        })
}
_$dbg("bcrm-mobile-textareapw.js loaded");