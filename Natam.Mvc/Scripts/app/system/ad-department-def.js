
//============================================================================================ app_ad_def

function app_ad_department_def(userInfo) {


    this.AccountId = userInfo.AccountId;
    this.UserRole = userInfo.UserRole;
    this.AllowEdit = (this.UserRole > 4) ? 1 : 0;

    $("#AccountId").val(this.AccountId);
    this.gridWith = 500;
    this.sourceData = {};
    this.sourceUrl = '/Admin/AdDepartmentDefList';
    this.updateUrl = '/Admin/AdDepartmentDefUpdate';
    this.deleteUrl = '/Admin/AdDefDelete';
    this.showMemmbersUrl = '/Admin/AdDepartmentShowMembers';
    this.fieldId = 'DepartmentId';
    this.RelUrl = '/Admin/AdDepartmentDefRel';
    this.RelToAddUrl = '/Admin/AdDepartmentDefRelToAdd';
    this.RelDeleteUrl = "/Admin/AdDepartmentDefRelDelete";
    this.RelUpdateUrl = "/Admin/AdDepartmentDefRelUpdate";

    this.RelUsersUrl = '/Admin/AdDepartmentUsersRel';
    this.RelUsersToLeadUrl = '/Admin/AdDepartmentUsersToLeadRel';
    this.RelSetLeadUrl = '/Admin/AdDepartmentLeadUpdate';
    
    this.rowEdit = -1;

    this.loadControls();

    var slf = this;

    this.createRowData = function () {
        var row = {
            DepartmentId: $("#DepartmentId").val(), DepartmentName: $("#DepartmentName").val()
        };
        return row;
    }

    this.setEditorInputData = function (dataRecord) {
        if (dataRecord === undefined || dataRecord == null) {
            $("#DepartmentId").val('');
            $("#DepartmentName").val('');
            $("#trcode").hide();
        }
        else {
            $("#trcode").show();
            $("#DepartmentId").val(dataRecord.DepartmentId);
            $("#DepartmentName").val(dataRecord.DepartmentName);
        }
    }

    this.createCoulmns = function () {

        var columns = [
           //{
           //    text: 'קוד מחלקה', datafield: 'DepartmentId', width: 60, cellsalign: 'right', align: 'center',
           //    cellsrenderer: function (row, columnfield, value, defaulthtml, columnproperties) {
           //        return '<div style="text-align:center;direction:rtl;margin:5px;"><a href="' + slf.showMemmbersUrl + '=' + value + '" title="הצג מנויים">' + value + '</a></div>'
           //    }
           //},
           { text: 'שם מחלקה', datafield: 'DepartmentName', cellsalign: 'right', align: 'center' },
           { text: 'מנהל מחלקה', datafield: 'ManagerDisplayName', cellsalign: 'right', align: 'center' },
           { text: 'מנויים', datafield: 'MembersCount', width: 80, cellsalign: 'right', align: 'center' }
        ];
        return columns;
    }
    
    this.createFields = function () {
        var datafields =
            [
                { name: 'DepartmentId', type: 'number' },
                { name: 'DepartmentName', type: 'string' },
                { name: 'ManagerDisplayName', type: 'string' },
                { name: 'MembersCount', type: 'number' }
            ];
        return datafields;
    }

    this.getDataCommand = function (rowid, rowdata, command) {

        if (command == 2)//delete
        {
            if (rowid <= 0) {
                app_dialog.alert("Invalid row id to delete!");
                return null;
            }
            return { 'DepartmentId': rowid };
        }
        else

            return { 'DepartmentId': command == 0 ? -1 : rowdata.DepartmentId, 'DepartmentName': rowdata.DepartmentName, 'command': command };

    }

    //app_jqxgrid.loadEntityGrid(this);

    $("#jqxgrid").on('rowselect', function (event) {

        event.stopPropagation();
        var row = event.args.row;
        if (row) {
            var DepartmentId = row.DepartmentId;
            slf.nastedGridLoder(DepartmentId,"teams");
        }
    });

    app_jqxgrid.loadEntityGrid(this, "#jqxgrid", false, "popupWindow", function (data) {

        if (data && data.length > 0)
            $("#jqxgrid").jqxGrid('selectrow', 0);
    });

    slf.nastedGrid(-1);
    slf.nastedUsersGrid(-1);

    this.nastedGridLoder = function (id, mode) {

        var srcTeams = $('#jqxgrid2').jqxGrid('source');
        var srcUsers = $('#jqxgrid3').jqxGrid('source');

        if (mode == "teams") {
            $("#jqxTabs").jqxTabs({ 'selectedItem': 0 });
            srcTeams._source.url = this.RelUrl;//'/Admin/AdDefRel';
            srcTeams._source.data = { 'id': id };
            $('#jqxgrid2').jqxGrid('source').dataBind();

            $("#jqxgrid2_Update").hide();
            $("#jqxgrid2_Cancel").hide();
            $("#jqxgrid2_Show").show();
            $("#jqxgrid2_LeadShow").show();
            $("#liTeams").text("צוותים");
            $("#liUsers").text("משתמשים");
            $("#pHelp").text("להסרת צוות ממחלקה, יש לסמן את הצוות הרצוי");
        }
        else if (mode === "lead") {
            $("#jqxTabs").jqxTabs({ 'selectedItem': 1 });
            srcUsers._source.url = this.RelUsersToLeadUrl;
            srcUsers._source.data = { 'id': id };
            $('#jqxgrid3').jqxGrid('source').dataBind();

            $("#jqxgrid2_Update").hide();
            $("#jqxgrid2_Cancel").show();
            $("#jqxgrid2_Show").hide();
            $("#jqxgrid2_LeadShow").show();
            $("#liUsers").text("בחירת מנהל מחלקה");
            $("#pHelp").text("לבחירת מנהל מחלקה, יש לסמן את המשתמש הרצוי");
        }
        else if (mode === "users") {
            $("#jqxTabs").jqxTabs({ 'selectedItem': 1 });
            srcUsers._source.url = this.RelUsersUrl;
            srcUsers._source.data = { 'id': id };
            $('#jqxgrid3').jqxGrid('source').dataBind();

            $("#jqxgrid2_Update").hide();
            $("#jqxgrid2_Cancel").hide();
            $("#jqxgrid2_Show").hide();
            $("#jqxgrid2_LeadShow").hide();
            $("#liUsers").text("משתמשים");
            $("#pHelp").text("רשימת משתמשים המשויכים למחלקה");
        }
        else {//add
            $("#jqxTabs").jqxTabs({ 'selectedItem': 0 });
            srcTeams._source.url = this.RelToAddUrl;// '/Admin/AdDefRelToAdd';
            srcTeams._source.data = { 'id': id };
            $('#jqxgrid2').jqxGrid('source').dataBind();

            $("#jqxgrid2_Update").show();
            $("#jqxgrid2_Cancel").show();
            $("#jqxgrid2_Show").hide();
            $("#jqxgrid2_LeadShow").hide();
            $("#liTeams").text("צוותים להוספה");
            $("#liUsers").text("משתמשים");
            $("#pHelp").text("להוספת צוותים למחלקה, יש לסמן את הצוותים הרצוים וללחוץ על עדכון");
        }
    };

    $("#jqxgrid").jqxGrid('selectrow', 0);

};

