

function triggerPrimaryContactCompleted(id, isPrimary, rcd) {

    var ContactId;
    var ContactName;
    var Mobile;
    var Email
    var uid;
    var Phone1;
    var Title;

    if (isPrimary) {
        $("#ContactName").val(rcd.ContactName);
        $("#Mobile").val(rcd.Mobile);
        $("#Email").val(rcd.Email);
    }
    $("#ContactName").focus();
    //return false;
    //var record = row;
 
    //$("#ContactName").val();

}

//============================================================================================ app_accounts_def

function app_accounts_def(accountId, accountType, userRule, isNew) {
    //alert(accountId+ ', acctype ' + accountType);
    this.AccountId = accountId;
    this.AccountType = accountType;
    this.UserRole = userRule;

    this.allowEdit = (this.UserRole == 9) ? 1 : 0;

    this.contactRole = app_contacts.getContactRole(accountType);

    this.contactsLoaded = false;

    //if (isNew) {

    //    console.log('isNew');
    //}
    //else {
    //    if (this.AccountId > 0)
    //        $('#accContacts').show();
    //    else
    //        $('#accContacts').hide();
    //}

    $('#AccountType').val(this.AccountType);


    if (this.AccountType == 1 || this.AccountType == 2) {

        this.categoryAdapter = app_jqxcombos.createDropDownAdapter("CategoryId", "CategoryName", "AccountCategory", '/Common/GetCategoryView', 155);
    }
    $('#lblCategory').text(app_accounts.displayAccountCategoryType(this.AccountType));

   // this.loadControls(isNew);

    this.loadDataAdapter = function () {

        var slf = this;

        this.view_source =
        {
            datatype: "json",
            datafields: [
                    { name: 'AccountId', type: 'number' },
                    { name: 'AccountName', type: 'string' },
                    { name: 'AccountType', type: 'string' },
                    { name: 'AccountCategory', type: 'number' },
                    //{ name: 'CompanyName', type: 'string' },
                    //{ name: 'ContactName', type: 'string' },
                    { name: 'Street', type: 'string' },
                    { name: 'City', type: 'string' },
                    { name: 'Phone1', type: 'string' },
                    { name: 'Phone2', type: 'string' },
                    //{ name: 'Mobile', type: 'string' },
                    //{ name: 'Email', type: 'string' },
                    { name: 'Fax', type: 'string' },
                    { name: 'WebSite', type: 'string' },
                    { name: 'ZipCode', type: 'string' },
                    { name: 'Details', type: 'string' }
            ],
            id: 'AccountId',
            data: { 'id': slf.AccountId, 'acctype': slf.AccountType },
            type: 'POST',
            url: '/Common/GetAccountEdit'
        };

        this.viewAdapter = new $.jqx.dataAdapter(this.view_source, {
            loadComplete: function (record) {

                slf.syncData(record);
                slf.loadControls(record);
            },
            loadError: function (jqXHR, status, error) {
            },
            beforeLoadComplete: function (records) {
            }
        });
        this.viewAdapter.dataBind();
    };

    if (this.AccountId > 0)
    {
        this.loadDataAdapter();
        $('#accContacts').show();
    }
    else
    {
        $('#accContacts').hide();
        this.loadControls();
    }

    this.doSubmit = function (callback) {
        //e.preventDefault();

        var actionurl = $('#accForm').attr('action');
        var validationResult = function (isValid) {
            if (isValid) {
                //ajaxForm("/Common/UpdateAccount", "accForm", onSuccess);
                $.ajax({
                    url: actionurl,
                    type: 'post',
                    dataType: 'json',
                    data: app.serialize('#accForm'),
                    success: function (data) {
                        //alert(data.Message);
                        app_jqxnotify.notify(data.Message);
                        if (data.Status >= 0) {

                            //$('#accWindow').jqxWindow('close');
                            var accType = $('#AccountType').val();
                            if (parent.app_trigger && parent.app_trigger.triggerAccComplete)
                                parent.app_trigger.triggerAccComplete(accType, data.OutputId);
                        }
                        if (callback)
                            callback(true);

                    },
                    error: function (jqXHR, status, error) {
                        alert(error);
                    }
                });
            }
            else {
                if (callback)
                    callback(false);
            }
        }
        $('#accForm').jqxValidator('validate', validationResult);
    };
    this.FoundId = 0;
    this.submitConfirm = function (confirm) {

        if (confirm == 'yes' && this.FoundId > 0)
        {
            parent.app_trigger.triggerAccComplete(this.AccountType, this.FoundId);
        }
        else if (confirm == 'no')
        {
            this.submitNewAccount();
        }
    }

    this.doSubmitNew = function (callback) {
        //e.preventDefault();
        var slf = this;
        var validationResult = function (isValid) {
            if (isValid) {

                var accType = $('#AccountType').val();
                var accName = $('#AccountName').val();
                var contactName = $('#ContactName').val();
                var cell = $('#ContactMobile').val();

                var result = app_accounts.AccountValidate(accType, accName, contactName, cell);
                if (result && result.OutputId > 0) {
                    slf.FoundId = result.OutputId;
                    var msg = "<p>" + "קיימת רשומה עם  פרטים זהים במערכת האם להמשיך ?" + "</p>" +
                       "<p>" + "לצפייה " + "<a href=\"javascript:app_accounts.accountDisplay(" + result.OutputId + ",'');\">הצג</a>" + "</p>" +
                       "<p>" + "לבחירת הרשומה שנמצאה לחץ על כן" + "</p>" +
                       "<p>" + "להתעלמות מהרשומה שנמצאה לחץ על לא" + "</p>" +
                       "<p>" + "לביטול התהליך לחץ על ביטול" + "</p>";

                    app_dialog.confirmMessage("הגדרות", msg, slf);
                    if (callback)
                        callback(false);
                    return;
                }

                slf.submitNewAccount(callback);
            }
            else {
                if (callback)
                    callback(false);
            }
        }
        $('#accForm').jqxValidator('validate', validationResult);
    };

    this.submitNewAccount=function(callback){

        var actionurl = $('#accForm').attr('action');
        $.ajax({
            url: actionurl,
            type: 'post',
            dataType: 'json',
            data: app.serialize('#accForm'),
            success: function (data) {
                alert(data.Message);
                if (data.Status >= 0) {

                    //$('#accWindow').jqxWindow('close');
                    var accType = $('#AccountType').val();

                    if (window.parent.app_trigger.triggerAccComplete)
                        window.parent.app_trigger.triggerAccComplete(accType, data.OutputId);
                    else if (app_trigger.triggerAccComplete)
                        app_trigger.triggerAccComplete(accType, data.OutputId);
                }
                if (callback)
                    callback(data.Status >= 0);

            },
            error: function (jqXHR, status, error) {
                alert(error);
                if (callback)
                    callback(false);
            }
        });
    };

    this.setAccountTypeElemnts = function (AccountType) {

        if (AccountType == 1) {
            //title = "הגדרת בעלים";
            $("#lblName").text("שם חברה");
            $("#divCategory").show();
        }
        else if (AccountType == 2) {
            //title = "הגדרת בעלים";
            $("#lblName").text("שם בעלים");
            $("#divCategory").show();
        }
        else if (AccountType == 6) {
            //title = "הגדרת חברת ניהול";
            $("#lblName").text("שם חברת ניהול");
            $("#divCategory").hide();
        }
        else {
            $("#lblName").text("שם");
            $("#divCategory").show();
        }
    }

    this.setAccountTypeElemnts(this.AccountType);
};

