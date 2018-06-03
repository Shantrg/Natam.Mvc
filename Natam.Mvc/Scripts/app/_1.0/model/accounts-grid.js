
var account_page_config = {
    title: '',
    htitle: '',
    msg_confirm: '',
    msg_alert: '',

    load: function (accType) {

        this.title = app_accounts.displayAccountType(accType);
        this.htitle = "הגדרת " + this.title;
        this.msg_confirm = "פעולה זו תסיר את ה" + this.title + " מרשימת ה" + this.title + " , האם להמשיך?";
        this.msg_alert = "ה" + this.title + " הוסר מהמערכת";
        $("#hTitle").text("רשימת " + this.title);
        return this;
    }
};


app_accounts_public = {

    customers_contactEdit: function (id, accid) {
        //app_contacts.contactPanel(id, accid, '', '', "grid-iframe-window");
        app_contacts.contactEdit(id, accid, 0);
        //customers_contactRefresh();
    },
    customers_contactDelete: function (id) {
        app_contacts.contactDelete(id, false, customers_contactRefresh);
        //accountGridControl.customers_contactRefresh();
    },
    customers_contactRefresh: function () {
        try {
            var i = accountGridControl.NScustomers.currentIndex;
            var g = accountGridControl.NScustomers.nastedContactGrids[i];
            var adapter = g.jqxGrid('source');
            adapter.dataBind();
        }
        catch (e) {
            alert(e);
        }
    },
    customers_accounsRefresh: function () {
        try {
            $("#jqxgrid").jqxGrid('source').dataBind();
        }
        catch (e) {
            alert(e);
        }
    },
    customers_accountEdit: function (id) {

        wizard.displayStep(2);
        accountGridControl.showControl(id, 'e');

        //var accountType = accountGridControl.Model.AccType;
        //accountGridControl.NScustomers.accountDialog = app_accounts.accountEdit(id, accountType);
    },
    customers_accountDelete: function (id) {

        var ok = app_accounts.accountDelete(id, accountGridControl.Model.AccType);
        if (ok)
            app_accounts_public.customers_accounsRefresh();
    },
    customers_accountCancel: function () {

        wizard.wizHome();
    }

};


app_trigger = {

    triggerContactComplete: function (accid) {
        app_accounts_public.customers_contactRefresh();
        app_dialog.dialogClose(slf.NScustomers.contactDialog);
    },
    triggerAccComplete: function (accType, accid) {
        app_accounts_public.customers_accounsRefresh();
        app_dialog.dialogClose(slf.NScustomers.accountDialog);
    },
    triggerNewsComplete: function (accid) {
        app_accounts_public.customers_newsRefresh();
        app_dialog.dialogClose(slf.NScustomers.newsDialog);
    },
    triggerAccCancel: function () {
        //app_iframe.panelClose();
    }
}

//============================================================================================ app_accounts_grid


