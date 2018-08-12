

//============================================================================================ app_form

var app_jqxform = {

    setLinkHref: function (input, taglink, isEmail) {

        var val = $('#' + input).val();
        if (isEmail)
            val = 'mailto:' + val;
        if (val === undefined || val.length < 10) {
            $('a#' + taglink).attr('href', '');
            $('a#' + taglink).hide();
        }
        else {
            $('a#' + taglink).attr('href', val);
            $('a#' + taglink).show();
        }
    },

    setInputValue: function (tag, value, asEmpty) {
        if (value != asEmpty)
            $("#" + tag).val(value);
    },
    setInputFormValue: function (tag, value) {
        if (value !== undefined && value != null) {
            var str = value.toString();
            if (str.match(/Date/gi)) {
                var d = formatJsonShortDate(value)
                $(tag).val(d);
            }
            else if (typeof value === 'boolean')
                $(tag).attr("checked", value);
            else
                $(tag).val(value);
        }
        else {
            $(tag).val(null);
        }
    },
    loadDataForm: function (form, record, exclude) {
        var arr = '';
        var types = '';
        $('#' + form + ' input, #' + form + ' select, #' + form + ' textarea').each(function (index) {
            var input = $(this);
            var tag = input.attr('name');
            if (tag !== undefined) {
                var isexclude = false;
                if (exclude)
                {
                    isexclude = (exclude.indexOf(tag))>=0;
                }
                if (!isexclude) {
                    var value = record[tag];
                    if (value !== undefined && value != null) {
                        var str = value.toString();
                        if (str.match(/Date/gi)) {
                            var d = formatJsonShortDate(value)
                            $("#" + tag).val(d);
                        }
                        else if (typeof value === 'boolean')
                            $("#" + tag).attr("checked", value);
                        else
                            $("#" + tag).val(value);
                    }
                    else {
                        $("#" + tag).val(null);
                    }
                }
            }
        });
    },

    CreateDateTimeInput: function (input) {
        $("#" + input).jqxDateTimeInput({ formatString: 'dd/MM/yyyy', value: null });
    },
    validateInputAuto: function (input) {
        var item = $("#" + input).val();
        return (item) ? true : false;
    },
    validateCombo: function (input) {
        var index = $("#" + input).jqxComboBox('getSelectedIndex');
        if (index >= 0) { return true; } return false;
    },
    validateDropDown: function (input) {
        var index = $("#" + input).jqxDropDownList('getSelectedIndex');
        if (index >= 0) { return true; } return false;
    },
    validateNumber: function (input) {
        var value = $("#" + input).val();
        return value > 0;
    },

    validateNumeric: function (input) {
        var value = $("#" + input).val();
        return $.isNumeric(value);
    },

    validateDate: function (input, minYear, maxYear) {
        var date = $("#" + input).jqxDateTimeInput('value');
        if (date == null || date === undefined)
            return false;

        if (typeof minYear === 'undefined' || minYear == null) { minYear = 2000; }
        if (typeof maxYear === 'undefined' || maxYear == null) { maxYear = 2999; }

        return date.getFullYear() >= minYear && date.getFullYear() <= maxYear;
    },
    formSubmitValidator: function (form, funcSuccess) {

        var actionurl = $(form).attr('action');

        $(form).jqxValidator('validate', function (isValid) {
            if (isValid) {
                $.ajax({
                    url: actionurl,
                    type: 'post',
                    dataType: 'json',
                    data: app.serialize(form),
                    success: function (data) {
                        funcSuccess(data);
                    },
                    error: function (jqXHR, status, error) {
                        app_dialog.alert(error);
                    }
                });
            }
        });
    }
};

//============================================================================================ app_combos

