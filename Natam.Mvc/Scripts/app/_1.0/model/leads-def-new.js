
//============================================================================================ app_leads_def

function app_leads_def_new(userId, userRule) {

    //this.LeadId;
    this.UserId = userId;
    this.UserRole = userRule;
    this.allowEdit = 0;
    
    var slf = this;

    $("#ParkingNum").val("");
    $("#ContractDuration").val("");
    $("#BadgetForMr").val("");

    app_jqxform.CreateDateTimeInput("EntryDate");

    $('#reset').on('click', function () {
        //$("#form-iframe").html('').fadeOut('fast');
        //$("#form-next").html('')
        location.reload();
    });

    this.loadControls();

    this.doSubmit = function () {
        //e.preventDefault();
        var slf = this;
        var name = $("#CustomerName").val();

        if (name.length > 0) {
            $("#ValidateResult").val("");
            app_leads.validateLeadAccountName(name, "ValidateResult", false);
            if ($("#ValidateResult").val() == "false")
                return;
        }
        var actionurl = $('#form').attr('action');

        var validationResult = function (isValid) {
            slf.validateTabs('linkA', isValid)
            if (isValid) {
                $.ajax({
                    url: actionurl,
                    type: 'post',
                    dataType: 'json',
                    data: app.serialize('#form'),
                    success: function (data) {
                        //popMessage("לקוחות", data.Message, "modal");

                        alert(data.Message);
                        if (data.Status >= 0) {
                            //window.parent.triggerBuildingComplete(data.OutputId);
                            //$('#form')[0].reset();
                            app.redirectTo('LeadDef?id=' + data.OutputId);
                        }

                    },
                    error: function (jqXHR, status, error) {
                        alert(error);
                    }
                });
            }
            else
                $('#linkA').trigger('click');
        }
        // Validate the Form.
        $('#form').jqxValidator('validate', validationResult);
    };

    this.loadPic = function (tag, value) {
        if (value) {
            var img = $('<img height="60" src="' + value + '"/>');
            $("#" + tag).html(img);
        }
    };

    this.validateTabItem = function (tab, isvalid) {

        if (isvalid) {
            $("#" + tab + "img").remove();
        }
        else {
            var li = $("#" + tab);
            $("#" + tab + "img").remove();
            li.prepend('<span id="' + tab + 'img" class="mandatory" title="נתונים אינם תקינים"> !!! </span>');
        }
    };

    this.validateTabs = function () {
        var slf = this;
        var validationResult = function (isValid) {
            slf.validateTabItem('linkA', isValid);
        }
        var activeTab = $("ul#tab-form > li.active > a").attr("id");
        if (activeTab == 'linkA') {
            $('#form').jqxValidator('validate', validationResult);
        }
    };

    this.checkAccountValidity = function () {
        //e.preventDefault();
        var name = $("#CustomerName").val();
        if (name == "")
            return;
        app_leads.validateLeadAccountName(name);

    };
   
    $('#checkAccountValidity').click(function (e) {
        e.preventDefault();
        slf.checkAccountValidity();
    });
    
    return this;
};

app_leads_def.prototype.loadControls = function () {

    app_jqx_list.dealComboCheckAdapter();

    app_jqx_list.purposeComboCheckAdapter("PurposeType");

    app_jqx_list.areaComboAdapter("AreaType");

    app_jqx_list.requestSizeComboAdapter();

    $("#AreaType").jqxComboBox({ "multiSelect": true, dropDownHorizontalAlignment: "right", "showArrow": true });

    $('#form').jqxValidator({
        rtl: true,
        hintType: 'label',
        animationDuration: 0,
        rules: [
                  { input: '#CustomerName', message: 'חובה לציין שם חברה!', action: 'keyup, blur', rule: 'required' },

           {
               input: '#Phone', message: 'ניתן להקליד מספרים בלבד!', action: 'valuechanged, blur', rule:
               function (input, commit) {
                   var val = input.val();
                   var re = /^([0-9])+$/
                   return val ? re.test(val) : true;
               }
           },

       {
           input: '#Phone2', message: 'ניתן להקליד מספרים בלבד!', action: 'valuechanged, blur', rule:
               function (input, commit) {
                   var val = input.val();
                   var re = /^([0-9])+$/
                   return val ? re.test(val) : true;
               }
       },
           {
               input: '#Fax', message: 'ניתן להקליד מספרים בלבד!', action: 'valuechanged, blur', rule:
               function (input, commit) {
                   var val = input.val();
                   var re = /^([0-9])+$/
                   return val ? re.test(val) : true;
               }
           }
                  //{ input: '#Mobile', message: 'חובה לציין טלפון נייד!', action: 'keyup, blur', rule: 'required' },
                  //{
                  //    input: '#AreaType', message: 'חובה לציין אזור!', action: 'select', rule: function (input) {
                  //        var index = $("#AreaType").jqxComboBox('getSelectedIndex');
                  //        if (index >= 0) { return true; } return false;
                  //    }
                  //},
                  //{
                  //    input: '#PurposeType', message: 'חובה לציין סוג נכס!', action: 'select', rule: function (input) {
                  //        var index = $("#PurposeType").jqxComboBox('getSelectedIndex');
                  //        if (index >= 0) { return true; } return false;
                  //    }
                  //},
                 //{ input: '#Email', message: 'אימייל לא תקין!', action: 'keyup', rule: 'email' },
                 //{
                 //    input: '#Mobile', message: 'טלפון נייד אינו תקין!', action: 'valuechanged, blur', rule:
                 //              function (input, commit) {
                 //                  var val = input.val();
                 //                  var re = /^(|\()(0|972)(\d{1}|\d{2})(|[\)\/\.-])([0-9]{7})$/
                 //                  return val ? re.test(val) : true;
                 //              }
                 //},
                 //{
                 //    input: '#Phone', message: 'טלפון אינו תקין!', action: 'valuechanged, blur', rule:
                 //              function (input, commit) {
                 //                  var val = input.val();
                 //                  var re = /^(|\()(0|972)(\d{1}|\d{2})(|[\)\/\.-])([0-9]{7})$/
                 //                  return val ? re.test(val) : true;
                 //              }
                 //}
        ]
    });
};
