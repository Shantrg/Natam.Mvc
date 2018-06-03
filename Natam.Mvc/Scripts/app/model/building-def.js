
//============================================================================================ app_building_def

function app_building_def(BuildingId, userRole, isEdit) {

    this.BuildingId = BuildingId;
    this.allowEdit = 0;
    this.UserRole = 0;

    this.srcManagementCompany = 0;
    this.srcManagementContact;
    this.srcPurposeType;
    this.srcAirConditionType;
    this.srcAreaId;
    this.srcStreetId;
    this.srcCityCode;
    this.srcBuildingOwnerId = 0;
    this.srcManagementContact = 0;
    this.srcBuildingClass=0;
    this.srcParkingType = 0;
    this.UserRole = userRole;

    $("#accordion").jcxTabs({
        rotate: false,
        startCollapsed: 'accordion',
        collapsible: 'accordion',
        click: function (e, tab) {
            //$('.info').html('Tab <strong>' + tab.id + '</strong> clicked!');
        },
        activate: function (e, tab) {
            //$('.info').html('Tab <strong>' + tab.id + '</strong> activated!');
        },
        activateState: function (e, state) {
           //$('.info').html('Switched from <strong>' + state.oldState + '</strong> state to <strong>' + state.newState + '</strong> state!');
        }
    });

    //this.loadAddresElements();

    this.addresssModel = new app_addres_model();

    this.loadDataAdapter = function () {
        console.log('loadDataAdapter');
        var slf = this;
        var sourceBuilding =
        {
            datatype: "json",
            data: { 'id': slf.BuildingId },
            id: 'BuildingId',
            type: 'POST',
            url: '/Building/GetBuilding'

        };

        var dataAdapter = new $.jqx.dataAdapter(sourceBuilding, {
            loadComplete: function (record) {
                //slf.syncData(record);
                slf.loadControls(record);
            },
            loadError: function (jqXHR, status, error) {
            },
        });
        // perform data binding.
        dataAdapter.dataBind();
    };
    
    if (this.BuildingId > 0) {
        this.loadDataAdapter();
    }
    else {
        this.loadControls();
    }

    this.loadEvents();

    this.doSubmit = function () {
        //e.preventDefault();
        var slf = this;
        var actionurl = $('#form').attr('action');

        app_jqxcombos.renderCheckList("PurposeList", "PurposeType");
       

        var validationResult = function (isValid) {
            slf.validateTabs('linkA', isValid);
            if (isValid) {
                //$.blockUI({ timeout: 4000 });
                //$("#form-iframe").load(function () {
                //    $.unblockUI();
                //    $("#form-next").html('<a href="Home/Main">המשך</a>')
                //});
                //========================================
                var formData = app.serialize('#form');

                $.ajax({
                    url: actionurl,
                    type: 'post',
                    dataType: 'json',
                    data: formData,
                    success: function (data) {
                        app_messenger.Post(data);
                        if (data.Status >= 0) {
                            //window.parent.triggerBuildingComplete(data.OutputId);
                            //$('#form')[0].reset();
                            var bid = $('#BuildingId').val();
                            $('#BuildingId').val(data.OutputId);
                            app.redirectTo('/Building/BuildingGrid?query_type=tab-query-building&bid=' + bid);
                            //app_rout.redirectToFinal("building-ok");
                        }
                        //else
                        //    alert(data.Message);
                    },
                    error: function (jqXHR, status, error) {
                        app_dialog.alert(error);
                    }
                });

            }
        }
        // Validate the Form.
        $('#form').jqxValidator('validate', validationResult);

    };

    this.doSubmitNew = function () {
        var slf = this;
 
        var actionurl = $('#form').attr('action');
        var validationResult = function (isValid) {
            slf.validateTabItem('linkA', isValid)
            if (isValid) {
                $.ajax({
                    url: actionurl,
                    type: 'post',
                    dataType: 'json',
                    data: app.serialize("#form"),
                    success: function (data) {
                        alert(data.Message);
                        if (data.Status >= 0) {
                            //window.parent.triggerBuildingComplete(data.OutputId);
                            //$('#form')[0].reset();
                            $('#BuildingId').val(data.OutputId);
                            if (allowEdit == 1)
                                app.redirectTo('/Building/BuildingToActiveGrid');
                            else
                                app.redirectTo('/Building/UnitQuery');
                        }
                    },
                    error: function (jqXHR, status, error) {
                        alert(error);
                    }
                });

            }
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
        var activeTab = $("ul#tab-building > li.active > a").attr("id");
        if (activeTab == 'linkA') {
            $('#form').jqxValidator('validate', validationResult);
        }
    };

};
app_building_def.prototype.loadControls = function (record) {

    var slf = this;

    if (record) {

        this.srcManagementCompany = record.ManagementCompany;
        this.srcManagementContact = record.ManagementContact;
        this.srcPurposeType = record.PurposeType;
        this.srcAirConditionType = record.AirConditionType;
        this.srcBuildingOwnerId = record.BuildingOwnerId;
        this.srcAreaId = record.AreaId;
        this.srcStreetId = record.StreetId;
        this.srcCityCode = record.CityCode;
        this.srcBuildingClass = record.BuildingClass;
        this.srcParkingType = record.ParkingType;

        //app_jqxcombos.selectCheckList("PurposeList", record.PurposeType);

        //load form
        app_jqxform.loadDataForm("form", record, ["AgentId", "BuildingOwnerId", "ManagementCompany", "ManagementContact", "CityCode", "StreetId", "DealType", "PurposeId"]);

        if (record.Investment)
            $("#showInvestment").show();

        $("#hBuildingName").text("הגדרת בניין - " + record.BuildingName);
        var floorGridLink = $('<br/><a class="tab_link" href="FloorGrid?id=' + record.BuildingId + '">פירוט קומות</a>');
        $("#floorLink").append(floorGridLink);
        $(".calc").show();
        if (record.FloorDefined == 0) {
            if (slf.UserRole == 9) {
                var link = app_menu.wizardLink(this.BuildingId);
                $('#wizard').append(link);
            }
        }

        if (record.ActiveState == 1) {
            this.allowEdit = (this.UserRole == 9) ? 1 : 0;
        }
        else {
            this.allowEdit = 1;
        }

        if (this.allowEdit == 0) {
            $("#submit").hide();
            $("#reset").hide();
            $("#archive").hide();
            $("#editOwner").hide();
            //$("#editManagement").hide();
            //$("#editContact").hide();
            $("#isSendMailSpan").hide();

        }
        else {
            $("#archive").show();
        }

        app_iframe.appendIframe("PricesGrid", "/Building/_PricesGrid?id=" + this.BuildingId, "100%", "180", true);

        //this.addresssModel.SetCityCode(record.CityCode);

        if (record.CityCode > 0)
            this.addresssModel.SetCityValue(record.CityCode);// app_jqx_adapter.setInputAdapterValue("#CityCode", record.CityCode);
        if (record.StreetId > 0)
            this.addresssModel.SetStreetValue(record.CityCode, record.StreetId);

        //app_jqx_adapter.setInptValue("#StreetId", record.StreetId, record.StreetName,true);
    }
    else
    {
        //this.addresssModel.SetCityCode();
    }


    // prepare the data
    //this.ownerAdapter = app_jqx_combo_async.ownerComboAdapter(null, slf.srcBuildingOwnerId);
    this.ownerAdapter = app_jqx_combo_async.ownerInputAdapterSync("#BuildingOwnerId", slf.srcBuildingOwnerId);

    //this.managementAdapter = app_jqx_combo_async.managementComboAdapter(null, slf.srcManagementCompany, function () {
    this.managementAdapter = app_jqx_combo_async.managementInputAdapterSync("#ManagementCompany", slf.srcManagementCompany, function () {

        //app_jqx_adapter.createComboAdapterAsync('ContactId', 'ContactName', "#ManagementContact", '/Building/GetContactByRole', { 'role': 1 }, 200, 200, true, null, function () {
        //    $("#ManagementContact").val(slf.srcManagementContact);
        //});
    });

    this.managementContactAdapter=app_jqx_adapter.createComboAdapterSync('ContactId', 'ContactName', "#ManagementContact", '/Building/GetContactByRole', { 'role': 1 }, 200, 200, true, null, function () {
            $("#ManagementContact").val(slf.srcManagementContact);
    });



    //app_jqx_combo_async.classComboAdapter("#BuildingClass", slf.srcBuildingClass);
    //app_jqx_combo_async.airComboAdapter("#AirConditionType", slf.srcAirConditionType);
    //app_jqx_combo_async.parkComboAdapter("#ParkingType", slf.srcParkingType);

    app_select.BuildingClass("#BuildingClass", slf.srcBuildingClass);
    app_select.AirConditionType("#AirConditionType", slf.srcAirConditionType);
    app_select.ParkingType("#ParkingType", slf.srcParkingType);


    $("#BuildingPopulateTime").jqxDateTimeInput({ formatString: 'dd/MM/yyyy' });
    $("#BuildingPopulateTime").val('');

    if (record) {

        app_jqx_adapter.createListAdapterAsync("PurposeId", "PurposeName", "#PurposeList", '/Building/GetPurposeView', null, 200, 150, true, "#PurposeType", null, function () {
            app_jqxcombos.selectCheckList("PurposeList", slf.srcPurposeType);
        });

        $('#form').jqxValidator({
            rtl: true,
            hintType: 'label',
            animationDuration: 0,
            rules: [
                   { input: '#BuildingName', message: 'חובה לציין שם בניין!', action: 'keyup, blur', rule: 'required' },
                   {
                       input: '#AreaId', message: 'חובה לציין אזור!', action: 'select', rule: function (input) {
                           var index = $("#AreaId").jqxComboBox('getSelectedIndex');
                           if (index >= 0) { return true; } return false;
                       }
                   },
                   {
                       input: '#PurposeList', message: 'חובה לציין סוג נכס!', action: 'select', rule: function (input) {
                           var items = $("#PurposeList").jqxListBox('getCheckedItems');
                           if (items && items.length > 0)
                               return true;
                           return false;
                       }
                   },
                   { input: '#BuildingOwnerId', message: 'חובה לציין בעלים עיקריים!', action: 'keyup, blur', rule: 'required' },
                   { input: '#CityCode', message: 'חובה לציין עיר!', action: 'keyup, blur', rule: 'required' },
                   { input: '#StreetId', message: 'חובה לציין רחוב!', action: 'keyup, blur', rule: 'required' },

                   //{
                   //    input: '#BuildingOwnerId', message: 'חובה לציין בעלים עיקריים!', action: 'select', rule: function (input) {
                   //        var index = $("#BuildingOwnerId").jqxComboBox('getSelectedIndex');
                   //        if (index >= 0) { return true; } return false;
                   //    }
                   //},
                    //{
                    //    input: '#StreetId', message: 'חובה לציין רחוב!', action: 'select', rule: function (input) {
                    //        var index = $("#StreetId").jqxComboBox('getSelectedIndex');
                    //        if (index >= 0) { return true; } return false;
                    //    }
                    //},
                    // {
                    //     input: '#CityCode', message: 'חובה לציין עיר!', action: 'select', rule: function (input) {
                    //         var index = $("#CityCode").jqxComboBox('getSelectedIndex');
                    //         if (index >= 0) { return true; } return false;
                    //     }
                    // },
                  //{ input: '#Street', message: 'חובה לציין רחוב!', action: 'keyup, blur', rule: 'required' },
                  //{ input: '#City', message: 'חובה לציין עיר!', action: 'keyup, blur', rule: 'required' },
                  { input: '#StreetNo', message: 'חובה לציין מספר בית!', action: 'keyup, blur', rule: 'required' }
            ]
        });
    }
    else {

        $('#form').jqxValidator({
            rtl: true,
            hintType: 'label',
            animationDuration: 0,
            rules: [
                   { input: '#BuildingName', message: 'חובה לציין שם בניין!', action: 'keyup, blur', rule: 'required' },//'keyup, blur'
                   {
                       input: '#AreaId', message: 'חובה לציין אזור!', action: 'select', rule: function (input) {
                           var index = $("#AreaId").jqxComboBox('getSelectedIndex');
                           if (index >= 0) { return true; } return false;
                       }
                   },
                    {
                        input: '#FloorsUp', message: 'חובה לציין מספר קומות מעל הקרקע!', action: 'keyup, blur', rule: function () {//'keyup, blur'
                            var value = $("#FloorsUp").val();
                            return value > 0;
                        }
                    },
                     {
                         input: '#FloorSize', message: 'חובה לציין שטח קומה טיפוסית!', action: 'keyup, blur', rule: function () {//'keyup, blur'
                             var value = $("#FloorSize").val();
                             return value > 0;
                         }
                     },
                      {
                          input: '#FloorSizeUp', message: 'חובה לציין שטח מעל הקרקע!', action: 'keyup, blur', rule: function () {//'keyup, blur'
                              var value = $("#FloorSizeUp").val();
                              return value > 0;
                          }
                      },
                      { input: '#BuildingOwnerId', message: 'חובה לציין בעלים עיקריים!', action: 'keyup, blur', rule: 'required' },//'keyup, blur'
                      { input: '#CityCode', message: 'חובה לציין עיר!', action: 'keyup, blur', rule: 'required' },
                      { input: '#StreetId', message: 'חובה לציין רחוב!', action: 'keyup, blur', rule: 'required' },
                   //{
                   //    input: '#BuildingOwnerId', message: 'חובה לציין בעלים עיקריים!', action: 'select', rule: function (input) {
                   //        var index = $("#BuildingOwnerId").jqxComboBox('getSelectedIndex');
                   //        if (index >= 0) { return true; } return false;
                   //    }
                   //},
                    //{
                    //    input: '#StreetId', message: 'חובה לציין רחוב!', action: 'select', rule: function (input) {
                    //        var index = $("#StreetId").jqxComboBox('getSelectedIndex');
                    //        if (index >= 0) { return true; } return false;
                    //    }
                    //},
                    // {
                    //     input: '#CityCode', message: 'חובה לציין עיר!', action: 'select', rule: function (input) {
                    //         var index = $("#CityCode").jqxComboBox('getSelectedIndex');
                    //         if (index >= 0) { return true; } return false;
                    //     }
                    // },

                  //{ input: '#Street', message: 'חובה לציין רחוב!', action: 'keyup, blur', rule: 'required' },
                  //{ input: '#City', message: 'חובה לציין עיר!', action: 'keyup, blur', rule: 'required' },
                  { input: '#StreetNo', message: 'חובה לציין מספר בית!', action: 'keyup, blur', rule: 'required' }

            ]
        });
    }
};

app_building_def.prototype.loadEvents = function () {

    var slf = this;

    $('#refreshOwner').click(function () {

        triggerInputAutoRefresh("BuildingOwnerId", slf.ownerAdapter, slf.srcBuildingOwnerId);

        //slf.ownerAdapter.dataBind();

        //app_jqxcombos.selectComboBoxValue("BuildingOwnerId", slf.srcBuildingOwnerId);
    });

    $('#refreshManagement').click(function () {

        triggerInputAutoRefresh("ManagementCompany", slf.managementAdapter, slf.srcManagementCompany);

        //slf.managementAdapter.dataBind();
        //$("#ManagementCompany").val(slf.srcManagementCompany);
        //app_jqxcombos.selectComboBoxValue("ManagementCompany", slf.srcManagementCompany);
    });

    $('#refreshContact').click(function () {
        var val = $("#ManagementContact").val();
        slf.managementContactAdapter.dataBind();
        $("#ManagementContact").val(val);
        //app_jqxcombos.selectComboBoxValue("ManagementContact", slf.srcManagementContact);
    });

    $('#queryOwner').click(function (e) {
        e.preventDefault();
        app_popup.ownerGrid();
    });
    $('#showOwner').click(function (e) {
        e.preventDefault();
        var item = $("#BuildingOwnerId").val();
        //var val = app_jqxcombos.getSelectedComboValue("BuildingOwnerId", 0);
        if (item && item.value != 0)
            app_accounts.accountDisplay(item.value, "בעלים");
    });
    $('#editOwner').click(function (e) {
        e.preventDefault();
        var item = $("#BuildingOwnerId").val();
        //var val = app_jqxcombos.getSelectedComboValue("BuildingOwnerId", 0);
        //app_accounts.accountEdit(val, 2);
        var val = (item && item.value != 0) ? item.value : 0;
        app_accounts.accountPanel(val, 2, "#BuildingOwnerId");
        
    });

    $('#showManagement').click(function (e) {
        e.preventDefault();
        //var val = app_jqxcombos.getSelectedComboValue("ManagementCompany", 0);
        var item = $("#ManagementCompany").val();
        if (item && item.value!=0)//(val != 0)
            app_accounts.accountDisplay(item.value, "חברת ניהול");
    });

    $('#editManagement').click(function (e) {
        e.preventDefault();
        //var val = app_jqxcombos.getSelectedComboValue("ManagementCompany", 0);
        var item = $("#ManagementCompany").val();
        var val = (item && item.value) ? item.value : null;
        app_accounts.accountPanel(val, 6, "ManagementCompany");
    });

    $('#showContact').click(function (e) {
        e.preventDefault();
        var val = app_jqxcombos.getSelectedComboValue("ManagementContact", 0);
        if (val != 0)
            app_contacts.contactDisplay(val, "אנשי קשר");
    });

    $('#editContact').click(function (e) {
        e.preventDefault();
        var val = app_jqxcombos.getSelectedComboValue("ManagementContact", 0);
        app_contacts.contactEdit(val, slf.BuildingId, 1);//"buildingcontact")// srcManagementCompany);
    });

    //$("#form").on('validationSuccess', function () {
    //    //alert('validationSuccess');
    //    // Display the Server's Response which came as result of the Form Submit.
    //    $("#form-iframe").fadeIn('fast');
    //});

    $('#reset').on('click', function () {
        //$("#form-iframe").html('').fadeOut('fast');
        //$("#form-next").html('')
        location.reload();
    });

    $('#showInvestment').click(function (e) {
        e.preventDefault();
        doInvestmentEdit();
        return false;
    });

    $("#Investment").change(function () {
        if (this.checked) {
            doInvestmentEdit();
        }
    });

    var doInvestmentEdit = function () {
        var val = $("#BuildingId").val();
        if (val != 0)
            app_popup.investmentEdit(0, val, 0);
        return false;
    };
};

app_trigger = {


    triggerAccComplete: function (accType, accId, isdialog) {
        if (accType == 2) {

            if (isdialog) {
                app_jqx.triggerDialogInputAuto("#BuildingOwnerId", buildingdef.ownerAdapter, accId);
                app_dialog.dialogClose();
            }
            else {
                app_jqx.triggerInputAutoRefresh("#BuildingOwnerId", buildingdef.ownerAdapter, accId, function () {
                    app_iframe.panelSwitchClose("BuildingOwnerId");
                });
            }
            //app_jqx.triggerDialogInputAuto("#BuildingOwnerId", buildingdef.ownerAdapter, accId, function () {
            //    app_iframe.panelSwitchClose("BuildingOwnerId");
            //});
        }
        else if (accType == 6) {

            app_jqx.triggerInputAutoRefresh("#ManagementCompany", buildingdef.managementAdapter, accId, function () {
                app_iframe.panelSwitchClose("ManagementCompany");
            });

        }
        //app_dialog.dialogIframClose();
    },
    triggerAccCancel: function (acctype) {
        if (accType == 2)
            app_iframe.panelSwitchClose("BuildingOwnerId", false);
        else if (accType == 6)
            app_iframe.panelSwitchClose("ManagementCompany");
    },
    triggerContactComplete: function (contactId, op) {

        app_jqx.triggerDialogComboBox(contactId, "#ManagementContact");

        //$("#ManagementContact").jqxComboBox("source").dataBind();
        ////if (op == 'buildingcontact')

        //$("#ManagementContact").val(contactId);
        //app_dialog.dialogIframClose();
    },
    triggerInvestmentComplete: function (id, bid, uid) {
        app_dialog.dialogIframClose();
    }
};