app_accounts_def.prototype.syncData = function (record) {

    if (record) {
        //srcAccountType = record.AccountType;

        app_jqxform.loadDataForm("accForm", record);
      
        //$('#AccountType').val(this.AccountType);

        //var title = "הגדרת חשבון";
        if (this.AccountType == 1) {

            if (this.allowEdit == 1) {
                //$("#divContact").hide();
                $("#accSubmit").show();
                $("#accCancel").show();
            }
            else {
                $("#accSubmit").hide();
                $("#accCancel").hide();
            }
        }
        
        //onEmailLink();
        //onWebsiteLink();
        app_jqxform.setLinkHref('Email', 'emailLink', true);
        app_jqxform.setLinkHref('WebSite', 'websiteLink', false);
        //$("#accHeader").append("<h4>" + title + "</h4>");
        //$("#divCategory")

        //selectDropDownValue("AccountCategory", record.AccountCategory);
    }
};

app_accounts_def.prototype.loadControls = function (record) {



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

    //if (isNew) {
    //    input_rules.push(
    //        { input: '#ContactName', message: 'שם+שם משפחה חובה', action: 'keyup, blur', rule: 'required' },
    //        //{ input: '#ContactMobile', message: 'טלפון נייד חובה', action: 'keyup, blur', rule: 'required' },
    //        {
    //            input: '#ContactMobile', message: 'ניתן להקליד מספרים בלבד!', action: 'keyup,valuechanged, blur', rule:
    //            function (input, commit) {
    //                var val = input.val();
    //                var re = /^([0-9])+$/
    //                return val ? re.test(val) : true;
    //            }
    //        },
    //        { input: '#ContactEmail', message: 'אימייל חובה', action: 'keyup, blur', rule: 'required' },
    //        { input: '#ContactEmail', message: 'אימייל לא תקין', action: 'keyup, blur', rule: 'email' }
    //     );

    //}
    //else {
    //    input_rules.push({
    //        input: '#Phone2', message: 'ניתן להקליד מספרים בלבד!', action: 'valuechanged, blur', rule:
    //        function (input, commit) {
    //            var val = input.val();
    //            var re = /^([0-9])+$/
    //            return val ? re.test(val) : true;
    //        }
    //    });

    //}

    $('#accForm').jqxValidator({
        rtl: true,
        hintType: 'label',
        animationDuration: 0,
        rules: input_rules
    });



                  
                  //{
                  //    input: '#Phone2', message: 'ניתן להקליד מספרים בלבד!', action: 'valuechanged, blur', rule:
                  //function (input, commit) {
                  //    var val = input.val();
                  //    var re = /^([0-9])+$/
                  //    return val ? re.test(val) : true;
                  //}
                  //},
                  //{
                  //    input: '#Fax', message: 'ניתן להקליד מספרים בלבד!', action: 'valuechanged, blur', rule:
                  //function (input, commit) {
                  //    var val = input.val();
                  //    var re = /^([0-9])+$/
                  //    return val ? re.test(val) : true;
                  //}
                  //}
                  //{ input: '#ContactName', message: 'חובה לציין איש קשר', action: 'keyup, blur', rule: 'required' },
                  //{ input: '#Address', message: 'חובה לציין כתובת', action: 'keyup, blur', rule: 'required' },
                  //{ input: '#City', message: 'חובה לציין עיר', action: 'keyup, blur', rule: 'required' },
                  //{ input: '#Email', message: 'אימייל לא תקין', action: 'keyup', rule: 'email' },
                  //{
                  //    input: '#Phone1', message: 'טלפון 1 אינו תקין', action: 'valuechanged, blur', rule:
                  //              function (input, commit) {
                  //                  return validatePhone(input.val());
                  //              }
                  //},
                   //{
                   //    input: '#Mobile', message: 'טלפון נייד אינו תקין', action: 'valuechanged, blur', rule:
                   //              function (input, commit) {
                   //                  return validatePhone(input.val());
                   //              }
                   //},
                  //{
                  //    input: '#Fax', message: 'פקס אינו תקין', action: 'valuechanged, blur', rule:
                  //              function (input, commit) {
                  //                  return validatePhone(input.val());
                  //              }
                  //}
    //        ]
    //    });

    //}
    //else {

    //    $('#accForm').jqxValidator({
    //        rtl: true,
    //        //hintType: 'label',
    //        animationDuration: 0,
    //        rules: [
    //              { input: '#AccountName', message: 'חובה לציין שם', action: 'keyup, blur', rule: 'required' },
    //              {
    //                  input: '#Phone1', message: 'ניתן להקליד מספרים בלבד!', action: 'valuechanged, blur', rule:
    //              function (input, commit) {
    //                  var val = input.val();
    //                  var re = /^([0-9])+$/
    //                  return val ? re.test(val) : true;
    //              }
    //              },
    //              {
    //                  input: '#Phone2', message: 'ניתן להקליד מספרים בלבד!', action: 'valuechanged, blur', rule:
    //              function (input, commit) {
    //                  var val = input.val();
    //                  var re = /^([0-9])+$/
    //                  return val ? re.test(val) : true;
    //              }
    //              },
    //              {
    //                  input: '#Fax', message: 'ניתן להקליד מספרים בלבד!', action: 'valuechanged, blur', rule:
    //              function (input, commit) {
    //                  var val = input.val();
    //                  var re = /^([0-9])+$/
    //                  return val ? re.test(val) : true;
    //              }
    //              }
    //              //{ input: '#ContactName', message: 'חובה לציין איש קשר', action: 'keyup, blur', rule: 'required' },
    //              //{ input: '#Address', message: 'חובה לציין כתובת', action: 'keyup, blur', rule: 'required' },
    //              //{ input: '#City', message: 'חובה לציין עיר', action: 'keyup, blur', rule: 'required' },
    //              //{ input: '#Email', message: 'אימייל לא תקין', action: 'keyup', rule: 'email' },
    //              //{
    //              //    input: '#Phone1', message: 'טלפון 1 אינו תקין', action: 'valuechanged, blur', rule:
    //              //              function (input, commit) {
    //              //                  return validatePhone(input.val());
    //              //              }
    //              //},
    //               //{
    //               //    input: '#Mobile', message: 'טלפון נייד אינו תקין', action: 'valuechanged, blur', rule:
    //               //              function (input, commit) {
    //               //                  return validatePhone(input.val());
    //               //              }
    //               //},
    //              //{
    //              //    input: '#Fax', message: 'פקס אינו תקין', action: 'valuechanged, blur', rule:
    //              //              function (input, commit) {
    //              //                  return validatePhone(input.val());
    //              //              }
    //              //}
    //        ]
    //    });
    //}
};



