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

/*bcrm-mobile-config.js
* Master config file
* TO BE EDITED BY CUSTOMER!
* Replace Siebel vanilla samples with custom object references as needed!
*/

//Smartlist configuration
var BCRMSLIConf =
{
    "SIS Account List Applet":{
        "top":["concat","","Name","&nbsp;/&nbsp;","Location",""],
        //"top":["columns","pre","2","@","3","post"],
        "center":["concat","<span class='bcrm-map'>","Full Address",""],
        "bottom":["concat","<span class='bcrm-phone'>","Main Phone Number",""],
        "img":["initials","",0,2,"Name"],
        "popup":["function","PopDetails"],
		"search":["~LIKE *","Name","*"]
    },
    "Activity List Applet With Navigation":{
        "top":["function","ActivityTime"],
        "center":["concat","","Type","@","Account Name",""],
        "bottom":["concat","","Status","&nbsp;:&nbsp;","Description",""],
        "img":["function","CalendarIcon"],
        "popup":["none"]
    },
    "Opportunity List Applet" :{
        "top":["columns","","1","&nbsp;-&nbsp;","2",""],
        "center":["concat","","Primary Revenue Amount","&nbsp;/&nbsp;","Primary Revenue Win Probability",""],
        "bottom":["concat","","Sales Stage",""],
        "img":["function","OpptyIcon"],
        "popup":["none"]
    },
    "BC_Contact":{
        "top":["concat","","M/M","&nbsp;","First Name","&nbsp;","Last Name","&nbsp;&gt;","Email Address",""],
        "center":["concat","","Job Title","@","Account",""],
        "bottom":["concat","<span class='bcrm-phone'>","Cellular Phone #",""],
        "img":["initials","",0,1,"First Name","Last Name"],
        "popup":["none"],
		"search":["~LIKE *","Last Name","*"]
    },
    "BC_Action":{
        "top":["function","ActivityTime"],
        "center":["concat","","Type","@","Account Name",""],
        "bottom":["concat","","Status","&nbsp;:&nbsp;","Description",""],
        "img":["function","CalendarIcon"],
        "popup":["none"],
		"search":["","Planned",""]
    },
	"BC_Expense Item":{
        "top":["columns","","1",":&nbsp;","3",""],
        "center":["columns","","4",""],
        "bottom":["columns",""],
        "img":["initials","",0,2,"3"],
        "popup":["function","PopDetails"]
    },
    "default":{
        "top":["columns","","1","&nbsp;-&nbsp;","2","&nbsp;-&nbsp;","3",""],
        "center":["columns","","4","&nbsp;-&nbsp;","5","&nbsp;-&nbsp;","6",""],
        "bottom":["columns","","7","&nbsp;-&nbsp;","8","&nbsp;-&nbsp;","9",""],
        "img":["initials","",0,1,"1","2"],
        "popup":["function","PopDetails"]
    },
	"Activity Assigned To Pick Applet":{
        "top":["columns","","1","&nbsp;-&nbsp;","2","&nbsp;-&nbsp;","3",""],
        "center":["columns","","4","&nbsp;-&nbsp;","5","&nbsp;-&nbsp;","6",""],
        "bottom":["columns","","7","&nbsp;-&nbsp;","8","&nbsp;-&nbsp;","9",""],
        "img":["initials","",0,1,"1","2"],
        "popup":["function","PopDetails"],
		"ispopup":true,
		"action":["function","InvokePick"]
    },
	"Employee Mvg Applet":{
		"top":["columns","","1","&nbsp;-&nbsp;","2","&nbsp;-&nbsp;","3",""],
        "center":["columns","","4","&nbsp;-&nbsp;","5","&nbsp;-&nbsp;","6",""],
        "bottom":["columns","","7","&nbsp;-&nbsp;","8","&nbsp;-&nbsp;","9",""],
        "img":["initials","",0,1,"1","2"],
        "popup":["function","MultiSelect"],
		"ispopup":true
	},
	"Employee Assoc Applet":{
		"top":["columns","","1","&nbsp;-&nbsp;","2","&nbsp;-&nbsp;","3",""],
        "center":["columns","","4","&nbsp;-&nbsp;","5","&nbsp;-&nbsp;","6",""],
        "bottom":["columns","","7","&nbsp;-&nbsp;","8","&nbsp;-&nbsp;","9",""],
        "img":["initials","",0,1,"1","2"],
        "popup":["function","MultiSelect"],
		"ispopup":true
	},
	"Primary Contact Mvg Applet":{
        "top":["concat","","M/M","&nbsp;","First Name","&nbsp;","Last Name",""],
        "center":["concat","","Status",""],
        "bottom":["concat","Employee:&nbsp;","Employee Flag",""],
        "img":["initials","",0,1,"First Name","Last Name"],
        "popup":["function","MultiSelect"],
		"ispopup":true
    },
	"Contact Assoc Applet":{
        "top":["concat","","M/M","&nbsp;","First Name","&nbsp;","Last Name",""],
        "center":["concat","","Job Title","&nbsp;","Email Address",""],
        "bottom":["concat","<span class='bcrm-phone'>","Work Phone #",""],
        "img":["initials","",0,1,"First Name","Last Name"],
        "popup":["function","MultiSelect"],
		"ispopup":true
    },
	"Opportunity Pick Applet":{
		"top":["columns","","1",""],
        "center":["columns",BCRMGetMsg("ACCOUNT") + ":&nbsp;","2",""],
        "bottom":["columns","","3","&nbsp;-&nbsp;","4","&nbsp;-&nbsp;","5",""],
        "img":["initials","",0,2,"1"],
        "popup":["function","PopDetails"],
		"ispopup":true,
		"action":["function","InvokePick"]
	},
	"Account Pick Applet":{
	    "top":["concat","","Name",",&nbsp;Loc:&nbsp;","Location",""],
        "center":["concat","<span class='bcrm-map'>","Full Address",""],
        "bottom":["concat","","Account Status","&nbsp;","Account Type Code",""],
        "img":["initials","",0,2,"Name"],
        "popup":["function","PopDetails"],
		"ispopup":true,
		"action":["function","InvokePick"]
	}
};

