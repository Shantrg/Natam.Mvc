
var showRowdetails = function (index, parentElement, gridElement, datarecord) {
    var tabsdiv = null;
    var information = null;
    var notes = null;
    var actions = null;
    tabsdiv = $($(parentElement));// $($(parentElement).children()[0]);
    //alert(tabsdiv);
    if (tabsdiv != null) {
        information = tabsdiv.find('.information');
        notes = tabsdiv.find('.notes');
        actions = tabsdiv.find('.actions');

        var title = tabsdiv.find('.title');
        title.text(datarecord.BuildingName);

        //info container
        var container = $('<div style="margin: 5px;text-align:right;"></div>')
        container.rtl = true;
        container.appendTo($(information));
        var leftcolumn = $('<div style="float: left; width: 45%;direction:rtl;"></div>');
        var rightcolumn = $('<div style="float: right; width: 40%;direction:rtl;"></div>');
        var photocolumn = $('<div style="float: left; width: 15%;"></div>');

        container.append(photocolumn);
        container.append(leftcolumn);
        container.append(rightcolumn);

        // var mediaLink = $('<input type="button" value="תמנות"/>')
        //.on("click", function (e) {
        //    e.preventDefault();
        //    mediaEditor(datarecord.BuildingId, datarecord.UnitId, "u");
        //});
        // $(photocolumn).append(mediaLink);

        var infosection = "<div class='row_detail'><b>{0}:</b>{1}</div>";


        $(leftcolumn).append(infosection.format("הערות", datarecord.Comment));

        $(rightcolumn).append(infosection.format("קוד השקעה", datarecord.InvestId));
        $(rightcolumn).append(infosection.format("הכנסה שנתית", datarecord.RevenuesOfYear));
        $(rightcolumn).append(infosection.format("נוצר ב", datarecord.Creation));

        //var ownerContainer = $("<div style='margin: 10px;direction:rtl;'><b>בעלים:</b> <a href='#' data-rel='popup' data-position-to='window' data-role='button' data-theme='a' data-inline='true'>" + datarecord.OwnerName + "</a></div>")
        //  .on("click", function (e) {
        //      e.preventDefault();
        //      accountDisplay(datarecord.OwnerId, "בעלים");
        //  });

        //$(rightcolumn).append(ownerContainer);

        //notes container
        var notescontainer = $('<div style="white-space: normal; margin: 5px;text-align:right;"><span>' + datarecord.DescreptionHeb + '</span></div><br/>' +
            '<div style="white-space: normal; margin: 5px;text-align:right;"><span>' + '' + '</span></div>');
        notescontainer.rtl = true;
        $(notes).append(notescontainer);

        //actions container
        var actionscontainer = $('<div style="white-space: normal; margin: 5px;text-align:right;"></div>');
        actionscontainer.rtl = true;

        // var invContainer = $("<div style='margin: 10px;direction:rtl;'><b>עריכה:</b> <a href='#' data-rel='popup' data-position-to='window' data-role='button' data-theme='a' data-inline='true'>פירוט השקעה</a></div>")
        //.on("click", function (e) {
        //    e.preventDefault();
        //    investmentEdit(datarecord.InvestId, datarecord.BuildingId, datarecord.UnitId);
        //});
        // actionscontainer.append(invContainer);

        var idType = datarecord.UnitId > 0 ? 'u' : 'b';
        if (idType == 'u')
            actionscontainer.append("<span class='row_link'><a href='UnitDef?id=" + datarecord.UnitId + "&bid=" + datarecord.BuildingId + "'>הצג יחידה</a></span>");

        actionscontainer.append("<span class='row_link'><a href='BuildingDef?id=" + datarecord.BuildingId + "'>הצג בניין</a></span>");

        //actionscontainer.append(mediaLink);
        var h = $(tabsdiv).parent();
        $(actions).append(actionscontainer);
        $(tabsdiv).jqxTabs({ width: '95%', height: 170, rtl: true });
        return tabsdiv;
    }
};


function accountDisplay(val, title, divResult) {
    //alert(val);
    $.ajax({
        type: "POST",
        url: "/Common/GetAccountDetails",//"/Ws/CrmWs.asmx/GetAccountDetails",
        data: "{ 'id': '" + val + "' }",
        contentType: "application/json; charset=utf-8",
        //dataType: "json",
        success: function (data) {
            dialogMessage(title,data);// data.d);
        },
        error: function (jqXHR, status, error) {
            alert(error);
            if (divResult)
                $("#" + divResult).html("WebSerivce unreachable");
        }
    });
}

function accountEdit(id, acctype) {
    return popupIframe("/Common/_AccountEdit?id=" + id + "&acctype=" + acctype, "500", "580");
};

function accountNewsAdd(id) {
    return popupIframe("/Common/_AccountNewsEdit?id=" + id, "400", "550");
};

