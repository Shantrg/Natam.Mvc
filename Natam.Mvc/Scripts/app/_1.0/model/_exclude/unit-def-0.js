
//============================================================================================ app_unit_def

app_unit_def = {

//members: 
allowEdit : 0,
UserRole : 0,
UserId : 0,
PropertyType: undefined,
BuildingName:undefined,
FloorNum:undefined,
srcOwnerId:undefined,
srcTenantId:undefined,
srcFloorNum:undefined,
srcOrigSize:undefined,
srcAgentId:undefined,
srcUnitId:undefined,
srcBuildingId:undefined,

    //members: function () {

    //    this.allowEdit = 0;
    //    this.UserRole = 0;
    //    this.UserId = 0;
    //    this.PropertyType;
    //    this.BuildingName;
    //    this.FloorNum;
    //    this.srcOwnerId;
    //    this.srcTenantId;
    //    this.srcFloorNum;
    //    this.srcOrigSize;
    //    this.srcAgentId;
    //    this.srcUnitId;
    //    this.srcBuildingId;
    //},

loadAdapter: function (members) {

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
            data: { 'id': members.srcUnitId },
            id: 'UnitId',
            type: 'POST',
            url: '/Building/GetUnit'

        };
        var dataAdapter = new $.jqx.dataAdapter(source, {
            loadComplete: function (record) {

                var op = members.PropertyType;

                $("#BuildingName").val(members.BuildingName);
                $("#FloorNum").val(members.FloorNum);
                $("#PropertyType").val(op);

                if (op == 1) {
                    $("#liUnitGrid").hide();
                    $("#hTitle").text('עדכון מידע');
                    $("#liTransaction").hide();
                    $("#FloorNum").attr('readonly', false);
                    //$('#divUnitId').hide();
                    $("#form-model").html('');
                    if (record.UnitId > 0) {
                        members.allowEdit = (members.UserId == record.AgentId || members.UserId == 81) ? 1 : 0;
                    }
                    else
                        members.allowEdit = 1;
                }
                else {
                    $("#hTitle").text('טופס עדכון יחידה');
                    $("#FloorNum").attr('readonly', true);
                    $("#liPropertyGrid").hide();
                    $("#liProp2Admin").hide();
                }

                if (members.allowEdit == 0) {
                    $('#submit').hide();
                    $('#reset').hide();
                }

                $("#UnitSizeOrig").val(0);
                members.srcOwnerId = record.OwnerId;
                members.srcTenantId = record.TenantId;
                members.srcFloorNum = record.FloorNum;

                if (record.UnitId > 0) {
                    loadDataForm("form", record);
                    $("#UnitSizeOrig").val(record.UnitSize);
                    members.srcOrigSize = record.UnitSize;
                    members.srcAgentId = record.AgentId;
                    //$("#hLeadName").html(record.CustomerName);

                }
                else {

                    $("#BuildingId").val('@Model.BuildingId');
                    members.srcOwnerId = '@Model.OwnerId';
                    $("#liTransaction").hide();
                    $("#liProp2Admin").hide();

                    members.srcAgentId = '@ViewBag.UserId'
                }

                members.srcUnitId = record.UnitId;

                members.srcBuildingId = record.BuildingId

                selectComboBoxValue("PurposeId", record.PurposeId);
                selectComboBoxValue("OwnerId", members.srcOwnerId);
                selectComboBoxValue("TenantId", record.TenantId);

                //selectCheckList("listDeal", record.DealType, "DealType");

                $("#divImages").css('display', members.srcBuildingId > 0 ? 'inline' : 'none');
            },
            loadError: function (jqXHR, status, error) {
            },
            beforeLoadComplete: function (records) {

            }
        });
        // perform data binding.
        dataAdapter.dataBind();

    },
    loadControls: function (members) {

        CreateDateTimeInput("DateEndContract");
        CreateDateTimeInput("DateEndOption1");
        CreateDateTimeInput("DateEndOption2");

        app_jqx_list.dealUnitComboAdapter();
        this.ownerAdapter = app_jqx_list.ownerComboAdapter();
        app_jqx_list.purposeComboAdapter();
        app_jqx_list.tenantComboAdapter();


        //var dealAdapter = createComboAdapter("DealId", "DealName", "DealType", '@Url.Action("GetDealView", "Building")', 240, 0, false);
        //var purposeAdapter = createComboAdapter("PurposeId", "PurposeName", "PurposeId", '@Url.Action("GetPurposeView", "Building")', 240, 0, false);
        //var ownerAdapter = createComboAdapter("AccountId", "AccountName", "OwnerId", '@Url.Action("GetOwnerView", "Building")', 240, 200, false);
        //var tenantAdapter = createComboAdapter("AccountId", "AccountName", "TenantId", '@Url.Action("GetTenantView", "Building")', 240, 200, false);

 


    },
    loadEvents: function (isEdit) {

        $('#linkTransaction').click(function (e) {
            var url = "/Common/_TransWizard4Seller?id=" + this.srcUnitId;
            propertyDialog = dialogIframe(url, "1020", "510", "הגדרת  דוח עסקה");
        });

        function clickLink(elementName) {
            $('#' + elementName).click();
            $('#form').jqxValidator('validate');
        }

        $("#form").on('validationSuccess', function () {
            // Display the Server's Response which came as result of the Form Submit.
            //$("#form-iframe").fadeIn('fast');
        });

        $('#reset').on('click', function () {
            //$("#form-iframe").html('').fadeOut('fast');
            //$("#form-next").html('')
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
                 // { input: '#FloorNum', message: 'חובה לציין קומה!', action: 'keyup, blur', rule: 'required' },
                  {
                      input: '#FloorNum', message: 'חובה לציין קומה!', action: 'keyup, blur', rule: function () {
                          return validateNumeric("FloorNum");
                      }
                  },
                   {
                       input: '#UnitSize', message: 'חובה לציין שטח!', action: 'keyup, blur', rule: function () {
                           return validateNumber("UnitSize");
                       }
                   },
                   {
                       input: '#UnitSize', message: 'השטח שצויין חורג מהשטח המוגדר', action: 'keyup, blur', rule: function () {
                           if ($("#PropertyType").val() == 0) {

                               var value = $("#UnitSize").val();
                               //var origvalue = $("#UnitSizeOrig").val();
                               var remainSize = '@Model.SumFloorRemain';

                               return app_units.validateUnitSize(srcOrigSize, value, remainSize);

                           }
                           return true;
                       }
                   },
                       {
                           input: '#DealType', message: 'חובה לציין סוג עסקה!', action: 'select', rule: function (input) {
                               return validateCombo("DealType");
                           }
                       },
                    {
                        input: '#OwnerId', message: 'חובה לציין בעלים!', action: 'select', rule: function (input) {
                            return validateCombo("OwnerId");
                        }
                    },
                    {
                        input: '#PurposeId', message: 'חובה לציין סוג נכס!', action: 'select', rule: function (input) {
                            return validateCombo("PurposeId");
                        }
                    }
            ]
        });
    },
    doSubmit: function () {

        //e.preventDefault();
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

                            if ('@id' == 0) {
                                $('#UnitId').val(data.OutputId);
                                var floor = $("#FloorNum").val();
                                var op = '@Model.PropertyType';
                                if (op == 0)
                                    parent.history.back()
                                else
                                    app_rout.redirectToUnit(data.OutputId, '@bid', floor, op);
                            }
                            else {
                                //redirectToFinal("unit-ok");
                                parent.history.back();
                            }
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
    load: function (UnitId, BuildingId, PropertyType, BuildingName, FloorNum, userRule, userId) {

        this.UserRole = userRule;
        this.UserId = userId;
        this.srcBuildingId = BuildingId;
        this.srcUnitId = UnitId;
        this.PropertyType = PropertyType;
        this.BuildingName = BuildingName;
        this.FloorNum = FloorNum;


        //this.srcOwnerId;
        //this.srcTenantId;
        //this.srcFloorNum;
        //this.srcOrigSize;
        //this.srcAgentId;



        this.loadControls();

        this.loadAdapter(this);
        this.loadEvents();
        this.loadValidator();

        $('#btnImages').click(function (e) {
            e.preventDefault();
            mediaEditor(members.srcBuildingId, members.srcUnitId, "u");
        });

        $('#showOwner').click(function (e) {
            e.preventDefault();
            var val = getSelectedComboValue("OwnerId", 0);//item.value;
            if (val != 0)
                app_accounts.accountDisplay(val, "בעלים");
        });
        $('#refreshOwner').click(function () {
            this.ownerAdapter.dataBind();
            selectComboBoxValue("OwnerId", members.srcOwnerId);
        });

        $('#editOwner').click(function (e) {
            e.preventDefault();
            var val = getSelectedComboValue("OwnerId", 0);
            app_accounts.accountEdit(val, 2);
        });

        $('#showTenant').click(function (e) {
            e.preventDefault();
            var val = getSelectedComboValue("TenantId", 0);//item.value;
            if (val != 0)
                app_accounts.accountDisplay(val, "דייר");
        });
        $('#refreshTenant').click(function () {
            this.ownerAdapter.dataBind();
            selectComboBoxValue("TenantId", members.srcTenantId);
        });

        $('#editTenant').click(function (e) {
            e.preventDefault();
            var val = getSelectedComboValue("TenantId", 0);
            app_accounts.accountEdit(val, 4);
        });

    }

};


//$("#divImages").css('display', 'none');





 