//Config for Grid2RWD
var BCRMRWDConf = {
    "SIS Product Form Applet - ISS Admin__ISS Product Administration View":{
        "free":{"seq":999,"id":"free","caption":"","fields":["Type","Name"]},//,"Organization","Orderable","Description","Version Status","Product Line","IsComplexProductBundle","Part #","Unit of Measure","IsComplexProductNotBundle","Payment Type","Product Def Type Code","Track As Asset Flag","Inventory Flag","Product Level","Maximum Quantity","Equivalent Product","Format","CDA Pageset","ThumbnImageFileName","Parent Internal Product Name","Start Date","Thumbnail Source Path","Network Element Type","End Date","ImageFileName","SPN Definition Name","Compound Flag","Image Source Path"]},
        "HTML_FormSection2_Label":{"caption":"Marketing Info","seq":1,"id":"HTML_FormSection2_Label","fields":["Targeted Industry","Targeted Min Age"]},//,"Targeted Postal Code","Targeted Country","Targeted Max Age"]},
        "HTML_FormSection4_Label":{"caption":"Service","seq":0,"id":"HTML_FormSection4_Label","fields":["MTBF","MTTR","Field Replacable Unit","Return if Defective","Tool Flag","Billing Type","Billing Service Type"]},
        "HTML_FormSection3_Label":{"caption":"Logistics","seq":2,"id":"HTML_FormSection3_Label","fields":["Vendor","Vendor Location","Vendor Part Number","Item Size","Lead Time","Carrier","Shipping Method","Allocate Below Safety Flag","Auto Substitute  Flag","Auto Allocate Flag","Auto Explode Flag"]},
        "HTML_FormSection5_Label":{"caption":"Other","seq":3,"id":"HTML_FormSection5_Label","fields":["SAP Division Code","Integration Id","Global Product Identifier","Serialized","Configuration","Taxable Flag","Tax Subcomponent Flag","Position Bill Product Flag","Inclusive Eligibility Flag","Compensatable"]}
    },
    "Service Request Detail Applet__Personal Service Request List View":{
        "free":{"seq":999,"id":"free","caption":"","fields":[]},
        "HTML_Label_2_Label":{"caption":"SR Information","seq":0,"id":"HTML_Label_2_Label","fields":["SR Number","INS Product","Contact Last Name","Area","Contact First Name","Sub-Area","Created","Account Location","Account","CSN","Commit Time","Contact Account","Closed Date","Contact Business Phone","Contact Email","Source","Reproduce"]},
        "HTML_FormSection2_Label":{"caption":"Priority and Ownership","seq":1,"id":"HTML_FormSection2_Label","fields":["Status","Sub-Status","Priority","Owner","Created By","Owner Group","Organization","Severity"]},
        "SRSummaryForm_Label":{"caption":"Summary","seq":2,"id":"SRSummaryForm_Label","fields":["Abstract"]},
        "DetailDescForm_Label":{"caption":"Detailed Description","seq":3,"id":"DetailDescForm_Label","fields":["Description","Billable Flag"]},
        "CustomerTimeFormSection_Label":{"caption":"Customer Time Zone","seq":4,"id":"CustomerTimeFormSection_Label","fields":["Contact Created","Contact Commit Time","Contact Closed Date"]},
        "Social_Media_Section_Label":{"caption":"Social Media","seq":5,"id":"Social_Media_Section_Label","fields":["SM Author","SM Community","SM Sentiment","SM Topic","SM Influence Score","SM Publish Date"]}
    },
    "Contact Form Applet__default":{
        "free":{"seq":999,"id":"free","caption":"","fields":["First Name","Last Name","M/M","Job Title"]},
        "section0":{"seq":0,"id":"section0","caption":"<span></span><i>" + BCRMGetMsg("CONTACT_INFO") + "</i></span>","fields":["Email Address","Work Phone #","Cellular Phone #"]},
        "section1":{"seq":1,"id":"section1","caption":"Company & Address","fields":["Account","Account Location","Personal Street Address","Personal City","Personal State","Personal Postal Code","Personal Country"]}
	},
	"Activity Form Applet__detailview":{
		"free":{"seq":999,"id":"free","caption":"","fields":[]},
		"section0":{"seq":0,"id":"section0","caption":"Activity","fields":["Type","Status","Planned","Duration Minutes"]},
		"section1":{"seq":1,"id":"section1","caption":"Description","fields":["Comment","Description"]}
	},
	"Activity Form Applet__NewRecord":{
		"free":{"seq":999,"id":"free","caption":"","fields":[]},
		"section0":{"seq":0,"id":"section0","caption":"1. Start Date/Time and Duration","fields":["Planned","Duration Minutes"],"openfirstfield":true},//,"hints": [{"Planned":"Watch the timezone"},{"Duration Minutes":"Enter duration in minutes"}]},
		"section1":{"seq":1,"id":"section1","caption":"2. Description","fields":["Description"]},
		"section2":{"seq":2,"id":"section2","caption":"3. Type and Status","fields":["Type","Status"]}
	},
	"Activity Form Applet__default":{"free":{"seq":999,"id":"free","caption":"","fields":["Description","Planned","Type","Duration Minutes","Comment","Planned Completion","Done Flag","Private","Priority","Primary Owned By","Status","Owned By","Opportunity","Contact Last Name","Account Name","Display"]}},
	"SIS Account Entry Applet__detailview":{
		"free":{"seq":999,"id":"free","caption":"","fields":["Name","Location","City"]},
		"section0":{"seq":0,"id":"section0","caption":"Account Details","fields":["Sales Rep","Main Phone Number"]},
		"section1":{"seq":1,"id":"section1","caption":"Address","fields":["Street Address","State","Postal Code","Country"]}
	}
};

