
//============================================================================================ app_unit_def

function app_unit_def(unitId, buildingId, propertyType, buildingName, floorNum, sumFloorRemain, userRule, userId) {


    this.UserRole = userRule;
    this.UserId = userId;
    this.BuildingId = buildingId;
    this.UnitId = unitId;
    this.PropertyType = propertyType;
    this.BuildingName = buildingName;
    this.FloorNum = floorNum;
    this.SumFloorRemain = sumFloorRemain;
    this.srcOwnerId;
    this.srcTenantId;
    this.srcAgentId = 0;
    this.srcDealType;
    this.srcPurposeId;

    this.allowEdit = 0;
    this.srcOrigSize = 0;
    this.srcFloorNum;
    this.allowEdit = (this.UserRole == 9) ? 1 : 0;
    this.isMobile = app.IsMobile();
    this.mediaUploader;
    this.mediaUploader = new media_model('#media-files', { 'buildingId': this.BuildingId, 'propertyId': this.UnitId, 'propertyType': "u" }, this.allowEdit == 0).mediaFiles();


    //$('#btnImages').attr("disabled", this.isMobile || unitId <= 0);
    
    $("#hImages").css('display', this.UnitId > 0 ? 'block' : 'none');

    $("#btnAds").css('display', this.UnitId > 0 ? 'inline' : 'none');
    $("#linkTransaction").css('display', this.UnitId > 0 && this.PropertyType == 0 ? 'inline' : 'none');
    //$("#tbProp2Admin").css('display', this.UnitId > 0 && this.PropertyType == 0 ? 'inline' : 'none');
    //$("#AgentId").jqxComboBox({
    //    showArrow: false, enableSelection: false, disabled: true
    //});

    app_jqxform.CreateDateTimeInput("DateEndContract");
    app_jqxform.CreateDateTimeInput("DateEndOption1");
    app_jqxform.CreateDateTimeInput("DateEndOption2");

    //this.ownerAdapter = app_jqx_combo_async.ownerUnitComboAdapter();
    //app_jqx_combo_async.dealUnitComboAdapter();
    //app_jqx_combo_async.purposeComboAdapter();
    //this.tenantAdapter = app_jqx_combo_async.tenantComboAdapter();
    //app_jqx_combo_async.agentComboAdapter();
   

    this.loadDataAdapter = function () {

        var slf = this;

        var source =
         {
             datatype: "json",
             datafields: [

                   { name: 'UnitId', type: 'number' },
                   { name: 'BuildingId', type: 'number' },
                   { name: 'FloorNum', type: 'number' },
                   { name: 'UnitNum', type: 'number' },
                   { name: 'UnitSize', type: 'number' },
                   { name: 'Price', type: 'number' },
                   { name: 'Populate', type: 'bool' },
                   { name: 'Memo', type: 'string' },
                   { name: 'LastUpdate', type: 'date' },
                   { name: 'DateEndContract', type: 'date' },
                   { name: 'DateEndOption1', type: 'date' },
                   { name: 'DateEndOption2', type: 'date' },
                   { name: 'AgentId', type: 'number' },
                   { name: 'DealType', type: 'number' },
                   { name: 'DealId', type: 'number' },
                   { name: 'PurposeId', type: 'number' },
                   { name: 'OwnerId', type: 'number' },
                   { name: 'TenantId', type: 'number' }

             ],
             data: { 'id': slf.UnitId },
             id: 'UnitId',
             type: 'POST',
             url: '/Building/GetUnit'

         };

        var dataAdapter = new $.jqx.dataAdapter(source, {
            loadComplete: function (record) {
                slf.syncData(record);
                slf.loadControls();
            },
            loadError: function (jqXHR, status, error) {
            },
            beforeLoadComplete: function (records) {

            }
        });

        // perform data binding.
        dataAdapter.dataBind();
    };

    if (this.UnitId > 0)
    {
        this.loadDataAdapter();
    }
    else
    {
        this.loadControls();
    }

    this.loadEvents();

    this.loadMedia=function()
    {
        if (this.mediaUploader == null) {
            this.mediaUploader = new app_media_uploader('#media-files');
            this.mediaUploader.init(this.BuildingId, this.UnitId, "u");
        }
    }
 


    //this.loadMedia();

    //this.mediaIFiles(unitId, buildingId, propertyType);

    //this.reloadImages = function () {

    //    app_media.loadImages(this.UnitId,'u');
    //};

    //app_media.loadImages(unitId, 'u');
  
    //$("#btnImages").css('display', this.BuildingId > 0 && this.isMobile == false ? 'inline' : 'none');

};