var app_jqxcombos = {

    getSelectedComboValue: function (tag, defaultValue) {
        var item = $("#" + tag).jqxComboBox('getSelectedItem');
        if (!item)
            return defaultValue;
        return item.value;
    },

    getSelectedListValue: function (tag, defaultValue) {
        var item = $("#" + tag).jqxListBox('getSelectedItem');
        if (!item)
            return defaultValue;
        return item.value;
    },

    selectComboBoxValue: function (tag, value) {
        var item = $("#" + tag).jqxComboBox('getItemByValue', value);
        if (item)
            $("#" + tag).jqxComboBox('selectIndex', item.index);
    },

    selectComboCheckBoxValues: function (tag, values) {
        if (values) {
            var items = values.toString().split(",");
            for (index = 0; index < items.length; ++index) {
                var item = $("#" + tag).jqxComboBox('getItemByValue', items[index]);
                if (item)
                    $("#" + tag).jqxComboBox('checkIndex', item.index);
            }
        }
    },

    selectComboBoxValues: function (tag, values) {
        if (values) {
            var items = values.toString().split(",");
            for (index = 0; index < items.length; ++index) {
                var item = $("#" + tag).jqxComboBox('getItemByValue', items[index]);
                if (item)
                    $("#" + tag).jqxComboBox('selectIndex', item.index);
            }
        }
    },

    getFirstCheckedComboValue: function (tag, defaultValue) {
        var items = $("#" + tag).jqxComboBox('getCheckedItems');
        if (items && items.length > 0)
            return items[0].value;
        return defaultValue;
    },

    getSelectedDropDownValue: function (tag, defaultValue) {
        var item = $("#" + tag).jqxDropDownList('getSelectedItem');
        if (!item)
            return defaultValue;
        return item.value;
    },

    selectDropDownValue: function (tag, value) {
        var item = $("#" + tag).jqxDropDownList('getItemByValue', value);
        if (item)
            $("#" + tag).jqxDropDownList('selectIndex', item.index);
    },

    selectCheckListIndex: function (tag, value) {
        var item = $("#" + tag).jqxListBox('getItemByValue', value);
        if (item) {
            $("#" + tag).jqxListBox('checkIndex', item.index);
        }
    },

    selectCheckList: function (tag, value, output) {
        if (value) {
            var items = value.toString().split(",");
            for (index = 0; index < items.length; ++index) {
                app_jqxcombos.selectCheckListIndex(tag, items[index]);
            }
            if (output)
                $("#" + output).val(value);
        }
    },

    getListCheckedValues: function (list) {
        var items = $("#" + list).jqxListBox('getCheckedItems');
        var values = "";
        if (items && items.length > 0) {
            for (var i = 0; i < items.length; i++) {
                values += items[i].value;
                if (i < items.length - 1) values += ",";
            }
        }
        return values;
    },

    getComboCheckedValues: function (list) {
        var items = $("#" + list).jqxComboBox('getCheckedItems');
        var values = "";
        if (items && items.length > 0) {
            for (var i = 0; i < items.length; i++) {
                values += items[i].value;
                if (i < items.length - 1) values += ",";
            }
        }
        return values;
    },

    getComboSelectedValues: function (list) {
        var items = $("#" + list).jqxComboBox('getSelectedItems');
        var values = "";
        if (items && items.length > 0) {
            for (var i = 0; i < items.length; i++) {
                values += items[i].value;
                if (i < items.length - 1) values += ",";
            }
        }
        return values;
    },

    renderCheckList: function (tag, dest) {
        var val = $("#" + tag).val();
        $("#" + dest).val(val);
    },

    getDataCheckedList: function (records, field) {
        var length = records.length;
        var newsType = '';
        for (var i = 0; i < length; i++) {
            var record = records[i];
            var val = record[field];
            newsType += val + ',';
        }
        if (newsType.length > 0)
            newsType = newsType.substring(0, newsType.length - 1);
        return newsType;
    },

    createDropDownAdapter: function (valueMember, displayMember, tag, url, width, dropDownHeight, async) {
        var srcAdapter = app_jqx.createDataAdapter(valueMember, displayMember, url, async);
        var autoDropDownHeight = true;
        if (typeof width === 'undefined' || width == 0) { width = 240; }
        if (typeof dropDownHeight === 'undefined' || dropDownHeight == 0)
            dropDownHeight = 200;
        else
            autoDropDownHeight = false;

        $("#" + tag.replace("#", "")).jqxDropDownList(
        {
            rtl: true,
            source: srcAdapter,
            width: width,
            dropDownHeight: dropDownHeight,
            autoDropDownHeight: autoDropDownHeight,
            placeHolder: 'נא לבחור',
            displayMember: displayMember,
            valueMember: valueMember
        });
        return srcAdapter;
    },
    createComboAdapter: function (valueMember, displayMember, tag, url, width, dropDownHeight, async) {
        var srcAdapter = app_jqx.createDataAdapter(valueMember, displayMember, url, async);
        var autoDropDownHeight = true;
        if (typeof width === 'undefined' || width == 0) { width = 240; }
        if (typeof dropDownHeight === 'undefined' || dropDownHeight == 0)
            dropDownHeight = 200;
        else
            autoDropDownHeight = false;

        $("#" + tag.replace("#", "")).jqxComboBox(
        {
            rtl: true,
            source: srcAdapter,
            width: width,
            dropDownHeight: dropDownHeight,
            autoDropDownHeight: autoDropDownHeight,
            displayMember: displayMember,
            valueMember: valueMember
        });
        return srcAdapter;
    },
    createComboAutoAdapter: function (valueMember, displayMember, tag, url, width, dropDownHeight, async) {
        var srcAdapter = app_jqx.createDataAdapter(valueMember, displayMember, url, async);
        var autoDropDownHeight = true;
        if (typeof width === 'undefined' || width == 0) { width = 240; }
        if (typeof dropDownHeight === 'undefined' || dropDownHeight == 0)
            dropDownHeight = 200;
        else
            autoDropDownHeight = false;

        $("#" + tag.replace("#", "")).jqxComboBox(
        {
            rtl: true,
            source: srcAdapter,
            width: width,
            autoComplete: true,
            dropDownHeight: dropDownHeight,
            autoDropDownHeight: autoDropDownHeight,
            displayMember: displayMember,
            valueMember: valueMember
        });
        return srcAdapter;
    },


 
    setComboSourceAdapter: function (valueMember, displayMember, tag, srcAdapter, width, dropDownHeight, async) {
        var autoDropDownHeight = true;
        if (typeof width === 'undefined' || width == 0) { width = 240; }
        if (typeof dropDownHeight === 'undefined' || dropDownHeight == 0)
            dropDownHeight = 200;
        else
            autoDropDownHeight = false;

        $("#" + tag.replace("#", "")).jqxComboBox(
        {
            rtl: true,
            source: srcAdapter,
            width: width,
            dropDownHeight: dropDownHeight,
            autoDropDownHeight: autoDropDownHeight,
            displayMember: displayMember,
            valueMember: valueMember
        });
    },

    createComboCheckAdapter: function (valueMember, displayMember, tag, url, width, dropDownHeight, async) {
        var srcAdapter = app_jqx.createDataAdapter(valueMember, displayMember, url, async);
        var autoDropDownHeight = true;
        if (typeof width === 'undefined' || width == 0) { width = 240; }
        if (typeof dropDownHeight === 'undefined' || dropDownHeight == 0)
            dropDownHeight = 200;
        else
            autoDropDownHeight = false;

        $("#" + tag.replace("#", "")).jqxComboBox(
        {
            rtl: true,
            checkboxes: true,
            source: srcAdapter,
            width: width,
            dropDownHeight: dropDownHeight,
            autoDropDownHeight: autoDropDownHeight,
            displayMember: displayMember,
            valueMember: valueMember
        });
        return srcAdapter;
    },

 
    createListAdapter: function (valueMember, displayMember, tagList, url, width, height, async, output) {
        var srcAdapter = app_jqx.createDataAdapter(valueMember, displayMember, url, async);
        tagList = "#" + tagList.replace("#", "");
        $(tagList).jqxListBox(
        {
            rtl: true,
            source: srcAdapter,
            width: width,
            height: height,
            displayMember: displayMember,
            valueMember: valueMember
        });
        if (output) {
            $(tagList).on('change', function (event) {
                app_jqxcombos.listBoxToInput(tagList, output);
            });
        }
        return srcAdapter;
    },

    createCheckListAdapter: function (valueMember, displayMember, tagList, url, width, height, async, output) {
        var srcAdapter = app_jqx.createDataAdapter(valueMember, displayMember, url, async);
        tagList = "#" + tagList.replace("#", "");
        $(tagList).jqxListBox(
        {
            rtl: true,
            source: srcAdapter,
            width: width,
            checkboxes: true,
            height: height,
            displayMember: displayMember,
            valueMember: valueMember
        });
        if (output) {
            $(tagList).on('checkChange', function (event) {
                app_jqxcombos.listCheckBoxToInput(tagList, output);
            });
        }
        return srcAdapter;
    },

    createCheckListFromArray: function (array, tagList, width, height, output) {
        tagList = "#" + tagList.replace("#", "");
        $(tagList).jqxListBox(
        {
            rtl: true,
            source: array,
            width: width,
            checkboxes: true,
            height: height
            //displayMember: displayMember,
            //valueMember: valueMember
        });
        if (output) {
            $(tagList).on('checkChange', function (event) {
                app_jqxcombos.listCheckBoxToInput(tagList, output);
            });
        }
        
    },

    listBoxToInput: function (list, input, checkbox) {
        //$('#' + list).on('change', function (event) {
        list = list.replace("#", "");
        var items = $("#" + list).jqxListBox('getSelectedItems');
        var checked = true;
        var values = "";
        if (items && items.length > 0) {
            for (var i = 0; i < items.length; i++) {
                values += items[i].value;
                if (i < items.length - 1) values += ",";
            }
            checked = false;
        }
        if (checkbox)
            $("#" + checkbox).prop('checked', checked);
        $("#" + input).val(values);
    },

    listCheckBoxToInput: function (list, input, checkbox) {
        //$('#' + list).on('checkChange', function (event) {
        list = list.replace("#", "");
        var items = $("#" + list).jqxListBox('getCheckedItems');
        var checked = true;
        var values = "";
        if (items && items.length > 0) {
            for (var i = 0; i < items.length; i++) {
                values += items[i].value;
                if (i < items.length - 1) values += ",";
            }
            checked = false;
        }
        if (checkbox)
            $("#" + checkbox).prop('checked', checked);
        $("#" + input).val(values);
    },

    comboBoxToInput: function (list, input, checkbox) {
        //$('#' + list).on('change', function (event) {
        var item = $("#" + list).jqxComboBox('getSelectedItem');
        var checked = true;
        var value = "";
        if (item) {
            value = item.value;
            checked = false;
        }
        if (checkbox)
            $("#" + checkbox).prop('checked', checked);
        $("#" + input).val(value);
    }

};

