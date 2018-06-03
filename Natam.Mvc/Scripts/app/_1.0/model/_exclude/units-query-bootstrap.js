
//============================================================================================ app_building_def

function app_units_query(BuildingId, userRole, isEdit) {

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
    
    loadFormSerachType("formAddress");

    $("#li-general").click(function () {

        if($("#listArea").is(':empty'))
        {
            loadFormSerachType("formGeneral");
            loadTabGeneral();
        }
    });
    
    $("#li-owner").click(function () {
        if ($("#listOwner").is(':empty')) {
            loadFormSerachType("formOwner");
            loadTabOwner();
        }
    });
    
    $("#li-natam").click(function () {
        if ($("#listNatam").is(':empty')) {
            loadFormSerachType("formNatam");
            loadTabNatam();
        }
    });


    this.loadAddresElements();

    var loadTabGeneral = function () {

        var dealAdapter = app_jqxcombos.createListAdapter("DealId", "DealName", "listDeal", "/Building/GetDealView", 200, 120);
        $('#listDeal').on('change', function (event) {
            app_jqxcombos.listBoxToInput("listDeal", "Deal");
        });
        var purposeAdapter = app_jqxcombos.createListAdapter("PurposeId", "PurposeName", "listPurpose", "/Building/GetPurposeView", 200, 120);
        $('#listPurpose').on('change', function (event) {
            app_jqxcombos.listBoxToInput("listPurpose", "Purpose");
        });

        var zoneAdapter = app_jqxcombos.createListAdapter("ZoneId", "ZoneName", "listZone", "/Building/GetZoneView", 200, 120);

        var areaSource =
        {
            dataType: "json",
            dataFields: [
                { name: 'AreaId' },
                { name: 'ZoneId' },
                { name: 'AreaName' }
            ],
            data: { 'zone': 0 },
            type: 'POST',
            url: "/Building/GetAreaView"
        };

        var areaAdapter = new $.jqx.dataAdapter(areaSource, {
            //contentType: "application/json; charset=utf-8",
            loadError: function (jqXHR, status, error) {
                //alert("areaAdapter failed: " + error);
            },
            loadComplete: function (data) {
                //alert("areaAdapter is Loaded");
            }
        });
        // perform Data Binding.
        //areaAdapter.dataBind();


        $("#listArea").jqxListBox(
        {
            rtl: true,
            source: areaAdapter,
            width: '100%',
            height: 180,
            multiple: true,
            //disabled: true,
            //promptText: "בחירת אזור",
            displayMember: 'AreaName',
            valueMember: 'AreaId'
        });
        $('#listArea').on('change', function (event) {
            app_jqxcombos.listBoxToInput("listArea", "Area");
        });

        $("#listZone").bind('select', function (event) {
            if (event.args) {

                $("#listArea").jqxListBox({ disabled: false, selectedIndex: -1 });
                var value = event.args.item.value;
                areaSource.data = { 'zone': value };
                areaAdapter = new $.jqx.dataAdapter(areaSource);
                $("#listArea").jqxListBox({ source: areaAdapter });
                $('#Zone').val(value);
            }
        });

        $("#selectAllArea").click(function () {

            var items = $("#listArea").jqxListBox('getItems');
            jQuery.each(items, function (i, item) {
                $("#listArea").jqxListBox('selectItem', item);
            });

        });
        $("#unselectAllArea").click(function () {
            $("#listArea").jqxListBox('clearSelection');
        });
    };

    var loadTabNatam = function () {
        var natamSource =
        {
            dataType: "json",
            dataFields: [
                { name: 'BuildingId' },
                { name: 'BuildingName' }
            ],
            data: {},
            type: 'POST',
            url: "/Building/GetBuildingByNatamView"
        };

        var natamAdapter = new $.jqx.dataAdapter(natamSource, {
            //contentType: "application/json; charset=utf-8",
            loadError: function (jqXHR, status, error) {
                //alert("dealAdapter failed: " + error);
            },
            loadComplete: function (data) {
                //alert("dealAdapter is Loaded");
            },
            formatData: function (data) {
                data.name_startsWith = $("#searchNatam").val();
                return data;
            }
        });
        // perform Data Binding.
        //dealAdapter.dataBind();

        $("#listNatam").jqxListBox(
        {
            rtl: true,
            source: natamAdapter,
            width: 340,
            height: 420,
            displayMember: 'BuildingName',
            valueMember: 'BuildingId',
            scrollBarSize: 5,
            filterable: true,
            filterPlaceHolder: 'חיפוש',
            searchMode: 'contains'
        });

        $('#listNatam').on('select', function (event) {
            var args = event.args;
            if (args) {
                var index = args.index;
                var item = args.item;
                $('#selectedNatamId').val(item.value);
            }
        });
    }

    var loadTabOwner = function () {
        var ownerSource =
        {
            dataType: "json",
            dataFields: [
                { name: 'AccountId' },
                { name: 'AccountName' },
                { name: 'ContactView' }
            ],
            data: {},
            type: 'POST',
            url: "/Building/GetOwnerView"
        };
        var ownerAdapter = new $.jqx.dataAdapter(ownerSource, {
            contentType: "application/json; charset=utf-8",
            loadError: function (jqXHR, status, error) {
                //alert("dealAdapter failed: " + error);
            },
            loadComplete: function (data) {
                //alert("dealAdapter is Loaded");
            },
            formatData: function (data) {
                data.name_startsWith = $("#searchOwner").val();
                return data;
            }

        });
        // perform Data Binding.
        //dealAdapter.dataBind();

        $("#listOwner").jqxListBox(
        {
            rtl: true,
            source: ownerAdapter,
            width: 340,
            height: 420,
            displayMember: 'AccountName',
            valueMember: 'AccountId',
            scrollBarSize: 5,
            filterable: true,
            filterPlaceHolder: 'חיפוש',
            searchMode: 'contains'
        });

        $('#ownerSearchBy').on('change', function () {
            var val = $('#ownerSearchBy').val();
            if (val == "1") {
                $("#listOwner").jqxListBox('displayMember', 'ContactView');
            }
            else {
                $("#listOwner").jqxListBox('displayMember', 'AccountName');
            }
            ownerAdapter.dataBind();
        });

        $('#listOwner').on('select', function (event) {
            var args = event.args;
            if (args) {
                var index = args.index;
                var item = args.item;
                $('#selectedOwnerId').val(item.value);
            }
        });
    }

    $("#reset").click(function () {
        location.reload();
    });


    //===================================================

    $('.formGeneral').change(function () {
        var action = app_query.getFormAction("formGeneral");
        $("#formGeneral").attr('action', action);
    });
    $('.formAddress').change(function () {
        var action = app_query.getFormAction("formAddress");
        $("#formAddress").attr('action', action);
    });
    $('.formOwner').change(function () {
        var action = app_query.getFormAction("formOwner");
        $("#formOwner").attr('action', action);
        //}
    });
    $('.formNatam').change(function () {
        var action = app_query.getFormAction("formNatam");
        $("#formNatam").attr('action', action);
        //}
    });

    function loadFormSerachType(form) {
        var action = app_query.getFormAction(form);
        $("#" + form).attr('action', action);
    }


    //$("#formGeneral").submit(function (e) {
    //    e.preventDefault();
    //    app_query.doFormSubmit("formGeneral");
    //});

    //$("#formAddress").submit(function (e) {
    //    e.preventDefault();
    //    app_query.doFormSubmit("formAddress");
    //});

    //$("#formOwner").submit(function (e) {
    //    e.preventDefault();
    //    app_query.doFormSubmit("formOwner");
    //});

    $('#submitAddress').on('click', function () {
        //if ($("#building_name").val() == '' && $("#building_street").val() == '' && $("#building_city").val() == '') {
        //    alert("נא לציין שם בניין או כתובת");
        //    return false;
        //}
        if ($("#building_name").val() == '' && $("#StreetId").val() == '' && $("#CityCode").val() == '') {
            alert("נא לציין שם בניין או כתובת");
            return false;
        }
        $("#formAddress").submit();
    });

};

app_units_query.prototype.loadAddresElements = function () {

    var slf = this;

    var citySource =
    {
        dataType: "json",
        dataFields: [
            { name: 'CityName' },
            { name: 'CityCode' }
        ],
        type: 'POST',
        url: '/Building/GetCityListView'
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


    $("#CityCode").bind('select', function (event) {
        if (event.args) {
            $("#StreetId").val("");
            $("#StreetId").jqxComboBox({ disabled: false, selectedIndex: -1 });
            var value = event.args.item.value;
            streetSource.data = { 'city': value };
            streetAdapter = new $.jqx.dataAdapter(streetSource);
            //streetAdapter = new $.jqx.dataAdapter(streetSource, {
            //    loadComplete: function (record) {
            //        if (slf.srcCityCode == value && slf.srcStreetId > 0)
            //            $("#StreetId").val(slf.srcStreetId);
            //    },
            //    loadError: function (jqXHR, status, error) {
            //        Console.log(status);
            //    },
            //});
            $("#StreetId").jqxComboBox({ source: streetAdapter, autoDropDownHeight: false });
            //$('#Zone').val(value);
        }
    });
};
 