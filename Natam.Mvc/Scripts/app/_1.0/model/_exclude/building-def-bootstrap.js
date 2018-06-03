
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
    //this.srcBuildingId;
    this.srcBuildingOwnerId = 0;
    this.srcManagementContact = 0;

    this.UserRole = userRole;

    this.loadAddresElements();
    
    // prepare the data
    this.ownerAdapter = app_jqx_list.ownerComboAdapter();
    this.managementAdapter = app_jqx_list.managementComboAdapter();
    app_jqx_list.classComboAdapter();
    app_jqx_list.airComboAdapter();
    app_jqx_list.parkComboAdapter();
    //app_jqx_list.areaComboAdapter();

    this.loadControls(isEdit);

    this.loadEvents();
   
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
            beforeLoadComplete: function (records) {
                setTimeout(function () {
                    return records;
                }, 2000);
            },
            loadComplete: function (record) {
                app_jqxform.loadDataForm("form", record);
                slf.syncData(record);
            },
            loadError: function (jqXHR, status, error) {
            },
        });
        // perform data binding.
        dataAdapter.dataBind();
    };

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

                $.ajax({
                    url: actionurl,
                    type: 'post',
                    dataType: 'json',
                    data: app.serialize('#form'),
                    success: function (data) {

                        if (data.Status >= 0) {
                            //window.parent.triggerBuildingComplete(data.OutputId);
                            //$('#form')[0].reset();
                            var bid = $('#BuildingId').val();
                            $('#BuildingId').val(data.OutputId);
                            app.redirectTo('/Building/BuildingGrid?query_type=tab-query-building&bid=' + bid);
                            //app_rout.redirectToFinal("building-ok");
                        }
                        else
                            alert(data.Message);
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
                    data: app.serialize('#form'),
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

    //$('#tab-building').on('click', function (e) {
    //    //e.preventDefault();
    //    var slf = this;
    //    var validationResult = function (isValid) {
    //        slf.validateTabs('linkA', isValid);
    //    }
    //    var activeTab = $("ul#tab-building > li.active > a").attr("id");
    //    if (activeTab == 'linkA') {
    //        $('#form').jqxValidator('validate', validationResult);
    //    }
    //});

    //$('.tabBox').click(function (e) {
    //    var validationResult = function (isValid) {
    //        if (isValid) {

    //            e.preventDefault();


    //        }
    //    }
    //        var activeTab = $("ul#tab-building > li.active > a").attr("id");
    //        if (activeTab == 'linkA') {
    //            $('#form').jqxValidator('validate', validationResult);
    //        }
    // });

};

app_building_def.prototype.syncData = function (record) {

    var slf = this;

    this.srcManagementCompany = record.ManagementCompany;
    this.srcManagementContact = record.ManagementContact;
    this.srcPurposeType = record.PurposeType;
    this.srcAirConditionType = record.AirConditionType;
    this.srcBuildingOwnerId = record.BuildingOwnerId;
    this.srcAreaId = record.AreaId;
    this.srcStreetId = record.StreetId;
    this.srcCityCode = record.CityCode;
    //this.srcBuildingId = record.BuildingId;

    app_jqxcombos.selectCheckList("PurposeList", record.PurposeType);

    if (this.BuildingId > 0) {
        $("#divImages").show();
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

    app_iframe.appendIframe("PricesGrid", "/Building/_PricesGrid?id=" + this.BuildingId, "400", "180", true);
};

app_building_def.prototype.loadAddresElements = function () {

    var slf = this;

    var areaSource =
    {
        dataType: "json",
        dataFields: [
            { name: 'AreaName' },
            { name: 'AreaId' },
            { name: 'CityId' }
        ],
        data:{'city':0},
        type: 'POST',
        url: '/Building/GetAreaViewAll'
    };
    var areaAdapter = new $.jqx.dataAdapter(areaSource);

   $("#AreaId").jqxComboBox(
   {
    source: areaAdapter,
    width: 240,
    height: 25,
    rtl: true,
    dropDownHeight: 200,
    autoDropDownHeight: false,
    promptText: "נא לבחור...",
    displayMember: 'AreaName',
    valueMember: 'AreaId'
   });


    var citySource =
    {
        dataType: "json",
        dataFields: [
            { name: 'CityName' },
            { name: 'CityCode' }
        ],
        data: { 'area': 0 },
        type: 'POST',
        url: '/Building/GetCityListByArea'//GetCityListView'
    };
    var cityAdapter = new $.jqx.dataAdapter(citySource);

    $("#CityCode").jqxComboBox(
    {
        source: cityAdapter,
        width: 240,
        height: 25,
        rtl: true,
        dropDownHeight: 200,
        autoDropDownHeight: false,
        promptText: "נא לבחור...",
        displayMember: 'CityName',
        valueMember: 'CityCode'
    });

    var streetSource =
    {
        dataType: "json",
        dataFields: [
            { name: 'StreetId' },
            { name: 'StreetCode' },
            { name: 'StreetName' },
            { name: 'CityCode' },
            { name: 'Region' }
        ],
        data: { 'city': 0 },
        type: 'POST',
        url: '/Building/GetStreetsListByCity'
    };
    var streetAdapter = new $.jqx.dataAdapter(streetSource);
  
    $("#StreetId").jqxComboBox(
    {
        width: 240,
        height: 25,
        disabled: true,
        rtl: true,
        dropDownHeight: 200,
        autoDropDownHeight: false,
        displayMember: 'StreetName',
        valueMember: 'StreetId'
    });

    //$("#CityCode").jqxComboBox({ disabled: true, selectedIndex: -1 });
    $("#StreetId").jqxComboBox({ disabled: true, selectedIndex: -1 });


    $("#CityCode").bind('select', function (event) {

        $("#StreetId").val("");

        if (event.args && event.args.item) {

            var value = event.args.item.value;

            $("#StreetId").jqxComboBox({ disabled: false, selectedIndex: -1 });

            streetSource.data = { 'city': value };
            streetAdapter = new $.jqx.dataAdapter(streetSource, {
                loadComplete: function (record) {
                    if (slf.srcCityCode == value && slf.srcStreetId > 0)
                        $("#StreetId").val(slf.srcStreetId);
                },
                loadError: function (jqXHR, status, error) {
                    Console.log(status);
                },
            });
            $("#StreetId").jqxComboBox({ source: streetAdapter, autoDropDownHeight: false });
        }
    });

    //$("#AreaId").bind('select', function (event) {

    //    $("#StreetId").jqxComboBox({ disabled: true, selectedIndex: -1 });

    //    if (event.args) {
    //        var value = event.args.item.value;

    //        $("#CityCode").jqxComboBox({ disabled: false, selectedIndex: -1 });
    //        citySource.data = { 'area': value };
    //        cityAdapter = new $.jqx.dataAdapter(citySource);

    //        cityAdapter = new $.jqx.dataAdapter(citySource, {
    //            loadComplete: function (record) {
    //                if (slf.srcAreaId == value && slf.srcCityCode > 0)
    //                    $("#CityCode").val(slf.srcCityCode);
    //            },
    //            loadError: function (jqXHR, status, error) {
    //                Console.log(status);
    //            },
    //        });
    //        if ($("#CityCode").val() == '')
    //            $("#CityCode").jqxComboBox({ source: cityAdapter, autoDropDownHeight: false });
    //    }
    //});
};


app_building_def.prototype.loadControls = function (isEdit) {

    var slf = this;

    this.contactSource =
    {
        dataType: "json",
        async: false,
        dataFields: [
            { name: 'ContactId' },
            { name: 'AccountId' },
            { name: 'ContactName' }
        ],
        data: { 'role': 1 },
        type: 'POST',
        url: '/Building/GetContactByRole'
    };
    this.contactAdapter = new $.jqx.dataAdapter(this.contactSource);
       
    $("#ManagementContact").jqxComboBox(
 {
     rtl: true,
     source: slf.contactAdapter,
     width: 240,
     dropDownHeight: 200,
     autoDropDownHeight: false,
     displayMember: 'ContactName',
     valueMember: 'ContactId'
 });

    $("#BuildingPopulateTime").jqxDateTimeInput({ formatString: 'dd/MM/yyyy' });
    $("#BuildingPopulateTime").val('');


    if (isEdit) {

        this.purposeSource =
       {
           dataType: "json",
           async: false,
           dataFields: [
               { name: 'PurposeId' },
               { name: 'PurposeName' }
           ],
           type: 'POST',
           url: '/Building/GetPurposeView'
       };
        this.purposeAdapter = new $.jqx.dataAdapter(this.purposeSource);

        $("#PurposeList").jqxListBox(
        {
            rtl: true,
            source: this.purposeAdapter,
            width: 240,
            height: 150,
            checkboxes: true,
            displayMember: 'PurposeName',
            valueMember: 'PurposeId'
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
                   {
                       input: '#BuildingOwnerId', message: 'חובה לציין בעלים עיקריים!', action: 'select', rule: function (input) {
                           var index = $("#BuildingOwnerId").jqxComboBox('getSelectedIndex');
                           if (index >= 0) { return true; } return false;
                       }
                   },
                    {
                        input: '#StreetId', message: 'חובה לציין רחוב!', action: 'select', rule: function (input) {
                            var index = $("#StreetId").jqxComboBox('getSelectedIndex');
                            if (index >= 0) { return true; } return false;
                        }
                    },
                     {
                         input: '#CityCode', message: 'חובה לציין עיר!', action: 'select', rule: function (input) {
                             var index = $("#CityCode").jqxComboBox('getSelectedIndex');
                             if (index >= 0) { return true; } return false;
                         }
                     },
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
                   { input: '#BuildingName', message: 'חובה לציין שם בניין!', action: 'keyup, blur', rule: 'required' },
                   {
                       input: '#AreaId', message: 'חובה לציין אזור!', action: 'select', rule: function (input) {
                           var index = $("#AreaId").jqxComboBox('getSelectedIndex');
                           if (index >= 0) { return true; } return false;
                       }
                   },
                    {
                        input: '#FloorsUp', message: 'חובה לציין מספר קומות מעל הקרקע!', action: 'keyup, blur', rule: function () {
                            var value = $("#FloorsUp").val();
                            return value > 0;
                        }
                    },
                     {
                         input: '#FloorSize', message: 'חובה לציין שטח קומה טיפוסית!', action: 'keyup, blur', rule: function () {
                             var value = $("#FloorSize").val();
                             return value > 0;
                         }
                     },
                      {
                          input: '#FloorSizeUp', message: 'חובה לציין שטח מעל הקרקע!', action: 'keyup, blur', rule: function () {
                              var value = $("#FloorSizeUp").val();
                              return value > 0;
                          }
                      },
                   {
                       input: '#BuildingOwnerId', message: 'חובה לציין בעלים עיקריים!', action: 'select', rule: function (input) {
                           var index = $("#BuildingOwnerId").jqxComboBox('getSelectedIndex');
                           if (index >= 0) { return true; } return false;
                       }
                   },
                    {
                        input: '#StreetId', message: 'חובה לציין רחוב!', action: 'select', rule: function (input) {
                            var index = $("#StreetId").jqxComboBox('getSelectedIndex');
                            if (index >= 0) { return true; } return false;
                        }
                    },
                     {
                         input: '#CityCode', message: 'חובה לציין עיר!', action: 'select', rule: function (input) {
                             var index = $("#CityCode").jqxComboBox('getSelectedIndex');
                             if (index >= 0) { return true; } return false;
                         }
                     },

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
        slf.ownerAdapter.dataBind();
        app_jqxcombos.selectComboBoxValue("BuildingOwnerId", slf.srcBuildingOwnerId);
    });

    $('#refreshManagement').click(function () {
        slf.managementAdapter.dataBind();
        app_jqxcombos.selectComboBoxValue("ManagementCompany", slf.srcManagementCompany);
    });

    $('#refreshContact').click(function () {
        slf.managementAdapter.dataBind();
        app_jqxcombos.selectComboBoxValue("ManagementContact", slf.srcManagementContact);
    });

    $('#queryOwner').click(function (e) {
        e.preventDefault();
        app_popup.ownerGrid();
    });
    $('#showOwner').click(function (e) {
        e.preventDefault();
        var val = app_jqxcombos.getSelectedComboValue("BuildingOwnerId", 0);
        if (val != 0)
            app_accounts.accountDisplay(val, "בעלים");
    });
    $('#editOwner').click(function (e) {
        e.preventDefault();
        var val = app_jqxcombos.getSelectedComboValue("BuildingOwnerId", 0);
        app_accounts.accountEdit(val, 2);
    });

    $('#showManagement').click(function (e) {
        e.preventDefault();
        var val = app_jqxcombos.getSelectedComboValue("ManagementCompany", 0);
        if (val != 0)
            app_accounts.accountDisplay(val, "חברת ניהול");
    });

    $('#editManagement').click(function (e) {
        e.preventDefault();
        var val = app_jqxcombos.getSelectedComboValue("ManagementCompany", 0);
        app_accounts.accountEdit(val, 6);
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

