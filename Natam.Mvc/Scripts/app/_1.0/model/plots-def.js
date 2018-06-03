
//============================================================================================ app_plots_def

function app_plots_def(plotsId, userInfo) {

    this.PlotsId = plotsId;
    this.UserRole = userInfo.UserRole;
    this.allowEdit = 0;
    this.srcDesignation;
    this.srcOwnerId;
    this.srcAreaId;
    this.srcStreetId;
    this.srcCityCode;
    this.allowEdit = (this.UserRole == 9) ? 1 : 0;
    this.isMobile = app.IsMobile();
    this.mediaUploader = new media_model('#media-files', { 'buildingId': this.PlotsId, 'propertyId': this.PlotsId, 'propertyType': "p" }, this.allowEdit == 0).mediaFiles();
    var slf = this;

    

    //$('#btnImages').attr("disabled", this.isMobile || plotsId <= 0);
    $("#hImages").css('display', this.PlotsId > 0 ? 'block' : 'none');
    if (plotsId==0)
    {
        $("#ads").hide();
        $("#AgentId").val(userInfo.UserId);
        $("#AgentName").val(userInfo.UserName);
    }
    
    // prepare the data
    //this.ownerAdapter = app_jqx_list.ownerPlotsComboAdapter();
    //app_jqx_list.areaComboAdapter();



        //var source =
        //    {
        //        dataType: "json",
        //        //async: async,
        //        dataFields: [
        //            { name: "AreaId" },
        //            { name: "AreaName" }
        //        ],
        //        type: 'POST',
        //        url: '/Building/GetAreaViewAll'
        //    };
        //var srcAdapter = new $.jqx.dataAdapter(source,
        //{
        //    formatData: function (data) {
        //        if ($("#AreaId").jqxComboBox('searchString') != undefined) {
        //            data.AreaName_startsWith = $("#AreaId").jqxComboBox('searchString');
        //            return data;
        //        }
        //    }
        //});

    //$("#AreaId").jqxComboBox(
    // {
    //     rtl: true,
    //     source: srcAdapter,
    //     width: 200,
    //     remoteAutoComplete: true,
    //     autoDropDownHeight: true,
    //     selectedIndex: 0,
    //     displayMember: "AreaName",
    //     valueMember: "AreaId",
    //     renderer: function (index, label, value) {
    //         var item = srcAdapter.records[index];
    //        if (item != null) {
    //            var label = item.AreaName;
    //            return label;
    //        }
    //        return "";
    //    },
    //    renderSelectedItem: function(index, item)
    //    {
    //        var item = srcAdapter.records[index];
    //        if (item != null) {
    //            var label = item.AreaName;
    //            return label;
    //        }
    //        return "";   
    //    },
    //    search: function (searchString) {
    //        srcAdapter.dataBind();
    //}
    // });

    app_jqx_list.ownerTypeComboAdapter();
    //app_jqx_list.designationComboAdapter();

    //$("#LastUpdate").jqxDateTimeInput({ formatString: 'dd/MM/yyyy' });
    //$("#Creation").val('');


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




    $('#ads').click(function (e) {
        app_rout.redirectToAdsDef(slf.PlotsId, "p");
    });
   
    this.addresssModel = new app_addres_model();


    this.loadDataAdapter = function () {

        var slf = this;

        if (slf.PlotsId > 0) {
            this.source =
            {
                datatype: "json",
                data: { 'id': slf.PlotsId },
                id: 'PlotsId',
                type: 'POST',
                url: '/Building/GetPlots'

            };
            this.dataAdapter = new $.jqx.dataAdapter(this.source, {
                beforeLoadComplete: function (records) {
                    setTimeout(function () {
                        return records;
                    }, 2000);
                },
                loadComplete: function (record) {

                    slf.syncData(record);
                    slf.loadControls(record);

                },
                loadError: function (jqXHR, status, error) {
                },
            });
            // perform data binding.
            this.dataAdapter.dataBind();
        }
    };

    if (this.PlotsId > 0) {
        this.loadDataAdapter();
    }
    else {
        this.loadControls();
    }

    this.doSubmit = function () {
        //e.preventDefault();
        var actionurl = $('#form').attr('action');
        app_jqxcombos.renderCheckList("DesignationList", "Designation");
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
                    data: app.serialize('#form'),
                    success: function (data) {

                        app_messenger.Post(data);

                        if (data.Status >= 0) {
                            //window.parent.triggerBuildingComplete(data.OutputId);
                            //$('#form')[0].reset();
                            $('#PlotsId').val(data.OutputId);
                            //app_messenger.Post(data);

                            //app_jqxnotify.notify(data);

                            //redirectToFinal("building-ok");
                            app.redirectTo("/Building/PlotsGrid");
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

    //this.loadPic = function (tag, value) {
    //    if (value) {
    //        var img = $('<img height="60" src="' + value + '"/>');
    //        $("#" + tag).html(img);
    //    }
    //};

    //this.reloadImages = function () {

    //    app_media.loadImages(this.PlotsId,'p');
    //};

    //app_media.loadImages(this.PlotsId, 'p');

    //var mediaModel = new media_model('#media-files', { 'id': slf.PlotsId, 'propertyId': slf.PlotsId, 'propertyType': "p" }, this.allowEdit==0)
    
    //$('#btnImages').click(function (e) {
    //    e.preventDefault();

    //        if (slf.mediaUploader == null) {
    //            slf.mediaUploader = new media_model('#media-files', { 'buildingId': slf.PlotsId, 'propertyId': slf.PlotsId, 'propertyType': "p" }, this.allowEdit == 0)
    //            slf.mediaUploader.load();
    //            $('#media-files').show();
    //        }


    //    //if (slf.mediaUploader == null) {
    //    //    slf.mediaUploader = new app_media_uploader('#media-files');
    //    //    slf.mediaUploader.init(slf.PlotsId, slf.PlotsId, "p");
    //    //    $('#media-files').show();
    //    //}
    //    else
    //        $('#media-files').toggle();


    //    //if ($('#media-files').is(":visible"))
    //    //    $('#media-files').hide();
    //    //else
    //    //    $('#media-files').show();

    //    //var unitId = $("#PlotsId").val();
    //    //app_popup.mediaEditor(0, slf.PlotsId, "p");
    //});
  
};

app_plots_def.prototype.syncData = function (record) {

    var slf = this;

    if (record.PlotsId > 0) {

        app_jqxform.loadDataForm("form", record,["OwnerId", "CityCode", "StreetId"]);

        this.srcDesignation = record.Designation;
        this.srcOwnerId = record.OwnerId;
        this.srcAreaId = record.AreaId;
        this.srcStreetId = record.StreetId;
        this.srcCityCode = record.CityCode;
        //srcPlotsId = record.PlotsId;

        app_query.getAgentName(record.AgentId, 'AgentName');

        app_jqxcombos.selectCheckList("DesignationList", record.Designation);

        //if (record.ActiveState == 1) {
        //    this.allowEdit = (this.UserRole == 9) ? 1 : 0;
        //}
        //else {
        //    this.allowEdit = 1;
        //}
    }

    if (slf.allowEdit == 0) {
        $("#submit").hide();
        $("#reset").hide();
        //$("#archive").hide();
        $("#editOwner").hide();

        //$("#isSendMailSpan").hide();

    }
    //else {
    //    $("#archive").show();
    //}
};

app_plots_def.prototype.loadControls = function (record) {


    if (record) {
        if (record.CityCode > 0)
            this.addresssModel.SetCityValue(record.CityCode);// app_jqx_adapter.setInputAdapterValue("#CityCode", record.CityCode);
        if (record.StreetId > 0)
            this.addresssModel.SetStreetValue(record.CityCode, record.StreetId);
        //app_jqx_adapter.setInptValue("#StreetId", record.StreetId, record.StreetName,true);

        app_jqx_combo_async.ownerInputAdapter("#OwnerId", record.OwnerId);
    }
    else
    {
        app_jqx_combo_async.ownerInputAdapter("#OwnerId");
    }
    


    this.designationSource =
   {
       dataType: "json",
       async: false,
       dataFields: [
           { name: 'DesignationId' },
           { name: 'DesignationName' }
       ],
       type: 'POST',
       url: '/Building/GetDesignationView'
   };
    this.designationAdapter = new $.jqx.dataAdapter(this.designationSource, {
        loadComplete: function (data) {
            if (record)
                app_jqxcombos.selectCheckList("DesignationList", record.Designation, "Designation");
        },
        loadError: function (jqXHR, status, error) {
        },
    });

    $("#DesignationList").jqxListBox(
    {
        rtl: true,
        source: this.designationAdapter,
        width: 240,
        height: 180,
        checkboxes: true,
        displayMember: 'DesignationName',
        valueMember: 'DesignationId'
    });

    $('#form').jqxValidator({
        rtl: true,
        hintType: 'label',
        animationDuration: 0,
        rules: [
               //{ input: '#BuildingName', message: 'חובה לציין שם בניין!', action: 'keyup, blur', rule: 'required' },
               {
                   input: '#AreaId', message: 'חובה לציין אזור!', action: 'select', rule: function (input) {
                       var index = $("#AreaId").jqxComboBox('getSelectedIndex');
                       if (index >= 0) { return true; } return false;
                   }
               },
               {
                   input: '#DesignationList', message: 'חובה לציין ייעוד!', action: 'select', rule: function (input) {
                       var items = $("#DesignationList").jqxListBox('getCheckedItems');
                       if (items && items.length > 0)
                           return true;
                       return false;
                   }
               },
               { input: '#OwnerId', message: 'חובה לציין בעלים עיקריים!', action: 'keyup, blur', rule: 'required' },
               { input: '#CityCode', message: 'חובה לציין עיר!', action: 'keyup, blur', rule: 'required' },
               { input: '#StreetId', message: 'חובה לציין רחוב!', action: 'keyup, blur', rule: 'required' },

               //{
               //    input: '#OwnerId', message: 'חובה לציין בעלים!', action: 'select', rule: function (input) {
               //        var index = $("#OwnerId").jqxComboBox('getSelectedIndex');
               //        if (index >= 0) { return true; } return false;
               //    }
               //},
              //{ input: '#Street', message: 'חובה לציין רחוב!', action: 'keyup, blur', rule: 'required' },
              //{ input: '#StreetNo', message: 'חובה לציין מספר בית!', action: 'keyup, blur', rule: 'required' },
              //{ input: '#City', message: 'חובה לציין עיר!', action: 'keyup, blur', rule: 'required' }
                //{
                //    input: '#StreetId', message: 'חובה לציין רחוב!', action: 'select', rule: function (input) {
                //        var index = $("#StreetId").jqxComboBox('getSelectedIndex');
                //        if (index >= 0) { return true; } return false;
                //    }
                //},
                //{
                //         input: '#CityCode', message: 'חובה לציין עיר!', action: 'select', rule: function (input) {
                //             var index = $("#CityCode").jqxComboBox('getSelectedIndex');
                //             if (index >= 0) { return true; } return false;
                //         }
                //}
        ]
    });
};


app_trigger = {

    triggerAccComplete: function (accType, accId) {
        app_jqx_combo_async.ownerInputAdapter("#OwnerId", accId);

        //$("#OwnerId").jqxComboBox("source").dataBind();
        //if (accId)
        //    $("#OwnerId").val(accId);

        app_iframe.panelSwitchClose("OwnerId");
        //app_dialog.dialogIframClose();
    },
    triggerAccCancel: function () {
        app_iframe.panelSwitchClose("OwnerId", false);
    },
    triggerImageChanged: function () {
        var id=plotsdef.PlotsId;
        app_media.loadImages(id, 'p');
    }
};
   


/*
app_plots_def.prototype.loadAddresElements = function () {

    var slf = this;

    //app_jqx_list.areaComboAdapter();

    var areaSource =
    {
        dataType: "json",
        dataFields: [
            { name: 'AreaName' },
            { name: 'AreaId' },
            { name: 'CityId' }
        ],
        data: { 'city': 0 },
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
            //$('#Zone').val(value);
        }
    });

    //$("#AreaId").bind('select', function (event) {

    //    $("#StreetId").jqxComboBox({ disabled: true, selectedIndex: -1 });

    //    if (event.args) {
    //        var value = event.args.item.value;

    //        $("#CityCode").jqxComboBox({ disabled: false, selectedIndex: -1 });
    //        citySource.data = { 'area': value };
    //        cityAdapter = new $.jqx.dataAdapter(citySource, {
    //            loadComplete: function (record) {
    //                if (slf.srcAreaId == value && slf.srcCityCode > 0)
    //                    $("#CityCode").val(slf.srcCityCode);
    //            },
    //            loadError: function (jqXHR, status, error) {
    //                Console.log(status);
    //            },
    //        });
    //        $("#CityCode").jqxComboBox({ source: cityAdapter, autoDropDownHeight: false });
    //    }
    //});


    //var citySource =
    //{
    //    dataType: "json",
    //    dataFields: [
    //        { name: 'CityName' },
    //        { name: 'CityCode' }
    //    ],
    //    type: 'POST',
    //    url: '/Building/GetCityListView'
    //};
    //var cityAdapter = new $.jqx.dataAdapter(citySource);

    //$("#CityCode").jqxComboBox(
    //{
    //    source: cityAdapter,
    //    width: 240,
    //    height: 25,
    //    rtl: true,
    //    dropDownHeight: 200,
    //    autoDropDownHeight: false,
    //    promptText: "נא לבחור...",
    //    displayMember: 'CityName',
    //    valueMember: 'CityCode'
    //});

    //var streetSource =
    //{
    //    dataType: "json",
    //    dataFields: [
    //        { name: 'StreetId' },
    //        { name: 'StreetCode' },
    //        { name: 'StreetName' },
    //        { name: 'CityCode' },
    //        { name: 'Region' }
    //    ],
    //    data: { 'city': 0 },
    //    type: 'POST',
    //    url: '/Building/GetStreetsListByCity'
    //};
    //var streetAdapter = new $.jqx.dataAdapter(streetSource);

    //$("#StreetId").jqxComboBox(
    //{
    //    width: 240,
    //    height: 25,
    //    disabled: true,
    //    rtl: true,
    //    dropDownHeight: 200,
    //    autoDropDownHeight: false,
    //    displayMember: 'StreetName',
    //    valueMember: 'StreetId'
    //});


    //$("#CityCode").bind('select', function (event) {
    //    if (event.args) {
    //        $("#StreetId").val("");
    //        $("#StreetId").jqxComboBox({ disabled: false, selectedIndex: -1 });
    //        var value = event.args.item.value;
    //        streetSource.data = { 'city': value };
    //        //streetAdapter = new $.jqx.dataAdapter(streetSource);
    //        streetAdapter = new $.jqx.dataAdapter(streetSource, {
    //            loadComplete: function (record) {
    //                if (slf.srcCityCode == value && slf.srcStreetId > 0)
    //                    $("#StreetId").val(slf.srcStreetId);
    //            },
    //            loadError: function (jqXHR, status, error) {
    //                Console.log(status);
    //            },
    //        });
    //        $("#StreetId").jqxComboBox({ source: streetAdapter, autoDropDownHeight: false });
    //        //$('#Zone').val(value);
    //    }
    //});
};
*/