app_accounts_grid = {

    wizardStep: 2,
    page_config: 0,
    isMobile:false,
    Model: {},
    UInfo: null,
    Control: null,
    AllowEdit: 0,
    AccType:0,
    NScustomers: {},
    init: function (dataModel, userInfo) {
        //var allowEdit = ('@ViewBag.UserRole' == 9) ? 1 : 0;
        this.isMobile = app.IsMobile();
        this.page_config = account_page_config.load(dataModel.AccType);
        this.TaskId = dataModel.PId;
        this.Model = dataModel;
        this.AccType = dataModel.AccType;
        this.UInfo = userInfo;
        this.AllowEdit = (userInfo.UserRole == 9) ? 1 : 0;
        this.grid();
        return this;
    },
    grid : function () {

        var slf = this;
        //var NScustomers = {};

        // prepare the data
        var source =
        {
            datatype: "json",
            datafields: [
                { name: 'AccountId', type: 'number' },
                { name: 'AccountName', type: 'string' },
                { name: 'AccountType', type: 'number' },
                { name: 'Address', type: 'string' },
                { name: 'City', type: 'string' },
                { name: 'ZipCode', type: 'number' },
                //{ name: 'ContactName', type: 'string' },
                { name: 'Phone1', type: 'string' },
                { name: 'Phone2', type: 'string' },
                { name: 'Phone3', type: 'string' },
                { name: 'Creation', type: 'date' },
                //{ name: 'Email', type: 'string' },
                { name: 'Fax', type: 'string' },
                { name: 'WebSite', type: 'string' },
                { name: 'Details', type: 'string' }

            ],
            id: 'AccountId',
            type: 'POST',
            url: '/Crm/GetAcoountsGrid',

            pagenum: 3,
            pagesize: 20,
            pager: function (pagenum, pagesize, oldpagenum) {
                // callback called when a page or page size is changed.
            }
        };

        source.data = { 'acctype': this.Model.AccType };


        //var dataAdapter = new $.jqx.dataAdapter(source);
        var dataAdapter = new $.jqx.dataAdapter(source, {
            async: false,
            loadComplete: function (data) { },
            loadError: function (xhr, status, error) { alert(' status: ' + status + '\n error ' + error) }
        });
        //var cellsrenderer = function (row, columnfield, value, defaulthtml, columnproperties) {

        //    //return '<div style="text-align:center"><a href="CustomerDef?id=' + value + '" >הצג</a></div>';
        //        var link = '<div style="text-align:center"><a href="javascript:customers_accountEdit(' + value + ')" ><i class="fa fa-plus-square-o" style="font-size:20px;color:#000"></i></a>';
        //    //if (allowEdit > 0)
        //    //    link += ' | <a href="javascript:customers_accountDelete(' + value + ')" >הסרה</a>';

        //    return link + '</div>';
        //};
        var contactcellsrenderer = function (row, columnfield, value, defaulthtml, columnproperties) {
            var accid = $('#jqxgrid').jqxGrid('getrowdata', row).AccountId;

            return '<div style="text-align:center;direction:rtl;margin:5px;"><a href="#" onclick="app_contacts.contactEdit(' + value + ',' + accid + ',0);" >הצג</a> | <a href="#" onclick="app_contacts.contactDelete(' + value + ');">הסר</a></div>'
        };

        slf.NScustomers.nastedContactGrids = new Array();

        var initContactGrid = function (tabControl, index, id) {
            //contacts
            var nastedcontainer = $('<div style="float:right;margin:5px"></div>');
            nastedcontainer.rtl = true;
            var nastedsource = {
                datafields: [
                      { name: 'ContactId', type: 'number' },
                      { name: 'ParentId', type: 'number' },
                      { name: 'ContactName', type: 'string' },
                      { name: 'Title', type: 'string' },
                      { name: 'Email', type: 'string' },
                      { name: 'Mobile', type: 'string' }
                ],
                datatype: "json",
                id: 'ContactId',
                type: 'POST',
                url: '/Crm/GetContactsView',
                data: { 'parentId': id, 'role': 0, 'uk': null }
            }
            slf.NScustomers.nastedContactGrids[index] = nastedcontainer;

            var nastedAdapter = new $.jqx.dataAdapter(nastedsource);
            nastedcontainer.jqxGrid({
                source: nastedAdapter, width: '90%', height: 130,
                rtl: true,
                columns: [
                  //{
                  //    text: '*', dataField: 'ContactId', width: 100, cellsalign: 'right', align: 'center',
                  //    cellsrenderer: function (row, columnfield, value, defaulthtml, columnproperties) {
                  //        var accid = id;// $('#jqxgrid').jqxGrid('getrowdata', row).AccountId;
                  //        return '<div style="text-align:center;direction:rtl;margin:5px;"><a href="#" onclick="customers_contactEdit(' + value + ',' + accid + ');" >הצג</a> | <a href="#" onclick="customers_contactDelete(' + value + ');">הסר</a></div>'
                  //    }
                  //},
                  { text: 'שם איש קשר', datafield: 'ContactName', cellsalign: 'right', align: 'center' },
                  { text: 'תפקיד', datafield: 'Title', width: 150, cellsalign: 'right', align: 'center' },
                  {
                      text: 'דואל', datafield: 'Email', width: 150, align: 'center', cellsrenderer: function (row, datafield, value) {
                          return '<a href="mailto:' + value + '">' + value + '</a>';
                      }
                  },
                  {
                      text: 'טלפון נייד', datafield: 'Mobile', width: 200, align: 'center', cellsrenderer: function (row, datafield, value) {
                          return isMobile ? '<a style="float:right;"  href="tel:' + value + '">' + value + '</a>' : '<span style="float:right">' + value + '</span>';
                      }
                  }
                ]
            });
            //var additem = $('<div style="margin:10px"><input type="button" value="הוסף" title="הוספת איש קשר חדש" /></div>')
            //.click(function () {
            //    NScustomers.contactDialog = contactEdit(0, id, 0);
            //});
            //var refreshcontacts = $('<div style="margin:10px"><input type="button" value="רענן" title="רענון רשימת אנשי קשר" /></div>')
            //.click(function () {
            //    nastedAdapter.dataBind();
            //});

            //var additem = $('<a title="הוספת איש קשר חדש" href="#" style="padding-left:10px;padding-right:10px;float:right;">הוסף</a>')
            //    .click(function () {
            //        slf.NScustomers.contactDialog = app_contacts.contactEdit(0, id, 0);
            //    });
            var refreshcontacts = $('<div style="float:right; margin:5px 5px"><a title="רענון רשימת אנשי קשר" href="#">רענון</a></div>')
            .click(function () {
                nastedAdapter.dataBind();
            });

            //$(tabControl).append(additem);
            $(tabControl).append(refreshcontacts);
            $(tabControl).append(nastedcontainer);

        };

        var initrowdetails = function (index, parentElement, gridElement, datarecord) {

            slf.NScustomers.currentIndex = index;

            var tabsdiv = null;
            var information = null;
            var notes = null;

            tabsdiv = $($(parentElement).children()[0]);
            if (tabsdiv != null) {
                information = tabsdiv.find('.information');
                notes = tabsdiv.find('.notes');
                var title = tabsdiv.find('.title');
                title.text(datarecord.AccountName);
                var tabcontacts = tabsdiv.find('.tabcontacts');
                var taboptions = tabsdiv.find('.taboptions');

                var container = $('<div style="margin: 5px;text-align:right;"></div>')
                container.rtl = true;
                container.appendTo($(information));

                var leftcolumn = $('<div style="float: left; width: 45%;direction:rtl;"></div>');
                var rightcolumn = $('<div style="float: right; width: 40%;direction:rtl;"></div>');
                container.append(leftcolumn);
                container.append(rightcolumn);

                var divLeft = $("<div style='margin: 10px;'><b>טלפון 1:</b> " + datarecord.Phone1 + "</div>" +
                    "<div style='margin: 10px;'><b>טלפון 2:</b> " + datarecord.Phone2 + "</div>" +
                    "<div style='margin: 10px;'><b>קוד לקוח:</b> <a href='javascript:app_accounts_public.customers_accountEdit(" + datarecord.AccountId + ")'>" + datarecord.AccountId + "</a></div>");
                divLeft.rtl = true;
                var divRight = $(
                    //"<div style='margin: 10px;'><b>מייל:</b> " + datarecord.Email + "</div>" +
                    "<div style='margin: 10px;'><b>פקס:</b> " + datarecord.Fax + "</div>" +
                    "<div style='margin: 10px;'><b>אתר:</b> " + app.isNull(datarecord.WebSite) + "</div>");

                divRight.rtl = true;
                $(leftcolumn).append(divLeft);
                $(rightcolumn).append(divRight);

                var notescontainer = $('<div style="white-space: normal; margin: 5px;text-align:right;"><span>' + app.isNull(datarecord.Details) + '</span></div>');
                notescontainer.rtl = true;
                $(notes).append(notescontainer);

                var accid = datarecord.AccountId;//parseInt(datarecord.AccountId);

                var optionscontainer = $('<div style="white-space: normal; margin: 5px;text-align:right;"></div>');
                optionscontainer.rtl = true;

                //var linkEdit = $('<div style="margin:5px"><a href="#" >הצג ' + slf.page_config.title + '</a></div>')
                //.click(function () {

                //    customers_accountEdit(accid);
                //});
                //var linkRemove = $('<div style="margin:5px"><a href="#" >הסר ' + slf.page_config.title + '</a></div>')
                //.click(function () {
                //    customers_accountDelete(accid);
                //});

                //optionscontainer.append(linkEdit);
                //if (slf.AllowEdit > 0)
                //    optionscontainer.append(linkRemove);
                //taboptions.append(optionscontainer);

                //contacts
                initContactGrid(tabcontacts, index, accid);

                $(tabsdiv).jqxTabs({ width: '95%', height: 170, rtl: true });
            }
        };

        // create Tree Grid
        $("#jqxgrid").jqxGrid(
        {
            width: '100%',
            autoheight: true,
            rtl: true,
            source: dataAdapter,
            localization: getLocalization('he'),
            pagermode: 'simple',
            pageable: true,
            sortable: true,
            showfilterrow: true,
            filterable: true,
            rowdetails: true,
            rowdetailstemplate: { rowdetails: "<div style='margin: 10px;'><ul style='margin-right: 30px;'><li class='title'></li><li>פרטים</li><li>אנשי קשר</li><li>אפשרויות</li></ul><div class='information'></div><div class='notes'></div><div class='tabcontacts'></div><div class='taboptions'></div></div>", rowdetailsheight: 200 },
            ready: function () {
                $("#jqxgrid").jqxGrid('showrowdetails', 0);
            },
            initrowdetails: initrowdetails,
            columns: [
              {
                  text: '*', dataField: 'AccountId', filterable: false, width: 30, cellsalign: 'right', align: 'center', cellsrenderer: function (row, columnfield, value, defaulthtml, columnproperties) {
                      return '<a href="javascript:app_accounts_public.customers_accountEdit(' + value + ')" ><i class="fa fa-plus-square-o" style="font-size:14px;color:#000;margin:8px 8px"></i></a>';
                  }
              },
              { text: 'שם ' + app_accounts.displayAccountType(slf.AccType), dataField: 'AccountName', filtercondition: 'CONTAINS', cellsalign: 'right', align: 'center' },
              //{ text: 'סוג לקוח', dataField: 'AccountType', width: 100, cellsalign: 'right', align: 'center' },
              { text: 'עיר', dataField: 'City', filtercondition: 'starts_with', cellsalign: 'right', align: 'center', hidden: slf.isMobile },
              { text: 'כתובת', dataField: 'Address', filtercondition: 'starts_with', cellsalign: 'right', align: 'center', hidden: slf.isMobile },
              //{ text: 'איש קשר', dataField: 'ContactName', filtercondition: 'starts_with', width: 120, cellsalign: 'right', align: 'center' },
              {
                  text: 'טלפון', dataField: 'Phone1', filtercondition: 'starts_with', width: 150, cellsalign: 'right', align: 'center', cellsrenderer: function (row, datafield, value) {
                      return isMobile ? '<a style="float:right;"  href="tel:' + value + '">' + value + '</a>' : '<span style="float:right">' + value + '</span>';
                  }
              },
              { text: 'מועד עדכון', type: 'date', dataField: 'Creation', width: 120, cellsformat: 'd', cellsalign: 'right', align: 'center', hidden: slf.isMobile }
            ]
        });
        $('#jqxgrid').on('rowdoubleclick', function (event) {
            //var args = event.args;
            //var boundIndex = args.rowindex;
            //var visibleIndex = args.visibleindex;
            //var id = $("#jqxgrid").jqxGrid('getrowid', boundIndex);
            //app_popup.memberEdit(id);
            slf.edit();
        });


        //$("#linkCustomerDef").jqxLinkButton({ width: '120', height: '30' });
        $('#btnclearfilter').jqxButton();
        $('#btnclearfilter').click(function () {
            $("#jqxgrid").jqxGrid('clearfilters');
        });

        $('#btnCustomerEdit').jqxButton();
        $('#btnCustomerEdit').click(function () {
            //customers_accountEdit(0);
            slf.edit();
        });

        $('#btnCustomerDef').jqxButton();
        $('#btnCustomerDef').click(function () {
            // customers_accountEdit(0);
            slf.add();
        });

        $('#btnCustomerAll').jqxButton();
        $('#btnCustomerAll').click(function () {
            $("#jqxgrid").jqxGrid('source').dataBind();
        });
        //$("#excelExport").jqxButton({ width: '120', height: '30' });
        //$("#excelExport").click(function () {
        //    $("#jqxgrid").jqxGrid('exportdata', 'xls', 'Customers',true, null, false,null,'utf-8');
        //});

        $('#account-def-update').click(function () {
            slf.update();
        });
        $('#account-def-cancel').click(function () {
            slf.cancel();
        });


        //function triggerContactComplete(accid) {
        //    customers_contactRefresh();
        //    app_dialog.dialogClose(slf.NScustomers.contactDialog);
        //};

        //function triggerAccComplete(accType, accid) {
        //    customers_accounsRefresh();
        //    app_dialog.dialogClose(slf.NScustomers.accountDialog);
        //};

        //function triggerNewsComplete(accid) {
        //    customers_newsRefresh();
        //    app_dialog.dialogClose(slf.NScustomers.newsDialog);
        //};

        //function customers_contactRefresh() {
        //    try {
        //        var i = slf.NScustomers.currentIndex;
        //        var g = slf.NScustomers.nastedContactGrids[i];
        //        var adapter = g.jqxGrid('source');
        //        adapter.dataBind();
        //    }
        //    catch (e) {
        //        alert(e);
        //    }
        //};

        //function customers_contactDelete(id) {
        //    app_contacts.contactDelete(id, false);
        //    customers_contactRefresh();
        //}

        //function customers_contactEdit(id, accid) {
        //    app_contacts.contactEdit(id, accid, 0);
        //    customers_contactRefresh();
        //}

        function customers_newsRefresh() {
            try {
                var i = slf.NScustomers.currentIndex;
                var g = slf.NScustomers.nastedNewsGrids[i];
                var adapter = g.jqxGrid('source');
                adapter.dataBind();
            }
            catch (e) {
                alert(e);
            }
        };
        function customers_newsDelete(id, accid) {
            app_accounts.AccountNewsRemove(id, accid);
            customers_newsRefresh();
        }
    },
    showControl: function (id, option, action) {

        var data_model = { Id: id, AccType: this.Model.AccType, Role: this.UInfo.UserRole, Option: option, Action: action };

        //if (this.Control == null) {
        //    this.Control = new app_accounts_edit("#account-def-window");
        //}

        $("#account-def-window").empty();
        this.Control = null;
        this.Control = new app_accounts_edit("#account-def-window");
        this.Control.init(data_model);//id.this.Model.AccType, this.UInfo.UserRole);//, data_model, this.UInfo);
        this.Control.display();
    },
    getrowId: function () {

        var selectedrowindex = $("#jqxgrid").jqxGrid('getselectedrowindex');
        if (selectedrowindex < 0)
            return -1;
        var id = $("#jqxgrid").jqxGrid('getrowid', selectedrowindex);
        return id;
    },
    clear: function () {
        $("#account-def-window").empty();
        this.Control = null;
    },
    add: function () {
        //setTaskButton('comment', 'add', true);
        //wizard.appendIframe(2, app.appPath() + "/System/_TaskCommentAdd?pid=" + this.TaskId, "100%", "500px");

        //app_iframe.appendEmbed("jqxgrid1-window", app.appPath() + "/System/_TaskCommentAdd?pid=" + this.TaskId, "100%", "280px");
        wizard.displayStep(2);
        this.showControl(0, 'a');

    },
    edit: function () {
        //if (this.Model.Option != "e")
        //    return;
        var id = this.getrowId();
        if (id > 0) {
            //setTaskButton('comment', 'update', true);
            //wizard.appendIframe(2, app.appPath() + "/System/_TaskCommentEdit?id=" + id, "100%", "500px");

            //app_iframe.appendEmbed("jqxgrid1-window", app.appPath() + "/System/_TaskCommentEdit?id=" + id, "100%", "350px");
            wizard.displayStep(2);
            this.showControl(id, 'e');
        }
    },
    remove: function () {
        var id = this.getrowId();
        if (id > 0) {
            if (confirm('האם למחוק הערה ' + id)) {
                app_query.doPost(app.appPath() + "/System/TaskCommentDelete", { 'id': id }, function (data) {
                    if (data.Status > 0)
                        $('#jqxgrid1').jqxGrid('source').dataBind();
                });
            }
        }
    },
    refresh: function () {
        $('#jqxgrid').jqxGrid('source').dataBind();
    },
    cancel: function () {
        wizard.wizHome();
    },
    update: function () {
        if (this.Control != null) {
            var result = this.Control.update();//data_model);
            if (result) {
                wizard.wizHome();
                $("#jqxgrid").jqxGrid('source').dataBind();
            }
        }
    },
    end: function (data) {
        wizard.wizHome();
        //wizard.removeIframe(2);
        app_messenger.Post(data);
        if (data && data.Status > 0) {
            this.refresh();
            // app_dialog.alert(data.Message);
        }
    }
};


















