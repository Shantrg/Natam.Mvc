
//============================================================================================ app_building_def

app_building_def = {

    members: function () {

        this.BuildingId = 0;
        this.allowEdit = 0;
        this.UserRole = 0;
        this.srcManagementCompany = 0;
        this.rcManagementContact;
        this.rcPurposeType;
        this.rcAirConditionType;
        this.rcBuildingOwnerId;
        this.rcAreaId;
        this.rcBuildingId;

        this.loadMembers = function (record) {
            this.srcManagementCompany = record.ManagementCompany;
            this.srcManagementContact = record.ManagementContact;
            this.srcPurposeType = record.PurposeType;
            this.srcAirConditionType = record.AirConditionType;
            this.srcBuildingOwnerId = record.BuildingOwnerId;
            this.srcAreaId = record.AreaId;
            this.srcBuildingId = record.BuildingId;
        };
    },

    // prepare the data

    loadPic: function (tag, value) {
        if (value) {
            var img = $('<img height="60" src="' + value + '"/>');
            $("#" + tag).html(img);
        }
    },

    loadAdapter: function (buildingId, members) {

        var source =
            {
                datatype: "json",
                data: { 'id': buildingId },
                id: 'BuildingId',
                type: 'POST',
                url: '/Building/GetBuilding'

            };
        var dataAdapter = new $.jqx.dataAdapter(source, {
            beforeLoadComplete: function (records) {
                setTimeout(function () {
                    return records;
                }, 2000);
            },
            loadComplete: function (record) {

                loadDataForm("form", record);

                //members.loadMembers(record);

                members.srcManagementCompany = record.ManagementCompany;
                members.srcManagementContact = record.ManagementContact;
                members.srcPurposeType = record.PurposeType;
                members.srcAirConditionType = record.AirConditionType;
                members.srcBuildingOwnerId = record.BuildingOwnerId;
                members.srcAreaId = record.AreaId;
                members.srcBuildingId = record.BuildingId;


                selectCheckList("PurposeList", record.PurposeType);


                if (members.srcBuildingId > 0) {
                    $("#divImages").show();
                    if (record.Investment)
                        $("#showInvestment").show();
                    $("#hBuildingName").text("הגדרת בניין - " + record.BuildingName);
                    var floorGridLink = $('<br/><a class="tab_link" href="FloorGrid?id=' + record.BuildingId + '">פירוט קומות</a>');
                    $("#floorLink").append(floorGridLink);
                    $(".calc").show();
                    if (record.FloorDefined == 0) {
                        if (members.UserRole == 9) {
                            var link = app_menu.wizardLink(members.srcBuildingId);
                            $('#wizard').append(link);
                        }
                    }
                }
                if (record.ActiveState == 1) {
                    members.allowEdit = (members.UserRole == 9) ? 1 : 0;
                }
                else {
                    members.allowEdit = 1;
                }

                if (members.allowEdit == 0) {
                    $("#submit").hide();
                    $("#reset").hide();
                    $("#archive").hide();
                    $("#editOwner").hide();
                    $("#editManagement").hide();
                    $("#editContact").hide();
                    $("#isSendMailSpan").hide();

                }
                else {
                    $("#archive").show();
                }

                appendIframe("PricesGrid", "/Building/_PricesGrid?id=" + buildingId, "400", "180", true);

            },
            loadError: function (jqXHR, status, error) {
            },
        });
        // perform data binding.
        dataAdapter.dataBind();
    },

    loadControls: function () {


        var contactSource =
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

        app_jqx_list.classComboAdapter();
        this.ownerAdapter=app_jqx_list.ownerComboAdapter();
        this.managementAdapter=app_jqx_list.managementComboAdapter();
        app_jqx_list.airComboAdapter();
        app_jqx_list.parkComboAdapter();
        app_jqx_list.areaComboAdapter();

        //var classAdapter = app_jqxcombos.createComboAdapter("ClassType", "ClassName", "BuildingClass", '/Building/GetBuildingClasses', 155, 0, false);

        //var ownerAdapter = app_jqxcombos.createComboAdapter("AccountId", "AccountName", "BuildingOwnerId", '/Building/GetOwnerView', 0, 200, false);

        //var managementAdapter = app_jqxcombos.createComboAdapter("AccountId", "AccountName", "ManagementCompany", '/Building/GetManagementView', 0, 200, false);

        //var airAdapter = app_jqxcombos.createComboAdapter("AirConditionId", "AirConditionName", "AirConditionType", '/Building/GetAirConditionView', 155, 0, false);

        //var parkAdapter = app_jqxcombos.createComboAdapter("ParkId", "ParkName", "ParkingType", '/Building/GetParkingTypeView', 155, 0, false);

        //var areaAdapter = app_jqxcombos.createComboAdapter("AreaId", "AreaName", "AreaId", '/Building/GetAreaViewAll', 0, 200, false);


        var contactAdapter = new $.jqx.dataAdapter(contactSource);

        // perform Data Binding.
        contactAdapter.dataBind();

        $("#ManagementContact").jqxComboBox(
        {
            rtl: true,
            source: contactAdapter,
            width: 240,
            dropDownHeight: 200,
            autoDropDownHeight: false,
            displayMember: 'ContactName',
            valueMember: 'ContactId'
        });

        $("#BuildingPopulateTime").jqxDateTimeInput({ formatString: 'dd/MM/yyyy' });
        $("#BuildingPopulateTime").val('');


        $('#queryOwner').click(function (e) {
            e.preventDefault();
            app_popup.ownerGrid();
        });
        $('#showOwner').click(function (e) {
            e.preventDefault();
            var val = getSelectedComboValue("BuildingOwnerId", 0);
            if (val != 0)
                app_accounts.accountDisplay(val, "בעלים");
        });

        $('#refreshOwner').click(function () {
            this.ownerAdapter.dataBind();
            selectComboBoxValue("BuildingOwnerId", this.members.srcBuildingOwnerId);
        });

        $('#editOwner').click(function (e) {
            e.preventDefault();
            var val = getSelectedComboValue("BuildingOwnerId", 0);
            app_accounts.accountEdit(val, 2);
        });

        $('#showManagement').click(function (e) {
            e.preventDefault();
            var val = getSelectedComboValue("ManagementCompany", 0);
            if (val != 0)
                app_accounts.accountDisplay(val, "חברת ניהול");
        });
        $('#refreshManagement').click(function () {
            this.managementAdapter.dataBind();
            selectComboBoxValue("ManagementCompany", srcManagementCompany);
        });

        $('#editManagement').click(function (e) {
            e.preventDefault();
            var val = getSelectedComboValue("ManagementCompany", 0);
            app_accounts.accountEdit(val, 6);
        });

        $('#showContact').click(function (e) {
            e.preventDefault();
            var val = getSelectedComboValue("ManagementContact", 0);
            if (val != 0)
                app_contacts.contactDisplay(val, "אנשי קשר");
        });
        $('#refreshContact').click(function () {
            this.managementAdapter.dataBind();
            selectComboBoxValue("ManagementContact", srcManagementContact);
        });

        $('#editContact').click(function (e) {
            e.preventDefault();
            var val = getSelectedComboValue("ManagementContact", 0);
            app_contacts.contactEdit(val, 0, 1);//"buildingcontact")// srcManagementCompany);
        });

    },

    loadControlsEx: function () {

        var purposeSource =
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
        var purposeAdapter = new $.jqx.dataAdapter(purposeSource);

        $("#PurposeList").jqxListBox(
        {
            rtl: true,
            source: purposeAdapter,
            width: 240,
            height: 160,
            checkboxes: true,
            displayMember: 'PurposeName',
            valueMember: 'PurposeId'
        });
    },

    loadEvents: function (isEdit) {

        if (isEdit) {
            $('#btnImages').click(function (e) {
                e.preventDefault();
                mediaEditor(this.members.srcBuildingId, 0, "b");
            });
            $('#archive').on('click', function () {
                var id = $('#BuildingId').val();
                if (confirm("פעולה זו תעביר את הבניין לארכיון , האם להמשיך?") == false)
                    return;
                $.ajax({
                    url: '/Building/DoArchive',
                    type: 'post',
                    dataType: 'json',
                    data: { 'BuildingId': id },
                    success: function (data) {
                        if (data.Status >= 0) {
                            $('#BindingId').val(data.OutputId);
                            app_rout.redirectToFinal("building-ok");
                        }
                        else
                            alert(data.Message);
                    },
                    error: function (jqXHR, status, error) {
                        alert(error);
                    }
                });
            });
        }

  
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
                investmentEdit(0, val, 0);
            return false;
        };

        $("#form").on('validationSuccess', function () {
            //alert('validationSuccess');
            // Display the Server's Response which came as result of the Form Submit.
            $("#form-iframe").fadeIn('fast');
        });

        $('#reset').on('click', function () {
            $("#form-iframe").html('').fadeOut('fast');
            $("#form-next").html('')
            location.reload();
        });

    },
    
    loadValidator: function () {
        //initialize validator.
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
                  { input: '#Street', message: 'חובה לציין רחוב!', action: 'keyup, blur', rule: 'required' },
                  { input: '#StreetNo', message: 'חובה לציין מספר בית!', action: 'keyup, blur', rule: 'required' },
                  { input: '#City', message: 'חובה לציין עיר!', action: 'keyup, blur', rule: 'required' }
            ]
        });
    },

    doSubmit: function () {
        //e.preventDefault();
        var actionurl = $('#form').attr('action');
        renderCheckList("PurposeList", "PurposeType");
        var validationResult = function (isValid) {
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
                    data: $('#form').serialize(),
                    success: function (data) {

                        if (data.Status >= 0) {
                            //window.parent.triggerBuildingComplete(data.OutputId);
                            //$('#form')[0].reset();
                            $('#BindingId').val(data.OutputId);
                            app_rout.redirectToFinal("building-ok");
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
    },

    loadValidatorNew: function () {
        //initialize validator.
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
                  { input: '#Street', message: 'חובה לציין רחוב!', action: 'keyup, blur', rule: 'required' },
                  //{
                  //    input: '#StreetNo', message: 'חובה לציין מספר בית!', action: 'keyup, blur', rule: function () {
                  //        var value = $("#StreetNo").val();
                  //        return value > 0;
                  //    }
                  //},
                  { input: '#StreetNo', message: 'חובה לציין מספר בית!', action: 'keyup, blur', rule: 'required' },
                  { input: '#City', message: 'חובה לציין עיר!', action: 'keyup, blur', rule: 'required' }

            ]
        });
    },

    doSubmitNew: function () {

        var actionurl = $('#form').attr('action');
        var validationResult = function (isValid) {
            if (isValid) {
                $.ajax({
                    url: actionurl,
                    type: 'post',
                    dataType: 'json',
                    data: $('#form').serialize(),
                    success: function (data) {
                        alert(data.Message);
                        if (data.Status >= 0) {
                            //window.parent.triggerBuildingComplete(data.OutputId);
                            //$('#form')[0].reset();
                            $('#BindingId').val(data.OutputId);
                            if (allowEdit == 1)
                                app_rout.redirectTo('/Building/BuildingToActiveGrid');
                            else
                                app_rout.redirectTo('/Building/UnitQuery');
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

    },

    load: function (BuildingId, userRule) {

        this.members.UserRole = userRule;
        this.members.BuildingId = BuildingId;

        this.loadControls();
        this.loadControlsEx();
        this.loadAdapter(BuildingId, this.members);
        this.loadEvents(true);
        this.loadValidator();
    },
    loadNew: function (userRule) {

        this.members.UserRole = userRule;
        this.members.BuildingId = 0;

        this.loadControls();
        this.loadEvents(false);
        this.loadValidatorNew();

    },

};
