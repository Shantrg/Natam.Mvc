

app_account_bck = {

    account_def: function (form, tag) {
        //this.accDef;
        this.tagDiv = tag;

        var html = (function () {/*
        <div style="margin: 0px;">
        <div id="jqxWidget" style="margin: 0 auto; display: block; direction: rtl">
            <div id="accWindow">
                <h3 id="accHeader">
                </h3>
                <div id="accBody">
                    <form class="accForm" id="accForm" method="post" action="/Common/UpdateAccount">
                        <div style="direction: rtl; text-align: right">
                            <input type="hidden" id="AccountType" name="AccountType" value="2" />
                            <input type="hidden" id="AccountId" name="AccountId" value="" />
                            <div class="panel-area mw600">
                            <div class="form-group">
                                <label  class="column">
                                    <span id="lblName">שם</span>: <span class="mandatory">(*)</span></label>
                                <input id="AccountName" name="AccountName" type="text" class="text-mid" />
                            </div>
                            <div id="divCategory" class="form-group">
                                <label class="column">
                                    <span id="lblCategory">קטגוריה</span>: <span class="mandatory">(*)</span>
                                </label>
                                <div id="AccountCategory" name="AccountCategory" style="display: inline-block; text-align: right"></div>
                            </div>
                            </div>
                            <div id="contacts_dropdown" style="max-width:600px">
                                <div class="panel-area">אנשי קשר</div>
                                <div>
                                    <div id="contact-def"></div>
                                    <div id="contacts-grid" style="border-color: transparent;" ></div>
                                </div>
                            </div>
                            <div style="height: 5px"></div>
                            <div class="panel-area mw600">
                            <div id="divContact" class="form-group">
                                <label class="column">
                                    איש קשר ראשי :<span class="mandatory">(*)</span></label></label>
                                <input id="ContactName" name="ContactName" type="text" class="text-mid" />
                            </div>
                            <div class="form-group">
                                <label class="column">
                                    תפקיד:<span class="mandatory">(*)</span></label>
                                </label>
                                <input id="ContactTitle" name="ContactTitle" type="text" class="text-mid" />
                            </div>
                            <div class="form-group">
                                <label class="column">
                                    טלפון נייד:<span class="mandatory">(*)</span></label>
                                </label>
                                <input id="Mobile" name="Mobile" type="text" class="text-mid" />
                            </div>
                            <div class="form-group">
                                <label class="column">
                                    דאר אלקטרוני:<span class="mandatory">(*)</span></label></label>
                                <input id="Email" name="Email" type="text" class="text-mid" />
                                <a id="emailLink" href="" target="_blank"></a>
                            </div>
                            </div>
                            <div class="panel-area mw600">
                            <div class="form-group">
                                <label class="column">
                                        עיר:</label>
                                <input id="City" name="City" type="text" class="text-mid" />
                            </div>
                            <div class="form-group">
                                <label class="column">
                                        כתובת:</label>
                                <input id="Address" name="Address" type="text" class="text-mid" />
                            </div>
                            <div class="form-group">
                                <label class="column">
                                        מיקוד:</label>
                                <input id="ZipCode" name="ZipCode" type="text" class="text-mid" />
                            </div>
                            </div>
                            <div class="panel-area mw600">
                            <div class="form-group">
                                <label class="column">
                                    טלפון-1 :</label>
                                <input id="Phone1" name="Phone1" type="text" class="text-mid" />
                            </div>
                            <div class="form-group">
                                <label class="column">
                                    טלפון-2 :
                                </label>
                                <input id="Phone2" name="Phone2" type="text" class="text-mid" />
                            </div>
                            <div class="form-group">
                                <label class="column">
                                    מספר פקס :</label>
                                <input id="Fax" name="Fax" type="number" class="text-mid" />
                            </div>
                            </div>
                            <div class="panel-area mw600">
                            <div class="form-group">
                                <label class="column">
                                        אינטרנט:</label>
                                <input id="WebSite" name="WebSite" type="text" class="text-wide" />
                                <a id="websiteLink" href="" target="_blank"></a>
                            </div>
                           <div class="form-group">
                                <label class="column">
                                        הערות:</label>
                               <textarea id="Details" name="Details" class="textarea-mid"></textarea>
                            </div>
                            </div>
                            <div style="height: 5px"></div>
                            <div id="contactsGrid"></div>

                            <div>
                                <!--<input id="accSubmit" class="btn-default btn7" type="button" value="עדכון" />-->
                                <!--<input id="accCancel" class="btn-default btn7" type="button" value="ביטול" />-->
                                <!--<input id="accContacts" class="btn-default btn7" type="button" value="אנשי קשר" />-->
                                <!--<a href="#" id="accClose"><i class="fa fa-close" style="font-size:20px;color:#000"></i></a>-->
                                <div class="clear"></div>

                            </div>

                            <div dir="rtl" class="mandatory">שדות חובה(*)</div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>*/
        }).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1];

        var input_rules = [
            { input: '#AccountName', message: 'חובה לציין שם', action: 'keyup, blur', rule: 'required' },
            {
                input: '#Phone1', message: 'ניתן להקליד מספרים בלבד!', action: 'valuechanged, blur', rule:
                  function (input, commit) {
                      var val = input.val();
                      var re = /^([0-9])+$/
                      return val ? re.test(val) : true;
                  }
            },
           { input: '#ContactName', message: 'שם+שם משפחה חובה', action: 'keyup, blur', rule: 'required' },
           { input: '#ContactTitle', message: 'תפקיד חובה', action: 'keyup, blur', rule: 'required' },
           { input: '#Mobile', message: 'טלפון נייד חובה', action: 'keyup, blur', rule: 'required' },
           {
               input: '#Mobile', message: 'ניתן להקליד מספרים בלבד!', action: 'keyup,valuechanged, blur', rule:
               function (input, commit) {
                   var val = input.val();
                   var re = /^([0-9])+$/
                   return val ? re.test(val) : true;
               }
           },
           { input: '#Email', message: 'אימייל חובה', action: 'keyup, blur', rule: 'required' },
           { input: '#Email', message: 'אימייל לא תקין', action: 'keyup, blur', rule: 'email' }
        ];

        var container = $(html);
        $(tag).empty();
        $(tag).append(container);
        //if (Model.Option != 'a' && this.Model.Id > 0) {
        //    this.contactGrid = new app_contacts_grid();
        //    this.contactGrid.init(this.Model.Id, this.contactRole, "");
        //}

        $(form).jqxValidator({
            rtl: true,
            hintType: 'label',
            animationDuration: 0,
            rules: input_rules
        });

        this.display = function () {
            $(this.tagDiv).show();
        };
        this.hide = function () {
            $(this.tagDiv).hide();
        };

        //this.update = function (callback) {
        //    if (this.accDef != null) {
        //        if (this.Model.Option == 'a')
        //            this.accDef.doSubmitNew(callback);
        //            //this.accDef.doSubmitNew(function (data) {
        //            //    return data;
        //            //});
        //        else
        //            this.accDef.doSubmit(callback);//function (data) {
        //        //    return data;
        //        //});
        //    }
        //    return false;
        //};

        //return html;
    }

}