//============================================================================================ app_jqx

var dataBindAutoAsync = function (dataAdapter, input, value, callback) {
    dataAdapter.dataBind();
    var i = 0;
    (function loopUntil() {
        setTimeout(function () {
            if ( ++i < 5) {
                if (dataAdapter.records && dataAdapter.records.length > 0) {
                    if (value)
                        app_jqx_adapter.setInputAdapterValue(input, value);
                    if (callback)
                        callback();
                }
                else {
                    loopUntil();
                }
            }
        }, 500);
    })();
};


var app_jqx = {

    findRecordByField: function (records, field, value) {

        return $.grep(records, function (item) { return item[field] == value; });

        //var result = records.find(x => x[field] === value);
        //return result;

      //  return records.filter(function (item) {
      //      return item[field] == value
      //  }
      //);
    },
    findRecordByValue: function (records, value) {

        //var result = records.find(x => x.value === value);
        return $.grep(records, function (item) { return item.value == value; });
        //return records.filter(function (item) {
        //    return item.value == value
        //}
      //);
    },
    createDataAdapter: function (valueMember, displayMember, url, async) {
        if (typeof async === 'undefined') { async = true; }
        var source =
                {
                    dataType: "json",
                    async: async,
                    dataFields: [
                        { name: valueMember },
                        { name: displayMember }
                    ],
                    type: 'POST',
                    url: url
                };
        var srcAdapter = new $.jqx.dataAdapter(source);
        return srcAdapter;
    },
    createDataAdapterSync: function (valueMember, displayMember, url, data, callback) {
        var source =
                {
                    dataType: "json",
                    async: false,
                    dataFields: [
                        { name: valueMember },
                        { name: displayMember }
                    ],
                    type: 'POST',
                    url: url
                };
        if (data)
            source.data = data;

        //var srcAdapter = new $.jqx.dataAdapter(source);
        var srcAdapter = new $.jqx.dataAdapter(source, {
            loadComplete: function (records) {
                if (callback)
                    callback('completed', records);
            },
            loadError: function (jqXHR, status, error) {
                if (callback)
                    callback('error', error);
            }
            //beforeLoadComplete: function (records) {
            //    if (beforeLoaded)
            //        beforeLoaded('before', records);
            //}
        });

        return srcAdapter;
    },
    createDataAdapterAsync: function (valueMember, displayMember, url, data, callback, beforeLoaded) {
        var source =
                {
                    dataType: "json",
                    async: true,
                    dataFields: [
                        { name: valueMember },
                        { name: displayMember }
                    ],
                    type: 'POST',
                    url: url
                };
        if (data)
            source.data = data;

        var srcAdapter = new $.jqx.dataAdapter(source, {
            loadComplete: function (records) {
                if (callback)
                    callback('completed', records);
            },
            loadError: function (jqXHR, status, error) {
                if (callback)
                    callback('error', error);
            },
            beforeLoadComplete: function (records) {
                if (beforeLoaded)
                    beforeLoaded('before', records);
            }
        });

        return srcAdapter;
    },
    gridRowDelete: function (url, data, msgConfirm, async) {

        if (typeof async === 'undefined') { async = true; }
        if (typeof msgConfirm === 'undefined') { msgConfirm = "?"; }

        var title = "האם למחוק " + msgConfirm;

        if (!confirm(title))
            return false;

        $.ajax({
            async: async,
            type: "POST",
            url: url,
            data: data,
            //contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                $("#jqxgrid").jqxGrid('source').dataBind();
            },
            error: function (e) {
                alert(e);
                return false;
            }
        });
    },
    triggerDialogComboBox: function (id, combo) {
        $(combo).jqxComboBox("source").dataBind();
        $(combo).val(id);
        app_dialog.dialogIframClose();
    },
    triggerDialogInputAuto: function (input, dataAdapter, value, callback) {

        if (value == null) {
            var item = $(input).val();
            value = item.value;
        }

        dataBindAutoAsync(dataAdapter, input, value, function () {
            if (callback)
                callback();
        });
    },
    triggerInputAutoRefresh: function (input, dataAdapter, value, callback) {

        if (value == null) {
            var item = $(input).val();
            value = item.value;
        }
        dataAdapter.dataBind();
        if (value)
            app_jqx_adapter.setInputAdapterValue(input, value);
        if (callback)
            callback();
    },
    inputAutoValue: function (tag, dest) {
        var item = $(tag).val();
        var val = (item) ? item.value : "";
        if (dest)
            $(dest).val(val);
        return val;
    },
    inputAutoLabel: function (tag, dest,json_escape) {
    var item = $(tag).val();
    var val = (item) ? item.label : "";
    if (json_escape)
        val = (val == null) ? "" : val.jsonEscape();
    if (dest)
        $(dest).val(val);
    return val;
}
};

