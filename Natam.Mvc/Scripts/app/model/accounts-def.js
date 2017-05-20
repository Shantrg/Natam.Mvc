
//============================================================================================ app_accounts_def

function app_accounts_def(accountId, accountType, userRule, isNew) {

    this.AccountId = accountId;
    this.AccountType = accountType;
    this.UserRole = userRule;

    this.allowEdit = (this.UserRole == 9) ? 1 : 0;

    this.contactRole = app_contacts.getContactRole(accountType);

    this.contactsLoaded = false;

    if (isNew) {

        console.log('isNew');
    }
    else {
        if (this.AccountId > 0)
            $('#accContacts').show();
        else
            $('#accContacts').hide();
    }

    $('#AccountType').val(this.AccountType);


    if (this.AccountType == 1 || this.AccountType == 2) {

        this.categoryAdapter = app_jqxcombos.createDropDownAdapter("CategoryId", "CategoryName", "AccountCategory", '/Common/GetCategoryView', 155);
    }
    $('#lblCategory').text(app_accounts.displayAccountCategoryType(this.AccountType));

    this.loadControls(isNew);

    this.loadDataAdapter = function () {

        var slf = this;

        if (slf.AccountId > 0) {

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
                },
                loadError: function (jqXHR, status, error) {
                },
                beforeLoadComplete: function (records) {
                }
            });
            this.viewAdapter.dataBind();
        }
    };

    this.doSubmit = function () {
        //e.preventDefault();

        var actionurl = $('#accForm').attr('action');
        var validationResult = function (isValid) {
            if (isValid) {
                //ajaxForm("/Common/UpdateAccount", "accForm", onSuccess);
                $.ajax({
                    url: actionurl,
                    type: 'post',
                    dataType: 'json',
                    data: $('#accForm').serialize(),
                    success: function (data) {
                        alert(data.Message);
                        if (data.Status >= 0) {

                            //$('#accWindow').jqxWindow('close');
                            var accType = $('#AccountType').val();
                            window.parent.triggerAccComplete(accType, data.OutputId);
                        }
                    },
                    error: function (jqXHR, status, error) {
                        alert(error);
                    }
                });
            }
        }
        $('#accForm').jqxValidator('validate', validationResult);
    };
    this.FoundId = 0;
    this.submitConfirm = function (confirm) {

        if (confirm == 'yes' && this.FoundId > 0)
        {
            window.parent.triggerAccComplete(this.AccountType, this.FoundId);
        }
        else if (confirm == 'no')
        {
            this.submitNewAccount();
        }
    }

    this.doSubmitNew = function () {
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

                    return;
                }

                slf.submitNewAccount();
            }
        }
        $('#accForm').jqxValidator('validate', validationResult);
    };

    this.submitNewAccount=function(){

        var actionurl = $('#accForm').attr('action');
        $.ajax({
            url: actionurl,
            type: 'post',
            dataType: 'json',
            data: $('#accForm').serialize(),
            success: function (data) {
                alert(data.Message);
                if (data.Status >= 0) {

                    //$('#accWindow').jqxWindow('close');
                    var accType = $('#AccountType').val();
                    window.parent.triggerAccComplete(accType, data.OutputId);
                }
            },
            error: function (jqXHR, status, error) {
                alert(error);
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
                $("#divContact").hide();
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

app_accounts_def.prototype.loadControls = function (isNew) {

    var input_rules = [
             { input: '#AccountName', message: 'חובה לציין שם', action: 'keyup, blur', rule: 'required' },
             {
                input: '#Phone1', message: 'ניתן להקליד מספרים בלבד!', action: 'valuechanged, blur', rule:
                  function (input, commit) {
                      var val = input.val();
                      var re = /^([0-9])+$/
                      return val ? re.test(val) : true;
                  }
           }
    ];

    if (isNew) {
        input_rules.push(
            { input: '#ContactName', message: 'שם+שם משפחה חובה', action: 'keyup, blur', rule: 'required' },
            //{ input: '#ContactMobile', message: 'טלפון נייד חובה', action: 'keyup, blur', rule: 'required' },
            {
                input: '#ContactMobile', message: 'ניתן להקליד מספרים בלבד!', action: 'keyup,valuechanged, blur', rule:
                function (input, commit) {
                    var val = input.val();
                    var re = /^([0-9])+$/
                    return val ? re.test(val) : true;
                }
            },
            { input: '#ContactEmail', message: 'אימייל חובה', action: 'keyup, blur', rule: 'required' },
            { input: '#ContactEmail', message: 'אימייל לא תקין', action: 'keyup, blur', rule: 'email' }
         );

    }
    else {
        input_rules.push({
            input: '#Phone2', message: 'ניתן להקליד מספרים בלבד!', action: 'valuechanged, blur', rule:
            function (input, commit) {
                var val = input.val();
                var re = /^([0-9])+$/
                return val ? re.test(val) : true;
            }
        });

    }

    $('#accForm').jqxValidator({
        rtl: true,
        //hintType: 'label',
        animationDuration: 0,
        rules: input_rules
    });


    //account dialog
    //if (isNew) {

        //$('#accForm').jqxValidator({
        //    rtl: true,
        //    //hintType: 'label',
        //    animationDuration: 0,
        //    rules: [
                  
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