//============================================================================================ app_const

var app_const = {

    adminLink: '<a href="/Admin/Manager">מנהל מערכת</a>',

    buildingToActiveLink: '<a href="/Building/BuildingToActiveGrid" class="row_link">הצג רשימת בניינים לעדכון</a>'
};

//============================================================================================ app_lookup

var app_lookups = {

    setInput: function (form, tagName, value) {

        switch (tagName) {
            case "UserId":
            case "AgentId":
                $('form#' + form + ' [name=' + tagName + ']').val(value);
                app_lookups.agentName('#' + tagName, value);
        }
    },
    lookup: function (tag, url, id) {

        if (id && id > 0)
            app_query.doLookup(url, { 'id': id }, function (content) {
                $(tag).val(content);
            });
    },
    agentName: function (tag, id) {
        app_lookups.lookup(tag, '/Common/GetAgentName', id);

        //if (id && id > 0) {
        //    var tag = tag.replace('#', '');
        //    app_query.doLookup("/Common/GetAgentName", { 'id': id }, function (data) {
        //        $('#' + tag).val(data);
        //    });
        //}
    },
}
//============================================================================================ app_select

var app_select = {

    lookupFieldValue: function (form, tag, selectValues, value) {

        var text = selectValues[value];
        if(text)
        {
            tag = tag.replace('#', '');
            $('#' + tag).val(text);
            $('form#' + form + ' [name=' + tag + ']').val(value);
        }
        //var item = $.grep(records, function (item) { return item.value == value; });
        //if (item && item.length > 0) {
        //    $('#' + tag).val(item[0].text);
        //    $('form#' + form + ' [name=' + tag + ']').val(item[0].value);
        //}
    },
    loadSelect: function (tag, selectValues, width, value, lookupForm) {
        if (lookupForm && value >= 0) {
            app_select.lookupFieldValue(lookupForm, tag, selectValues, value);
        }
        else {
            if (width === undefined || width == 0)
                width = 150;
            app_control.selectTag(tag, width);
            app_control.appendSelectOptions(tag, selectValues);
            if (typeof value === 'string')
                $(tag).val(value);
            else if (value >= 0)
                $(tag).val(value);
        }
    },
    loadSelectInput: function (form, tag, selectValues, width, value) {
        if (width === undefined || width == 0)
            width = 150;
        app_control.selectTag(tag, width);
        app_control.appendSelectOptions(tag, selectValues);
        $(tag).change(function () {
            var tagname = tag.replace('#', '');
            $('form#' + form + ' [name=' + tagname + ']').val(this.value);
        });
        if (value >= 0)
            $(tag).val(value);
    },
    jqxSelect: function (tag, selectValues, width, value) {
        if (width === undefined || width == 0)
            width = 150;
        $(tag).jqxDropDownList({
            rtl: true,
            width:width,
            source: selectValues
            //selectedIndex: 3,
            //theme: 'energyblue'
        });
    },
    PriceType: function (tag, value) {
        if (tag === undefined)
            tag = "#PriceType";
        var selectValues = { "1": "מעטפת", "2": "גמר מלא"};
        app_select.loadSelect(tag, selectValues, 150,value);
    },
    ManagementFeeType: function (tag, value) {
        if (tag === undefined)
            tag = "#ManagementFeeType";
        var selectValues = { "0": "לא ידוע", "1": "אין", "2": "ידוע" };
        app_select.loadSelect(tag, selectValues, 150, value);
    },
    OwnerType: function (tag, value, lookup) {
        if (tag === undefined)
            tag = "#OwnerType";
        var selectValues = { "1": "פרטית", "2": "מנהל", "3": "אחר" };
        app_select.loadSelect(tag, selectValues, 0, value, lookup);
    },
    PropertyType: function (tag, value, lookup) {
        if (tag === undefined)
            tag = "#PropertyType";
        var selectValues = { "0": "יחידה", "1": "עדכון מידע", "2": "סוכן", "3": "מגרש" };
        app_select.loadSelect(tag, selectValues, 0, value, lookup);
    },
    DealType: function (tag, value, lookup) {
        if (tag === undefined)
            tag = "#DealId";
        var selectValues = { "1": "אין עיסקה", "2": "מכירה", "3": "השכרה", "5": "השקעה" };
        app_select.loadSelect(tag, selectValues, 0, value, lookup);
    },
    DesignationType: function (tag, value, lookup) {
        if (tag === undefined)
            tag = "#Designation";
        var selectValues = { "1": "לא מוגדר", "2": "משרדים", "3": "תעשייה", "4": "מסחר", "5": "מגורים", "6": "חקלאי", "7": "הייטק" };
        app_select.loadSelect(tag, selectValues, 0, value, lookup);
    },
   AccountType: function (tag, value, lookup) {
        if (tag === undefined)
            tag = "#TypeIdId";
        var selectValues = {"0": "לא ידוע",  "1": "לקוח", "2": "בעלים", "3": "משקיע", "4": "דייר", "5": "בעל מקצוע", "6": "חברת ניהול"};
        app_select.loadSelect(tag, selectValues, 0, value, lookup);
   },
   AirConditionType: function (tag, value, lookup) {
       if (tag === undefined)
           tag = "#AirConditionId";
       var selectValues = { "1": "ללא", "2": "צ'ילרים", "3": "מערכת מים", "4": "מיני מרכזי", "5": "אחר"};
       app_select.loadSelect(tag, selectValues, 0, value, lookup);
   },
   PurposeType: function (tag, value, lookup) {
       if (tag === undefined)
           tag = "#PurposeId";
       var selectValues = { "1": "לא מוגדר", "2": "משרדים", "3": "תעשייה", "4": "מסחר", "5": "מחסנים", "6": "מגורים", "7": "חנייה"};
       app_select.loadSelect(tag, selectValues, 0, value, lookup);
   },
   AdsTypeJqx: function (tag, value, lookup) {
       if (tag === undefined)
           tag = "#MediaType";
       var selectValues = { "1": "אתר החברה", "2": "יד2-רגיל", "3": "יד2-צהוב", "4": "יד2-ורוד", "5": "גלובס", "6": "דה מרקר", "7": "שילוט" };
       app_select.jqxSelect(tag, selectValues, 0, value);
   },
   AdsType: function (tag, value, lookup) {
       if (tag === undefined)
           tag = "#MediaType";
       var selectValues = { "1": "אתר החברה", "2": "יד2-רגיל", "3": "יד2-צהוב", "4": "יד2-ורוד", "5": "גלובס", "6": "דה מרקר", "7": "שילוט"};
       app_select.loadSelect(tag, selectValues, 0, value, lookup);
   },
   AdsStatus: function (form, tag, value) {
       if (tag === undefined)
           tag = "#Status";
       var selectValues = { "0": "ממתין", "1": "פעיל", "2": "דחוי" };
       app_select.loadSelectInput(form, tag, selectValues, 0, value);
   },
   AdsPropertyType: function (tag, value, lookup) {
       if (tag === undefined)
           tag = "#PropertyType";
       var selectValues = { "1": "יחידה", "2": "מגרש"};
       app_select.loadSelect(tag, selectValues, 0, value, lookup);
   },
   ParkingType: function (tag, value, lookup) {
       if (tag === undefined)
           tag = "#ParkingType";
       var selectValues = { "0": "ללא", "1": "תת קרקעי", "2": "חיצוני" };
       app_select.loadSelect(tag, selectValues, 0, value, lookup);
   },
   BuildingClass: function (tag, value) {
        if (tag === undefined)
            tag = "#ClassType";
        var selectValues = { "A": "קלאס איי", "B": "קלאס בי", "C": "קלאס סי", "D": "קלאס די" };
        app_select.loadSelect(tag, selectValues, 0, value);
    },
    TransType: function (tag, value, lookup) {
        if (tag === undefined)
            tag = "#TransType";
        var selectValues = { "1": "עסקה מצד הדייר/רוכש", "2": "עסקה מצד בעל הנכס/מוכר", "3": "עסקת ייעוץ" };
        app_select.loadSelect(tag, selectValues, 0, value, lookup);
    },
    BroadcastDealType: function (tag, value) {
        if (tag === undefined)
            tag = "#DealType";
        var selectValues = { "0": "הכל","1": "מכירה", "2": "שכירות"};
        app_select.loadSelect(tag, selectValues, 0, value);
    },
    BroadcastPurposeType: function (tag, value) {
        if (tag === undefined)
            tag = "#PurposeType";
        var selectValues = {  "0": "הכל", "1": "משרדים", "2": "תעשיה", "4": "מסחר", "8": "מחסנים", "16": "מגורים", "32": "חניה"};
        app_select.loadSelect(tag, selectValues, 0, value);
    },
    BroadcastAreaType: function (tag, value) {
        if (tag === undefined)
            tag = "#AreaType";
        var selectValues = {  "0": "הכל","1": "מרכז", "2": "צפון", "4": "דרום", "8": "ירושלים", "16": "שפלה", "32": "שרון"};//, "7": "תל אביב"};
        app_select.loadSelect(tag, selectValues, 0, value);
    },
    BroadcastSize: function (tag, value) {
        if (tag === undefined)
            tag = "#Size";
        var selectValues = { "0": "הכל", "1000": "מעל 1000 מטר"};
        app_select.loadSelect(tag, selectValues, 0, value);
    },
    enumTypes_load: function (tag, model, selectValue) {

        app_control.selectTag(tag, 200);
        app_control.fillSelect(tag, '/System/GetEnumTypesList', { 'model': model }, "PropId", "PropName", selectValue);
    },
};