app_unit_def.prototype.syncData = function (record) {

    console.log('syncData');

    var op = this.PropertyType;

    $("#BuildingName").val(this.BuildingName);
    $("#FloorNum").val(this.FloorNum);
    $("#PropertyType").val(op);

    if (op == 1) {
        $("#liUnitGrid").hide();
        $("#hTitle").text('עדכון מידע');
        $("#liTransaction").hide();
        $("#FloorNum").attr('readonly', false);
        //$('#divUnitId').hide();
        $("#form-model").html('');
        if (record.UnitId > 0) {
            this.allowEdit = (this.UserId == record.AgentId || this.UserId == 81) ? 1 : 0;
        }
        else
            this.allowEdit = 1;
    }
    else {
        $("#hTitle").text('טופס עדכון יחידה');
        $("#FloorNum").attr('readonly', true);
        $("#liPropertyGrid").hide();
        $("#liProp2Admin").hide();
    }



    if (this.allowEdit == 0) {
        $('#submit').hide();
        $('#reset').hide();
    }

    $("#UnitSizeOrig").val(0);
    this.srcOwnerId = record.OwnerId;
    this.srcTenantId = record.TenantId;
    this.srcFloorNum = record.FloorNum;

    if (record.UnitId > 0) {

        app_jqxform.loadDataForm("form", record, ["AgentId", "OwnerId", "TenantId", "DealType", "PurposeId"]);
        $("#UnitSizeOrig").val(record.UnitSize);
        this.srcOrigSize = record.UnitSize;
        this.srcAgentId = record.AgentId;
        this.srcTenantId = record.TenantId;
        this.srcDealType = record.DealType;
        this.srcPurposeId = record.PurposeId;

        //$("#hLeadName").html(record.CustomerName);
    }
    else {

        $("#BuildingId").val(this.BuildingId);
        //srcOwnerId = OwnerId;
        $("#liTransaction").hide();
        $("#liProp2Admin").hide();

        this.srcAgentId = this.UserId;
    }
    this.UnitId = record.UnitId;

    this.BuildingId = record.BuildingId

    if(this.BuildingId>0)
    {
        var buildingLink = $('<a href="#">>></a>')
              .on("click", function (e) {
                  e.preventDefault();
                  app_buildings.buildingDef(record.BuildingId);
              });
        $("#BuildingLink").append(buildingLink);
    }

    //app_jqxcombos.selectComboBoxValue("PurposeId", record.PurposeId);
    //app_jqxcombos.selectComboBoxValue("OwnerId", this.srcOwnerId);
    //app_jqxcombos.selectComboBoxValue("TenantId", record.TenantId);

    
};

