
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
    this.allowEdit = 0;
    this.srcOrigSize = 0;
    this.srcFloorNum;
    this.allowEdit = (this.UserRole == 9) ? 1 : 0;
    this.isMobile = app.IsMobile();
    
    //$('#btnImages').attr("disabled", this.isMobile || unitId <= 0);
    $("#hImages").css('display', this.UnitId > 0 ? 'block' : 'none');

    $("#btnAds").css('display', this.UnitId > 0 ? 'inline' : 'none');
    $("#linkTransaction").css('display', this.UnitId > 0 && this.PropertyType == 0 ? 'inline' : 'none');
    //$("#tbProp2Admin").css('display', this.UnitId > 0 && this.PropertyType == 0 ? 'inline' : 'none');
    $("#AgentId").jqxComboBox({
        showArrow: false, enableSelection: false, disabled: true
    });

    app_jqxform.CreateDateTimeInput("DateEndContract");
    app_jqxform.CreateDateTimeInput("DateEndOption1");
    app_jqxform.CreateDateTimeInput("DateEndOption2");

    this.ownerAdapter = app_jqx_list.ownerUnitComboAdapter();
    app_jqx_list.dealUnitComboAdapter();
    app_jqx_list.purposeComboAdapter();
    this.tenantAdapter = app_jqx_list.tenantComboAdapter();
    app_jqx_list.agentComboAdapter();
    this.loadControls();

    this.loadEvents();
    
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

            },
            loadError: function (jqXHR, status, error) {
            },
            beforeLoadComplete: function (records) {

            }
        });

        // perform data binding.
        dataAdapter.dataBind();
    };
 
    this.reloadImages = function () {

        app_media.loadImages(this.UnitId,'u');
    };

    app_media.loadImages(unitId, 'u');
  
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
        app_jqxform.loadDataForm("form", record);
        $("#UnitSizeOrig").val(record.UnitSize);
        this.srcOrigSize = record.UnitSize;
        this.srcAgentId = record.AgentId;
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

    app_jqxcombos.selectComboBoxValue("PurposeId", record.PurposeId);
    app_jqxcombos.selectComboBoxValue("OwnerId", this.srcOwnerId);
    app_jqxcombos.selectComboBoxValue("TenantId", record.TenantId);

    
};

app_unit_def.prototype.loadControls = function () {
    var slf = this;
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
                           return app_jqxform.validateCombo("DealType");
                       }
                   },
                {
                    input: '#OwnerId', message: 'חובה לציין בעלים!', action: 'select', rule: function (input) {
                        return app_jqxform.validateCombo("OwnerId");
                    }
                },
                {
                    input: '#PurposeId', message: 'חובה לציין סוג נכס!', action: 'select', rule: function (input) {
                        return app_jqxform.validateCombo("PurposeId");
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
                    data: $('#form').serialize(),
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
        app_jqxcombos.selectComboBoxValue("OwnerId", slf.srcOwnerId);
    });

    $('#showOwner').click(function (e) {
        e.preventDefault();
        var val = app_jqxcombos.getSelectedComboValue("OwnerId", 0);//item.value;
        if (val != 0)
            app_accounts.accountDisplay(val, "בעלים");
    });

    $('#editOwner').click(function (e) {
        e.preventDefault();
        var val = app_jqxcombos.getSelectedComboValue("OwnerId", 0);
        app_accounts.accountEdit(val, 2);
    });
    $('#queryOwner').click(function (e) {
        e.preventDefault();
        app_popup.ownerGrid();
    });
    //Tenant
    $('#refreshTenant').click(function () {
        slf.tenantAdapter.dataBind();
        app_jqxcombos.selectComboBoxValue("TenantId", slf.srcTenantId);
    });

    $('#showTenant').click(function (e) {
        e.preventDefault();
        var val = app_jqxcombos.getSelectedComboValue("TenantId", 0);//item.value;
        if (val != 0)
            app_accounts.accountDisplay(val, "דייר");
    });

    $('#editTenant').click(function (e) {
        e.preventDefault();
        var val = app_jqxcombos.getSelectedComboValue("TenantId", 0);
        app_accounts.accountEdit(val, 4);
    });

    $('#btnImages').click(function (e) {
        e.preventDefault();
        app_popup.mediaEditor(slf.BuildingId, slf.UnitId, "u");
    });

}