//============================================================================================ app_accounts

var app_accounts = {

    getAgentName: function (id, input) {
        console.log(id);
        $.ajax({
            type: "POST",
            url: "/Common/GetAgentName",
            data: { 'id': id },
            //contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                $('#' + input).val(data);// data.d);
            },
            error: function (jqXHR, status, error) {
                alert(error);
            }
        });
    },
    accountDisplay: function (id, title, divResult) {
        //alert(val);
        $.ajax({
            type: "POST",
            url: "/Common/GetAccountDetails",
            data: "{ 'id': '" + id + "' }",
            contentType: "application/json; charset=utf-8",
            //dataType: "json",
            success: function (data) {
                app_dialog.popMessage(title, data);// data.d);
            },
            error: function (jqXHR, status, error) {
                alert(error);
                if (divResult)
                    $("#" + divResult).html("WebSerivce unreachable");
            }
        });
    },

    displayAccountType: function (acctype) {
        if (acctype == 2)
            return "בעלים";
        if (acctype == 1)
            return "לקוח";
        else if (acctype == 6)
            return "חברת ניהול";
        else if (acctype == 4)
            return "דייר";
        else
            return 'חשבון'
    },

    displayAccountCategoryType: function (acctype) {
        if (acctype == 2)
            return "סוג בעלים";
        if (acctype == 1)
            return "סוג לקוח";
            //else if (acctype == 6)
            //    return "חברת ניהול";
            //else if (acctype == 4)
            //    return "דייר";
        else
            return 'קטגוריה'
    },

    accountEdit: function (id, acctype) {
        //alert(id);
        var title = "הגדרת חשבון";
        if (acctype == 2)
            title = "הגדרת בעלים";
        if (acctype == 1)
            title = "הגדרת לקוח";
        else if (acctype == 6)
            title = "הגדרת חברת ניהול";
        else if (acctype == 4) {
            title = "הגדרת דייר";
            return app_dialog.dialogIframe("/Common/_TenantEdit?id=" + id + "&acctype=" + acctype, "420", "400", title);
        }

        if (id > 0)
            return app_dialog.dialogIframe("/Common/_AccountEdit?id=" + id + "&acctype=" + acctype, "500", "580", title);
        else
            return app_dialog.dialogIframe("/Common/_AccountEditNew?acctype=" + acctype, "500", "520", title);
    },

    accountPanel: function (id, acctype, tag) {

        //$(tag).empty();
        //alert(id);
        var title = "הגדרת חשבון";
        if (acctype == 2)
            title = "הגדרת בעלים";
        if (acctype == 1)
            title = "הגדרת לקוח";
        else if (acctype == 6)
            title = "הגדרת חברת ניהול";
        else if (acctype == 4) {
            title = "הגדרת דייר";
            app_iframe.appendPanel(tag, "/Common/_TenantEdit?id=" + id + "&acctype=" + acctype, '100%', 400, true, title);
        }

        if (id > 0)
            app_iframe.appendPanel(tag, "/Common/_AccountEdit?id=" + id + "&acctype=" + acctype, '100%', 500, true, title);
        else
            app_iframe.appendPanel(tag, "/Common/_AccountEditNew?acctype=" + acctype, '100%', 500, true, title);
    },
    accountPanelSwitch: function (id, acctype, tagParent) {

        //$(tag).empty();
        //alert(id);
        var title = "הגדרת חשבון";
        if (acctype == 2)
            title = "הגדרת בעלים";
        if (acctype == 1)
            title = "הגדרת לקוח";
        else if (acctype == 6)
            title = "הגדרת חברת ניהול";
        else if (acctype == 4) {
            title = "הגדרת דייר";
            app_iframe.appendPanelSwitch(tagParent, "/Common/_TenantEdit?id=" + id + "&acctype=" + acctype, '100%', 400, true, title);
        }

        if (id > 0)
            app_iframe.appendPanelSwitch(tagParent, "/Common/_AccountEdit?id=" + id + "&acctype=" + acctype, '100%', 500, true, title);
        else
            app_iframe.appendPanelSwitch(tagParent, "/Common/_AccountEditNew?acctype=" + acctype, '100%', 500, true, title);
    },

    accountDelete: function (id, acctype, async) {
        if (typeof async === 'undefined') { async = true; }

        var title = "האם למחוק כרטיס חשבון ";
        if (acctype == 2)
            title = "האם למחוק כרטיס בעלים ";
        if (acctype == 1)
            title = "האם למחוק כרטיס לקוח ";
        else if (acctype == 6)
            title = "כרטיס חברת ניהול ";
        else if (acctype == 4)
            title = "האם למחוק כרטיס דייר ";

        if (!confirm(title + id))
            return false;

        $.ajax({
            async: async,
            type: "POST",
            url: "/Crm/AccountDelete",
            data: "{ 'AccountId': " + id + " , 'AccType': '" + acctype + "' }",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                if (data.Status < 0)
                    return false;
                app_dialog.popMessage(data.Title, data.Message, "auto");
                return true;
            },
            error: function (e) {
                alert(e);
                return false;
            }
        });
    },

    AccountNewsAdd: function (id) {
        var title = "הגדרת קבוצת דיוור";
        return app_dialog.dialogIframe("/Common/_AccountNewsEdit?id=" + id, "400", "550", title);
    },

    AccountNewsRemove: function (newsid, accid) {
        if (confirm("האם להסיר לקוח " + accid + " מקבוצת דיוור " + newsid)) {
            $.ajax({
                type: "POST",
                url: "/Common/AccountNewsDelete",///Ws/CrmWs.asmx/AccountNewsDelete",
                data: "{ 'AccountId': '" + accid + "','NewsId': '" + newsid + "' }",
                contentType: "application/json; charset=utf-8",
                //dataType: "json",
                success: function (data) {
                    app_dialog.popMessage('קבוצות דיוור', 'לקוח ' + accid + ' הוסר מקבוצת דיוור ' + newsid, "auto");
                },
                error: function (e) {
                    alert(e);
                }
            });
        }
    },

    AccountValidate: function (accType, accName, contactName, cell) {

        var result;

        $.ajax({
            async: false,
            type: "POST",
            url: "/Common/AccountValidate",
            data: { 'AccountType': accType, 'AccountName': '' + accName + '', 'ContactName': '' + contactName + '', 'CellPhone': '' + cell + '' },
            //contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                result = data;
            },
            error: function (e) {
                alert(e);
            }
        });
        return result;
    },
    accTypeToString: function (accType) {

        switch (accType) {
            case 0: return "לא ידוע";
            case 1: return "לקוח";
            case 2: return "בעלים";
            case 3: return "משקיע";
            case 4: return "דייר";
            case 5: return "בעל מקצוע";
            case 6: return "חברת ניהול";
        }
        return "";
    }
};