app_unit_def.prototype.loadControls = function () {
    var slf = this;


    this.ownerAdapter = app_jqx_combo_async.ownerInputAdapter("#OwnerId", slf.srcOwnerId);

    app_jqx_combo_async.dealUnitComboAdapter("#DealType", slf.srcDealType);

    app_jqx_combo_async.purposeComboAdapter("#PurposeId", slf.srcPurposeId);

    this.tenantAdapter = app_jqx_combo_async.tenantInputAdapter("#TenantId", slf.srcTenantId);

        var agentid = slf.UnitId > 0 ? slf.srcAgentId : slf.UserId;
        app_jqx_combo_async.agentComboAdapter("#AgentId", agentid);
        $("#AgentId").jqxComboBox({
            showArrow: false, enableSelection: false, disabled: true
        });


    //initialize validator.
    $('#form').jqxValidator({
        rtl: true,
        hintType: 'label',
        animationDuration: 0,
        rules: [
              {
                  input: '#FloorNum', message: 'חובה לציין קומה!', action: 'keyup, blur', rule: function () {
                      return app_jqxform.validateNumeric("FloorNum");
                  }
              },
               {
                   input: '#UnitSize', message: 'חובה לציין שטח!', action: 'keyup, blur', rule: function () {
                       return app_jqxform.validateNumber("UnitSize");
                   }
               },
               {
                   input: '#UnitSize', message: 'השטח שצויין חורג מהשטח המוגדר', action: 'keyup, blur', rule: function () {
                       if ($("#PropertyType").val() == 0) {

                           var value = $("#UnitSize").val();
                           var remainSize = slf.SumFloorRemain;

                           return app_units.validateUnitSize(slf.srcOrigSize, value, remainSize);

                       }
                       return true;
                   }
               },
                   {
                       input: '#DealType', message: 'חובה לציין סוג עסקה!', action: 'select', rule: function (input) {
                           return app_jqxform.validateDropDown("DealType");
                       }
                   },
                {
                    input: '#OwnerId', message: 'חובה לציין בעלים!', action: 'select', rule: function (input) {
                        return app_jqxform.validateCombo("OwnerId");
                    }
                },
                {
                    input: '#PurposeId', message: 'חובה לציין סוג נכס!', action: 'select', rule: function (input) {
                        return app_jqxform.validateDropDown("PurposeId");
                    }
                }
        ]
    });

    $("form").submit(function (e) {
       
        e.preventDefault();

        var actionurl = $('#form').attr('action');

        var validationResult = function (isValid) {

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

                            if (slf.UnitId == 0) {
                                $('#UnitId').val(data.OutputId);

                                //var floor = $("#FloorNum").val();

                                //var op = slf.PropertyType;

                                //if (op == 0)
                                //    app.goReferrer();//parent.history.back();
                                //else
                                //    app.goReferrer(); //parent.history.back();//app_rout.redirectToUnit(data.OutputId, this.BuildingId, floor, op);
                            }
                            //else {
                            //    app.goReferrer();
                            //    //parent.history.back();
                            //}
                            app.redirectTo('/Building/BuildingUnitGrid?query_type=tab-query-unit&bid=' + $('#BuildingId').val());
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

    });


    //$("#form").on('validationSuccess', function () {
    //    // Display the Server's Response which came as result of the Form Submit.
    //    //$("#form-iframe").fadeIn('fast');
    //});

    $('#reset').on('click', function () {
        //$("#form-iframe").html('').fadeOut('fast');
        //$("#form-next").html('')
        location.reload();
    });

};

app_unit_def.prototype.loadEvents = function () {

    var slf = this;

    //Owner
    $('#refreshOwner').click(function () {
        slf.ownerAdapter.dataBind();
        //app_jqxcombos.selectComboBoxValue("OwnerId", slf.srcOwnerId);
    });

    $('#showOwner').click(function (e) {
        e.preventDefault();
        //var val = app_jqxcombos.getSelectedComboValue("OwnerId", 0);//item.value;
        //if (val != 0)
        var item = $("#OwnerId").val();
        if (item && item.value > 0)
            app_accounts.accountDisplay(item.value, "בעלים");
    });

    $('#editOwner').click(function (e) {
        e.preventDefault();
        var item = $("#OwnerId").val();
        if (item && item.value > 0)
                app_accounts.accountPanel(item.value, 2, "OwnerId");

        //var val = app_jqxcombos.getSelectedComboValue("OwnerId", 0);
        //app_accounts.accountEdit(val, 2);
    });
    $('#queryOwner').click(function (e) {
        e.preventDefault();
        app_popup.ownerGrid();
    });
    //Tenant
    $('#refreshTenant').click(function () {
        slf.tenantAdapter.dataBind();
        //app_jqxcombos.selectComboBoxValue("TenantId", slf.srcTenantId);
    });

    $('#showTenant').click(function (e) {
        e.preventDefault();
        var item = $("#TenantId").val();
        if (item && item.value > 0)
            app_accounts.accountDisplay(item.value, "דייר");
        //var val = app_jqxcombos.getSelectedComboValue("TenantId", 0);//item.value;
        //if (val != 0)
        //    app_accounts.accountDisplay(val, "דייר");
    });

    $('#editTenant').click(function (e) {
        e.preventDefault();
        var item = $("#TenantId").val();
        if (item && item.value > 0)
            app_accounts.accountPanel(item.value, 4, "TenantId");

        //var val = app_jqxcombos.getSelectedComboValue("TenantId", 0);
        //app_accounts.accountEdit(val, 4);
    });

    //$('#btnImages').click(function (e) {
    //    e.preventDefault();
    //    if (slf.mediaUploader == null) {
    //        slf.mediaUploader = new app_media_uploader('#media-files');
    //        slf.mediaUploader.init(slf.BuildingId, slf.UnitId, "u");
    //    }
    //    $('#media-files').show();
    //    //app_popup.mediaEditor(slf.BuildingId, slf.UnitId, "u");

    //});
    //$('#btnReloadImages').click(function (e) {
    //    var id = $("#UnitId").val();
    //    if (id > 0) {
    //        //app_media.loadImages(id);
    //        if (slf.mediaUploader != null) {
    //            slf.mediaUploader.doRefresh();
    //        }
    //    }
    //});

    $('#media-toggle-off').click(function (e) {
        $('#media-files').hide();
    });
}



app_trigger = {

    triggerPropertyTransComplete: function (unitId, leadId, contactId) {
        //app_dialog.dialogIframClose();
        app_iframe.panelSwitchClose("wiz-parent",true);
        if (unitId > 0 && contactId > 0) {
            var url = "/Crm/TransactionSellerDef?id=" + unitId + "&tt=2&pid=" + leadId + "&cid=" + contactId;
            app.redirectTo(url);
        }
     },

    triggerInvestmentComplete: function (id, bid, uid) {
        app_dialog.dialogIframClose();
    },

    triggerAccComplete: function (accType, accId) {

        if (accType == "2") {
            $("#OwnerId").jqxComboBox("source").dataBind();
            if (accId)
                $("#OwnerId").val(accId);
            app_iframe.panelSwitchClose("OwnerId");
        }
        else if (accType == "4") {
            $("#TenantId").jqxComboBox("source").dataBind();
            if (accId)
                $("#TenantId").val(accId);
            app_iframe.panelSwitchClose("TenantId");
        }
        //app_dialog.dialogIframClose();
    },

    triggerAccCancel: function (accType) {
        if (accType == "2")
            app_iframe.panelSwitchClose("OwnerId", false);
        else if (accType == "4")
            app_iframe.panelSwitchClose("TenantId", false);
    },
    triggerImageChanged: function () {
        var id = unitdef.UnitId;
        app_media.loadImages(id, 'u');
    }
};



/*
app_unit_def.prototype.mediaIFiles = function (unitId, buildingId, propertyType) {

    var slf = this;

    //$('#media_images').jqxScrollView({
    //    width: 300,
    //    height: 250,
    //    buttonsOffset: [0, 0]
    //});

    $('#uploadBid').val(buildingId);
    $('#uploadUid').val(unitId);
    $('#uploadPt').val(propertyType);


    //maxFileSize: 10400000,//10mb
    //url: '/Media/MediaUpload',//Url.Content("~/Ws/UploadFiles.asmx/MediaUpload")',
    //formData: {
    //    param1: $('#uploadBid').val(),
    //    param2: $('#uploadUid').val(),
    //    param3: $('#uploadPt').val()
    //},

    //$('#jqxFileUpload').jqxFileUpload({ width: 300, uploadUrl: '/Media/MediaUpload', fileInputName: 'fileToUpload' });

    //<input id="fileUploader" type="file" name="fileUploader" />
    //<button id="upload" value="Upload" />

    //$(document).on("click", "#upload", function() {
    //    var file_data = $("#fileUploader").prop("files")[0];   // Getting the properties of file from file field
    //    var form_data = new FormData();                  // Creating object of FormData class
    //    form_data.append("file", file_data)              // Appending parameter named file with properties of file_field to form_data
    //    form_data.append("param1", $('#uploadBid').val())                 // Adding extra parameters to form_data
    //    form_data.append("param2", $('#uploadUid').val()) 
    //    form_data.append("param3", $('#uploadPt').val()) 
    //    $.ajax({
    //        url: '/Media/MediaUpload',
    //        dataType: 'script',
    //        cache: false,
    //        contentType: false,
    //        processData: false,
    //        data: form_data,                         // Setting the data attribute of ajax with file_data
    //        type: 'post'
    //    })
    //})

    $('#step-backward').on('click', function () {
        $('#media_images').jqxScrollView('back');
    });
    $('#step-forward').on('click', function () {
        $('#media_images').jqxScrollView('forward');
    });
    $('#media-toggle-off').on('click', function () {
        $('#media_images').hide();
    });
    $('#media-toggle-on').on('click', function () {
        $('#media_images').show();
    });
    $('#media-upload_item').on('click', function () {
        
        if(slf.uploader==null)
        {
            var bid=$('#uploadBid').val();
            var uid=$('#uploadUid').val();
            var pt=$('#uploadPt').val();

            slf.uploder= new media_uploader(bid,uid,pt);
            $("#uploader").show();
        }
    });
    $('#media-remove_item').on('click', function () {
        
    });
    $('#media-refresh').on('click', function () {
        $('#media_images').jqxScrollView('refresh');
    });


    var getCurrent=function()
    {
        var currentPage = $('#media_images').jqxScrollView('currentPage');
        return currentPage;
    }
    var getCurrentId=function()
    {
        var currentPage = $('#media_images').jqxScrollView('currentPage');
        var id= $('div#media_images>div').eq(currentPage).attr('id');
        return id;
    }
    var getItemId = function (page) {

        var id= $('div#media_images>div').eq(page).attr('id');
        return id;
    }
}

*/