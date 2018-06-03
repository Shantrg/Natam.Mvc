var config = {
    base: ''//'/party'
};

var appPath = function () {
    return window.location.protocol + "//" + window.location.host + config.base;
};

var actionPath = function (action, conroller) {
    var link = window.location.protocol + "//" + window.location.host + config.base + "/" + conroller + "/" + action;
    return link;
};

function isAllowEdit(allowEdit){
    if (allowEdit == 0) {
        alert('You vave no permission for this action.');
    }
}

function redirectTo(url) {
    
    // similar behavior as an HTTP redirect
    //window.location.replace(url);

    // similar behavior as clicking on a link
    window.location.href = url;
}
function redirectToFinal(code) {
    redirectTo("/Home/Final?m=" + code);
}
function redirectToUnit(uid, bid, floor, op) {
    if (typeof bid === 'undefined') { bid = 0; }
    redirectTo("/Building/UnitDef?id=" + uid + "&bid=" + bid + "&floor=" + floor + "&op=" + op);
}
function redirectToProperty(uid, bid) {
   
    if (typeof bid === 'undefined')
        redirectTo("/Building/RedirectToUnitDef?id=" + uid + "&floor=0&op=1");
    else
        redirectTo("/Building/UnitDef?id=" + uid + "&bid=" + bid + "&floor=0&op=1");
}
//function redirectToBuildingUnit(bid, op) {
//    redirectTo("/Building/UnitDef?id=" + bid + "&op=" + op);
//}
function redirectToBuilding(id) {
    redirectTo("/Building/BuildingDef?id=" + id);
}
function redirectToLead(id) {
    redirectTo("/Crm/LeadDef?id=" + id);
}
function redirectToTrans(id, transType) {
    if (transType == 3)
        redirectTo("/Crm/TransactionAdviceDef?id=" + id + "&tt=0");
    else if (transType == 1)
        redirectTo("/Crm/TransactionBuyerDef?id=" + id + "&tt=0");
    else if (transType == 2)
        redirectTo("/Crm/TransactionSellerDef?id=" + id + "&tt=0");
}
function accountDisplay(val, title, divResult) {
    //alert(val);
    $.ajax({
        type: "POST",
        url: "/Common/GetAccountDetails",//"/Ws/CrmWs.asmx/GetAccountDetails",
        data: "{ 'id': '" + val + "' }",
        contentType: "application/json; charset=utf-8",
        //dataType: "json",
        success: function (data) {
            popMessage(title, data);// data.d);
        },
        error: function (jqXHR, status, error) {
            alert(error);
            if (divResult)
                $("#" + divResult).html("WebSerivce unreachable");
        }
    });
}

function accountEdit(id, acctype) {
    var title = "הגדרת חשבון";
    if (acctype == 2)
        title = "הגדרת בעלים";
    if (acctype == 1)
        title = "הגדרת לקוח";
    else if (acctype == 6) 
        title = "הגדרת חברת ניהול";
    else if (acctype == 4) {
        title = "הגדרת דייר";
        return dialogIframe("/Common/_TenantEdit?id=" + id + "&acctype=" + acctype, "420", "400", title);
    }

    return dialogIframe("/Common/_AccountEdit?id=" + id + "&acctype=" + acctype, "500", "510", title);
};

function accountDelete(id, acctype,async) {
    if (typeof async === 'undefined') { async = true; }

    var title = "האם למחוק כרטיס חשבון ";
    if (acctype == 2)
        title = "האם למחוק כרטיס בעלים ";
    if (acctype == 1)
        title = "האם למחוק כרטיס לקוח ";
    else if (acctype == 6) 
        title = "כרטיס חברת ניהול ";
    else if (acctype == 4)
        title = "האם למחוק כרטיס דייר ";
        
        if (!confirm(title + id))
            return;

        $.ajax({
            async: async,
            type: "POST",
            url: "/Common/AccountDelete",
            data: "{ 'id': '" + id + "' }",
            contentType: "application/json; charset=utf-8",
            //dataType: "json",
            success: function (data) {
                popMessage('לקוחות', 'לקוח ' + id + 'הוסר מהמערכת ', "auto");
            },
            error: function (e) {
                alert(e);
            }
        });
    };

function AccountNewsAdd(id) {
    var title = "הגדרת קבוצת דיוור";
    return dialogIframe("/Common/_AccountNewsEdit?id=" + id, "400", "550", title);
};