app_ad_department_def.prototype.loadControls = function () {

    // initialize the input fields.
    $("#DepartmentId").jqxInput().width(200);
    $("#DepartmentName").jqxInput().width(200);

    // initialize the popup window and buttons.
    $("#Cancel").jqxButton();
    $("#Save").jqxButton();

    $("#popupWindow").jqxWindow({
        width: 300, resizable: false, isModal: true, autoOpen: false, cancelButton: $("#Cancel"), modalOpacity: 0.01
    });

    var input_rules = [
             { input: '#DepartmentName', message: 'חובה לציין מחלקה!', action: 'keyup, blur', rule: 'required' }
    ];

    //input_rules.push({ input: '#MemberId', message: 'חובה לציין ת.ז!', action: 'keyup, blur', rule: 'required' });

    $('#form').jqxValidator({
        rtl: true,
        //hintType: 'label',
        animationDuration: 0,
        rules: input_rules
    });

};

app_ad_department_def.prototype.nastedGrid = function (id) {


    var slf = this;

    var getCurrentId = function () {

        var selectedrowindex = $("#jqxgrid").jqxGrid('getselectedrowindex');
        if (selectedrowindex >= 0) {
            var id = $("#jqxgrid").jqxGrid('getrowid', selectedrowindex);
            return id;
        }
        return -1;
    }

    $("#CurrentId").val(id);

    $("#jqxgrid2_Show").show();
    $("#jqxgrid2_Update").hide();
    $("#jqxgrid2_Cancel").hide();


    var source =
    {
    //async:false,
    dataType: "json",
    datafields:
    [
        { name: 'TeamId', type: 'number' },
        { name: 'TeamName', type: 'string' },
        { name: 'DepartmentId', type: 'number' }
    ],
    //id: 'DepartmentId',
    data: { 'id': id },
    type: 'POST',
    url: '/Admin/AdDepartmentDefRel'
    };



    var dataAdapter = new $.jqx.dataAdapter(source, {
        //contentType: "application/json; charset=utf-8",
        loadError: function (jqXHR, status, error) {
            //alert("dealAdapter failed: " + error);
        },
        loadComplete: function (data) {
            //alert("dealAdapter is Loaded");
        }
    });

    // initialize jqxGrid
    $('#jqxgrid2').jqxGrid(
   {
       rtl: true,
       scrollmode: 'default',
       width: '99%',//entity.gridWith,
       height: '99%',
       selectionmode: 'checkbox',
       //selectionmode: 'singlecell',
       //editmode: 'click',
       autoheight: false,
       source: dataAdapter,
       localization: getLocalization('he'),
       pageable: false,
       sortable: true,
       showstatusbar: true,
       //showtoolbar: true,
       //rendertoolbar: function (toolbar) {
       //    app_jqxgrid.renderToolbar(toolbar,entity)
       //},
       columns: [
             {
                 text: 'קוד צוות', datafield: 'TeamId', width: 60, cellsalign: 'right', align: 'center', hidden: true
                 //cellsrenderer: function (row, columnfield, value, defaulthtml, columnproperties) {
                 //    return '<div style="text-align:center;direction:rtl;margin:5px;"><a href="showUserInfo=' + value + '" title="הצג צוות">' + value + '</a></div>'
                 //}
             },
             { text: ' שם ', datafield: 'TeamName', cellsalign: 'right', align: 'center' },
             { text: 'מחלקה', datafield: 'DepartmentId', width: 80, cellsalign: 'right', align: 'center', hidden: true }
       ]
   });

    //$("#jqxgrid2").on("bindingcomplete", function (event) {

    //   // var all = $("#liUsers").text() == "עריכה";
    //    if (all == true) {
    //        var records = $('#jqxgrid2').jqxGrid('getrows');

    //        var length = records.length;
    //        for (var i = 0; i < length; i++) {
    //            var record = records[i];
    //            if (record.DepartmentId == id) {
    //                $('#jqxgrid2').jqxGrid('selectrow', i);
    //            }
    //        }
    //    }
    //});




    $("#jqxgrid2_Show").on('click', function () {
        var id = getCurrentId();
        if (id < 0)
            return
        slf.nastedGridLoder(id, "add");
    });
    $("#jqxgrid2_LeadShow").on('click', function () {
        var id = getCurrentId();
        if (id < 0)
            return
        slf.nastedGridLoder(id, "lead");
    });

    $("#jqxgrid2_Update").on('click', function () {
        var id = getCurrentId();

        var curTab = $("#jqxTabs").jqxTabs('selectedItem');

        if (curTab == 0) {

            var rowindexes = $('#jqxgrid2').jqxGrid('getselectedrowindexes');
            var length = rowindexes.length;
            if (length > 0 && id > 0) {
                var records = $('#jqxgrid2').jqxGrid('getrows');
                var sel = [];
                for (var i = 0; i < length; i++) {
                    var rowindex = rowindexes[i];
                    var uid = $('#jqxgrid2').jqxGrid('getrowdata', rowindex).TeamId;
                    sel.push(uid)
                }
                var data = {
                    DepartmentId: id, Users: sel.join()
                };
                //this.RelUpdateUrl = "/Admin/AdDefRelUpdate"

                app_query.doDataPost(slf.RelUpdateUrl, data, function (data) {
                    $('#jqxgrid2').jqxGrid('clearselection');
                    slf.nastedGridLoder(id, "teams");
                });
            }
        }
    });

    $("#jqxgrid2_Cancel").on('click', function () {

        var id = getCurrentId();
        slf.nastedGridLoder(id, "teams");
    });
      
    //$("#jqxgrid2").on('rowunselect', function (event) {
    //    event.stopPropagation();
    //    //alert("Un Selected Row Indexes: " + event.args.rowindex);
    //    //$("#selectrowindex").text(event.args.rowindex);
    //    //app.cancelBubble(event);
    //});

    $("#jqxgrid2").on('rowselect', function (event) {
        event.stopPropagation();

        if ($("#liTeams").text() == "צוותים") {
            var uid = $('#jqxgrid2').jqxGrid('getrowdata', event.args.rowindex).UserId;

            if (!confirm("האם להסיר את הצוות המסומן מהמחלקה")) {
                $('#jqxgrid2').jqxGrid('unselectrow', event.args.rowindex);
                return;
            }
            var id = getCurrentId();
            var data = {
                DepartmentId: id, UserId: uid
            };
            //this.RelDeleteUrl = "/Admin/AdDefRelDelete"
            app_query.doDataPost(slf.RelDeleteUrl, data, function (data) {
                $('#jqxgrid2').jqxGrid('clearselection');
                $('#jqxgrid2').jqxGrid('source').dataBind();
            });
        }
    });
};