//Beautifier config
var BCRMBeautifierConf = {
	"BC_Account" : [".rsl-new-grid-wrap#wrap0","bcrm-featured-field"],
	"Contact Form Applet" : [".rsl-new-grid-wrap#wrap0","bcrm-featured-field-rwd",".rsl-new-grid-wrap#wrap1","bcrm-featured-field-rwd"],
	"Employee Mvg Applet" : ["#sieb-ui-popup-mvg-selected .AppletButtons","rsl-hidden"],
	"Primary Contact Mvg Applet": ["#sieb-ui-popup-mvg-selected .AppletButtons","rsl-hidden"],
	"Activity Assigned To Pick Applet":[".ui-jqgrid-bdiv","bcrm-popup-50"],
	"BC_Expense Item" : [".siebui-icon-onspreadrecord","rsl-hidden"],
	"Contact Assoc Applet" : [".siebui-popup-action","rsl-hidden"]
}

//Exclusion list / blacklist for form applets that cannot be RWD'd
var BCRMRWDBlacklist = [
    "Quote Catalog List Applet OUI Dropdown",
    "Layout Controls SI Applet",
    "Account Home Add Virtual Form Applet",
    "eCalendar Daily Applet Home Page - HI",
    "Salutation Applet (WCC Home)",
    "Layout Controls Applet",
    "SS Shopping Cart Info Applet",
    "Activity HI Outlook Calendar Applet",
	"Opportunity Default Chart Applet"
];

