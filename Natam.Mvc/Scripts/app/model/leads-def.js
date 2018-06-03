
//============================================================================================ app_leads_def

function app_leads_def(leadId, userId, userRule) {

    this.LeadId = leadId;
    this.UserId = userId;
    this.UserRole = userRule;
    this.allowEdit = 0;
    this.srcLeadId;
    this.srcUploadKey;
    this.srcTransId;
    this.propertyDialog;

    var slf = this;

    this.loadLeadPropertyList = function () {

        var src = "/Common/_LeadPropertyGrid?id=" + slf.srcLeadId;
        app_iframe.attachIframe("property-iframe", src, 980, 500, false)
    };

    this.loadLeadTracking = function () {
        var src = "/Common/_LeadTrace?id=" + slf.srcLeadId;
        app_iframe.attachIframe("trace-iframe", src, 980, 500, false)
    };

    if (leadId <= 0) {
        $("#linkC").hide();
        $("#linkD").hide();
        $("#linkTransaction").hide();
        $("#linkTransAdvice").hide();
        $("#linkTransfer").hide();

        $("#ParkingNum").val("");
        $("#ContractDuration").val("");
        $("#BadgetForMr").val("");
    }

    app_jqxform.CreateDateTimeInput("EntryDate");

    $('#reset').on('click', function () {
        //$("#form-iframe").html('').fadeOut('fast');
        //$("#form-next").html('')
        location.reload();
    });

    $("#accordion").jcxTabs({
        rotate: false,
        startCollapsed: 'accordion',
        collapsible: 'accordion',
        //setHash: true,
        //disabled: [3, 4],
        click: function (e, tab) {
            //$('.info').html('Tab <strong>' + tab.id + '</strong> clicked!');
        },
        activate: function (e, tab) {
            //$('.info').html('Tab <strong>' + tab.id + '</strong> activated!');
            switch (tab.id) {
                case 2:
                    if (slf.LeadId > 0) {
                        if ($("#property-iframe").length == 0 || $("#property-iframe")[0].src == "") {
                            slf.loadLeadPropertyList();
                            //slf.loadLeadTracking();

                        }
                    }
                    break;
                case 3:
                    if (slf.LeadId > 0) {
                        if ($("#trace-iframe").length == 0 || $("#trace-iframe")[0].src == "") {
                            //slf.loadLeadPropertyList();
                            slf.loadLeadTracking();
                        }
                    }
                    break;
            }
        },
        activateState: function (e, state) {
            //console.log(state);
            //$('.info').html('Switched from <strong>' + state.oldState + '</strong> state to <strong>' + state.newState + '</strong> state!');
        }
    });
   

    this.loadControls();

    this.loadDataAdapter = function () {

        var slf = this;

        if (slf.LeadId > 0) {
            this.source =
            {
                datatype: "json",
                datafields: [
                       { name: 'LeadId', type: 'number' },
                       { name: 'CustomerName', type: 'string' },
                       { name: 'Address', type: 'string' },
                       { name: 'City', type: 'string' },
                       { name: 'Phone', type: 'string' },
                       { name: 'Creation', type: 'date' },
                       { name: 'LastUpdate', type: 'date' },
                       { name: 'Fax', type: 'string' },
                       { name: 'Commission', type: 'string' },
                       { name: 'PurposeType', type: 'string' },
                       { name: 'DealType', type: 'string' },
                       { name: 'RequestSize', type: 'number' },
                       { name: 'AreaType', type: 'string' },
                       { name: 'EntryDate', type: 'date' },
                       { name: 'ParkingNum', type: 'number' },
                       { name: 'ContractDuration', type: 'number' },
                       { name: 'BadgetForMr', type: 'number' },
                       { name: 'Status', type: 'number' },
                       { name: 'AgentId', type: 'number' },
                       { name: 'ContractCopy', type: 'string' },
                       { name: 'UploadKey', type: 'string' },
                       { name: 'Address', type: 'string' },
                       { name: 'Fax', type: 'string' },
                       { name: 'TransId', type: 'number' },
                       { name: 'Phone2', type: 'string' },
                       { name: 'Memo', type: 'string' }
                ],
                id: 'LeadId',
                type: 'POST',
                url: '/Crm/GetLead',
                data: { 'id': slf.LeadId }
            };

            this.dataAdapter = new $.jqx.dataAdapter(this.source, {
                beforeLoadComplete: function (records) {
                    setTimeout(function () {
                        return records;
                    }, 2000);
                },
                loadComplete: function (record) {

                    slf.syncData(record);

                },
                loadError: function (jqXHR, status, error) {
                },
            });
            // perform data binding.
            this.dataAdapter.dataBind();
        }
    };

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
                        app_messenger.Post(data);
                        //app_jqxnotify.notify(data.Message);
                        if (data.Status >= 0) {
                            //window.parent.triggerBuildingComplete(data.OutputId);
                            //$('#form')[0].reset();
                            app.redirectTo('leadsGrid');
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

    this.propertySearch = function () {
        var slf = this;
        var DealType = app_jqxcombos.getComboCheckedValues("DealType");
        var PurposeType = app_jqxcombos.getComboCheckedValues("PurposeType");
        var AreaType = app_jqxcombos.getComboSelectedValues("AreaType");
        var RequestSize = $("#RequestSize").val();
        var propertyType = 2;
        var size = RequestSize === undefined ? '' : RequestSize.replace("+", "%");
        var url = "/Common/_PropertyGrid?id=" + slf.LeadId + "&qt=" + propertyType + "&dt=" + DealType + "&pt=" + PurposeType + "&at=" + AreaType + "&rs=" + size;
        //return app_dialog.dialogIframe(url, "1020", "510", "איתור נכסים");
        return app_iframe.appendPanelSwitch("wiz-parent", url, "100%", 420, true, "איתור נכסים");
    };

    $('#checkAccountValidity').click(function (e) {
        e.preventDefault();
        slf.checkAccountValidity();
    });
    $('#btnPropertySearch').click(function (e) {
        slf.propertyDialog = slf.propertySearch();//dialogIframe(url, "1020", "510", "איתור נכסים");
    });

    $('#btnPropertyRefresh').click(function (e) {
        slf.loadLeadPropertyList();
    });

    $('#btnPropertyAdd').click(function (e) {

        var url = "/Common/_PropertyDef?id=0&pid=" + slf.srcLeadId + "&pt=2";
        app_iframe.appendPanelSwitch("wiz-parent", url, "100%", 620, true, "הגדרת נכס");

        //slf.propertyDialog = app_dialog.dialogIframe(url, "580", "620", "הגדרת נכס", true);
    });
    $('#linkTransaction').click(function (e) {
        var url = "/Common/_TransWizard4Buyer?id=" + slf.srcLeadId;
        app_iframe.appendPanelSwitch("wiz-parent", url, "100%", 420, true, "הגדרת דוח עסקה");
        //slf.propertyDialog = app_dialog.dialogIframe(url, "1020", "510", "הגדרת  דוח עסקה");
    });
    $('#linkTransAdvice').click(function (e) {
        var url = "/Common/_TransWizard4Advice?id=" + slf.srcLeadId;
        app_iframe.appendPanelSwitch("wiz-parent", url, "100%", 510, true, "הגדרת עסקת ייעוץ");
        //slf.propertyDialog = app_dialog.dialogIframe(url, "1020", "510", "הגדרת  עסקת ייעוץ");
    });

    $('#linkTransfer').click(function (e) {
        var url = "/Common/_LeadTransfer?id=" + slf.srcLeadId;
        app_iframe.appendPanelSwitch("wiz-parent", url, "100%", 320, true, "העברת לקוח");
        //slf.propertyDialog = app_dialog.dialogIframe(url, "420", "320", "העברת לקוח");
    });



    this.loadDataAdapter();

    return this;
};

app_leads_def.prototype.syncData = function (record) {

    var slf = this;

    app_jqxform.loadDataForm("form", record, ["AreaType", "PurposeType","DealType"]);

    if (record.ParkingNum == 0)
        $("#ParkingNum").val("");
    if (record.ContractDuration == 0)
        $("#ContractDuration").val("");
    if (record.BadgetForMr == 0)
        $("#BadgetForMr").val("");

    //srcPurposeType = record.PurposeType;
    //srcDealType = record.DealType;
    //srcAreaType = record.AreaType;

    slf.srcLeadId = record.LeadId;
    slf.srcUploadKey = record.UploadKey;
    slf.srcTransId = record.TransId;

    if (record.LeadId <= 0) {
        $("#linkTransaction").hide();
        $("#linkTransAdvice").hide();
        $("#linkTransfer").hide();
        slf.srcAgentId = sf.UserId;
    }
    else {
        slf.srcAgentId = record.AgentId;
        $("#hLeadName").html(record.CustomerName);
    }

    $("#Creation").val(formatJsonShortDate(record.Creation));
    $("#LastUpdate").val(formatJsonShortDate(record.LastUpdate));

 
    app_jqxcombos.selectComboBoxValues("AreaType", record.AreaType);
    app_jqxcombos.selectComboCheckBoxValues("PurposeType", record.PurposeType);
    app_jqxcombos.selectComboCheckBoxValues("DealType", record.DealType);
    //app_jqxcombos.selectComboBoxValue("RequestSize", record.RequestSize);

    var role = (slf.srcLeadId > 0) ? 3 : 4;
    var parentId = (slf.srcLeadId > 0) ? slf.srcLeadId : slf.srcAgentId;
    app_contacts.appendContactIframe("contactsGrid", parentId, role, slf.srcUploadKey);
                
    //if (slf.LeadId > 0) {
    //    slf.loadLeadPropertyList();
    //    slf.loadLeadTracking();
    //}
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




app_leads_def_public = {

    onNotifyClosed: function (data) {
        if (data.Status >= 0) {
            //window.parent.triggerBuildingComplete(data.OutputId);
            //$('#form')[0].reset();
            app.redirectTo('leadsGrid');
        }
    }
};
app_trigger = {

    triggerPopertySearchComplete: function () {
        //app_dialog.dialogIframClose();
        def.loadLeadPropertyList();

        app_iframe.panelSwitchClose("wiz-parent", true);
    },
    triggerPropertyComplete: function () {
        //app_dialog.dialogIframClose();
        def.loadLeadPropertyList();
        app_iframe.panelSwitchClose("wiz-parent", true);
    },
    triggerContactComplete: function (contactId, op) {
        app_dialog.dialogIframClose();
    },
    triggerTransferComplete: function (id) {
        app_dialog.dialogIframClose();
    },
    triggerPopertyTransComplete: function (unitId, contactId, transType) {
        var id= def.LeadId;
        //app_dialog.dialogIframClose();
        if (transType == 3) {
            var url = "/Crm/TransactionAdviceDef?id=" + unitId + "&tt=3&pid=" + id + "&cid=" + contactId;
            app.redirectTo(url);
        }
        else if (unitId > 0 && contactId > 0) {
            var url = "/Crm/TransactionBuyerDef?id=" + unitId + "&tt=1&pid=" + id + "&cid=" + contactId;
            app.redirectTo(url);
        }
    },
    trigger_Prompt: function (status) {
        $('#submit').prop('disabled', status == 1);
        //if (status == 1) {
        //    $('#submit').attr('disabled','disabled');//.hide();
        //}
        window.location.href = '/Crm/Leads';
    }
};
