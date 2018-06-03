
//============================================================================================ app_plots_grid

app_plots_grid = {

    allowEdit: 0,
    isMobile:app.IsMobile(),
    // prepare the data
    source:
    {
        //sort: customsortfunc,
        datatype: "json",
        datafields: [
            { name: 'PlotsId', type: 'number' },
            { name: 'StreetName', type: 'string' },
            { name: 'CityName', type: 'string' },
            { name: 'Size', type: 'number' },
            { name: 'Price', type: 'number' },
            { name: 'OwnerName', type: 'string' },
            { name: 'AgentName', type: 'string' },
            { name: 'LastUpdate', type: 'date' }
        ],
        id: 'PlotsId',
        type: 'POST',
        url: '/Building/GetPlotsGrid',
        pagenum: 0,
        pagesize: 20,
        //root: 'Rows',
        //beforeprocessing: function (data) {
        //    this.totalrecords = data.TotalRows;
        //},
        //pager: function (pagenum, pagesize, oldpagenum) {
        //    // callback called when a page or page size is changed.
        //}
    },
    grid: function (dataAdapter, ismobile) {
        var slf=this;
        // create Tree Grid
        $("#jqxgrid").jqxGrid(
        {
            width: '100%',
            autoheight: true,
            rtl: true,
            source: dataAdapter,
            localization: getLocalization('he'),
            virtualmode: false,
            pageable: true,
            //pagermode: 'simple',
            altrows: true,
            sortable: true,
            showfilterrow: true,
            filterable: true,
            columns: [
              {
                  text: 'קוד מגרש', dataField: 'PlotsId', filtercondition: 'equal', width: 70, cellsalign: 'right', align: 'center', cellsrenderer:
                function (row, columnfield, value, defaulthtml, columnproperties) {

                    var link = '<div style="margin:6px 6px;direction:rtl;"><a title="עריכת מגרש" href="PlotsDef?id=' + value + '" ><i class="fa fa-plus-square-o" style="font-size:14px;color:#000;"></i></a>';
                    if (slf.allowEdit > 0 && !slf.isMobile)
                        link += '<label style="padding-right:15px;"><a href="#" title="הסרת מגרש" onclick="app_plots_grid.delete_plot(' + value + ');"><i class="fa fa-remove" style="font-size:14px;color:red;"></i></a></label>';


                    //var link = '<div style="text-align:center"><a title="הצג מגרש" href="PlotsDef?id=' + value + '" >הצג</a>';
                    //if (slf.allowEdit > 0)
                    //    link += ' | <a href="javascript:app_buildings.plotsDelete(' + value + ')" >הסרה</a>';

                    return link + '</div>';
                }
              }, 
              { text: 'עיר', dataField: 'CityName', filtercondition: 'starts_with', width: 150, cellsalign: 'right', align: 'center', hidden: ismobile },
              { text: 'סוכן', dataField: 'AgentName', filtercondition: 'CONTAINS', width: 120, cellsalign: 'right', align: 'center' },
              { text: 'בעלים', dataField: 'OwnerName', filtercondition: 'CONTAINS', cellsalign: 'right', align: 'center' },
              { text: 'שטח', dataField: 'Size', filtercondition: 'CONTAINS', width: 120, cellsalign: 'right', align: 'center', hidden: ismobile },
              { text: 'מחיר לדונם', dataField: 'Price', filtercondition: 'equal', width: 100, cellsalign: 'right', align: 'center' },
              { text: 'מועד עדכון', dataField: 'LastUpdate', filtercondition: 'equal', type: 'date', width: 120, cellsformat: 'd', cellsalign: 'right', align: 'center' }
            ]
        });
        
    },
    load: function (id,userRule) {

        this.allowEdit = (userRule == 9) ? 1 : 0;

        this.source.data = { 'id': id};
        var ismobile = app.IsMobile();
        var dataAdapter = new $.jqx.dataAdapter(this.source, {
            async: false,
            loadComplete: function (data) { },
            loadError: function (xhr, status, error) { alert(' status: ' + status + '\n error ' + error) }
        });
        this.grid(dataAdapter, ismobile);
    },
    delete_plot: function (id) {

        app_dialog.confirm("האם למחוק מגרש " + id, function () {
            $.ajax({
                //async: async,
                type: "POST",
                url: "/Building/DeletePlots",
                data: { 'PlotsId': id },
                //contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    $("#jqxgrid").jqxGrid('source').dataBind();
                    app_messenger.Post(data);
                    //app_dialog.popMessage(data.Title, data.Message, "auto");
                },
                error: function (e) {
                    app_dialog.alert(e);
                }
            });
        });
    }
};