//============================================================================================ app_jqx_list

var app_jqx_list = {

    classComboAdapter: function (tag) { return app_jqxcombos.createDropDownAdapter("ClassType", "ClassName", tag === undefined ? "BuildingClass" : tag, '/Building/GetBuildingClasses', 155, 0, false) },
    ownerComboAdapter: function (tag) { return app_jqxcombos.createComboAutoAdapter("AccountId", "AccountName", tag === undefined ? "BuildingOwnerId" : tag, '/Building/GetOwnerView', 0, 200, false) },
    ownerUnitComboAdapter: function (tag) { return app_jqxcombos.createComboAutoAdapter("AccountId", "AccountName", tag === undefined ? "OwnerId" : tag, '/Building/GetOwnerView', 240, 200, false) },
    ownerPlotsComboAdapter: function (tag) { return app_jqxcombos.createComboAutoAdapter("AccountId", "AccountName", tag === undefined ? "OwnerId" : tag, '/Building/GetOwnerView', 0, 200, false) },
    managementComboAdapter: function (tag) { return app_jqxcombos.createComboAutoAdapter("AccountId", "AccountName", tag === undefined ? "ManagementCompany" : tag, '/Building/GetManagementView', 0, 200, false) },
    airComboAdapter: function (tag) { return app_jqxcombos.createDropDownAdapter("AirConditionId", "AirConditionName", tag === undefined ? "AirConditionType" : tag, '/Building/GetAirConditionView', 155, 0, false) },
    parkComboAdapter: function (tag) { return app_jqxcombos.createDropDownAdapter("ParkId", "ParkName", tag === undefined ? "ParkingType" : tag, '/Building/GetParkingTypeView', 155, 0, false) },
    dealComboAdapter: function (tag) { return app_jqxcombos.createDropDownAdapter("DealId", "DealName", tag === undefined ? "DealType" : tag, '/Building/GetDealView', 240, 0, false) },
    dealComboCheckAdapter: function (tag) { return app_jqxcombos.createComboCheckAdapter("DealId", "DealName", tag === undefined ? "DealType" : tag, '/Building/GetDealView', 240, 0, false) },
    dealUnitComboAdapter: function (tag) { return app_jqxcombos.createComboAdapter("DealId", "DealName", tag === undefined ? "DealType" : tag, '/Building/GetDealUnitView', 240, 0, false) },
    purposeComboAdapter: function (tag) { return app_jqxcombos.createDropDownAdapter("PurposeId", "PurposeName", tag === undefined ? "PurposeId" : tag, '/Building/GetPurposeView', 240, 0, false) },
    purposeComboCheckAdapter: function (tag) { return app_jqxcombos.createComboCheckAdapter("PurposeId", "PurposeName", tag === undefined ? "PurposeId" : tag, '/Building/GetPurposeView', 240, 0, false) },
    tenantComboAdapter: function (tag) { return app_jqxcombos.createComboAdapter("AccountId", "AccountName", tag === undefined ? "TenantId" : tag, '/Building/GetTenantView', 240, 200, false) },
    ownerTypeComboAdapter: function (tag) { return app_jqxcombos.createDropDownAdapter("OwnerTypeId", "OwnerTypeName", tag === undefined ? "OwnerType" : tag, '/Building/GetOwnerTypeView', 155, 0, false) },
    designationComboAdapter: function (tag) { return app_jqxcombos.createComboAdapter("DesignationId", "DesignationName", tag === undefined ? "Designation" : tag, '/Building/GetDesignationView', 240, 200, false) },
    adsTypeComboAdapter: function (tag) { return app_jqxcombos.createDropDownAdapter("AdsTypeId", "AdsTypeName", tag === undefined ? "MediaType" : tag, '/Building/GetAdsTypeView', 240, 200, false) },
    adsStatusComboAdapter: function (tag) { return app_jqxcombos.createDropDownAdapter("AdsStatusId", "AdsStatusName", tag === undefined ? "Status" : tag, '/Common/GetAdsStatus', 240, 0, false) },
    requestSizeComboAdapter: function (tag) { return app_jqxcombos.createDropDownAdapter("SizeId", "SizeTitle", tag === undefined ? "RequestSize" : tag, '/Common/GetRequestSize', 0, 200, false) },
    agentComboAdapter: function (tag) { return app_jqxcombos.createComboAdapter("UserId", "DisplayName", tag === undefined ? "AgentId" : tag, '/Common/GetAgentList', 0, 200, false) },
    adsPropertyTypeComboAdapter: function (tag) { return app_jqxcombos.createDropDownAdapter("AdsPropId", "AdsPropName", tag === undefined ? "PropertyType" : tag, '/Common/GetAdsPropertyType',160, 0, false) },

    areaComboAdapter: function (tag) { return app_jqxcombos.createComboAutoAdapter("AreaId", "AreaName", tag === undefined ? "AreaId" : tag, '/Building/GetAreaViewAll', 0, 200, false) },
    cityComboAdapter: function (tag) { return app_jqxcombos.createComboAutoAdapter("CityCode", "CityName", tag === undefined ? "CityCode" : tag, '/Building/GetCityListView', 0, 200, false) },
    streetComboAdapter: function (city, tag) { return app_jqxcombos.createComboAutoAdapter("StreetCode", "StreetName", tag === undefined ? "StreetCode" : tag, '/Building/GetStreetsListByCity?city=' + city, 0, 200, false) }

    
};