app_accounts_edit = function (tagDiv) {
    this.accDef;
    this.contactGrid;
    this.Model;
    this.tagDiv = tagDiv;
    this.contactRole = 0;

    this.init = function (model) {//id, acctype,role
        //var data_model = { Id: id, AccType: this.Model.AccType, Role: this.UInfo.UserRole, Option: option, Action: action };
        if (this.accDef == null) {

            var slf = this;

            this.Model = model;
            //var container = $(html);
            //$(this.tagDiv).empty();
            //$(this.tagDiv).append(container);

            this.load();
            $("#accHeader").text(app_accounts.accTypeToString(model.AccType));
            this.accDef = new app_accounts_def(model.Id, model.AccType, model.Role, model.Option=='a');
            this.accDef.loadDataAdapter();
            this.contactRole = app_contacts.getContactRole(model.AccType);

            //$("#contactsGrid-exp").jqxExpander({ rtl: true, width: '50%', animationType: 'fade', expandAnimationDuration: 500, collapseAnimationDuration: 350, expanded: false });
            //var contactsLoaded = false;
            //$('#contactsGrid-exp').on('expanding', function () {
            //    if (contactsLoaded == false) {
            //        //var close = $('<a href="#">סגור</a>').click(function () {
            //        //    $("#contactsGrid").hide();
            //        //});
            //        //$("#contactsGrid").append(close);
            //        //$("#contactsGrid").empty();
            //        var role = app_contacts.getContactRole(slf.Model.AccType);
            //        var uploadKey = "";
            //        $('#contactsGrid').show();
            //        app_iframe.appendIframe("contactsGrid", "/Common/_Contacts?id=" + slf.Model.Id + "&role=" + role + "&uk=" + uploadKey, "500", "350");
            //        contactsLoaded = true;
            //    }
            //    else {
            //        $('#contactsGrid').show();
            //    }
            //});

            var contactsLoaded = false;
            $('#accContacts').click(function () {

                if (contactsLoaded == false) {
                    //var close = $('<a href="#">סגור</a>').click(function () {
                    //    $("#contactsGrid").hide();
                    //});
                    //$("#contactsGrid").append(close);
                    $('#contactsGrid').show();
                    var role = slf.contactRole;// app_contacts.getContactRole(slf.Model.AccType);
                    var uploadKey = null;
                    app_iframe.appendIframe("contactsGrid", "/Common/_Contacts?id=" + slf.Model.Id + "&role=" + role + "&uk=" + uploadKey, "100%", "350");
                    contactsLoaded = true;
                }
                else {
                    $('#contactsGrid').show();
                }
            });
            $('#accClose').click(function () {
                $('#contactsGrid').hide();
            });

            $('#accSubmit').on('click', function (e) {
                e.preventDefault();

                this.accDef.doSubmit();
            });

            $('#Email').on('input propertychange paste', function () {
                //onEmailLink();
                app_jqxform.setLinkHref('Email', 'emailLink', true);
            });
            $('#WebSite').on('input propertychange paste', function () {
                //onWebsiteLink();
                app_jqxform.setLinkHref('WebSite', 'websiteLink', false);
            });

            //var loadHtml = function (tagDiv) {


              

            //$(this.tagDiv).html(html);
            //};
        }
    };
    this.load = function () {

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
    </div>*/}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1];//.toString().split('\n').slice(1, -1).join('\n');


        //<div id="jqxwindow">
        //    <div>
        //        עריכת איש קשר
        //    </div>
        //    <div style="overflow: hidden;">
                                       
        //    </div>
        //    <div>
        //        <input type="button" style='margin-top: 15px; margin-left: 50px; float: left;' value="Find" id="updateButton" />
        //        <input type="button" style='margin-left: 5px; margin-top: 15px; float: left;' value="Clear" id="clearButton" />
        //    </div>
        //</div>



        var container = $(html);
        $(this.tagDiv).empty();
        $(this.tagDiv).append(container);
        if (this.Model.Option != 'a' && this.Model.Id>0) {
            this.contactGrid = new app_contacts_grid();
            this.contactGrid.init(this.Model.Id, this.contactRole, "");
        }
    };
    this.display = function () {
        $(this.tagDiv).show();
    };
    this.hide = function () {
        $(this.tagDiv).hide();
    };
    this.update = function () {
        if (this.accDef != null) {
            if (this.Model.Option == 'a')
                this.accDef.doSubmitNew(function (data) {
                    return data;
                });
            else
                this.accDef.doSubmit(function (data) {
                    return data;
                });
        }
        return false;
    };

};

