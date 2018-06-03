 

function app_addres_model(options) {
    this.Options = {
        enableArea: true,
        enableAddress: true
    };

    this.Area = function () {

        var slf = this;

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
            //promptText: "נא לבחור...",
            displayMember: 'AreaName',
            valueMember: 'AreaId'
        });
    };

    /*
        this.SetCityCode = function (citycode) {
            //if (cityName)
            //    app_jqx_adapter.setInputValue("#CityCode", citycode, cityName);
            //else
            //    app_jqx_adapter.setInputAdapterValue("#CityCode", citycode);
    
    
            var citySource =
            {
                dataType: "json",
                dataFields: [
                    { name: 'CityName' },
                    { name: 'CityCode' }
                ],
                data: { 'area': 0 },
                type: 'POST',
                url: '/Building/GetCityListView'//GetCityListByArea'//GetCityListView'
            };
    
            //var cityAdapter = new $.jqx.dataAdapter(citySource);
    
            var cityAdapter = new $.jqx.dataAdapter(citySource, {
                loadComplete: function (record) {
                    if (citycode > 0)
                        app_jqx_adapter.setInputAdapterValue("#CityCode", citycode);//$("#StreetId").val(slf.srcStreetId);
                },
                loadError: function (jqXHR, status, error) {
                    console.log(status);
                },
            });
    
            $("#CityCode").jqxInput(
            {
                source: cityAdapter,
                width: 200,
                height: 25,
                rtl: true,
                items: 10,
                //placeHolder: "נא לבחור...",
                displayMember: 'CityName',
                valueMember: 'CityCode'
            });
    
        };
    */

    this.Address = function () {

        var slf = this;

        var citySource =
        {
            async: false,
            dataType: "json",
            dataFields: [
                { name: 'CityName' },
                { name: 'CityCode' }
            ],
            data: { 'area': 0 },
            type: 'POST',
            url: '/Building/GetCityListView'//GetCityListByArea'//GetCityListView'
        };

        var cityAdapter = new $.jqx.dataAdapter(citySource);

        $("#CityCode").jqxInput(
        {
            source: cityAdapter,
            width: 200,
            height: 25,
            rtl: true,
            items: 10,
            //placeHolder: "נא לבחור...",
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

        $("#StreetId").jqxInput(
        {
            width: 200,
            height: 25,
            disabled: true,
            rtl: true,
            items: 10,
            displayMember: 'StreetName',
            valueMember: 'StreetId'
        });

        $("#StreetId").jqxInput({ disabled: true, value: null });

        this.SetCityValue = function (citycode, cityName) {
            if (cityName)
                app_jqx_adapter.setInputValue("#CityCode", citycode, cityName);
            else
                app_jqx_adapter.setInputAdapterValue("#CityCode", citycode);
        }

        this.SetStreetValue = function (citycode, streetId) {

            if (citycode && citycode > 0) {
                $("#StreetId").jqxInput({ disabled: false, value: null });

                streetSource.data = { 'city': citycode };
                streetAdapter = new $.jqx.dataAdapter(streetSource, {
                    loadComplete: function (record) {
                        if (slf.srcCityCode == citycode && slf.srcStreetId > 0)
                            app_jqx_adapter.setInputAdapterValue("#StreetId", slf.srcStreetId);//$("#StreetId").val(slf.srcStreetId);
                        else if (streetId && streetId > 0)
                            app_jqx_adapter.setInputAdapterValue("#StreetId", streetId);
                    },
                    loadError: function (jqXHR, status, error) {
                        console.log(status);
                    },
                });
                $("#StreetId").jqxInput({ source: streetAdapter });
            }
        }


        $('#CityCode').on('change', function (event) {
            //var type = event.args.type; // keyboard, mouse or null depending on how the value was changed.
            var value = $('#CityCode').val();
            if (value == null || value == "") {
                $("#StreetId").jqxInput({ disabled: true, value: null });
                slf.srcStreetId = 0;
                slf.srcCityCode = 0;
            }
        });

        $("#CityCode").bind('select', function (event) {

            $("#StreetId").val("");

            if (event.args && event.args.item) {

                var value = event.args.item.value;

                slf.SetStreetValue(value);

                //$("#StreetId").jqxInput({ disabled: false, value: null });

                //streetSource.data = { 'city': value };
                //streetAdapter = new $.jqx.dataAdapter(streetSource, {
                //    loadComplete: function (record) {
                //        if (slf.srcCityCode == value && slf.srcStreetId > 0)
                //            $("#StreetId").val(slf.srcStreetId);
                //    },
                //    loadError: function (jqXHR, status, error) {
                //        console.log(status);
                //    },
                //});
                //$("#StreetId").jqxInput({ source: streetAdapter });
            }
            else {
                $("#StreetId").jqxInput({ disabled: true, value: null });
                slf.srcStreetId = 0;
                slf.srcCityCode = 0;
            }
        });
    };


    if (options) {
        this.Options.enableArea = options.enableArea === undefined ? true : options.enableArea;
        this.Options.enableAddress = options.enableAddress === undefined ? true : options.enableAddress;
    }

    if (this.Options.enableArea)
        this.Area();
    if (this.Options.enableAddress)
        this.Address();

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
    //                console.log(status);
    //            },
    //        });
    //        if ($("#CityCode").val() == '')
    //            $("#CityCode").jqxComboBox({ source: cityAdapter, autoDropDownHeight: false });
    //    }
    //});
};
