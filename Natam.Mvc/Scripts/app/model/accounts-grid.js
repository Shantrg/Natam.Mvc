
//============================================================================================ app_accounts_grid

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