//============================================================================================ app_accounts_grid
/*
app_accounts_grid = {
 
    accType: 0,
    NScustomers: {},
    dataAdapter: {},
    // prepare the data
    source :
    {
        datatype: "json",
        datafields: [
            { name: 'AccountId', type: 'number' },
            { name: 'AccountName', type: 'string' },
            { name: 'AccountType', type: 'number' },
            { name: 'Address', type: 'string' },
            { name: 'City', type: 'string' },
            { name: 'ZipCode', type: 'number' },
            { name: 'Phone1', type: 'string' },
            { name: 'Phone2', type: 'string' },
            { name: 'Phone3', type: 'string' },
            { name: 'Creation', type: 'date' },
            { name: 'Fax', type: 'string' },
            { name: 'WebSite', type: 'string' },
            { name: 'Details', type: 'string' }

        ],
        id: 'AccountId',
        type:'POST',
        url: '/Crm/GetAcoountsGrid',

        //pagenum: 3,
        pagesize: 20,
        pager: function (pagenum, pagesize, oldpagenum) {
            // callback called when a page or page size is changed.
        }
    },

    cellsrenderer: function (row, columnfield, value, defaulthtml, columnproperties) {
        var link = '<div style="text-align:center"><a href="javascript:customers_accountEdit(' + value + ')" >הצג</a>';
        if (allowEdit > 0)
            link += ' | <a href="javascript:customers_accountDelete(' + value + ')" >הסרה</a>';

        return link + '</div>';
    },

    initContactGrid: function (tabControl, index, id) {
        //contacts
        var nastedcontainer = $('<div style="float:right;margin:5px"></div>');
        nastedcontainer.rtl = true;
        var nastedsource = {
            datafields: [
                  { name: 'ContactId', type: 'number' },
                  { name: 'ParentId', type: 'number' },
                  { name: 'ContactName', type: 'string' },
                  { name: 'Title', type: 'string' },
                  { name: 'Email', type: 'string' },
                  { name: 'Mobile', type: 'string' }
            ],
            datatype: "json",
            id: 'ContactId',
            type: 'POST',
            url: '/Crm/GetContactsView',
            data: { 'parentId': id, 'role': 0, 'uk': null }
        }
        this.NScustomers.nastedContactGrids[index] = nastedcontainer;

        var nastedAdapter = new $.jqx.dataAdapter(nastedsource);
        nastedcontainer.jqxGrid({
            source: nastedAdapter, width: '90%', height: 130,
            rtl: true,
            columns: [
              {
                  text: 'פעולות', dataField: 'ContactId', width: 100, cellsalign: 'right', align: 'center',
                  cellsrenderer: function (row, columnfield, value, defaulthtml, columnproperties) {
                      var accid = id;// $('#jqxgrid').jqxGrid('getrowdata', row).AccountId;
                      return '<div style="text-align:center;direction:rtl;margin:5px;"><a href="#" onclick="customers_contactEdit(' + value + ',' + accid + ');" >הצג</a> | <a href="#" onclick="customers_contactDelete(' + value + ');">הסר</a></div>'
                  }
              },
              { text: 'שם איש קשר', datafield: 'ContactName', cellsalign: 'right', align: 'center' },
              { text: 'תפקיד', datafield: 'Title', width: 150, cellsalign: 'right', align: 'center' },
              { text: 'דואל', datafield: 'Email', width: 150, align: 'center' },
              { text: 'טלפון נייד', datafield: 'Mobile', width: 200, align: 'center' }
            ]
        });
        //var additem = $('<div style="margin:10px"><input type="button" value="הוסף" title="הוספת איש קשר חדש" /></div>')
        //.click(function () {
        //    this.NScustomers.contactDialog = contactEdit(0, id, 0);
        //});
        //var refreshcontacts = $('<div style="margin:10px"><input type="button" value="רענן" title="רענון רשימת אנשי קשר" /></div>')
        //.click(function () {
        //    nastedAdapter.dataBind();
        //});

        var additem = $('<a title="הוספת איש קשר חדש" href="#" style="padding-left:10px;padding-right:10px;float:right;">הוסף</a>')
                .click(function () {
                    NScustomers.contactDialog = app_contacts.contactEdit(0, id, 0);
                });
        var refreshcontacts = $('<a title="רענון רשימת אנשי קשר" href="#" style="padding-left:10px;float:right;">רענון</a>')
        .click(function () {
            nastedAdapter.dataBind();
        });

        $(tabControl).append(additem);
        $(tabControl).append(refreshcontacts);
        $(tabControl).append(nastedcontainer);

    },

    initrowdetails: function (index, parentElement, gridElement, datarecord) {

        this.NScustomers.currentIndex = index;

        var tabsdiv = null;
        var information = null;
        var notes = null;

        tabsdiv = $($(parentElement).children()[0]);
        if (tabsdiv != null) {
            information = tabsdiv.find('.information');
            notes = tabsdiv.find('.notes');
            var title = tabsdiv.find('.title');
            title.text(datarecord.AccountName);
            var tabcontacts = tabsdiv.find('.tabcontacts');
            var tabnews = tabsdiv.find('.tabnews');

            var container = $('<div style="margin: 5px;text-align:right;"></div>')
            container.rtl = true;
            container.appendTo($(information));

            var leftcolumn = $('<div style="float: left; width: 45%;direction:rtl;"></div>');
            var rightcolumn = $('<div style="float: right; width: 40%;direction:rtl;"></div>');
            container.append(leftcolumn);
            container.append(rightcolumn);

            var divLeft = $("<div style='margin: 10px;'><b>טלפון 1:</b> " + datarecord.Phone1 + "</div>" +
                "<div style='margin: 10px;'><b>טלפון 2:</b> " + datarecord.Phone2 + "</div>" +
                "<div style='margin: 10px;'><b>קוד לקוח:</b> " + datarecord.AccountId + "</div>");
            divLeft.rtl = true;
            var divRight = $(
                //"<div style='margin: 10px;'><b>מייל:</b> " + datarecord.Email + "</div>" +
                "<div style='margin: 10px;'><b>פקס:</b> " + datarecord.Fax + "</div>" +
                "<div style='margin: 10px;'><b>אתר:</b> " + datarecord.WebSite + "</div>");

            divRight.rtl = true;
            $(leftcolumn).append(divLeft);
            $(rightcolumn).append(divRight);

            var notescontainer = $('<div style="white-space: normal; margin: 5px;text-align:right;"><span>' + datarecord.Details + '</span></div>');
            notescontainer.rtl = true;
            $(notes).append(notescontainer);

            var accid = datarecord.AccountId;//parseInt(datarecord.AccountId);
            //contacts
            this.initContactGrid(tabcontacts, index, accid);

            $(tabsdiv).jqxTabs({ width: '95%', height: 170, rtl: true });
        }
    },

    grid: function () {
        // create Tree Grid
        $("#jqxgrid").jqxGrid(
        {
            width: '100%',
            autoheight: true,
            rtl: true,
            source: dataAdapter,
            localization: getLocalization('he'),
            pagermode: 'simple',
            pageable: true,
            sortable: true,
            showfilterrow: true,
            filterable: true,
            rowdetails: true,
            rowdetailstemplate: { rowdetails: "<div style='margin: 10px;'><ul style='margin-right: 30px;'><li class='title'></li><li>פרטים</li><li>אנשי קשר</li></ul><div class='information'></div><div class='notes'></div><div class='tabcontacts'></div></div>", rowdetailsheight: 200 },
            ready: function () {
                $("#jqxgrid").jqxGrid('showrowdetails', 0);
            },
            initrowdetails: this.initrowdetails,
            columns: [
              { text: 'פעולות', dataField: 'AccountId', filterable: false, width: 100, cellsalign: 'right', align: 'center', cellsrenderer: cellsrenderer },
              { text: 'שם לקוח', dataField: 'AccountName', filtercondition: 'CONTAINS', cellsalign: 'right', align: 'center' },
              { text: 'עיר', dataField: 'City', filtercondition: 'starts_with', cellsalign: 'right', align: 'center' },
              { text: 'כתובת', dataField: 'Address', filtercondition: 'starts_with', cellsalign: 'right', align: 'center' },
              { text: 'טלפון', dataField: 'Phone1', filtercondition: 'starts_with', width: 150, cellsalign: 'right', align: 'center' },
              { text: 'מועד עדכון', type: 'date', dataField: 'Creation', width: 120, cellsformat: 'd', cellsalign: 'right', align: 'center' }
            ]
        })
    },

    load: function (acctype) {
        this.accType = acctype;
        this.source.data = { 'acctype': acctype };
        this.NScustomers.nastedContactGrids = new Array();
        //var dataAdapter = new $.jqx.dataAdapter(source);
        this.dataAdapter = new $.jqx.dataAdapter(source, {
            async: false,
            loadComplete: function (data) { },
            loadError: function (xhr, status, error) { alert(' status: ' + status + '\n error ' + error) }
        });

    }
};
*/