//============================================================================================ app_contacts

var app_contacts = {

    getContactRole: function (accType) {

        switch (accType) {
            case 0://Unknown = 0,    //0	לא ידוע
                return 1;// BuildingContact=1,
            case 7://Lead = 7//לקוח סןכן
                return 3;//LeadContact=5
        }
        return 0;// account
    },

    appendContactIframe: function (iframe, id, role, uploadKey) {
        app_iframe.appendIframe(iframe, "/Common/_Contacts?id=" + id + "&role=" + role + "&uk=" + uploadKey, "500", "300");
    },

    contactDisplay: function (val, title, divResult) {
        $.ajax({
            type: "POST",
            url: "/Common/GetContactDetails",///Ws/CrmWs.asmx/GetContactDetails",//"/Ws/CrmWs.asmx/GetContactDetails",
            data: "{ 'id': '" + val + "' }",
            contentType: "application/json; charset=utf-8",
            //dataType: "json",
            success: function (data) {
                app_dialog.popMessage(title, data);//data.d);
            },
            error: function (e) {
                if (divResult)
                    $("#" + divResult).html("WebSerivce unreachable");
            }
        });
    },

    contactPanel: function (id, accid, op, uk, tag) {

        if (id === undefined)
            return;
        if (accid === undefined)
            accid = 0;
        if (uk === undefined)
            uk = '';
        app_iframe.appendPanelBefore(tag, "/Common/_ContactEdit?id=" + id + "&pid=" + accid + "&op=" + op + "&uk=" + uk, "100%", "340", true, "עריכת פרטי איש קשר");
    },

    contactEdit: function (id, accid, op, uk) {
        if (id === undefined)
            return;
        if (accid === undefined)
            accid = 0;
        if (uk === undefined)
            uk = '';
        return app_dialog.dialogIframe("/Common/_ContactEdit?id=" + id + "&pid=" + accid + "&op=" + op + "&uk=" + uk, "320", "340", "אנשי קשר");
    },

    contactEditSwitch: function (tag, tagParent, id, pid, op, uk) {
        if (id === undefined)
            return;
        if (pid === undefined)
            pid = 0;
        if (uk === undefined)
            uk = '';
        $(tagParent).hide();
        $(tag).empty();
        $(tag).show();
        app_iframe.appendIframe(tag, "/Common/_ContactEdit?id=" + id + "&pid=" + pid + "&op=" + op + "&uk=" + uk, "290", "340", "אנשי קשר");
    },

    contactDeleteConfirmed: function (id, enablePopMessage, async) {
        if (typeof async === 'undefined') { async = true; }
        $.ajax({
            async: async,
            type: "POST",
            url: "/Common/ContactDelete",///Ws/CrmWs.asmx/ContactDelete",
            data: "{ 'id': '" + id + "' }",
            contentType: "application/json; charset=utf-8",
            //dataType: "json",
            success: function (data) {
                if (enablePopMessage)
                    app_dialog.popMessage('אנשי קשר', 'איש קשר ' + id + 'הוסר מהמערכת ', "auto");
            },
            error: function (e) {
                alert(e);
            }
        });
    },
    contactDelete: function (id, async, func) {
        if (typeof async === 'undefined') { async = true; }
        app_dialog.confirm("האם למחוק איש קשר " + id, function (id) {
            $.ajax({
                async: async,
                type: "POST",
                url: "/Common/ContactDelete",///Ws/CrmWs.asmx/ContactDelete",
                data: "{ 'id': '" + id + "' }",
                contentType: "application/json; charset=utf-8",
                //dataType: "json",
                success: function (data) {
                    app_dialog.popMessage('אנשי קשר', 'איש קשר ' + id + 'הוסר מהמערכת ', "auto");
                    if (func)
                        func();
                },
                error: function (e) {
                    alert(e);
                }
            });

        }, id);


        //if (confirm("האם למחוק איש קשר " + id)) {
        //    $.ajax({
        //        async: async,
        //        type: "POST",
        //        url: "/Common/ContactDelete",///Ws/CrmWs.asmx/ContactDelete",
        //        data: "{ 'id': '" + id + "' }",
        //        contentType: "application/json; charset=utf-8",
        //        //dataType: "json",
        //        success: function (data) {
        //            app_dialog.popMessage('אנשי קשר', 'איש קשר ' + id + 'הוסר מהמערכת ', "auto");
        //        },
        //        error: function (e) {
        //            alert(e);
        //        }
        //    });
        //}
    }
};

