//app-model
String.prototype.jsonEscape = function () { return this.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\t/g, "\\t").replace(/\f/g, "\\f").replace(/"/g, "\\\"").replace(/'/g, "\\\'").replace(/\&/g, "\\&"); }

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
            return valueIfnull === undefined? "": valueIfnull;
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
    jsonEscape : function (str) { return str.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\t/g, "\\t").replace(/\f/g, "\\f").replace(/"/g, "\\\"").replace(/'/g, "\\\'").replace(/\&/g, "\\&"); },

    htmlEscape: function (str) {
        return str

            //.replace(/{/g, '&#123;')
            //.replace(/}/g, '&#125;')
            //.replace('/', '&#47;')
            //.replace(/%/g, '&#37;')
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/\\/g, '\\\\')
            .replace(/'/g, '&apos;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    },
    htmlUnescape: function (str) {
        return str
            //.replace(/&#123;/g, '{')
            //.replace(/&#125;/g, '}')
            //.replace(/&#47;/g, '/')
            //.replace(/&#37;/g, '%')
            .replace(/&quot;/g, '"')
            .replace(/\\\\/g, "\\")//
            .replace(/&apos;/g, "'")
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&amp;/g, '&');
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
    serializeForms: function (forms) {
        var postData = [];

        $.each(forms, function (index, value) {
            var form = value
            $(form + ' input, ' + form + ' select, ' + form + ' textarea,' + form + 'hidden').each(
                function (index) {
                    var input = $(this);
                    var tag = input.attr('name');
                    if (tag !== undefined) {
                        var val = input.val();
                        if (input[0].type == "checkbox")
                            val = input[0].checked;
                        else if (val) {
                            if (typeof val === 'object')
                                val = val.value;
                        }
                        postData.push(tag + "=" + encodeURIComponent(val));
                    }
                    //alert('Type: ' + input.attr('type') + 'Name: ' + input.attr('name') + 'Value: ' + input.val());
                }
            );
        });
        return postData.join("&");
    },
    serialize: function (form) {
        var postData = [];
        $(form + ' input, ' + form + ' select, ' + form + ' textarea,' + form + 'hidden').each(
            function (index) {
                var input = $(this);
                var tag = input.attr('name');
                if (tag !== undefined) {
                    var val = input.val();
                    if (input[0].type == "checkbox")
                        val = input[0].checked;
                    else if (val) {
                        if (typeof val === 'object')
                            val = val.value;
                    }
                    else
                        val = "";
                    postData.push(tag + "=" + encodeURIComponent(val));
                }
            }
        );
        return postData.join("&");
    },
    serializeEx: function (formInputs, exArgs) {
        var postData = [];
        //form + ' input, ' + form + ' select, ' + form + 'hidden'
        $(formInputs).each(
            function (index) {
                var input = $(this);
                var tag = input.attr('name');
                if (tag !== undefined) {
                    var val = input.val();
                    if (input[0].type == "checkbox")
                        val = input[0].checked;
                    else if (val) {
                        if (typeof val === 'object')
                            val = val.value;
                    }
                    else
                        val = "";
                    postData.push(tag + "=" + encodeURIComponent(val));
                }
            });
        if (exArgs) {
            for (var i = 0; i < exArgs.length; i++) {
                postData.push(exArgs[i].key + "=" + encodeURIComponent(exArgs[i].value));
            }
        }
        return postData.join("&");
    },
    serializeArrayToJson: function (form) {
        return JSON.stringify($(form).serializeArray());
    },
    serializeToJsonObject: function (form) {
        var unindexed_array = $(form).serializeArray();
        var indexed_array = {};

        $.map(unindexed_array, function (n, i) {
            indexed_array[n['name']] = n['value'];
        });

        return indexed_array;
    },
    parseJsonDate: function (value) {

        if (typeof value === 'string') {
            var strd = /\/Date\((\d*)\)\//.exec(value);
            return (strd) ? new Date(+strd[1]) : value;
        }
        return value;
        //value = new Date(parseInt(value.replace("/Date(", "").replace(")/", ""), 10));
        //return new Date(value);
    },
    formatDateTimeIso: function (date, format) {
        return formatDateTimeString(date, 'yyyy-mm-dd hh:mm:ss');
    },
    formatDateTimeString: function (date, format) {

        if (date === undefined || date == null || date == '')
            return '';
        if (format === undefined || format == null)
            format = 'dd/mm/yyyy hh:mm:ss';

        //if (date === typeof (Date)) {
        //    return date.format(format);
        //}
        if (date instanceof Date) {// && typeof date.getMonth === 'function') {
            return date.format(format);
        }
        else {//if (typeof date === 'string') {

            var strdate = date.toString();
            if (strdate.indexOf('Date') != -1) {
                var jdate = app.parseJsonDate(date);
                if (jdate) {// && jdate === typeof (Date)) {
                    return jdate.format(format);
                }
            }

            var d = new Date(date);
            return d.format(format);
        }
    },
    formatDateString: function (date, format) {

        if (format === undefined || format == null)
            format = 'dd/mm/yyyy';
        return app.formatDateTimeString(date, format);
    }
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

    breadcrumbs: function (section, page, lang) {

        var breadcrumbs = $(".breadcrumbs");
        breadcrumbs.text('');
        var b = $('<div style="text-align:left;direction:ltr"></div>')

        if (lang === undefined || lang == 'en') {
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
//============================================================================================ app_combo

    var app_combo = {

    jsonToOption: function (tag, data, valueMember, displayMember) {
            $.each(data, function (key, entry) {
                $(tag).append($('<option></option>').attr('value', entry[valueMember]).text(entry[displayMember]));
            })
    },
    getJsonToCombo: function (tag, url, valueMember, displayMember) {
        $.getJSON(url, function (data) {
            $.each(data, function (key, entry) {
                $(tag).append($('<option></option>').attr('value', entry[valueMember]).text(entry[displayMember]));
            })
        });
    },
    bindCombo: function (tag, url, data, valueMember, displayMember, width, placeHolder,selectedValue) {
        if (width === undefined) width = '200px';
        $(tag).empty();
        if (placeHolder)
            $(tag).append($('<option></option>').attr('value', "").text(placeHolder));
        $.post(url, data, function (data, textStatus) {
            $.each(data, function (key, entry) {
                $(tag).append($('<option></option>').attr('value', entry[valueMember]).text(entry[displayMember]));
            })
            //var combo=$(tag).jqCombo({ rtl: true, allow_single_deselect: false, disable_search_threshold: 10, no_results_text: 'Oops, nothing found!', width: width });
            if (selectedValue) {
                //combo.single_set_selected_text("ללא");
                //var sval= $(tag).val();
                $(tag).val(selectedValue);
            }
        }, "json");
    }

};

    //============================================================================================ app_query

    // Handle form submit ...
    //$("form").live("submit", function (event) {
    //    event.preventDefault();
    //    var form = $(this);
    //    $("#ProgressDialog").dialog("open");
    //    $.ajax({
    //        url: form.attr('action'),
    //        type: "POST",
    //        data: form.serialize(),
    //        success: function (data) {
    //            $("#FormContainer").html(data);
    //            $.validator.unobtrusive.parse("form");
    //        },
    //        error: function (jqXhr, textStatus, errorThrown) {
    //            alert("Error '" + jqXhr.status + "' (textStatus: '" + textStatus + "', errorThrown: '" + errorThrown + "')");
    //        },
    //        complete: function () {
    //            $("#ProgressDialog").dialog("close");
    //        }
    //    });
    //});

    var app_query = {

        doPost: function (url, requestData, callback) {
            //e.preventDefault();
            $.ajax({
                url: url,
                type: 'post',
                dataType: 'json',
                data: requestData,
                success: function (data) {
                    if (callback)
                        callback(data);
                },
                error: function (jqXHR, status, error) {
                    //app_dialog.alert(error);
                    app_messenger.Error(error);
                }
            });
        },
        doFormSubmit: function (formTag, actionUrl, formData, callback) {
            //e.preventDefault();
            if (actionUrl === undefined || actionUrl == null)
                actionUrl = $(formTag).attr('action');

            if (formData === undefined || formData == null)
                formData = app.serialize(formTag);// app.serialize(formTag);

            var validationResult = function (isValid) {
                if (isValid) {
                    $.ajax({
                        url: actionUrl,
                        type: 'post',
                        dataType: 'json',
                        data: formData,
                        success: function (data) {
                            if (callback)
                                callback(data);
                            else
                                app_dialog.alert(data.Message);// app_messenger.Post(data);
                        },
                        error: function (jqXHR, status, error) {
                            app_dialog.alert(error); //app_messenger.Notify(error, 'error');
                        }
                    });
                }
                else {
                    //not valid
                }
            }
            $(formTag).jqxValidator('validate', validationResult);

            return this;
        },
        doFormPost: function (formTag, callback, preSubmit, validatorTag) {
            if (validatorTag)
                $(validatorTag).empty();
            var actionurl = $(formTag).attr('action');
            if (preSubmit)
                preSubmit();
            var validationResult = function (isValid) {
                if (isValid) {
                    $.ajax({
                        url: actionurl,
                        type: 'post',
                        dataType: 'json',
                        data: app.serialize(formTag),
                        success: function (data) {
                            if (callback)
                                callback(data);
                            else
                                app_dialog.alert(data.Message);
                        },
                        error: function (jqXHR, status, error) {
                            app_dialog.alert(error);
                        }
                    });
                }
                else {
                    if (validatorTag)
                        $(validatorTag).text("חסרים פרטים הכרחיים לעדכון");
                }
            }
            $(formTag).jqxValidator('validate', validationResult);
        },
        doDataPost: function (url, data, callback, args) {
            $.ajax({
                url: url,
                type: 'post',
                dataType: 'json',
                data: data,
                success: function (data) {
                    if (data.Status > 0)
                        app_dialog.alert(data.Message);//app_messenger.Post(data);
                    else
                        app_dialog.alert(data.Message); //app_messenger.Post(data, 'error');
                    if (callback) {
                        if (args)
                            callback(data, args);
                        else
                            callback(data);
                    }
                },
                error: function (jqXHR, status, error) {
                    app_dialog.alert(error);
                }
            });
        },
        //doFormSubmit: function (formtype) {

        //    var actionurl = this.getFormAction(formtype);
        //    $.ajax({
        //        url: actionurl,
        //        type: 'post',
        //        //dataType: 'json',
        //        data: $('#' + formtype).serialize(),
        //        //success: function (data) {
        //        //},
        //        error: function (jqXHR, status, error) {
        //            alert(error);
        //        }
        //    });
        //},
        getUrlPage: function (path) {
            //var path = window.location.pathname;
            var page = path.split("/").pop();
            return page;
        },
         doGet: function (url, data, callback) {
            $.ajax({
                url: url,
                type: 'get',
                dataType: 'json',
                data: data,
                success: function (data) {
                    console.log(data);
                    if (callback)
                        callback(data);
                },
                error: function (jqXHR, status, error) {
                    app_dialog.alert(error);
                }
            });
        },
        doLookup: function (url, data, callback) {
            $.ajax({
                url: url,
                type: 'post',
                dataType: 'json',
                data: data,
                success: function (data) {
                    console.log(data);
                    if (callback) {
                        callback(data);
                    }
                },
                error: function (jqXHR, status, error) {
                    //app_dialog.alert(error);
                    app_messenger.Error(error);
                }
            });
        }
    };
//============================================================================================ app_model

    var app_model = {

    postModel: function (url, postData, callback) {
        $.ajax({
            async: false,
            url: url,
            type: "POST",
            dataType: 'json',
            //contentType: "application/json; charset=utf-8",
            //contentType: "application/x-www-form-urlencoded;charset=utf-8",
            data: postData,
            success: function (data) {
                if (callback);
                callback(data);
            },
            error: function (jqXHR, status, error) {
                app_dialog.alert(error);
            }
        });
        //return false;
    }
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
        actionTo: function (value) {

            //return '<a href="javascript:customers_accountEdit(' + value + ')" ><i class="fa fa-plus-square-o" style="font-size:14px;color:#000;margin:8px 8px"></i></a>';

            //var link = '<div style="text-align:center"><a href="javascript:customers_accountEdit(' + value + ')" ><i class="fa fa-plus-square-o" style="font-size:20px;color:#000"></i></a>';

        }
    };

    //============================================================================================ app_messenger

    var app_messenger = {
        //'messenger-fixed messenger-on-bottom messenger-on-right'
        //'messenger-fixed messenger-on-top'
        Init: function (location, theme) {
            if (typeof location === 'undefined') { location = "messenger-fixed messenger-on-top"; }
            else if (location == 'bottom-right') { location = "messenger-fixed messenger-on-bottom messenger-on-right"; }
            else if (location == 'top') { location = "messenger-fixed messenger-on-top"; }
            if (typeof theme === 'undefined') { theme = "block"; }

            Messenger.options = {
                extraClasses: location,
                theme: theme
            }
        },
        //Alert: function (message, type, showClose) {
        //    if (typeof showClose === 'undefined') { showClose = false; }
        //    if (typeof type === 'undefined') { type = "info"; }
        //    Messenger().post({
        //        message: message,
        //        type: type,
        //        showCloseButton: showClose,
        //        hideOnNavigate: !showClose
        //    });
        //    //hideAfter: 10,
        //    //hideOnNavigate: true
        //    //Messenger().post(message);
        //},
        Notify: function (data, type, redirectTo) {
            if (typeof type === 'undefined') { type = "info"; }

            var msg = Messenger().post({
                message: (typeof data === 'string') ? data : data.Message,
                type: type,
                showCloseButton: (redirectTo) ? true : false,
                actions: {
                    click: {
                        label: 'אישור',
                        action: function () {
                            //if (redirectTo) {
                            //    if (typeof data === 'object') {
                            //        if (data.Status >= 0)
                            //            app.redirectTo(redirectTo);
                            //    }
                            //    else
                            //        app.redirectTo(redirectTo);
                            //}
                            return msg.cancel();
                        }
                    }
                }
            });

            if (redirectTo) {
                if (typeof data === 'object') {
                    if (data.Status >= 0)
                        app.redirectTo(redirectTo);
                }
                else
                    app.redirectTo(redirectTo);
            }
            //return msg.cancel();
        },
        Post: function (data, type, showClose) {
            if (typeof type === 'undefined') { type = "info"; }
            if (typeof showClose === 'undefined') {
                showClose = true;
            }
            Messenger().post({
                message: (typeof data === 'string') ? data : data.Message,
                type: type,
                showCloseButton: showClose
            });
        },
        Error: function (message, showClose) {
            if (typeof showClose === 'undefined') {
                showClose = true;
            }
            Messenger().post({
                message: message,
                type: "error",
                showCloseButton: showClose
            });
        },
        Dialog: function (data, callback, args) {
            var type = (data.Status > 0) ? 'success' : 'error';
            var msg = Messenger().post({
                message: data.Message,
                type: type,
                showCloseButton: false,
                actions: {
                    cancel: {
                        label: 'אישור',
                        action: function () {
                            if (callback && type != "error") {
                                (args) ? callback(data, args) : callback(data);
                            }
                            return msg.cancel();
                        }
                    }
                }
            });

            //Messenger().post(message);
        }
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
        confirm: function (message, callbackYes, args,callbackNo) {

            var divmessage = $('<div class="rtl" style="z-index:10000">' + message + '</div>');
            var dialog = $("<div class='bdialog'></div>").append(divmessage).appendTo("body").dialog({
                resizable: false,
                height: "auto",
                width: 400,
                modal: true,
                dialogClass: 'ui-dialog-osx',
                buttons: {
                    "אישור": function () {
                        $(this).dialog("close");
                        if (callbackYes)
                            callbackYes(args);
                    },
                    "ביטול": function () {
                        $(this).dialog("close");
                        if (callbackNo)
                            callbackNo(args);
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
                    width: 400,
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
                    width: 400,
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
            //alert(src);
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
            if (d ===undefined || d == null)
                d = $('.bdialog');
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
        panelClose: function (tag, doempty) {
            tag = tag.replace("#", "");
            $("#" + tag).hide();
            if (doempty)
                $("#" + tag).empty();
        },
        panelSwitchClose: function (parentName, isSwitch, doempty) {
            parentName = parentName.replace("#", "");
            var tag = parentName + "-panel";
            $("#" + tag).hide();
            if (isSwitch)
                $("#" + parentName).show();
            if (doempty)
                $("#" + tag).empty();
        },
        appendPanelSwitch: function (parentName, src, width, height, scroll, title) {
            parentName = parentName.replace("#", "");
            var tag = parentName + "-panel";

            if ($("#" + tag).length == 0) {
                $("#" + parentName).after('<div id="' + tag + '" class="panel-window"></div>');
            }
            else {
                $("#" + tag).empty();
            }

            $("#" + parentName).hide();

            //app_iframe.showPanel("#" + tag, src, width, height, scroll, title);
            $("#" + tag).empty();
            var panel = $('<div class="panel-header"></div>');
            panel.append('<span style="float:right">' + title + '</span>');
            var close = $('<a href="#" style="float:left;margin:5px 10px"><i class="fa fa-close" style="font-size:16px"></i></a>')
              .on("click", function (e) {
                  e.preventDefault();
                  $("#" + tag).hide();
                  $("#" + parentName).show();
                  $("#" + tag).empty();
              });
            panel.append(close);
            $("#" + tag).append(panel);
            app_iframe.appendIframe(tag, src, width, height, scroll);
            $("#" + tag).show();
        },
        appendPanel: function (parentName, src, width, height, scroll, title) {
            parentName = parentName.replace("#", "");
            var tag = parentName + "-panel";

            if ($("#" + tag).length == 0) {
                $("#" + parentName).after('<div id="' + tag + '" class="panel-window"></div>');
            }
            else {
                $("#" + tag).empty();
            }
            app_iframe.showPanel("#" + tag, src, width, height, scroll, title);
        },
        appendPanelBefore: function (parentName, src, width, height, scroll, title) {
            parentName = parentName.replace("#", "");
            var tag = parentName + "-panel";

            if ($("#" + tag).length == 0) {
                $("#" + parentName).before('<div id="' + tag + '" class="panel-window"></div>');
            }
            else {
                $("#" + tag).empty();
            }
            app_iframe.showPanel("#" + tag, src, width, height, scroll, title);
        },
        showPanel: function (tag, src, width, height, scroll, title) {
            $(tag).empty();
            var panel = $('<div class="panel-header"></div>');
            panel.append('<span style="float:right">' + title + '</span>');
            var close = $('<a href="#" style="float:left;margin:5px 10px"><i class="fa fa-close" style="font-size:16px"></i></a>')
              .on("click", function (e) {
                  e.preventDefault();
                  $(tag).hide();
                  $(tag).empty();
              });
            panel.append(close);
            $(tag).append(panel);
            app_iframe.appendIframe(tag, src, width, height, scroll);
            $(tag).show();
        },
        appendIframe: function (div, src, width, height, scrolling) {
            var iframe = $('<iframe frameborder="0" marginwidth="0" marginheight="0" allowfullscreen></iframe>');
            $("#" + div.replace("#", "")).append(iframe);
            iframe.attr({
                scrolling: scrolling,
                width: width,
                height: height,
                src: src
            });
        },

        attachIframe: function (tag, src, width, height, scrolling) {
            var iframe = $("#" + tag.replace("#", ""))
            iframe.attr({
                scrolling: scrolling,
                width: width,
                height: height,
                src: src
            });
        }

    };

    //============================================================================================ app_form
/*
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
        onRadioChange: function (selector, formname) {
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
        },
        formSubmit: function (form, funcSuccess) {
            var actionurl = $(form).attr('action');
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
    };
*/

    var app_form = {

        loadDataForm: function (form, record, exclude) {

            $('#' + form + ' input, #' + form + ' select, #' + form + ' textarea').each(function (index) {
                var input = $(this);
                var tag = input.attr('name');
                var datatype = $(this).attr("data-type");
                var datafield = $(this).attr("data-field");
                var currentId = $(this).attr('id');
                //var type = input.prop('tagName');

                if (datafield !== undefined && datafield !== null)
                    tag = datafield;

                if (tag !== undefined) {
                    var isexclude = false;
                    if (exclude) {
                        isexclude = (exclude.indexOf(tag)) >= 0;
                    }

                    var value = record[tag];
                    if (!isexclude) {

                        if (input.length > 0) {
                            var parent = input[0].parentElement;

                            if (parent && $(parent).hasClass("jqx-widget"))
                                datatype = "jqx-widget";
                        }

                        if (value !== undefined && value != null) {

                            switch (datatype) {
                                case "datetime":
                                    input.val(app.formatDateTimeString(value)); break;
                                case "date":
                                    input.val(app.formatDateString(value)); break;
                                case "bool":
                                    input.attr("checked", value); break;
                                case "ignore":
                                    //ignore
                                    break;
                                case "select-input":
                                    $('form#' + form + '#' + tag ).val(value);
                                    $('form#' + form + ' [name=' + tag + ']').val(value);
                                    break;
                                case "jqx-widget":
                                case "jqx-dropdwon":
                                    //$('form#' + form + '#' + tag).val(value);
                                    $('form#' + form + ' [name=' + tag + ']').val(value);
                                    break;
                                case "lookup":
                                    app_lookups.setInput(form, tag, value);
                                    break;
                                default:

                                    var str = value.toString();
                                    if (str.match(/Date/gi)) {
                                        var d = formatJsonShortDate(value)
                                        app_form.setInputValue(input, form, currentId, tag, d);
                                    }
                                        //else if (typeof value === 'boolean')
                                        //    input.attr("checked", value); 
                                        //else if (currentId === tag)
                                        //    $('#' + currentId).val(value);
                                    else
                                        app_form.setInputValue(input, form, currentId, tag, value);
                                    break;
                            }
                        }
                        else {
                            app_form.setInputValue(input, form, currentId, tag, null); //$('#' + tag).val(null);
                        }

                    }
                }
            });
        },
        setInputValue: function (input, form, id, tag, value) {

            if (id == 'input' + tag) {//for jqx
                if (typeof value === 'boolean')
                    $('form#' + form + ' [name=' + tag + ']').attr("checked", value);
                else
                    $('form#' + form + ' [name=' + tag + ']').val(value);
            }
            else if (typeof value === 'boolean')
                input.attr("checked", value);
            else
                input.val(value);
        },
        setDateNow: function (tag) {
            $(tag).val(app.toLocalDateString(Date.now()));
        },
        setDateTimeNow: function (tag) {
            $(tag).val(app.toLocalDateTimeString(Date.now()));
        },
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
        onRadioChange: function (selector, formname) {
            if ($(selector).is(':checked')) {
                var action = $(selector).val();
                $("#" + formname).attr('action') = action;
            }
        },
        radioSelectedValue: function (name) {
            var selected = $("input[type='radio'][name='" + name + "']:checked");
            if (selected.length > 0)
                return selected.val();
            else
                return null;
        },
        doProgress: function (show, input) {
            if (show) {
                if (input !== undefined)
                    $(input).attr("disabled", "disabled");

                $("#progressbar").progressbar({ value: false }).show();
            }
            else {
                $("#progressbar").hide();
            }
        },
        formSubmit: function (form, funcSuccess) {
            var actionurl = $(form).attr('action');
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
    };

    var app_control = {
        selectTag: function (tag, width) {
            if (width === undefined)
                width = 200;

            //$(tag).selectmenu({
            //    width: width,
            //    open: function (event, ui) {
            //        $(this).selectmenu("menuWidget").hide().slideDown("fast");
            //    },
            //    close: function (event, ui) {
            //        var $menuWidget = $(this).selectmenu("menuWidget");
            //        $menuWidget.parent().show();
            //        $menuWidget.slideUp("fast");
            //    }
            //});
            $(tag).css('width', width);
        },
        fillSelect: function (tag, url, data, valueField, labelField, selectValue) {

            $(tag).empty()
            var $dropDown = $(tag);
            $.ajax({
                type: "post",
                dataType: 'json',
                url: url,
                data: data,
                success: function (data) {
                    // Parse the returned json data
                    //var opts = $.parseJSON(data);
                    $.each(data, function (i, d) {
                        $dropDown.append($("<option></option>").css('padding', '28px')
                            .attr("value", d[valueField])
                            .text(d[labelField]));
                    });
                    if (selectValue) {
                        $dropDown.val(selectValue);
                    }
                }
            });
        },
        appendSelectRecords: function (tag, records, valueField, labelField) {

            // var selectValues = { "0": "ללא", "1": "צוות", "2": "פרטי", "3": "לפי בחירה" };
            $(tag).empty();
            var $dropDown = $(tag);
            $.each(selectValues, function (i, record) {
                $dropDown.append($("<option></option>")
                    .attr("value", record[valueField])
                    .text(record[labelField]));
            });
        },
        appendSelectOptions: function (tag, selectValues) {

            // var selectValues = { "0": "ללא", "1": "צוות", "2": "פרטי", "3": "לפי בחירה" };
            $(tag).empty();
            var $dropDown = $(tag);
            $.each(selectValues, function (key, value) {
                $dropDown.append($("<option></option>")
                    .attr("value", key)
                    .text(value));
            });
        },
        datepicker: function (selector, yearRange, formValidator) {

            $(selector).datepicker({
                regional: ["he"],
                isRTL: true,
                //yearRange: "1925:1999",
                changeMonth: true,
                changeYear: true,
                showButtonPanel: true,
                dateFormat: 'dd/mm/yy'
            });
            //getter
            //var yearRange = $(".selector").datepicker("option", "yearRange");
            // Setter
            if (yearRange) {
                $(selector).datepicker("option", "yearRange", yearRange);
            }
            if (formValidator !== undefined) {
                $(selector).datepicker({
                    onSelect: function (dateText, inst) {
                        $(formValidator).jqxValidator('validateInput', '' + selector + '');
                    }
                });
            }
        },

        datepickerBirthday: function (selector, yearRange, formValidator) {
            $(selector).datepicker({
                regional: ["he"],
                isRTL: true,
                yearRange: "1925:1999",
                changeMonth: true,
                changeYear: true,
                showButtonPanel: true,
                dateFormat: 'dd/mm/yy',
                onSelect: function (dateText, inst) {
                    $(formValidator).jqxValidator('validateInput', '' + selector + '');
                }
            });
        }
    }

   


//============================================================================================ app_trigger

    //var app_trigger = {


    //}