function accountNewsRemove(newsid, accid) {
    if (confirm("האם להסיר לקוח " + accid + " מקבוצת דיוור " + newsid)) {
        $.ajax({
            type: "POST",
            url: "/Common/AccountNewsDelete",///Ws/CrmWs.asmx/AccountNewsDelete",
            data: "{ 'AccountId': '" + accid + "','NewsId': '" + newsid + "' }",
            contentType: "application/json; charset=utf-8",
            //dataType: "json",
            success: function (data) {
                dialogMessage('קבוצות דיוור', 'לקוח ' + accid + ' הוסר מקבוצת דיוור ' + newsid, true);
            },
            error: function (e) {
                alert(e);
            }
        });
    }
};
function accountContacts(id) {
    popupIframe("/Common/_AccountContacts?id=" + id , "600", "320");
};
function contactDisplay(val, title, divResult) {
    $.ajax({
        type: "POST",
        url: "/Common/GetContactDetails",///Ws/CrmWs.asmx/GetContactDetails",//"/Ws/CrmWs.asmx/GetContactDetails",
        data: "{ 'id': '" + val + "' }",
        contentType: "application/json; charset=utf-8",
        //dataType: "json",
        success: function (data) {
            dialogMessage(title, data);//data.d);
        },
        error: function (e) {
            if (divResult)
                $("#" + divResult).html("WebSerivce unreachable");
        }
    });
}

function contactEdit(id, accid, op, uk) {
     //return dialogIframe("/Common/_ContactEdit?id=" + id + "&accid=" + accid + "&op=" + op, "300", "250", "אנשי קשר");
    return popupIframe("/Common/_ContactEdit?id=" + id + "&accid=" + accid + "&op=" + op + "&uk=" + uk, "320", "320");
};
//function contactEditDialog(id, accid) {
//    //popupAjax("/Common/_ContactEdit?id=" + id + "&accid=" + accid);
//    //popupIframe("/Common/_ContactEdit?id=" + id + "&accid=" + accid, "320", "300");
//    dialogIframe("/Common/_ContactEdit?id=" + id + "&accid=" + accid, "300", "250", "אנשי קשר");
//};
function contactDelete(id, async) {
    if (typeof async === 'undefined') { async = true; }

    if (confirm("האם למחוק איש קשר " + id)) {
        $.ajax({
            async: async,
            type: "POST",
            url: "/Common/GetContactDetails",///Ws/CrmWs.asmx/ContactDelete",
            data: "{ 'id': '" + id + "' }",
            contentType: "application/json; charset=utf-8",
            //dataType: "json",
            success: function (data) {
                dialogMessage('אנשי קשר', 'איש קשר ' + id + 'הוסר מהמערכת ',true);
            },
            error: function (e) {
                alert(e);
            }
        });
    }
};

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

function mediaEditor(bid, pid, pt) {
    popupIframe("/Building/_Media?bid=" + bid + "&pid=" + pid + "&pt=" + pt, "900", "520");
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

    //alert(types);
    //alert(arr);
    //arr = '';
    //$.each($('.text'), function () {
    //    var tag = $(this).attr('name');
    //    var type = $(this).attr('data-type');
    //    var value = record[tag];
    //    if (type == "combo")
    //        selectComboBoxValue(tag, value);
    //    else if (type == "checklist")
    //        selectCheckList(tag, value);
    //    else
    //        $("#" + tag).val(value);
    //    arr += tag + ',';
    //});
    //alert(arr);
}

function investmentEdit(id, bid, uid) {
    return dialogIframe("/Common/_InvestmentEdit?id=" + id + "&bid=" + bid + "&uid=" + uid, 500, 580,"תאור השקעה");
    //return popupIframe("/Common/_InvestmentEdit?id=" + id + "&bid=" + bid + "&uid=" + uid, "500", "580");
};

function getSelectedComboValue(tag, defaultValue) {
    var item = $("#" + tag).jqxComboBox('getSelectedItem');
    if (!item)
        return defaultValue;
    return item.value;
};

var selectComboBoxValue = function (tag, value) {
    var item = $("#" + tag).jqxComboBox('getItemByValue', value);
    if (item)
        $("#" + tag).jqxComboBox('selectIndex', item.index);
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

var selectCheckList = function (tag, value) {
    if (value) {
        var items = value.toString().split(",");
        for (index = 0; index < items.length; ++index) {
            selectCheckListIndex(tag, items[index]);
        }
    }
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
var createListAdapter = function (valueMember, displayMember, tag, url, width, height, async) {
    var srcAdapter = createtDataAdapter(valueMember, displayMember, url, async);
    $("#" + tag).jqxListBox(
    {
        rtl: true,
        source: srcAdapter,
        width: width,
        height: height,
        displayMember: displayMember,
        valueMember: valueMember
    });
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
function appendIframe(div, src, width, height, scrolling) {
    var iframe = $('<iframe frameborder="0" marginwidth="0" marginheight="0" allowfullscreen></iframe>');
    $("#" + div).append(iframe);
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

///////////////////////////////  jq ///////////////////////////

function checkTagObject(obj) {

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

var adminLink=function(){
  return  '<a href="/Admin/Manager">מנהל מערכת</a>'
};

//$("#print").jqxButton();

/*
print grid
$("#print").click(function () {
    var gridContent = $("#jqxgrid").jqxGrid('exportdata', 'html');
    var newWindow = window.open('', '', 'width=800, height=500'),
    document = newWindow.document.open(),
    pageContent =
        '<!DOCTYPE html>\n' +
        '<html>\n' +
        '<head>\n' +
        '<meta charset="utf-8" />\n' +
        '<title>jQWidgets Grid</title>\n' +
        '</head>\n' +
        '<body>\n' + gridContent + '\n</body>\n</html>';
    document.write(pageContent);
    document.close();
    newWindow.print();
});
*/