app_contacts_grid = function (){

    this.NSaccountcontacts = {};
    this.accountId;
    this.role;
    this.uk;
    this.isMobile = false;
    this.init = function (accid, role, uk) {
        this.accountId = accid;
        this.isMobile = app.IsMobile();
        this.role = role;
        this.uk = uk;
        var slf = this;
        var isprimary = true;
        var isMobile = true;// app.IsMobile();

        isprimary = (parent.app_trigger.triggerPrimaryContactCompleted);

        //$("#contacts_add-window").jqxWindow({ resizable: false, autoOpen: false, width: 210, height: 180 });

        //$("#contacts_dropdown").jqxDropDownButton({
        //    width: 250, height: 25, rtl: true, popupZIndex: 0, animationType: 'fade', openDelay: 200, closeDelay: 200
        //});
        //$("#contacts_dropdown").jqxDropDownButton('setContent', "אנשי קשר");

        $("#contacts_dropdown").jqxExpander({ width: '100%', rtl: true, animationType: 'fade', expandAnimationDuration: 500, collapseAnimationDuration: 350, expanded: false });

        //contacts
        var nastedsource = {
            datafields: [
                  { name: 'IsPrimary', type: 'boolean' },
                  { name: 'ContactId', type: 'number' },
                  { name: 'AccountId', type: 'number' },
                  { name: 'ContactName', type: 'string' },
                  { name: 'Title', type: 'string' },
                  { name: 'Details', type: 'string' },
                  { name: 'Email', type: 'string' },
                  { name: 'Phone1', type: 'string' },
                  { name: 'Mobile', type: 'string' }
            ],
            datatype: "json",
            id: 'ContactId',
            type: 'POST',
            url: '/Crm/GetContactsView',
            data: { 'parentId': accid, 'role': role, 'uk': uk }
        }

        var nastedAdapter = new $.jqx.dataAdapter(nastedsource);

        $("#contacts-grid").jqxGrid({
            source: nastedAdapter,
            ready: function () {
                //$("#jqxgrid").jqxGrid('showrowdetails', 0);
                setGridButtons();
            },

            width: '99%', height: 180,
            autoheight: true,
            scrollmode: 'default',
            rtl: true,
            showtoolbar: true,
            rendertoolbar: function (statusbar) {
                // appends buttons to the status bar.
                var container = $("<div style='overflow: hidden; position: relative; margin: 5px;direction:rtl'></div>");
                var addButton = $("<div id='addButton-grid' style='float: right; margin-left: 5px;'><i class='fa fa-plus-square' style='font-size:20px;color:#000'></i><span style='margin-left: 4px; position: relative; top: -3px;'>הוספה</span></div>");
                var deleteButton = $("<div id='deleteButton-grid' style='float: right; margin-left: 5px;'><i class='fa fa-remove' style='font-size:20px;color:#000'></i><span style='margin-left: 4px; position: relative; top: -3px;'>הסרה</span></div>");
                var editButton = $("<div id='editButton-grid' style='float: right; margin-left: 5px;'><i class='fa fa-pencil-square' style='font-size:20px;color:#000'></i><span style='margin-left: 4px; position: relative; top: -3px;'>עריכה</span></div>");
                var reloadButton = $("<div id='reloadButton-grid' style='float: right; margin-left: 5px;'><i class='fa fa-refresh' style='font-size:20px;color:#000'></i><span style='margin-left: 4px; position: relative; top: -3px;'>רענון</span></div>");
                container.append(addButton);
                container.append(deleteButton);
                container.append(editButton);
                container.append(reloadButton);
                statusbar.append(container);
                addButton.jqxButton({ width: 60, height: 20 });
                deleteButton.jqxButton({ width: 65, height: 20 });
                editButton.jqxButton({ width: 50, height: 20 });
                reloadButton.jqxButton({ width: 65, height: 20 });
                // add new row.
                addButton.click(function (event) {
                    //var datarow = generatedata(1);
                    //$("#contacts-grid").jqxGrid('addrow', null, datarow[0]);
                    OpenContactItem(0);
                });
                // delete selected row.
                deleteButton.click(function (event) {
                    var selectedrowindex = $("#contacts-grid").jqxGrid('getselectedrowindex');
                    if (selectedrowindex < 0)
                        return;
                    //var rowscount = $("#contacts-grid").jqxGrid('getdatainformation').rowscount;
                    var id = $("#contacts-grid").jqxGrid('getrowid', selectedrowindex);
                    //$("#contacts-grid").jqxGrid('deleterow', id);
                    DeleteContactItem(id);
                    
                });
                // edit selected record.
                editButton.click(function (event) {
                    var selectedrowindex = $("#contacts-grid").jqxGrid('getselectedrowindex');
                    if (selectedrowindex < 0)
                        return;
                    //var rowscount = $("#contacts-grid").jqxGrid('getdatainformation').rowscount;
                    var id = $("#contacts-grid").jqxGrid('getrowid', selectedrowindex);
                    OpenContactItem(id);
                    //$("#contacts-grid").jqxGrid('editrow', id);
                });
                // reload grid data.
                reloadButton.click(function (event) {
                    //$("#contacts-grid").jqxGrid('source').dataBind();
                    Refresh();
                });


                //var rowscount = $("#contacts-grid").jqxGrid('getdatainformation').rowscount;
                //editButton.disabled = rowscount==0;
                //deleteButton.disabled = rowscount == 0;

                //if (rowscount > 0) {
                //    editButton.disabled;
                //    deleteButton.disabled;
                //}
                //else
                //{
                //    editButton.enabled;
                //    deleteButton.enabled;
                //}

                //// search for a record.
                //searchButton.click(function (event) {
                //    var offset = $("#grid").offset();
                //    $("#jqxwindow").jqxWindow('open');
                //    $("#jqxwindow").jqxWindow('move', offset.left + 30, offset.top + 30);
                //});
            },
            rowdetails: true,
            rowdetailstemplate: { rowdetails: "<div style='margin: 10px;'><ul style='margin-right: 30px;'><li class='title'></li><li>פרטים</li></ul><div class='information'></div><div class='notes'></div></div>", rowdetailsheight: 200 },
            initrowdetails: function (index, parentElement, gridElement, datarecord) {

                //NScustomers.currentIndex = index;

                var tabsdiv = null;
                var information = null;
                var notes = null;

                tabsdiv = $($(parentElement).children()[0]);
                if (tabsdiv != null) {
                    information = tabsdiv.find('.information');
                    notes = tabsdiv.find('.notes');
                    var title = tabsdiv.find('.title');
                    title.text(datarecord.ContactName);
          
                    var container = $('<div style="margin: 5px;text-align:right;direction:rtl;"></div>')
                    container.rtl = true;
                    container.appendTo($(information));

                    var divinfo = $("<div style='margin: 10px;'><b>שם:</b> " + datarecord.ContactName + "</div>" +
                                    "<div style='margin: 10px;'><b>טלפון נייד:</b> " + datarecord.Mobile + "</div>" +
                                    "<div style='margin: 10px;'><b>דואר אלקטרוני:</b> " + datarecord.Email + "</div>" +
                                    "<div style='margin: 10px;'><b>תפקיד:</b> " + datarecord.Title + "</div>" +
                                    "<div style='margin: 10px;'><b>פקס:</b> " + datarecord.Phone1 + "</div>" +
                                    "<div style='margin: 10px;'><b>קוד איש קשר:</b> " + datarecord.ContactId + "</div>");
                    divinfo.rtl = true;
                    container.append(divinfo);

                    var linkPrimary = $('<div style="margin:5px"><a href="#" >איש קשר ראשי</a></div>')
                    .click(function () {
                        app_trigger.triggerPrimaryContact(datarecord);
                    });
                    container.append(linkPrimary);

                    var notescontainer = $('<div style="white-space: normal; margin: 5px;text-align:right;"><span>' + app.isNull(datarecord.Details, "") + '</span></div>');
                    notescontainer.rtl = true;
                    $(notes).append(notescontainer);
                    $(tabsdiv).jqxTabs({ width: '95%', height: 170, rtl: true });
                }
            },
            columns: [
              {
                  text: 'ראשי', datafield: 'IsPrimary', width: 90, cellsalign: 'right', align: 'center', hidden: !isprimary || slf.isMobile, //threestatecheckbox: true, columntype: 'checkbox', width: 70,
                  cellsrenderer: function (row, datafield, columntype, oldvalue, newvalue) {

                      return '<div style="text-align:center;direction:rtl;margin:5px;"><a href="#" onclick="return app_trigger.triggerPrimaryContact(' + row + ');">ראשי</a></div>';
                      //cellvaluechanging: function (row, datafield, columntype, oldvalue, newvalue) {
                      //if (oldvalue != newvalue)
                      //{
                      //    triggerPrimaryContact(row, newvalue);
                      //}
                      //return newvalue;
                  }
              },

              { text: 'שם', datafield: 'ContactName', cellsalign: 'right', align: 'center' },
              {
                  text: 'טלפון נייד', datafield: 'Mobile', width: 100, align: 'center', cellsrenderer: function (row, datafield, value) {
                      return isMobile ? '<a style="float:right;"  href="tel:' + value + '">' + value + '</a>' : '<span style="float:right">' + value + '</span>';
                  }
              },
              {
                  text: 'דואל', datafield: 'Email', width: 120, align: 'center',hidden: slf.isMobile, cellsrenderer: function (row, datafield, value) {
                      return '<a href="mailto:' + value + '">' + value + '</a>';
                  }
              },
              { text: 'תפקיד', datafield: 'Title', width: 100, cellsalign: 'right', align: 'center', hidden: isMobile },
              {
                  text: 'פעולות', dataField: 'ContactId', width: 90, cellsalign: 'right', align: 'center',hidden:true,
                  cellsrenderer: function (row, columnfield, value, defaulthtml, columnproperties) {
                      return '<div style="text-align:center;direction:rtl;margin:5px;"><a href="#" onclick="accountContacts_contactEdit(' + value + ');">עריכה</a> | <a href="#" onclick="accountContacts_contactDelete(' + value + ');">הסרה</a></div>'
                  }
              }
            ]
        });
        $('#contacts-grid').on('rowdoubleclick', function (event) {
            var args = event.args;
            var boundIndex = args.rowindex;
            //var visibleIndex = args.visibleindex;
            var id = $("#contacts-grid").jqxGrid('getrowid', boundIndex);
            OpenContactItem(id);
            //slf.edit();
        });

        //$('#contacts-grid').on('bindingcomplete', function (event) {
        //    setGridButtons();
        //});
        //$('#btnAddItem').click(function () {
        //    slf.NSaccountcontacts.contactdialog = app_contacts.contactEdit(0, id, role, uk);// "d");
        //});
        //$('#btnRefresh').click(function () {
        //    nastedAdapter.dataBind();
        //});

        //function EditContactItem(id) {
        //    $("#contacts_dropdown").jqxDropDownButton('close');
        //    app_contacts.contactEditSwitch("#contact-def", "#contacts-grid", id, accid, role, uk);
        //    $("#contacts_dropdown").jqxDropDownButton('open');
        //};
        //function AddContactItem() {
            
        //    app_contacts.contactEditSwitch("#contact-def", "#contacts-grid", 0, accid, role, uk);

        //    //slf.NSaccountcontacts.contactdialog = app_contacts.contactEditSwitch("contact-def", "contacts-grid", 0, id, role, uk);// "d");
        //    //slf.NSaccountcontacts.contactdialog = app_contacts.contactEdit(0, id, role, uk);// "d");
        //};

        function OpenContactItem(id) {
            //$("#contacts_dropdown").jqxDropDownButton('close');
            app_contacts.contactEditSwitch("#contact-def", "#contacts-grid", id, accid, role, uk);
            //$("#contacts_dropdown").jqxDropDownButton('open');
        };

        function DeleteContactItem(id) {

            app_dialog.confirm("האם למחוק איש קשר " + id, function (id) {
                app_contacts.contactDeleteConfirmed(id);
                $("#contacts-grid").jqxGrid('deleterow', id);
                //$("#contacts_dropdown").jqxDropDownButton('open');
                $("#contacts-grid").show();
            }, id);

        };
        

        function Refresh() {
            //$("#contacts-grid").jqxGrid('source').dataBind();
            nastedAdapter.dataBind();
            setGridButtons();

        };
        function setGridButtons() {

            //var opened = $("#contacts_dropdown").jqxDropDownButton('isOpened');
            //if (!opened)
            //    return;
            var expanded = $("#contacts_dropdown").jqxExpander('expanded');
            if (!expanded)
                return;

            var rowscount = $("#contacts-grid").jqxGrid('getdatainformation').rowscount;

            var disabled = rowscount == 0;
            $('#deleteButton-grid').jqxButton({ disabled: disabled });
            $('#editButton-grid').jqxButton({ disabled: disabled });

            disabled = rowscount > 100;
            $('#addButton-grid').jqxButton({ disabled: disabled });
            //$('#reloadButton-grid').jqxButton({ disabled: false });

        };
    };

    function accountContacts_contactDelete(id) {
        app_contacts.contactDelete(id, false);
        $("#contacts-grid").jqxGrid('source').dataBind();
    };

    function accountContacts_contactEdit(id) {
        NSaccountcontacts.contactdialog = app_contacts.contactEdit(id, 0, 0);
    }

    $("#contacts-grid").on('rowselect', function (event) {
        var args = event.args;
        var row = $("#contacts-grid").jqxGrid('getrowdata', args.rowindex);
        //var dropDownContent = '<div style="position: relative; margin-left: 3px; margin-top: 5px;">' + row['ContactName']  + '</div>';
        //$("#contacts_dropdown").jqxDropDownButton('setContent', dropDownContent);
    });


    //$("#contacts-grid").jqxGrid('selectrow', 0);

    //});


};


