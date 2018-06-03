
//============================================================================================ app_lead_trace_grid

app_lead_trace_grid = {

    LeadId:0,
    loadDataRecord: function (dataRecord, args) {

        if (dataRecord === undefined || dataRecord == null) {
            $("#RecordId").val('');
            $("#RemindDate").val('');
            $("#Memo").val('');
            $("#LeadId").val(args);
            $("#State").val('');
            $("#LeadType").val('0');
        }
        else {
            $("#RecordId").val(dataRecord.RecordId);
            $("#RemindDate").val(dataRecord.RemindDate);
            $("#Memo").val(dataRecord.Memo);
            $("#ContactId").val(dataRecord.ContactId);
            $("#LeadId").val(args);
            //$("#AgentId").val(dataRecord.AgentId);
            $("#State").val(dataRecord.State);
            $("#LeadType").val(dataRecord.LeadType);
        }
    },
    grid: function (ismobile) {

        var slf = this;

        app_jqxform.CreateDateTimeInput("RemindDate");
        $("#LeadId").val(slf.LeadId);

        // create Tree Grid
     var contactsSource =
     {
         dataType: "json",
         async: false,
         dataFields: [
             { name: 'ContactId' },
             { name: 'Info' }
         ],
         data: { 'LeadId': slf.LeadId },
         type: 'POST',
         url: '/Crm/GetContactsByLead'
     };

        var contactsAdapter = new $.jqx.dataAdapter(contactsSource);
        $("#ContactId").jqxComboBox(
        {
            rtl: true,
            source: contactsAdapter,
            width: 250,
            //height: 200,
            //checkboxes: true,
            displayMember: 'Info',
            valueMember: 'ContactId'
        });


        //AgentId-ContactId-LeadId-LeadType-Memo-RecordId-RemindDate-State
        var sendCommand = function (rowdata, command, commit) {


            var url;
            if (command == 0)
                url = '/Common/LeadTraceAdd'
            else if (command == 2)
                url = '/Common/LeadTraceDelete'
            else
                url = '/Common/LeadTraceUpdate';

            $.ajax({
                dataType: 'json',
                type: 'POST',
                url: url,
                data: rowdata,
                success: function (data, status, xhr) {
                    //alert(data.Message);
                    if (data.Commit) {
                        //alert('עודכן בהצלחה');
                        commit(true);
                        //dataAdapter.dataBind();
                    }
                    dataAdapter.dataBind();
                },
                error: function () {
                    alert('אירעה שגיאה, לא עודכנו נתונים');
                    commit(false);
                }
            });
        };
        var source =
        {

            updaterow: function (rowid, rowdata, commit) {
                sendCommand(rowdata, 1, commit);
            },
            addrow: function (rowid, rowdata, position, commit) {
                sendCommand(rowdata, 0, commit);
            },
            deleterow: function (rowid, commit) {
                var rowdata = { 'RecordId': rowid }
                sendCommand(rowdata, 2, commit);
            },
            dataType: "json",

            datafields:
            [
               { name: 'RecordId', type: 'number' },
               { name: 'Creation', type: 'date' },
               { name: 'LastUpdate', type: 'date' },
               { name: 'RemindDate', type: 'date' },
               { name: 'Memo', type: 'string' },
               { name: 'ContactId', type: 'number' },
               { name: 'LeadId', type: 'number' },
               { name: 'AgentId', type: 'number' },
               { name: 'State', type: 'number' },
               { name: 'LeadType', type: 'number' },
               { name: 'CustomerName', type: 'string' },
               { name: 'ContactName', type: 'string' },
               { name: 'ContactTitle', type: 'string' },
               { name: 'ContactMobile', type: 'string' }

            ],
            data: { 'id': slf.LeadId },
            id: 'RecordId',
            type: 'POST',
            url: '/Common/GetLeadsTrace'
        };
        var dataAdapter = new $.jqx.dataAdapter(source, {
            //contentType: "application/json; charset=utf-8",
            loadError: function (jqXHR, status, error) {
                alert("dataAdapter failed: " + error);
            },
            loadComplete: function (data) {
                //alert("dataAdapter is Loaded");
            }
        });
        dataAdapter.dataBind();
        var editrow = -1;
        // initialize jqxGrid
        $("#jqxgrid").jqxGrid(
        {
            rtl: true,
            width: '99%',
            height: 450,
            rowsheight: 30,
            autoheight: false,
            source: dataAdapter,
            localization: getLocalization('he'),
            pageable: false,
            showtoolbar: true,
            scrollmode: 'logical',
            rendertoolbar: function (toolbar) {

                app_jqxgrid.createToolbar(toolbar);

                // update row.
                $("#updaterowbutton").on('click', function () {

                    var selectedrowindex = $("#jqxgrid").jqxGrid('getselectedrowindex');
                    
                    contactsAdapter.dataBind();
                    editrow = app_jqxgrid.doRowEdit(selectedrowindex, 1, slf.loadDataRecord, slf.LeadId);
                });

                // create new row.
                $("#addrowbutton").on('click', function () {
                    editrow = -1;
                    contactsAdapter.dataBind();
                    editrow = app_jqxgrid.doRowEdit(-1, 0, slf.loadDataRecord, slf.LeadId);
                });
                // delete row.
                $("#deleterowbutton").on('click', function () {
                    editrow = app_jqxgrid.deleteSelectedRow();
                });
                // refresh grid.
                $("#refreshbutton").on('click', function () {
                    dataAdapter.dataBind();
                });
            },
            columns: [
            { text: 'קוד שיחה', datafield: 'RecordId', width: 90, cellsalign: 'right', align: 'center' },
            { text: 'שם הלקוח', datafield: 'CustomerName', width: 120, cellsalign: 'right', align: 'center' },
            { text: 'איש קשר', datafield: 'ContactName', width: 100, cellsalign: 'right', align: 'center' },
            { text: 'תפקיד', datafield: 'ContactTitle', width: 100, cellsalign: 'right', align: 'center' },
            { text: 'טלפון', datafield: 'ContactMobile', width: 100, cellsalign: 'right', align: 'center' },
            { text: 'תוכן', datafield: 'Memo', cellsalign: 'right', align: 'center' },
            { text: 'תאריך לתזכורת', datafield: 'RemindDate', type: 'date', width: 100, cellsformat: 'd', cellsalign: 'right', align: 'center' },
            { text: 'תאריך עדכון', datafield: 'LastUpdate', type: 'date', width: 100, cellsformat: 'd', cellsalign: 'right', align: 'center' }
            ]
        });
        
  
        $('#jqxgrid').on('rowdoubleclick', function (event) {
            var args = event.args;
            var boundIndex = args.rowindex;
            var visibleIndex = args.visibleindex;
            contactsAdapter.dataBind();
            editrow = app_jqxgrid.doRowEdit(boundIndex, 1, slf.loadDataRecord, slf.LeadId);
        });


        //================= popup Register ================.


        $("#popupRegister").jqxWindow({
            width: 400, height: 300, resizable: false, isModal: true, autoOpen: false, cancelButton: $("#regCancel"), modalOpacity: 0.01
        });
        //$("#popupRegister").on('open', function () {
        //    $("#regUserName").jqxInput('selectAll');
        //});
        $('#popupRegister').jqxValidator({
            hintType: 'label',
            animationDuration: 0,
            rules: [
                 {
                     input: '#ContactId', message: 'חובה לציין איש קשר!', action: 'select', rule: function (input) {
                         return app_jqxform.validateCombo("ContactId");
                     }
                 },
                { input: '#Memo', message: 'נדרש תוכן!', action: 'keyup, blur', rule: 'required' }
            ]
        });

        // LeadTraceAdd(int LeadId, int AgentId, int LeadType, int ContactId, string Memo, DateTime? RemindDate, int State, int RecordId)
        $('#popupRegister').on('validationSuccess', function (event) {
            var RowId = $("#RecordId").val();
            var row = {
                LeadId: slf.LeadId,//$("#LeadId").val(),
                LeadType: $("#LeadType").val(),
                ContactId: $("#ContactId").val(),
                Memo: $("#Memo").val(),
                RemindDate: $("#RemindDate").val(),
                State: $("#State").val(),
                RecordId: RowId
            };

            var mode = $("#Mode").val();

            if (mode == 0) {
                $('#jqxgrid').jqxGrid('addrow', null, row);
            }
            else if (editrow >= 0) {
                var rowID = $('#jqxgrid').jqxGrid('getrowid', editrow);
                $('#jqxgrid').jqxGrid('updaterow', rowID, row);
            }

            $("#popupRegister").jqxWindow('hide');
        });
        $("#regCancel").jqxButton();
        $("#regSave").jqxButton();
        // update the edited row when the user clicks the 'Save' button.
        $("#regSave").click(function () {
            $('#popupRegister').jqxValidator('validate');

        });

    },
    load: function (id) {
        var ismobile = app.IsMobile();
        this.LeadId = id;
        this.grid(ismobile);
    }
};
