

function setLinkHref(input,taglink,isEmail) {

    var val = $('#' + input).val();
    if (isEmail)
        val = 'mailto:' + val;
    if (val === undefined || val.length < 10) {
        $('a#' + taglink).attr('href', '');
        $('a#' + taglink).hide();
    }
    else {
        $('a#'+taglink).attr('href',  val);
        $('a#' + taglink).show();
    }
};

function setInputValue(tag, value, asEmpty) {
    if (value != asEmpty)
        $("#" + tag).val(value);
}

function loadDataForm(form, record) {
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
}

function getSelectedComboValue(tag, defaultValue) {
    var item = $("#" + tag).jqxComboBox('getSelectedItem');
    if (!item)
        return defaultValue;
    return item.value;
};
function getSelectedListValue(tag, defaultValue) {
    var item = $("#" + tag).jqxListBox('getSelectedItem');
    if (!item)
        return defaultValue;
    return item.value;
};
var selectComboBoxValue = function (tag, value) {
    var item = $("#" + tag).jqxComboBox('getItemByValue', value);
    if (item)
        $("#" + tag).jqxComboBox('selectIndex', item.index);
};

var selectComboCheckBoxValues = function (tag, values) {
    if (values) {
        var items = values.toString().split(",");
        for (index = 0; index < items.length; ++index) {
            var item = $("#" + tag).jqxComboBox('getItemByValue', items[index]);
            if (item)
                $("#" + tag).jqxComboBox('checkIndex', item.index);
        }
    }
};

var selectComboBoxValues = function (tag, values) {
    if (values) {
        var items = values.toString().split(",");
        for (index = 0; index < items.length; ++index) {
            var item = $("#" + tag).jqxComboBox('getItemByValue', items[index]);
            if (item)
                $("#" + tag).jqxComboBox('selectIndex', item.index);
        }
    }
};

function getFirstCheckedComboValue(tag, defaultValue) {
    var items = $("#" + tag).jqxComboBox('getCheckedItems');
    if (items && items.length > 0)
        return items[0].value;
    return defaultValue;
};


function getSelectedDropDownValue(tag, defaultValue) {
    var item = $("#" + tag).jqxDropDownList('getSelectedItem');
    if (!item)
        return defaultValue;
    return item.value;
};

var selectDropDownValue = function (tag, value) {
    var item = $("#" + tag).jqxDropDownList('getItemByValue', value);
    if (item)
        $("#" + tag).jqxDropDownList('selectIndex', item.index);
};

var selectCheckListIndex = function (tag, value) {
    var item = $("#" + tag).jqxListBox('getItemByValue', value);
    if (item) {
        $("#" + tag).jqxListBox('checkIndex', item.index);
    }
};

var selectCheckList = function (tag, value,output) {
    if (value) {
        var items = value.toString().split(",");
        for (index = 0; index < items.length; ++index) {
            selectCheckListIndex(tag, items[index]);
        }
        if (output)
            $("#" + output).val(value);
    }
};
function getListCheckedValues(list) {
    var items = $("#" + list).jqxListBox('getCheckedItems');
    var values = "";
    if (items && items.length > 0) {
        for (var i = 0; i < items.length; i++) {
            values += items[i].value;
            if (i < items.length - 1) values += ",";
        }
    }
    return values;
};
function getComboCheckedValues(list) {
    var items = $("#" + list).jqxComboBox('getCheckedItems');
    var values = "";
    if (items && items.length > 0) {
        for (var i = 0; i < items.length; i++) {
            values += items[i].value;
            if (i < items.length - 1) values += ",";
        }
    }
    return values;
};
function getComboSelectedValues(list) {
    var items = $("#" + list).jqxComboBox('getSelectedItems');
    var values = "";
    if (items && items.length > 0) {
        for (var i = 0; i < items.length; i++) {
            values += items[i].value;
            if (i < items.length - 1) values += ",";
        }
    }
    return values;
};

var renderCheckList = function (tag, dest) {
    var val = $("#" + tag).val();
    $("#" + dest).val(val);
};


var getDataCheckedList = function (records, field) {
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
}

var createComboAdapter = function (valueMember, displayMember, tag, url, width, dropDownHeight,async) {
    var srcAdapter = createtDataAdapter(valueMember, displayMember, url,async);
    var autoDropDownHeight = true;
    if (typeof width === 'undefined'|| width==0) { width = 240; }
    if (typeof dropDownHeight === 'undefined' || dropDownHeight == 0)
        dropDownHeight = 200;
    else
        autoDropDownHeight= false;

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
};

var setComboSourceAdapter = function (valueMember, displayMember, tag, srcAdapter, width, dropDownHeight, async) {
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
};