// global
//==================================================


function custom_account_edit(id) {
    app_accounts_edit
}

app_trigger = {
    triggerPrimaryContactCompleted: function (id, value, rcd) {

        if (rcd) {
            $("#ContactName").val(rcd.ContactName);
            $("#Mobile").val(rcd.Mobile);
            $("#Email").val(rcd.Email);
        }
        //$("#ContactName").focus();
        return false;
    },
    triggerPrimaryContact: function (row) {

        var id = $('#contacts-grid').jqxGrid('getrowid', row);
        var rcd = $('#contacts-grid').jqxGrid('getrowdata', row);
        var value = true;
        if (parent != null) {
            if (parent.triggerPrimaryContactCompleted)
                parent.triggerPrimaryContactCompleted(id, value, rcd);
        }
        return false;
    },

    triggerContactClose: function (accid) {
        //$("#contacts_dropdown").jqxDropDownButton('close');
        $("#contact-def").hide();
        $("#contacts-grid").show();
        //$("#contacts_dropdown").jqxDropDownButton('open');
    },

    triggerContactComplete: function (accid) {
        try {
            var adapter = $("#contacts-grid").jqxGrid('source');
            adapter.dataBind();
            //app_dialog.dialogClose(NSaccountcontacts.contactdialog);
            //$("#contacts_dropdown").jqxDropDownButton('close');
            $("#contact-def").hide();
            $("#contacts-grid").show();
            //$("#contacts_dropdown").jqxDropDownButton('open');
        }
        catch (e) {

        }
    }
}