//============================================================================================ app_jqx_adapter

var app_jqx_adapter = {

    setInputValue: function (tag, value, label, enable) {
        if (value) {
            $(tag).jqxInput('val', { label: label, value: value });
            if (enable)
                $(tag).jqxInput({ disabled: false });
        }
    },
    setInputAdapterValue: function (tag, value) {
        tag = "#" + tag.replace("#", "");
        var records = $(tag).jqxInput("source");
        if (value && records) {
            var item = $.grep(records, function (e) { return e.value == value; });
            //var item = app_jqx.findRecordByValue(records, value);
            if (item && item.length > 0)
                $(tag).jqxInput('val', { label: item[0].label, value: item[0].value });
        }
    },
    setInputAutoValue: function (tag, valueMember, displayMember, value, records) {
        tag = "#" + tag.replace("#", "");
        if (value) {
            var item = $.grep(records, function (e) { return e[field] == value; });
            //var item = app_jqx.findRecordByField(records, valueMember, value);
            if (item && item.length > 0)
                $(tag).jqxInput('val', { label: item[0][displayMember], value: item[0][valueMember] });
        }
    },
    createDropDownAdapterAsync: function (valueMember, displayMember, tag, url, data, width, dropDownHeight,value, callback) {
        tag = "#" + tag.replace("#", "");
        var srcAdapter = app_jqx.createDataAdapterAsync(valueMember, displayMember, url, data, function (status, records) {
            if (value)
                $(tag).val(value);
            if (callback)
                callback(status, records);
        });
        var autoDropDownHeight = true;
        if (typeof width === 'undefined' || width == 0) { width = 200; }
        if (typeof dropDownHeight === 'undefined' || dropDownHeight == 0)
            dropDownHeight = 200;
        else
            autoDropDownHeight = false;

        $("#" + tag.replace("#", "")).jqxDropDownList(
        {
            rtl: true,
            source: srcAdapter,
            width: width,
            dropDownHeight: dropDownHeight,
            autoDropDownHeight: autoDropDownHeight,
            placeHolder: 'נא לבחור',
            displayMember: displayMember,
            valueMember: valueMember
        });
        return srcAdapter;
    },
    createComboAdapterSync: function (valueMember, displayMember, tag, url, data, width, dropDownHeight, autoComplete, value, callback) {
        tag = "#" + tag.replace("#", "");
        var srcAdapter = app_jqx.createDataAdapterSync(valueMember, displayMember, url, data, function (status, records) {
            if (value)
                $(tag).val(value);
            if (callback)
                callback(status, records);
        });
        var autoDropDownHeight = true;
        if (typeof width === 'undefined' || width == 0) { width = 200; }
        if (typeof dropDownHeight === 'undefined' || dropDownHeight == 0)
            dropDownHeight = 200;
        else
            autoDropDownHeight = false;
        if (autoComplete === undefined) autoComplete = false;

        $(tag).jqxComboBox(
        {
            rtl: true,
            source: srcAdapter,
            width: width,
            autoComplete: autoComplete,
            dropDownHeight: dropDownHeight,
            autoDropDownHeight: autoDropDownHeight,
            displayMember: displayMember,
            valueMember: valueMember
        });
        return srcAdapter;
    },
    createComboAdapterAsync: function (valueMember, displayMember, tag, url, data, width, dropDownHeight, autoComplete,value, callback) {
        tag = "#" + tag.replace("#", "");
        var srcAdapter = app_jqx.createDataAdapterAsync(valueMember, displayMember, url, data, function (status, records) {
            if (value)
                $(tag).val(value);
            if (callback)
                callback(status, records);
        });
        var autoDropDownHeight = true;
        if (typeof width === 'undefined' || width == 0) { width = 200; }
        if (typeof dropDownHeight === 'undefined' || dropDownHeight == 0)
            dropDownHeight = 200;
        else
            autoDropDownHeight = false;
        if (autoComplete === undefined) autoComplete = false;

        $(tag).jqxComboBox(
        {
            rtl: true,
            source: srcAdapter,
            width: width,
            autoComplete: autoComplete,
            dropDownHeight: dropDownHeight,
            autoDropDownHeight: autoDropDownHeight,
            displayMember: displayMember,
            valueMember: valueMember
        });
        return srcAdapter;
    },
    createListAdapterAsync: function (valueMember, displayMember, tagList, url, data, width, height, ischeckboxes, output, value, callback) {
        tagList = "#" + tagList.replace("#", "");
        var srcAdapter = app_jqx.createDataAdapterAsync(valueMember, displayMember, url, data, function (status, records) {
            if (value)
                $(tag).val(value);
            if (callback)
                callback(status, records);
        });
        if (ischeckboxes === undefined) ischeckboxes = false;
        
        $(tagList).jqxListBox(
        {
            rtl: true,
            checkboxes: ischeckboxes,
            source: srcAdapter,
            width: width,
            height: height,
            displayMember: displayMember,
            valueMember: valueMember
        });
        if (output) {
            $(tagList).on('change', function (event) {
                app_jqxcombos.listBoxToInput(tagList, output);
            });
        }
        return srcAdapter;
    },
    createInputAutoAdapterSync: function (valueMember, displayMember, tag, url, data, width, items, placeHolder, value, callback) {
        tag = "#" + tag.replace("#", "");

        //var srcAdapter = app_jqx.createDataAdapterSync(valueMember, displayMember, url, data);
        //if (value && srcAdapter) {
        //        var records = srcAdapter.records;
        //        var item = app_jqx.findRecordByField(records, valueMember, value);
        //        if (item && item.length > 0)
        //            $(tag).jqxInput('val', { label: item[0][displayMember], value: item[0][valueMember] });
        //    }
        //    if (callback)
        //        callback(records);

        var srcAdapter = app_jqx.createDataAdapterSync(valueMember, displayMember, url, data, function (status, records) {
                if (value && status == 'completed') {
                    var item = app_jqx.findRecordByField(records, valueMember, value);
                    if (item && item.length > 0)
                        $(tag).jqxInput('val', { label: item[0][displayMember], value: item[0][valueMember] });
                }
                if (callback)
                    callback(status, records);
            });

        if (typeof width === 'undefined' || width == 0) { width = 200; }
        if (typeof items === 'undefined' || items == 0)
            items = 10;
        if (placeHolder === undefined || placeHolder == null) placeHolder = '';// "...";

        $(tag).jqxInput(
        {
            rtl: true,
            height:25,
            source: srcAdapter,
            width: width,
            placeHolder: placeHolder,
            items: items,
            displayMember: displayMember,
            valueMember: valueMember
        });

        $(tag).keydown(function (event) {
            if (event.which == 8) {//backspace
                if ($(tag).is('[readonly]'))
                    event.preventDefault();
                else if (!$(this).val())
                    event.preventDefault();
            }
        });
        return srcAdapter;
    },
    createInputAutoAdapterAsync: function (valueMember, displayMember, tag, url, data, width, items, placeHolder, value, callback) {
        tag = "#" + tag.replace("#", "");
        var srcAdapter = app_jqx.createDataAdapterAsync(valueMember, displayMember, url, data, function (status, records) {
            if (value && status == 'completed') {
                var item = app_jqx.findRecordByField(records, valueMember, value);
                if (item && item.length > 0)
                    $(tag).jqxInput('val', { label: item[0][displayMember], value: item[0][valueMember] });
            }
            if (callback)
                callback(status, records);
        });
        if (typeof width === 'undefined' || width == 0) { width = 200; }
        if (typeof items === 'undefined' || items == 0)
            items = 10;
        if (placeHolder === undefined || placeHolder == null) placeHolder = '';// "...";

        $(tag).jqxInput(
        {
            rtl: true,
            height:25,
            source: srcAdapter,
            width: width,
            placeHolder: placeHolder,
            items: items,
            displayMember: displayMember,
            valueMember: valueMember
        });
        $(tag).keydown(function (event) {
            if (event.which == 8) {//backspace
                if ($(tag).is('[readonly]'))
                    event.preventDefault();
                else if (!$(this).val())
                    event.preventDefault();
            }
        });
        //$(tag).on('select', function (event) {
        //    if (event.args) {
        //        var item = event.args.item;
        //        if (item) {
        //            var valueelement = $("<div></div>");
        //            valueelement.text("Value: " + item.value);
        //            var labelelement = $("<div></div>");
        //            labelelement.text("Label: " + item.label);
        //        }
        //    }
        //});

        return srcAdapter;
    }

};