function AccountNewsRemove(newsid, accid) {
    if (confirm("האם להסיר לקוח " + accid + " מקבוצת דיוור " + newsid)) {
        $.ajax({
            type: "POST",
            url: "/Common/AccountNewsDelete",///Ws/CrmWs.asmx/AccountNewsDelete",
            data: "{ 'AccountId': '" + accid + "','NewsId': '" + newsid + "' }",
            contentType: "application/json; charset=utf-8",
            //dataType: "json",
            success: function (data) {
                popMessage('קבוצות דיוור', 'לקוח ' + accid + ' הוסר מקבוצת דיוור ' + newsid, "auto");
            },
            error: function (e) {
                alert(e);
            }
        });
    }
};
function getContactRole(accType) {
 
    switch (accType) {
        case 0://Unknown = 0,    //0	לא ידוע
            return 1;// BuildingContact=1,
        case 7://Lead = 7//לקוח סןכן
            return 3;//LeadContact=5
    }
    return 0;// account
}

function appendContactIframe(iframe, id, role, uploadKey) {
    appendIframe(iframe, "/Common/_Contacts?id=" + id + "&role=" + role + "&uk=" + uploadKey, "500", "350");
}

//function accountContacts(id, role, uk) {
//    dialogIframe("/Common/_Contacts?id=" + id + "&role=" + role + "&uk=" + uk, "600", "320", "אנשי קשר");
//};

function contactDisplay(val, title, divResult) {
    $.ajax({
        type: "POST",
        url: "/Common/GetContactDetails",///Ws/CrmWs.asmx/GetContactDetails",//"/Ws/CrmWs.asmx/GetContactDetails",
        data: "{ 'id': '" + val + "' }",
        contentType: "application/json; charset=utf-8",
        //dataType: "json",
        success: function (data) {
            popMessage(title, data);//data.d);
        },
        error: function (e) {
            if (divResult)
                $("#" + divResult).html("WebSerivce unreachable");
        }
    });
}

function contactEdit(id, pid, op, uk) {
    if (uk === undefined)
        uk = '';
    return dialogIframe("/Common/_ContactEdit?id=" + id + "&pid=" + pid + "&op=" + op + "&uk=" + uk, "320", "280", "אנשי קשר");
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
            url: "/Common/ContactDelete",///Ws/CrmWs.asmx/ContactDelete",
            data: "{ 'id': '" + id + "' }",
            contentType: "application/json; charset=utf-8",
            //dataType: "json",
            success: function (data) {
                popMessage('אנשי קשר', 'איש קשר ' + id + 'הוסר מהמערכת ', "auto");
            },
            error: function (e) {
                alert(e);
            }
        });
    }
};


function validateLeadAccountName(name, inputResult, async) {
    if (typeof async === 'undefined') { async = true; }

    $.ajax({
        async: async,
        type: "POST",
        url: "/Common/ValidateLeadAccountName",
        data: "{ 'name': '" + name + "' }",
        contentType: "application/json; charset=utf-8",
        //dataType: "json",
        success: function (data) {
            if (data == "ok")
                return;
            else {
                if (inputResult) {
                    var confirmRes = confirm(data + "\n" + " האם להמשיך? ");
                    //alert(confirmRes)
                    $("#" + inputResult).val(confirmRes);
                }
                else
                    popMessage('בדיקת לקוח', data);
            }
        },
        error: function (e) {
            alert(e);
        }
    });

};

function validateUnitSize(origSize,newSize, maxSize) {

    if (!$.isNumeric(newSize) || !$.isNumeric(maxSize))
        return false;
    var actualSize = parseFloat(newSize) - parseFloat(origSize);
    var ok = parseFloat(maxSize) >= actualSize;

    return ok;
}
function validatePhone(value) {
    var re = /^(|\()(0|972)(\d{1}|\d{2})(|[\)\/\.-])([0-9]{7})$/
    return value ? re.test(value) : true;
}
function mediaEditor(bid, pid, pt) {
    popupIframe("/Building/_Media?bid=" + bid + "&pid=" + pid + "&pt=" + pt, "900", "520");
};

function investmentEdit(id, bid, uid) {
    return dialogIframe("/Common/_InvestmentEdit?id=" + id + "&bid=" + bid + "&uid=" + uid, 500, 580,"תאור השקעה");
};

var adminLink=function(){
  return  '<a href="/Admin/Manager">מנהל מערכת</a>'
};

var wizardLink = function (id) {
    return '<a href="/Building/WizardBuilder?id=' + id + '">בניית בניין</a>'
};

var buildingToActiveLink = function () {
    return '<a href="/Building/BuildingToActiveGrid" class="row_link">הצג רשימת בניינים לעדכון</a>'
};

function activeLayoutMenu(li) {
    $("#cssmenu>ul>li.active").removeClass("active");
    $("#cssmenu>ul>li#"+li).addClass("active");
}



function printObject(obj) {
    //debugObjectKeys(obj);
    var o = obj;
}

///////////////////////////////////  dialog /////////////////////////////////////////////