var createComboCheckAdapter = function (valueMember, displayMember, tag, url, width, dropDownHeight, async) {
    var srcAdapter = createtDataAdapter(valueMember, displayMember, url, async);
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
};
var createDropDownAdapter = function (valueMember, displayMember, tag, url, width, dropDownHeight, async) {
    var srcAdapter = createtDataAdapter(valueMember, displayMember, url, async);
    var autoDropDownHeight = true;
    if (typeof width === 'undefined' || width==0) { width = 240; }
    if (typeof dropDownHeight === 'undefined' || dropDownHeight==0)
        dropDownHeight = 200;
    else
        autoDropDownHeight= false;

    $("#" + tag).jqxDropDownList(
    {
        rtl: true,
        source: srcAdapter,
        width: width,
        dropDownHeight: dropDownHeight,
        autoDropDownHeight: autoDropDownHeight,
        placeHolder:'נא לבחור',
        displayMember: displayMember,
        valueMember: valueMember
    });
    return srcAdapter;
};
var createListAdapter = function (valueMember, displayMember, tagList, url, width, height, async, output) {
    var srcAdapter = createtDataAdapter(valueMember, displayMember, url, async);
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
            listBoxToInput(tagList, output);
        });
    }
    return srcAdapter;
};
var createCheckListAdapter = function (valueMember, displayMember, tagList, url, width, height, async, output) {
    var srcAdapter = createtDataAdapter(valueMember, displayMember, url, async);
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
            listCheckBoxToInput(tagList, output);
        });
    }
    return srcAdapter;
};
var createtDataAdapter = function (valueMember, displayMember, url,async) {
    if (typeof async === 'undefined') { async = true; }
    var source =
            {
                dataType: "json",
                async:async,
                dataFields: [
                    { name: valueMember },
                    { name: displayMember }
                ],
                type: 'POST',
                url: url
            };
    var srcAdapter = new $.jqx.dataAdapter(source);
    return srcAdapter;
};

function appendIframe(div, src, width, height, scrolling) {
    var iframe = $('<iframe frameborder="0" marginwidth="0" marginheight="0" allowfullscreen></iframe>');
    $("#"+div).append(iframe);
    iframe.attr({
        scrolling:scrolling,
        width: width,
        height: height,
        src: src
    });
};
function attachIframe(tag, src, width, height, scrolling) {
    var iframe = $("#" + tag)
    iframe.attr({
        scrolling: scrolling,
        width: width,
        height: height,
        src: src
    });
};


function listBoxToInput(list, input, checkbox) {
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
};
function listCheckBoxToInput(list, input, checkbox) {
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
};
function comboBoxToInput(list, input, checkbox) {
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
};

function CreateDateTimeInput(input) {
    $("#" + input).jqxDateTimeInput({ formatString: 'dd/MM/yyyy', value: null });
};
function validateCombo(input) {
    var index = $("#" + input).jqxComboBox('getSelectedIndex');
    if (index >= 0) { return true; } return false;
}
function validateNumber(input) {
    var value = $("#" + input).val();
    return value > 0;
}
function validateNumeric(input) {
    var value = $("#" + input).val();
    return isNumeric(value);
}
function validateDate(input, minYear, maxYear) {
    var date = $("#" + input).jqxDateTimeInput('value');
    if (date == null || date === undefined)
        return false;

    if (typeof minYear === 'undefined' || minYear == null) { minYear = 2000; }
    if (typeof maxYear === 'undefined' || maxYear == null) { maxYear = 2999; }

    return date.getFullYear() >= minYear && date.getFullYear() <= maxYear;
}

function openNotification(msg, container, auto,onClose) {
    if (typeof auto === 'undefined') { auto = false; }
    
    var d = $('<div>'+msg+'</div>').jqxNotification({
        width: '92%', position: "top-right", opacity: 0.9, rtl: true, appendContainer: container, browserBoundsOffset: 60,
        autoOpen: true, animationOpenDelay: 800, autoClose: auto, autoCloseDelay: 3000, template: "info"
    });
    if(onClose)
    {
        d.on('close', function () { onClose() });
    }
    //d.jqxNotification("open");
    
    return d;
};

function notificationError(data, auto, isDialog) {
    notificationData(data, auto, "error", isDialog?0:60);
};
function notificationWarning(data, auto, isDialog) {
    notificationData(data, auto, "warning", isDialog ? 0 : 60);
};
function notificationInfo(data, auto, isDialog) {
    notificationData(data, auto, "info", isDialog ? 0 : 60);
};
function notificationSuccess(data, auto, isDialog) {
    notificationData(data, auto, "success", isDialog ? 0 : 60);
};

//template='info''warning''success''error''mail''time'null
function notificationData(data, auto, template, offset, onClose) {
    if (typeof auto === 'undefined') { auto = false; }
    if (typeof template === 'undefined') { template = "info"; }
    if (typeof offset === 'undefined') { offset = 0; }
    var width =(offset > 0) ? '92%':'99%';
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
};

function notificationDialog(data, auto, isError, onClose) {
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