//============================================================================================ app_jqx_list

var app_jqx_combo_async = {

    buildingNameInputAdapter: function (tag, value, callback) {
        tag = (tag === undefined || tag == null) ? "#BuildingName" : tag;
        return app_jqx_adapter.createInputAutoAdapterAsync("BuildingId", "BuildingName", tag, '/Building/GetBuildingList', null, 200, 10, null, value, callback);
    },
    classComboAdapter: function (tag, value, callback) {
        tag = (tag === undefined || tag == null) ? "#BuildingClass" : tag;
        return app_jqx_adapter.createDropDownAdapterAsync("ClassType", "ClassName", tag, '/Building/GetBuildingClasses', null, 155, 0, value, callback);
    },
    ownerComboAdapter: function (tag, value, callback) {
        tag = (tag === undefined || tag == null) ? "#BuildingOwnerId" : tag;
        var adapter = app_jqx_adapter.createComboAdapterAsync("AccountId", "AccountName", tag, '/Building/GetOwnerView', null, 0, 200, true, value, callback);
        return adapter;
    },
    ownerInputAdapter: function (tag, value, callback) {
        tag = (tag === undefined || tag == null) ? "#OwnerId" : tag;
        var adapter = app_jqx_adapter.createInputAutoAdapterAsync("AccountId", "AccountName", tag, '/Building/GetOwnerView', null, 0, 10, null, value, callback);
        return adapter;
    },
    ownerInputAdapterSync: function (tag, value, callback) {
        tag = (tag === undefined || tag == null) ? "#OwnerId" : tag;
        var adapter = app_jqx_adapter.createInputAutoAdapterSync("AccountId", "AccountName", tag, '/Building/GetOwnerView', null, 0, 10, null, value, callback);
        return adapter;
    },
    //ownerUnitComboAdapter: function (tag, value, callback) {
    //    tag = (tag === undefined || tag == null) ? "#OwnerId" : tag;
    //    var adapter = app_jqx_adapter.createComboAdapterAsync("AccountId", "AccountName", tag, '/Building/GetOwnerView', null, 200, 200, true, value, callback);
    //    return adapter;
    //},
    ownerPlotsComboAdapter: function (tag, value, callback) {
        tag = (tag === undefined || tag == null) ? "#OwnerId" : tag;
        var adapter = app_jqx_adapter.createComboAdapterAsync("AccountId", "AccountName", tag, '/Building/GetOwnerView', null, 0, 200, true, value, callback);
        return adapter;
    },
    managementInputAdapter: function (tag, value, callback) {
        tag = (tag === undefined || tag == null) ? "#ManagementCompany" : tag;
        var adapter = app_jqx_adapter.createInputAutoAdapterAsync("AccountId", "AccountName", tag, '/Building/GetManagementView', null, 0, 10, null, value, callback);
        return adapter;
    },
    managementInputAdapterSync: function (tag, value, callback) {
        tag = (tag === undefined || tag == null) ? "#ManagementCompany" : tag;
        var adapter = app_jqx_adapter.createInputAutoAdapterSync("AccountId", "AccountName", tag, '/Building/GetManagementView', null, 0, 10, null, value, callback);
        return adapter;
    },
    managementComboAdapter: function (tag, value, callback) {
        tag = (tag === undefined || tag == null) ? "#ManagementCompany" : tag;
        var adapter = app_jqx_adapter.createComboAdapterAsync("AccountId", "AccountName", tag, '/Building/GetManagementView', null, 0, 200, true, value, callback);
        return adapter;
    },
    airComboAdapter: function (tag, value, callback) {
        tag = (tag === undefined || tag == null) ? "#AirConditionType" : tag;
        var adapter = app_jqx_adapter.createDropDownAdapterAsync("AirConditionId", "AirConditionName", tag, '/Building/GetAirConditionView', null, 155, 0, value, callback);
        return adapter;
    },
    parkComboAdapter: function (tag, value, callback) {
        tag = (tag === undefined || tag == null) ? "#ParkingType" : tag;
        var adapter = app_jqx_adapter.createDropDownAdapterAsync("ParkId", "ParkName", tag, '/Building/GetParkingTypeView', null, 155, 0, value, callback);
        return adapter;
    },
    dealComboAdapter: function (tag, value, callback) {
        tag = (tag === undefined || tag == null) ? "#DealType" : tag;
        var adapter = app_jqx_adapter.createDropDownAdapterAsync("DealId", "DealName", tag, '/Building/GetDealView', null, 200, 0, value, callback);
        return adapter;
    },
    dealComboCheckAdapter: function (tag, value, callback) {
        tag = (tag === undefined || tag == null) ? "#DealType" : tag;
        var adapter = app_jqx_adapter.createComboCheckAdapterAsync("DealId", "DealName", tag, '/Building/GetDealView', null, 200, 0, value, callback);
        return adapter;
    },
    dealUnitComboAdapter: function (tag, value, callback) {
        tag = (tag === undefined || tag == null) ? "#DealType" : tag;
        var adapter = app_jqx_adapter.createDropDownAdapterAsync("DealId", "DealName", tag, '/Building/GetDealUnitView', null, 200, 0, value, callback);
        return adapter;
    },
    purposeComboAdapter: function (tag, value, callback) {
        tag = (tag === undefined || tag == null) ? "#PurposeId" : tag;
        var adapter = app_jqx_adapter.createDropDownAdapterAsync("PurposeId", "PurposeName", tag, '/Building/GetPurposeView', null, 200, 0, value, callback);
        return adapter;
    },
    purposeComboCheckAdapter: function (tag, value, callback) {
        tag = (tag === undefined || tag == null) ? "#PurposeId" : tag;
        var adapter = app_jqx_adapter.createComboCheckAdapterAsync("PurposeId", "PurposeName", tag, '/Building/GetPurposeView', null, 200, 0, value, callback);
        return adapter;
    },
    tenantInputAdapterSync: function (tag, value, callback) {
        tag = (tag === undefined || tag == null) ? "#TenantId" : tag;
        var adapter = app_jqx_adapter.createInputAutoAdapterSync("AccountId", "AccountName", tag, '/Building/GetTenantView', null, 0, 10, null, value, callback);
        return adapter;
    },
    tenantInputAdapter: function (tag, value, callback) {
        tag = (tag === undefined || tag == null) ? "#TenantId" : tag;
        var adapter = app_jqx_adapter.createInputAutoAdapterAsync("AccountId", "AccountName", tag, '/Building/GetTenantView', null, 0, 10, null, value, callback);
        return adapter;
    },
    tenantComboAdapter: function (tag, value, callback) {
        tag = (tag === undefined || tag == null) ? "#TenantId" : tag;
        var adapter = app_jqx_adapter.createComboAdapterAsync("AccountId", "AccountName", tag, '/Building/GetTenantView', null, 200, 200, false, value, callback);
        return adapter;
    },
    ownerTypeComboAdapter: function (tag, value, callback) {
        tag = (tag === undefined || tag == null) ? "#OwnerType" : tag;
        var adapter = app_jqx_adapter.createDropDownAdapterAsync("OwnerTypeId", "OwnerTypeName", tag, '/Building/GetOwnerTypeView', null, 155, 0, value, callback);
        return adapter;
    },
    designationComboAdapter: function (tag, value, callback) {
        tag = (tag === undefined || tag == null) ? "#Designation" : tag;
        var adapter = app_jqx_adapter.createComboAdapterAsync("DesignationId", "DesignationName", tag, '/Building/GetDesignationView', null, 200, 200, false, value, callback);
        return adapter;
    },
    adsTypeComboAdapter: function (tag, value, callback) {
        tag = (tag === undefined || tag == null) ? "#MediaType" : tag;
        var adapter = app_jqx_adapter.createDropDownAdapterAsync("AdsTypeId", "AdsTypeName", tag, '/Building/GetAdsTypeView', null, 200, 200, value, callback);
        return adapter;
    },
    adsStatusComboAdapter: function (tag, selectValue) {
        tag = (tag === undefined || tag == null) ? "#Status" : tag;
        var adapter = app_jqx_adapter.createDropDownAdapterAsync("AdsStatusId", "AdsStatusName", tag, '/Common/GetAdsStatus', null, 240, 0, value, callback);
        return adapter;
    },
    requestSizeComboAdapter: function (tag, value, callback) {
        tag = (tag === undefined || tag == null) ? "#RequestSize" : tag;
        var adapter = app_jqx_adapter.createDropDownAdapterAsync("SizeId", "SizeTitle", tag, '/Common/GetRequestSize', null, 0, 200, value, callback);
        return adapter;
    },
    agentComboAdapter: function (tag, value, callback) {
        tag = (tag === undefined || tag == null) ? "#AgentId" : tag;
        var adapter = app_jqx_adapter.createComboAdapterAsync("UserId", "DisplayName", tag, '/Common/GetAgentList', null, 0, 200, false, value, callback);
        return adapter;
    },
    adsPropertyTypeComboAdapter: function (tag, value, callback) {
        tag = (tag === undefined || tag == null) ? "#PropertyType" : tag;
        var adapter = app_jqx_adapter.createDropDownAdapterAsync("AdsPropId", "AdsPropName", tag, '/Common/GetAdsPropertyType', null, 160, 0, value, callback);
        return adapter;
    }

};

