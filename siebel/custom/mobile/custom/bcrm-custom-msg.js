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
//put custom strings and translations below
BCRMCustomStringsInit = "";

BCRMGetCustomStrings = function(lang){


    if (typeof(lang) === "undefined"){
        lang = sessionStorage.LangCode;
    }
    if (typeof(lang) === "undefined"){
        lang = "ENU";
    }
    if (BCRMCustomStringsInit == "")
    {
        BCRMCustomStringsInit = lang;
        if (lang == "ENU"){
            BCRMStrings["CUSTOM_1"] = "Example Text";

        }
        if (lang == "DEU"){
            BCRMStrings["CUSTOM_1"] = "Beispieltext";

        }
        //add other languages as needed
    }
    //return BCRMStrings;
};
console.log("bcrm-custom-msg.js loaded");
