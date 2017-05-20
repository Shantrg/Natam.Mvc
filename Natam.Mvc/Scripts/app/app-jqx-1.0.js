

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

    loadDataForm: function (form, record) {
        var arr = '';
        var types = '';
        $('#' + form + ' input, #' + form + ' select, #' + form + ' textarea').each(function (index) {
            var input = $(this);

            var tag = input.attr('name');
            if (tag !== undefined) {

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
        });
    },

    CreateDateTimeInput: function (input) {
        $("#" + input).jqxDateTimeInput({ formatString: 'dd/MM/yyyy', value: null });
    },

    validateCombo: function (input) {
        var index = $("#" + input).jqxComboBox('getSelectedIndex');
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

    createComboAdapter: function (valueMember, displayMember, tag, url, width, dropDownHeight, async) {
        var srcAdapter = app_jqx.createtDataAdapter(valueMember, displayMember, url, async);
        var autoDropDownHeight = true;
        if (typeof width === 'undefined' || width == 0) { width = 240; }
        if (typeof dropDownHeight === 'undefined' || dropDownHeight == 0)
            dropDownHeight = 200;
        else
            autoDropDownHeight = false;

        $("#" + tag).jqxComboBox(
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

    setComboSourceAdapter: function (valueMember, displayMember, tag, srcAdapter, width, dropDownHeight, async) {
        var autoDropDownHeight = true;
        if (typeof width === 'undefined' || width == 0) { width = 240; }
        if (typeof dropDownHeight === 'undefined' || dropDownHeight == 0)
            dropDownHeight = 200;
        else
            autoDropDownHeight = false;

        $("#" + tag).jqxComboBox(
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
        var srcAdapter = app_jqx.createtDataAdapter(valueMember, displayMember, url, async);
        var autoDropDownHeight = true;
        if (typeof width === 'undefined' || width == 0) { width = 240; }
        if (typeof dropDownHeight === 'undefined' || dropDownHeight == 0)
            dropDownHeight = 200;
        else
            autoDropDownHeight = false;

        $("#" + tag).jqxComboBox(
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

    createDropDownAdapter: function (valueMember, displayMember, tag, url, width, dropDownHeight, async) {
        var srcAdapter = app_jqx.createtDataAdapter(valueMember, displayMember, url, async);
        var autoDropDownHeight = true;
        if (typeof width === 'undefined' || width == 0) { width = 240; }
        if (typeof dropDownHeight === 'undefined' || dropDownHeight == 0)
            dropDownHeight = 200;
        else
            autoDropDownHeight = false;

        $("#" + tag).jqxDropDownList(
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

    createListAdapter: function (valueMember, displayMember, tagList, url, width, height, async, output) {
        var srcAdapter = app_jqx.createtDataAdapter(valueMember, displayMember, url, async);
        $("#" + tagList).jqxListBox(
        {
            rtl: true,
            source: srcAdapter,
            width: width,
            height: height,
            displayMember: displayMember,
            valueMember: valueMember
        });
        if (output) {
            $("#" + tagList).on('change', function (event) {
                app_jqxcombos.listBoxToInput(tagList, output);
            });
        }
        return srcAdapter;
    },

    createCheckListAdapter: function (valueMember, displayMember, tagList, url, width, height, async, output) {
        var srcAdapter = app_jqx.createtDataAdapter(valueMember, displayMember, url, async);
        $("#" + tagList).jqxListBox(
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
            $("#" + tagList).on('checkChange', function (event) {
                app_jqxcombos.listCheckBoxToInput(tagList, output);
            });
        }
        return srcAdapter;
    },

    listBoxToInput: function (list, input, checkbox) {
        //$('#' + list).on('change', function (event) {
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

var app_jqx = {

    createtDataAdapter: function (valueMember, displayMember, url, async) {
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
    }
};

//============================================================================================ app_jqx_list

var app_jqx_list = {

    classComboAdapter: function (tag) { return app_jqxcombos.createComboAdapter("ClassType", "ClassName", tag === undefined ? "BuildingClass": tag, '/Building/GetBuildingClasses', 155, 0, false) },
    ownerComboAdapter: function (tag) { return app_jqxcombos.createComboAdapter("AccountId", "AccountName", tag === undefined ? "BuildingOwnerId": tag, '/Building/GetOwnerView', 0, 200, false) },
    ownerUnitComboAdapter: function (tag) { return app_jqxcombos.createComboAdapter("AccountId", "AccountName", tag === undefined ? "OwnerId" : tag, '/Building/GetOwnerView', 240, 200, false) },
    ownerPlotsComboAdapter: function (tag) { return app_jqxcombos.createComboAdapter("AccountId", "AccountName", tag === undefined ? "OwnerId": tag, '/Building/GetOwnerView', 0, 200, false) },
    managementComboAdapter: function (tag) { return app_jqxcombos.createComboAdapter("AccountId", "AccountName", tag === undefined ? "ManagementCompany": tag, '/Building/GetManagementView', 0, 200, false) },
    airComboAdapter: function (tag) { return app_jqxcombos.createComboAdapter("AirConditionId", "AirConditionName", tag === undefined ? "AirConditionType": tag, '/Building/GetAirConditionView', 155, 0, false) },
    parkComboAdapter: function (tag) { return app_jqxcombos.createComboAdapter("ParkId", "ParkName", tag === undefined ? "ParkingType": tag, '/Building/GetParkingTypeView', 155, 0, false) },
    areaComboAdapter: function(tag){return app_jqxcombos.createComboAdapter("AreaId", "AreaName", tag === undefined ? "AreaId": tag, '/Building/GetAreaViewAll', 0, 200, false)},
    dealComboAdapter: function (tag) { return app_jqxcombos.createComboAdapter("DealId", "DealName", tag === undefined ? "DealType" : tag, '/Building/GetDealView', 240, 0, false) },
    dealComboCheckAdapter: function (tag) { return app_jqxcombos.createComboCheckAdapter("DealId", "DealName", tag === undefined ? "DealType" : tag, '/Building/GetDealView', 240, 0, false) },
    dealUnitComboAdapter: function (tag) { return app_jqxcombos.createComboAdapter("DealId", "DealName", tag === undefined ? "DealType" : tag, '/Building/GetDealUnitView', 240, 0, false) },
    purposeComboAdapter: function (tag) { return app_jqxcombos.createComboAdapter("PurposeId", "PurposeName", tag === undefined ? "PurposeId" : tag, '/Building/GetPurposeView', 240, 0, false) },
    purposeComboCheckAdapter: function (tag) { return app_jqxcombos.createComboCheckAdapter("PurposeId", "PurposeName", tag === undefined ? "PurposeId" : tag, '/Building/GetPurposeView', 240, 0, false) },
    tenantComboAdapter: function (tag) { return app_jqxcombos.createComboAdapter("AccountId", "AccountName", tag === undefined ? "TenantId" : tag, '/Building/GetTenantView', 240, 200, false) },
    ownerTypeComboAdapter: function (tag) { return app_jqxcombos.createComboAdapter("OwnerTypeId", "OwnerTypeName", tag === undefined ? "OwnerType" : tag, '/Building/GetOwnerTypeView', 155, 0, false) },
    designationComboAdapter: function (tag) { return app_jqxcombos.createComboAdapter("DesignationId", "DesignationName", tag === undefined ? "Designation" : tag, '/Building/GetDesignationView', 240, 200, false) },
    adsTypeComboAdapter: function (tag) { return app_jqxcombos.createComboAdapter("AdsTypeId", "AdsTypeName", tag === undefined ? "MediaType" : tag, '/Building/GetAdsTypeView', 240, 200, false) },
    adsStatusComboAdapter: function (tag) { return app_jqxcombos.createComboAdapter("AdsStatusId", "AdsStatusName", tag === undefined ? "Status" : tag, '/Common/GetAdsStatus', 240, 0, false) },
    requestSizeComboAdapter: function (tag) { return app_jqxcombos.createComboAdapter("SizeId", "SizeTitle", tag === undefined ? "RequestSize" : tag, '/Common/GetRequestSize', 0, 200, false) },
    agentComboAdapter: function (tag) { return app_jqxcombos.createComboAdapter("UserId", "DisplayName", tag === undefined ? "AgentId" : tag, '/Common/GetAgentList', 0, 200, false) },
    adsPropertyTypeComboAdapter: function (tag) { return app_jqxcombos.createDropDownAdapter("AdsPropId", "AdsPropName", tag === undefined ? "PropertyType" : tag, '/Common/GetAdsPropertyType',160, 0, false) }

    
};
//============================================================================================ app_notify

var app_jqxnotify = {

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