//Map URL generator config
var BCRMAddress2MapConf = {
	"SIS Account Entry Applet":{
		"link":["City"],
		"addr":["Full Address"],
		"hide":["State"]
		}
}
//magic menu
var BCRMMagicMenuConf = {
	"default":{
		"Base":["NewRecord","EditRecord","NewQuery","DeleteRecord","RecordCount"],
		"NewRecord":["WriteRecord","UndoRecord"],
		"EditRecord":"NewRecord",
		"DeleteRecord":["NewRecord","EditRecord","UndoRecord","NewQuery","DeleteRecord","RecordCount"],
		"WriteRecord":"Base",
		"UndoRecord":"Base",
		"NewQuery":["ExecuteQuery","UndoQuery"],
		"ExecuteQuery":"Base",
		"UndoQuery":"Base"
	},
	"expenses":{
		"Base":["NewRecord","EditRecord","OnSpreadRecord","DeleteRecord"],
		"NewRecord":["WriteRecord","UndoRecord"],
		"EditRecord":"NewRecord",
		"DeleteRecord":["NewRecord","EditRecord","UndoRecord","OnSpreadRecord","DeleteRecord"],
		"WriteRecord":"Base",
		"UndoRecord":"Base"
	},
		"childMM":{
		"Base":["NewRecord","EditRecord","CreateRecord","NewQuery","DeleteRecord","RecordCount","ShowHelp"],
		"NewRecord":["WriteRecord","UndoRecord"],
		"EditRecord":"NewRecord",
		"CreateRecord":["WriteRecord","UndoRecord"],
		"DeleteRecord":["NewRecord","EditRecord","UndoRecord","CreateRecord","NewQuery","DeleteRecord","RecordCount"],
		"WriteRecord":"Base",
		"UndoRecord":"Base",
		"NewQuery":["ExecuteQuery","UndoQuery"],
		"ExecuteQuery":"Base",
		"UndoQuery":"Base"
	},
		"help":{
		"Base":["ShowHelp"]
	}
};


//Enable mobile actions/magic menu on the following views
var BCRMMACConf = {
    "Activity List View":{conf:"default"},
	"Account List View": {conf:"default"},
	"All Account List View": {conf:"default"},
    "Opportunity List View":{conf:"default"},
	"Visible Contact List View":{conf:"default"},
	"Activity Expense View":{conf:"expenses"},
	"Account Detail - Contacts View":{conf:"childMM",link:"MM"},
	"Service Request Detail View":{conf:"default"},
	"Account Screen Homepage View":{conf:"help"},
	"Contact Detail View":{conf:"default"}
};

//Config for PDQ Handler
var BCRMPDQConf = {
	"Home Page View (WCC)":"hide",
	"Activity Attachment View":"hide",
	"Activity Expense View":"hide",
	"detailview":"hide"
};

//New Home Page view links
var BCRMHomeViews = {
	"Visible Contact List View":BCRMGetMsg("MY_CONTACTS"),
	"Activity List View":BCRMGetMsg("MY_ACTIVITIES")
};

//Form Applet swipe actions
var BCRMSwipeConf = {
	"Activity Form Applet":{},
	"SIS Account Entry Applet":{}
};

//Popup Applets without search box
var BCRMPopupNoSearch = {
	"Employee Mvg Applet":{},
	"Primary Contact Mvg Applet":{}
};

//user guide/intro.js definitions
var BCRMIntroConf = {
	"Account Screen Homepage View":{
    steps: [
        {
            intro: "Welcome to BCRM Mobile!"
        },
        {
            element: '#bcrm_salutation',
            intro: BCRMGetMsg("INTRO_SALUTATION")
        },
        {
            element: '.siebui-screen-hp-applet',
            intro: BCRMGetMsg("INTRO_VIEWLINKS")
        },
        {
            element: '#s_S_A2_div',
            intro: BCRMGetMsg("INTRO_RECENT")
        },
        {
            element: '.siebui-nav-hb-btn',
            intro: BCRMGetMsg("INTRO_SCREENS")
        },
		{
            element: '#findcombobox',
            intro: BCRMGetMsg("INTRO_FIND")
        },
		{
            element: '#MsgBar',
            intro: BCRMGetMsg("INTRO_MSGBAR")
        },
        {
            element: '#siebui-toolbar-settings',
            intro: BCRMGetMsg("INTRO_AVATAR")
        }
    ],
	showStepNumbers:false,
	BCRMAutoPlay:true
	},
	"Account Detail - Contacts View":{
    steps: [
        {
            element: 'li[bcrm-method="NewRecord"]',
            intro: BCRMGetMsg("HELP_MAGICMENU_1")
        },
		        {
            element: 'li[bcrm-method="EditRecord"]',
            intro: BCRMGetMsg("HELP_MAGICMENU_2")
        },
		        {
            element: 'li[bcrm-method="CreateRecord"]',
            intro: BCRMGetMsg("HELP_MAGICMENU_3")
        },
		        {
            element: 'li[bcrm-method="NewQuery"]',
            intro: BCRMGetMsg("HELP_MAGICMENU_4")
        },
		        {
            element: 'li[bcrm-method="DeleteRecord"]',
            intro: BCRMGetMsg("HELP_MAGICMENU_5")
        },
		        {
            element: 'li[bcrm-method="RecordCount"]',
            intro: BCRMGetMsg("HELP_MAGICMENU_6")
        },
		        {
            element: 'li[bcrm-order="1"]',
            intro: BCRMGetMsg("HELP_MAGICMENU_7")
        }
    ],
	showStepNumbers:false,
	BCRMAutoPlay:false
	}
};
_$dbg("bcrm-mobile-config.js loaded");