//mode=auto|modal
function alertMessage(msg) {

    var d = $('<div id="alert-message" title="..." style="direction:rtl;">' +
        '<div style="margin-right: 20px;margin-top:10px;">' +
        '<p>' + msg + '</p></div></div>').dialog({
            modal: true,
            show: 'fade',
            hide: 'fade',
            dialogClass: 'ui-dialog-osx',
            buttons: [
                {
                    text: "אישור",
                    "class": 'btn-dialog',
                    click: function () {
                        $(this).dialog("close");
                    }
                }
            ],
        });
}

function popMessage(caption, msg, mode) {
    var modal = false;
    var auto = false;
    if (mode == "auto")
        auto = true;
    else if (mode == "modal")
        modal = true;

    var d = $('<div id="pop-message" title="' + caption + '" style="direction:rtl;">' +
        '<div style="margin-right: 20px;margin-top:10px;">' +
        '<p>' + msg + '</p></div></div>').dialog({
            modal: true,
            show: 'blind',
            hide: 'blind',
            dialogClass: 'ui-dialog-osx',
            buttons: [
                {
                    text: "אישור",
                    "class": 'btn-dialog',
                    click: function () {
                        $(this).dialog("close");
                    }
                }
            ],
        });
    if (auto) {
        setTimeout(function () {
            d.dialog("close");
        }, 2000);
    }
}

function notifyMessage(caption, msg, mode) {

    var modal = false;
    var auto = false;
    if (mode == "auto")
        auto = true;
    else if (mode == "modal")
        modal = true;

    var d = $('<div id="notify-message" title="' + caption + '" style="direction:rtl;">' +
        '<div style="margin-right: 20px;margin-top:10px;">' +
        '<p>' + msg + '</p></div></div>').dialog({
            modal: modal,
            draggable: false,
            resizable: false,
            position: ['center', 'top'],
            show: 'blind',
            hide: 'blind',
            width: '80%',
            dialogClass: 'ui-dialog-osx',
            buttons: [
                {
                    text: "אישור",
                    "class": 'btn-dialog',
                    click: function () {
                        $(this).dialog("close");
                    }
                }
            ],
        });
    if (auto) {
        setTimeout(function () {
            d.dialog("close");
        }, 2000);
    }
}

function dialogMessage(caption, msg, auto, modal) {
    if (typeof auto === 'undefined') { auto = false; }
    if (typeof modal === 'undefined' || auto == true) { modal = false; }

    var d = $('<div id="dialog-message" title="' + caption + '" style="direction:rtl;">' +
        '<div style="margin-right: 20px;margin-top:10px;">' +
        '<p>'+msg+'</p></div></div>').dialog({
            modal: modal,
            draggable: false,
            resizable: false,
            position: ['center', 'top'],
            show: 'blind',
            hide: 'blind',
            width: '80%',
            dialogClass: 'ui-dialog-osx',
            buttons: [
                {
                    text: "אישור",
                    "class": 'btn-dialog',
                    click: function() {
                        $(this).dialog("close");
                    }
                }
            ],
         });
    if (auto) {
        setTimeout(function () {
            d.dialog("close");
        }, 2000);
    }
}

function dialogMessage2(caption, msg, auto) {
    if (typeof auto === 'undefined') { auto = false; }

    var d = $('<div style="direction:rtl"></div>').dialog({
        //modal: modal,
        title: caption,
        open: function () {
            $(this).html(msg);
        },
        buttons: {
            Ok: function () {
                $(this).dialog("close");
            }
        }
    });

    if (auto) {
        setTimeout(function () {
            d.dialog("close");
        }, 2000);
    }
};


function dialogIframe(src, width, height, title, scrolling) {
    if (!scrolling)
        scrolling = 'no';
    var iframe = $('<iframe scrolling="' + scrolling + '" frameborder="0" marginwidth="0" marginheight="0" allowfullscreen></iframe>');
    var dialog = $("<div class='bdialog'></div>").append(iframe).appendTo("body").dialog({
        autoOpen: false,
        modal: true,
        resizable: false,
        width: "auto",
        height: "auto",
        title: title,
        //create: function (event, ui) {
        //    $(".ui-widget-header").hide();
        //},
        close: function () {
            iframe.attr("src", "");
        }
    });

    iframe.attr({
        width: width,
        height: height,
        src: src
    });
    dialog.dialog("open");
    return dialog;
    //dialog.dialog("option", "title", title).dialog("open");
    //$(".ui-dialog-titlebar").hide();
};

function dialogIframClose() {
    var d = $('.bdialog');
    if (d)
        d.dialog('close');
};

function dialogClose(d) {
    if (d)
        d.dialog('close');
};

function popupDialogClose() {
    var d = $('.bdialog');
    if (d)
        d.dialog('close');
};