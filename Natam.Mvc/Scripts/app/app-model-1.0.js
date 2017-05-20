//app-model

app = {
    globalID: 1,
    isMobileDevice: undefined,
    baseClassNames: {
        app: 'app',
        content: 'app-content',
        overlay: 'app-overlay'
    },
    defaultOptions: {
        content: '',
        appendLocation: 'body',
        className: '',
        css: {}
    },
    IsMobile: function () {

        if (this.isMobileDevice === undefined) {
            if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
                || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4)))
                this.isMobileDevice = true;
            else
                this.isMobileDevice = false;
        }
        return this.isMobileDevice;
    },
    appPath: function () {
        return window.location.protocol + "//" + window.location.host;// + config.base;
    },
    actionPath: function (action, conroller) {
        var link = window.location.protocol + "//" + window.location.host + config.base + "/" + conroller + "/" + action;
        return link;
    },
    redirectTo: function (url) {

        // similar behavior as an HTTP redirect
        //window.location.replace(url);

        // similar behavior as clicking on a link
        window.location.href = url;
    },
    refresh: function () {
        location.reload();
    },
    goBack: function () {
        parent.history.back();
    },
    goReferrer: function () {
        var ref = document.referrer;
        if (ref !== null && ref !== '') {
            if (ref.match(/:\/\/(.[^/]+)/)[1])
                window.location.href = ref;
        }
    },
    isNull: function (value, valueIfnull) {
        if (value === undefined || value == null)
            return valueIfnull
        return value;
    },
    toFloat: function (value, defaultVal) {
        var num = parseFloat(value);
        if (isNaN(num))
            return defaultVal
        return num;
    },
    toInt: function (value, defaultVal) {
        var num = parseInt(value, 10);
        if (isNaN(num))
            return defaultVal
        return num;
    },
    isInt: function (n) {
        return Number(n) === n && n % 1 === 0;
    },
    isFloat: function (n) {
        return n === Number(n) && n % 1 !== 0;
    },
    getFormInputs: function (forms) {
        var postData = [];

        $.each(forms, function (index, value) {
            var form = value
            $(form + ' input, ' + form + ' select, ' + form + ' textarea').each(
                function (index) {
                    var input = $(this);
                    postData.push(input.attr('name') + "=" + encodeURIComponent(input.val()));
                    //alert('Type: ' + input.attr('type') + 'Name: ' + input.attr('name') + 'Value: ' + input.val());
                }
            );
        });
        return postData.join("&");
    },
};

    //============================================================================================ app_rout

    var app_rout = {

        mediaPath: function () {
            return app.appPath() + "/uploads/";
        },
    
        isAllowEdit: function (allowEdit) {
            if (allowEdit == 0) {
                alert('You vave no permission for this action.');
            }
        },

        redirectToFinal: function (code) {
            app.redirectTo("/Home/Final?m=" + code);
        },

        redirectToUnit: function (uid, bid, floor, op) {
            if (typeof bid === 'undefined') { bid = 0; }
            app.redirectTo("/Building/UnitDef?id=" + uid + "&bid=" + bid + "&floor=" + floor + "&op=" + op);
        },

        redirectToProperty: function (uid, bid) {

            if (typeof bid === 'undefined')
                app.redirectTo("/Building/RedirectToUnitDef?id=" + uid + "&floor=0&op=1");
            else
                app.redirectTo("/Building/UnitDef?id=" + uid + "&bid=" + bid + "&floor=0&op=1");
        },

        redirectToBuilding: function (id) {
            app.redirectTo("/Building/BuildingDef?id=" + id);
        },

        redirectToLead: function (id) {
            app.redirectTo("/Crm/LeadDef?id=" + id);
        },

        redirectToTrans: function (id, transType) {
            if (transType == 3)
                app.redirectTo("/Crm/TransactionAdviceDef?id=" + id + "&tt=0");
            else if (transType == 1)
                app.redirectTo("/Crm/TransactionBuyerDef?id=" + id + "&tt=0");
            else if (transType == 2)
                app.redirectTo("/Crm/TransactionSellerDef?id=" + id + "&tt=0");
        },

        redirectToAdsDef: function (id, propertType) {
            app.redirectTo("/Crm/AdsDef?id=" + id + "&op=" + propertType);
        },
        redirectToAdsGrid: function (id, viewoption) {
            app.redirectTo("/Crm/AdsGrid?id=" + id + "&op=" + viewoption);
        },
    };

    //============================================================================================ app_accounts

    var app_accounts = {

        accountDisplay: function (id, title, divResult) {
            //alert(val);
            $.ajax({
                type: "POST",
                url: "/Common/GetAccountDetails",
                data: "{ 'id': '" + id + "' }",
                contentType: "application/json; charset=utf-8",
                //dataType: "json",
                success: function (data) {
                    app_dialog.popMessage(title, data);// data.d);
                },
                error: function (jqXHR, status, error) {
                    alert(error);
                    if (divResult)
                        $("#" + divResult).html("WebSerivce unreachable");
                }
            });
        },

        displayAccountType: function (acctype) {
            if (acctype == 2)
                return "בעלים";
            if (acctype == 1)
                return "לקוח";
            else if (acctype == 6)
                return "חברת ניהול";
            else if (acctype == 4) 
                return "דייר";
            else
                return  'חשבון'
        },

        displayAccountCategoryType: function (acctype) {
            if (acctype == 2)
                return "סוג בעלים";
            if (acctype == 1)
                return "סוג לקוח";
                //else if (acctype == 6)
                //    return "חברת ניהול";
                //else if (acctype == 4)
                //    return "דייר";
            else
                return 'קטגוריה'
        },

        accountEdit: function (id, acctype) {
            var title = "הגדרת חשבון";
            if (acctype == 2)
                title = "הגדרת בעלים";
            if (acctype == 1)
                title = "הגדרת לקוח";
            else if (acctype == 6)
                title = "הגדרת חברת ניהול";
            else if (acctype == 4) {
                title = "הגדרת דייר";
                return app_dialog.dialogIframe("/Common/_TenantEdit?id=" + id + "&acctype=" + acctype, "420", "400", title);
            }

            if(id>0)
                return app_dialog.dialogIframe("/Common/_AccountEdit?id=" + id + "&acctype=" + acctype, "500", "510", title);
            else
                return app_dialog.dialogIframe("/Common/_AccountEditNew?acctype=" + acctype, "500", "520", title);
        },

        accountDelete: function (id, acctype, async) {
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
                return false;

            $.ajax({
                async: async,
                type: "POST",
                url: "/Crm/AccountDelete",
                data: "{ 'AccountId': " + id + " , 'AccType': '" + acctype + "' }",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    if (data.Status < 0)
                        return false;
                    app_dialog.popMessage(data.Title, data.Message, "auto");
                    return true;
                },
                error: function (e) {
                    alert(e);
                    return false;
                }
            });
        },

        AccountNewsAdd: function (id) {
            var title = "הגדרת קבוצת דיוור";
            return app_dialog.dialogIframe("/Common/_AccountNewsEdit?id=" + id, "400", "550", title);
        },

        AccountNewsRemove: function (newsid, accid) {
            if (confirm("האם להסיר לקוח " + accid + " מקבוצת דיוור " + newsid)) {
                $.ajax({
                    type: "POST",
                    url: "/Common/AccountNewsDelete",///Ws/CrmWs.asmx/AccountNewsDelete",
                    data: "{ 'AccountId': '" + accid + "','NewsId': '" + newsid + "' }",
                    contentType: "application/json; charset=utf-8",
                    //dataType: "json",
                    success: function (data) {
                        app_dialog.popMessage('קבוצות דיוור', 'לקוח ' + accid + ' הוסר מקבוצת דיוור ' + newsid, "auto");
                    },
                    error: function (e) {
                        alert(e);
                    }
                });
            }
        },

        AccountValidate: function (accType, accName, contactName, cell) {

            var result;
   
            $.ajax({
                async:false,
                type: "POST",
                url: "/Common/AccountValidate",
                data: { 'AccountType': accType , 'AccountName': '' + accName + '', 'ContactName': '' + contactName + '', 'CellPhone': '' + cell + '' },
                //contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    result= data;
                },
                error: function (e) {
                    alert(e);
                }
            });
            return result;
        },
 
    };

    //============================================================================================ app_contacts

    var app_contacts = {

        getContactRole: function (accType) {

            switch (accType) {
                case 0://Unknown = 0,    //0	לא ידוע
                    return 1;// BuildingContact=1,
                case 7://Lead = 7//לקוח סןכן
                    return 3;//LeadContact=5
            }
            return 0;// account
        },

        appendContactIframe: function (iframe, id, role, uploadKey) {
            app_iframe.appendIframe(iframe, "/Common/_Contacts?id=" + id + "&role=" + role + "&uk=" + uploadKey, "500", "400");
        },

        contactDisplay: function (val, title, divResult) {
            $.ajax({
                type: "POST",
                url: "/Common/GetContactDetails",///Ws/CrmWs.asmx/GetContactDetails",//"/Ws/CrmWs.asmx/GetContactDetails",
                data: "{ 'id': '" + val + "' }",
                contentType: "application/json; charset=utf-8",
                //dataType: "json",
                success: function (data) {
                    app_dialog.popMessage(title, data);//data.d);
                },
                error: function (e) {
                    if (divResult)
                        $("#" + divResult).html("WebSerivce unreachable");
                }
            });
        },

        contactEdit: function (id, pid, op, uk) {
            if (id === undefined)
                return;
            if (pid === undefined)
                pid = 0;
            if (uk === undefined)
                uk = '';
            return app_dialog.dialogIframe("/Common/_ContactEdit?id=" + id + "&pid=" + pid + "&op=" + op + "&uk=" + uk, "320", "300", "אנשי קשר");
        },

        contactDelete: function (id, async) {
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
                        app_dialog.popMessage('אנשי קשר', 'איש קשר ' + id + 'הוסר מהמערכת ', "auto");
                    },
                    error: function (e) {
                        alert(e);
                    }
                });
            }
        }
    };

    //============================================================================================ app_leads

    var app_leads = {

        validateLeadAccountName: function (name, inputResult, async) {
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
                            app_dialog.popMessage('בדיקת לקוח', data);
                    }
                },
                error: function (e) {
                    alert(e);
                }
            });

        }

    };

    //============================================================================================ app_units

    var app_units = {

        validateUnitSize: function (origSize, newSize, maxSize) {

            if (!$.isNumeric(newSize) || !$.isNumeric(maxSize))
                return false;
            var actualSize = parseFloat(newSize) - parseFloat(origSize);
            var ok = parseFloat(maxSize) >= actualSize;

            return ok;
        },
        deleteUnit: function (unitId, BuildingId, FloorNum, PropertyType) {

            if (confirm("האם למחוק יחידה לצמיתות?") == false) {
                return;
            }
            $.ajax({
                url: '/Building/DeleteUnit',
                type: 'post',
                dataType: 'json',
                data: { 'UnitId': unitId, 'BuildingId': BuildingId, 'FloorNum': FloorNum, 'PropertyType': PropertyType },
                success: function (data) {
                    alert(data.Message);
                    if (data.Status > 0) {
                        //$("#jqxgrid").jqxGrid('source').dataBind();
                        window.location.reload();
                    }
                },
                error: function (jqXHR, status, error) {
                    alert(error);
                }
            });

        },
        unitDef: function (id) {
            app.redirectTo('UnitDef?id=' + id + '&bid=' + 0 + '&floor=0&op=0');
        }
    };

    //============================================================================================ app_buildings

    var app_buildings = {

        buildingDef:function(id){
            app.redirectTo("/Building/BuildingDef?id=" + id);
        },

        plotsDelete: function (id) {

            if (!confirm("האם למחוק כרטיס מגרש " + id))
                return;

            $.ajax({
                //async: async,
                type: "POST",
                url: "/Building/DeletePlots",
                data: { 'PlotsId': id },
                //contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    app_dialog.popMessage(data.Title, data.Message, "auto");
                },
                error: function (e) {
                    alert(e);
                }
            });

        }
    };

    //============================================================================================ app_query

    var app_query = {

        doFormSubmit: function (formtype) {

            var actionurl = this.getFormAction(formtype);
            $.ajax({
                url: actionurl,
                type: 'post',
                //dataType: 'json',
                data: $('#' + formtype).serialize(),
                //success: function (data) {
                //},
                error: function (jqXHR, status, error) {
                    alert(error);
                }
            });
        },
        getFormAction: function (formtype) {
            //if (formtype == 'formNatam')
            //    return '/Building/BuildingGrid';
            var val = app_form.getCheckedValue(formtype);
            //var val = $('.' + formtype).val();
            switch (val) {
                case "Buildings":
                    return '/Building/BuildingGrid'
                case "UnitsBuilding":
                    return '/Building/BuildingGrid';
                case "Units":
                    return '/Building/BuildingUnitGrid';
                default:
                    return '/Building/BuildingGrid';
            }
        },
        getUrlPage: function (path) {
            //var path = window.location.pathname;
            var page = path.split("/").pop();
            return page;
        },
        getAgentName: function (id, input) {
            console.log(id);
            $.ajax({
                type: "POST",
                url: "/Common/GetAgentName",
                data: { 'id': id },
                //contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    $('#'+input).val(data);// data.d);
                },
                error: function (jqXHR, status, error) {
                    alert(error);
                }
            });
        },
    };

    //============================================================================================ app_validation

    var app_validation = {

        validatePhone: function (value) {
            var re = /^(|\()(0|972)(\d{1}|\d{2})(|[\)\/\.-])([0-9]{7})$/
            return value ? re.test(value) : true;
        }
    };

    //============================================================================================ app_popup

    var app_popup = {

        mediaEditor: function (bid, pid, pt) {
            //popupIframe("/Building/_Media?bid=" + bid + "&pid=" + pid + "&pt=" + pt, "900", "520");
            app_dialog.dialogIframe("/Building/_Media?bid=" + bid + "&pid=" + pid + "&pt=" + pt, "900", "520","מדיה");
        },

        investmentEdit: function (id, bid, uid) {
            return app_dialog.dialogIframe("/Common/_InvestmentEdit?id=" + id + "&bid=" + bid + "&uid=" + uid, 500, 580, "תאור השקעה");
        },

        ownerGrid: function (account_type) {
            return app_dialog.dialogIframe("/Common/_AccountsGrid?at=2", 700, 580, "איתור בעלי נכסים");
        },
    }

    //============================================================================================ app_const

    var app_const = {

        adminLink: '<a href="/Admin/Manager">מנהל מערכת</a>',

        buildingToActiveLink: '<a href="/Building/BuildingToActiveGrid" class="row_link">הצג רשימת בניינים לעדכון</a>'
    };

    //============================================================================================ app_menu

    var app_menu = {

        wizardLink: function (id) {
            return '<a href="/Building/WizardBuilder?id=' + id + '">בניית בניין</a>'
        },

        activeLayoutMenu: function (li) {
            $("#cssmenu>ul>li.active").removeClass("active");
            $("#cssmenu>ul>li#" + li).addClass("active");
        },

        printObject: function (obj) {
            //debugObjectKeys(obj);
            var o = obj;
        },

        breadcrumbs: function (section,page,lang) {
        
            var breadcrumbs = $(".breadcrumbs");
            breadcrumbs.text('');
            var b = $('<div style="text-align:left;direction:ltr"></div>')

            if (lang === undefined || lang=='en')
            {
                b.append($('<a href="/home/index">Home</a>'));
                b.append($('<span> >> </span>'));
                b.append($('<a href="/home/main">Main</a>'));
                b.append($('<span> >> </span>'));
            
                var path = document.referrer;
                var page = app_query.getUrlPage(path);
                b.append($('<a href="' + path + '">' + page.split('?')[0] + '</a>'));
                b.append($('<span> >> </span>'));
                var curPage = app_query.getUrlPage(location.href);
                b.append($('<span> ' + curPage.split('?')[0] + ' </span>'));
            }
            else {
                b.append($('<a href="/home/index">דף הבית</a>'));
                b.append($('<span> >> </span>'));
                b.append($('<a href="/home/main">ראשי</a>'));
                b.append($('<span> >> </span>'));
                b.append('' + section + ' >> ' + page + ' |  ');
                b.append('<a href="javascript:parent.history.back()">חזרה</a>');

            }
            b.appendTo(breadcrumbs);
        }
    };

    //============================================================================================ app_dialog

    var app_dialog = {

        //mode=auto|modal
        alert: function (msg) {
            //font: normal normal normal 10px/1.5 Arial, Helvetica, sans-serif;
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
        },
        confirm: function (message, callback, args) {

            var divmessage = $('<div class="rtl">' + message + '</div>');
            var dialog = $("<div class='bdialog'></div>").append(divmessage).appendTo("body").dialog({
                resizable: false,
                height: "auto",
                width: 400,
                modal: true,
                dialogClass: 'ui-dialog-osx',
                buttons: {
                    "אישור": function () {
                        $(this).dialog("close");
                        if (callback)
                            callback(args);
                    },
                    "ביטול": function () {
                        $(this).dialog("close");
                    }
                }
            });
        },
        //mode=auto|modal
        alertMessage: function (msg) {

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
        },

        popMessage: function (caption, msg, mode) {
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
        },

        notifyMessage: function (caption, msg, mode) {

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
        },

        dialogMessage: function (caption, msg, auto, modal) {
            if (typeof auto === 'undefined') { auto = false; }
            if (typeof modal === 'undefined' || auto == true) { modal = false; }

            var d = $('<div id="dialog-message" title="' + caption + '" style="direction:rtl;">' +
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
        },

        confirmMessage: function (caption, msg, entity) {

            var d = $('<div id="dialog-message" title="' + caption + '" style="direction:rtl;">' +
                '<div style="margin-right: 20px;margin-top:10px;">' +
                '<p>' + msg + '</p></div></div>').dialog({
                    modal: true,
                    draggable: false,
                    resizable: false,
                    position: ['center', 'top'],
                    show: 'blind',
                    hide: 'blind',
                    width: '80%',
                    dialogClass: 'ui-dialog-osx',
                    buttons: [
                         {
                             text: "ביטול",
                             "class": 'btn-dialog',
                             click: function () {
                                 //$(resultTag).val('cancel');
                                 $(this).dialog("close");
                                 if (entity)
                                     entity.submitConfirm('cancel');
                             }
                         },
                        {
                            text: "לא",
                            "class": 'btn-dialog',
                            click: function () {
                                //$(resultTag).val('no');
                                $(this).dialog("close");
                                if (entity)
                                    entity.submitConfirm('no');
                            }
                        },
                        {
                            text: "כן",
                            "class": 'btn-dialog',
                            click: function () {
                                //$(resultTag).val('yes');
                                $(this).dialog("close");
                                if (entity)
                                    entity.submitConfirm('yes');
                            }
                        }
                    ]
                });
        },

        dialogIframe: function (src, width, height, title, scrolling) {
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
                dialogClass: 'ui-dialog-osx',
                //closeText: "x",
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
        },

        dialogIframClose: function () {
            var d = $('.bdialog');
            if (d)
                d.dialog('close');
        },

        dialogClose: function (d) {
            if (d)
                d.dialog('close');
        },

        popupDialogClose: function () {
            var d = $('.bdialog');
            if (d)
                d.dialog('close');
        }

    };

    //============================================================================================ app_iframe

    var app_iframe = {

        appendIframe: function (div, src, width, height, scrolling) {
            var iframe = $('<iframe frameborder="0" marginwidth="0" marginheight="0" allowfullscreen></iframe>');
            $("#" + div).append(iframe);
            iframe.attr({
                scrolling: scrolling,
                width: width,
                height: height,
                src: src
            });
        },

        attachIframe: function (tag, src, width, height, scrolling) {
            var iframe = $("#" + tag)
            iframe.attr({
                scrolling: scrolling,
                width: width,
                height: height,
                src: src
            });
        }

    };

    //============================================================================================ app_form

    var app_form = {

        getCheckedBox: function (classname) {
            var selected = $("." + classname + ":checked");
            if (!selected.val()) {
                return null;
            }
            else {
                var box = {
                    selectedValue: selected.val(),
                    selectedName: selected.siblings().text()
                };
                return box;
            }
        },
        getCheckedValue: function (classname) {
            var selected = $("." + classname + ":checked");
            if (!selected.val())
                return null;
            else
                return selected.val();
        },
        onRadioChange: function (selector,formname) {
            if ($(selector).is(':checked')) {
                var action = $(selector).val();
                $("#" + formname).attr('action') = action;
            }
        },
        ajaxDelete: function (url, data, onsuccess, msgConfirm, async) {

            if (typeof async === 'undefined') { async = true; }
            if (typeof msgConfirm === 'undefined') { msgConfirm = "?"; }

            var title = "האם למחוק " + msgConfirm;

            if (!confirm(title + id))
                return false;

            $.ajax({
                async: async,
                type: "POST",
                url: url,
                data: data,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    if (onsuccess)
                        onsuccess(data);
                },
                error: function (e) {
                    alert(e);
                    return false;
                }
            });
        }
    };

    var app_media = {
        propertyTypeToChar:function(propertyType){

            if (propertyType == 1)
                return "u";
            if (propertyType == 2)
                return "b";
            if (propertyType == 3)
                return "p"
            //default
            return "u";
        },
        loadImages: function (id, pt) {
            if (id === undefined || id == 0)
                return;
            if (typeof pt === 'undefined' || pt == null) { pt = 'u'; }

            for(var i=0;i<3;i++){
                $("#media_image" + i).html('');
            }  

            $.ajax({
                async: true,
                type: "POST",
                url: "/Building/GetMediaView",
                data: { 'buildingId': 0, 'propertyId': id, 'propertyType': '' + pt + '' },
                dataType: "json",
                success: function (data) {
                    if (data === undefined || data == null)
                        return;
                    $.each(data, function (index, value) {
                        console.log(value.MediaPath);
                        if (value.MediaPath && value.MediaType == 'img') {
                            var src = app_rout.mediaPath() + value.MediaType + "/" + value.MediaPath;
                            $("#media_image" + index).html('<img id="theImg" src="' + src + '" style="max-width:240px;border:solid 1px #808080" />');
                        }
                        else if (value.MediaPath && value.MediaType == 'doc') {
                            var src = app_rout.mediaPath() + value.MediaType + "/" + value.MediaPath;
                            $("#media_image" + index).html('<a href="' + src + '"><img id="theImg" src="/Images/doc.png" style="max-width:240px;border:solid 1px #808080" /></a>');
                        }
                        if (index > 2)
                            return;
                    });

                },
                error: function (e) {
                    //alert(e);
                }
            });

        }
    }