app_ad_department_def.prototype.nastedUsersGrid = function (id) {


    var slf = this;

    var getCurrentId = function () {

        var selectedrowindex = $("#jqxgrid").jqxGrid('getselectedrowindex');
        if (selectedrowindex >= 0) {
            var id = $("#jqxgrid").jqxGrid('getrowid', selectedrowindex);
            return id;
        }
        return -1;
    }

    //$("#CurrentId").val(id);

    //$("#jqxgrid2_Show").show();
    //$("#jqxgrid2_Update").hide();
    //$("#jqxgrid2_Cancel").hide();


    var sourceUsers =
    {
        //async:false,
        dataType: "json",
        datafields:
        [
            { name: 'UserId', type: 'number' },
            { name: 'DisplayName', type: 'string' },
            { name: 'ProfessionName', type: 'string' },
            { name: 'Phone', type: 'string' },
            { name: 'Email', type: 'string' },
            { name: 'TeamId', type: 'number' }
        ],
        //id: 'TeamId',
        data: { 'id': id },
        type: 'POST'
        //url: slf.RelUsersUrl
    };



    var dataAdapterUsers = new $.jqx.dataAdapter(sourceUsers, {
        //contentType: "application/json; charset=utf-8",
        loadError: function (jqXHR, status, error) {
            //alert("dealAdapter failed: " + error);
        },
        loadComplete: function (data) {
            //alert("dealAdapter is Loaded");
        }
    });

    // initialize jqxGrid
    $('#jqxgrid3').jqxGrid(
   {
       rtl: true,
       scrollmode: 'default',
       width: '99%',
       height: '99%',
       selectionmode: 'checkbox',
       autoheight: false,
       source: dataAdapterUsers,
       localization: getLocalization('he'),
       pageable: false,
       sortable: true,
       showstatusbar: true,
       //showtoolbar: true,
       //rendertoolbar: function (toolbar) {
       //    app_jqxgrid.renderToolbar(toolbar,entity)
       //},
       columns: [
             {
                 text: 'קוד משתמש', datafield: 'UserId', width: 60, cellsalign: 'right', align: 'center', hidden: true
                 //cellsrenderer: function (row, columnfield, value, defaulthtml, columnproperties) {
                 //    return '<div style="text-align:center;direction:rtl;margin:5px;"><a href="showUserInfo=' + value + '" title="הצג משתמש">' + value + '</a></div>'
                 //}
             },
             { text: ' שם ', datafield: 'DisplayName', cellsalign: 'right', align: 'center' },
              { text: 'תפקיד', datafield: 'ProfessionName', cellsalign: 'right', align: 'center' },
              { text: 'טלפון', datafield: 'Phone', cellsalign: 'right', align: 'center' },
              { text: 'דואל', datafield: 'Email', cellsalign: 'right', align: 'center' },
             { text: 'קבוצה', datafield: 'TeamId', width: 80, cellsalign: 'right', align: 'center', hidden: true }
       ]
   });

   
    $('#jqxTabs').on('tabclick', function (event) {
        var id = getCurrentId();
        if (id < 0)
            return
        var selectedTab = event.args.item;
        if (selectedTab == 1) {
            slf.nastedGridLoder(id, "users");
        }
        else if (selectedTab == 0) {
            slf.nastedGridLoder(id, "teams");
        }
    });


    //$("#cmdUsers").on('click', function () {
    //    var id = getCurrentId();
    //    if (id < 0)
    //        return
    //    slf.nastedGridLoder(id, "users");
    //});
  
    $("#jqxgrid3").on('rowselect', function (event) {
        event.stopPropagation();

        if ($("#liUsers").text() === "בחירת מנהל מחלקה") {

            var uid = $('#jqxgrid3').jqxGrid('getrowdata', event.args.rowindex).UserId;

            app_dialog.confirm("האם להגדיר את המשתמש המסומן כמנהל מחלקה",
                function () {//ok

                    var id = getCurrentId();
                    var data = {
                        DepartmentId: id, Manager: uid
                    };
                    app_query.doDataPost(slf.RelSetLeadUrl, data, function (data) {
                        $('#jqxgrid3').jqxGrid('clearselection');
                        $('#jqxgrid').jqxGrid('source').dataBind();
                        slf.nastedGridLoder(id, "teams");
                    });

                }, null,
            function () {//cancel

                $('#jqxgrid3').jqxGrid('unselectrow', event.args.rowindex);
                return;

            });
        }
    });
};