//============================================================================================ app_leads

var app_leads = {

    validateLeadAccountName: function (name, inputResult, async) {
        if (typeof async === 'undefined') { async = true; }

        $.ajax({
            async: async,
            type: "POST",
            url: "/Common/ValidateLeadAccountName",
            data: "{ 'name': '" + name + "' }",
            contentType: "application/json; charset=utf-8",
            //dataType: "json",
            success: function (data) {
                if (data == "ok")
                    return;
                else {
                    if (inputResult) {
                        var confirmRes = confirm(data + "\n" + " האם להמשיך? ");
                        //alert(confirmRes)
                        $("#" + inputResult).val(confirmRes);
                    }
                    else
                        app_dialog.popMessage('בדיקת לקוח', data);
                }
            },
            error: function (e) {
                alert(e);
            }
        });

    }

};

//============================================================================================ app_units

var app_units = {

    validateUnitSize: function (origSize, newSize, maxSize) {

        if (!$.isNumeric(newSize) || !$.isNumeric(maxSize))
            return false;
        var actualSize = parseFloat(newSize) - parseFloat(origSize);
        var ok = parseFloat(maxSize) >= actualSize;

        return ok;
    },
    deleteUnit: function (unitId, BuildingId, FloorNum, PropertyType) {

        if (confirm("האם למחוק יחידה לצמיתות?") == false) {
            return;
        }
        $.ajax({
            url: '/Building/DeleteUnit',
            type: 'post',
            dataType: 'json',
            data: { 'UnitId': unitId, 'BuildingId': BuildingId, 'FloorNum': FloorNum, 'PropertyType': PropertyType },
            success: function (data) {
                alert(data.Message);
                if (data.Status > 0) {
                    //$("#jqxgrid").jqxGrid('source').dataBind();
                    window.location.reload();
                }
            },
            error: function (jqXHR, status, error) {
                alert(error);
            }
        });

    },
    unitDef: function (id) {
        app.redirectTo('UnitDef?id=' + id + '&bid=' + 0 + '&floor=0&op=0');
    }
};

//============================================================================================ app_buildings

var app_buildings = {
    getFormAction: function (formtype) {
        //if (formtype == 'formNatam')
        //    return '/Building/BuildingGrid';
        var val = app_form.getCheckedValue(formtype);
        //var val = $('.' + formtype).val();
        switch (val) {
            case "Buildings":
                return '/Building/BuildingGrid'
            case "UnitsBuilding":
                return '/Building/BuildingGrid';
            case "Units":
                return '/Building/BuildingUnitGrid';
            default:
                return '/Building/BuildingGrid';
        }
    },
    buildingDef: function (id) {
        app.redirectTo("/Building/BuildingDef?id=" + id);
    },

    plotsDelete: function (id) {

        //if (!confirm("האם למחוק כרטיס מגרש " + id))
        //    return;

        app_dialog.confirm("האם למחוק מגרש " + id, function () {
            $.ajax({
                //async: async,
                type: "POST",
                url: "/Building/DeletePlots",
                data: { 'PlotsId': id },
                //contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    app_dialog.popMessage(data.Title, data.Message, "auto");
                },
                error: function (e) {
                    alert(e);
                }
            });
        });
    }
};