//============================================================================================ app_notify

var app_jqxnotify = {
    lastTemplate:'info',
    notify: function (text, template) {
        $("#jqxNotification").text(text, template);
        if (template === undefined)
            template = "info";//"success";//"warning"
        //if (app_jqxnotify.lastTemplate != template) {
        //    app_jqxnotify.lastTemplate = template;
            $("#jqxNotification").jqxNotification({
                width: "98%", position: "top-left", opacity: 0.9,
                autoOpen: false, animationOpenDelay: 800, autoClose: true, autoCloseDelay: 3000, template: template
            });
       // }
        $("#jqxNotification").jqxNotification("open");
    },
    openNotification: function (msg, container, auto, onClose) {
        if (typeof auto === 'undefined') { auto = false; }

        var d = $('<div>' + msg + '</div>').jqxNotification({
            width: '92%', position: "top-right", opacity: 0.9, rtl: true, appendContainer: container, browserBoundsOffset: 60,
            autoOpen: true, animationOpenDelay: 800, autoClose: auto, autoCloseDelay: 3000, template: "info"
        });
        if (onClose) {
            d.on('close', function () { onClose() });
        }
        //d.jqxNotification("open");

        return d;
    },
    notificationError: function (data, auto, isDialog) {
        app_jqxnotify.notificationData(data, auto, "error", isDialog ? 0 : 60);
    },
    notificationWarning: function (data, auto, isDialog) {
        app_jqxnotify.notificationData(data, auto, "warning", isDialog ? 0 : 60);
    },
    notificationInfo: function (data, auto, isDialog) {
        app_jqxnotify.notificationData(data, auto, "info", isDialog ? 0 : 60);
    },
    notificationSuccess: function (data, auto, isDialog) {
        app_jqxnotify.notificationData(data, auto, "success", isDialog ? 0 : 60);
    },
    //template='info''warning''success''error''mail''time'null
    notificationData: function (data, auto, template, offset, onClose) {
        if (typeof auto === 'undefined') { auto = false; }
        if (typeof template === 'undefined') { template = "info"; }
        if (typeof offset === 'undefined') { offset = 0; }
        var width = (offset > 0) ? '92%' : '99%';
        var msg = (typeof data === 'string') ? data : data.Message;
        //var msg = (data instanceof Object) ? data.Message : data;

        var d = $('<div>' + msg + '</div>').jqxNotification({
            width: width, position: "top-right", opacity: 0.9, rtl: true, browserBoundsOffset: offset,
            autoOpen: true, animationOpenDelay: 800, autoClose: auto, autoCloseDelay: 3000, template: template
        });
        if (onClose && template != "error") {
            d.on('close', function () { onClose(data) });
        }
        d.jqxNotification("open");
        return d;
    },
    notificationDialog: function (data, auto, isError, onClose) {
        if (typeof auto === 'undefined') { auto = false; }
        var msg = (typeof data === 'string') ? data : data.Message;
        var template = isError ? "error" : "info";

        var d = $('<div>' + msg + '</div>').jqxNotification({
            width: '99%', position: "top-right", opacity: 0.9, rtl: true, browserBoundsOffset: 0,
            autoOpen: true, animationOpenDelay: 800, autoClose: auto, autoCloseDelay: 3000, template: template
        });
        if (onClose && template != "error") {
            d.on('close', function () { onClose(data) });
        }
        //d.jqxNotification("open");
        return d;
    },

};

/*
notificationDialog(data, false, (data.Status < 0), onNotifyClosed);

function onNotifyClosed(data)
{
    if (data.Status >= 0) {

        if ('@id' == 0) {
            $('#UnitId').val(data.OutputId);
        }
        window.parent.triggerPropertyComplete();
    }
}
*/

//debug
function debugObjectKeys(obj) {

    for (var o in obj) {
        var i = o;
    }
 
    // Visit non-inherited enumerable keys
    Object.keys(obj).forEach(function (key) {
        console.log(key, obj[key]);
    });

    for (var key in validation_messages) {
        if (validation_messages.hasOwnProperty(key)) {
            var obj = validation_messages[key];
            for (var prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    //alert(prop + " = " + obj[prop]);
                    console.log(prop + " = " + obj[prop]);
                }
            }
        }
    }
}
