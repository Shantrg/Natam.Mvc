
//============================================================================================ app_plots_grid

app_plots_grid = {
    rowMenu:undefined,
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
        var slf = this;
        $(".grid-wrap").css('max-width', '1150px');
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
                  text: 'קוד מגרש', dataField: 'PlotsId', filtercondition: 'equal', width: 80, cellsalign: 'center', align: 'center', cellsrenderer:
                function (row, columnfield, value, defaulthtml, columnproperties) {

                    //var link = '<div style="margin:6px 6px;direction:rtl;"><a title="עריכת מגרש" href="PlotsDef?id=' + value + '" ><i class="fa fa-plus-square-o" style="font-size:14px;color:#000;"></i></a>';
                    //if (slf.allowEdit > 0 && !slf.isMobile)
                    //link += '<label style="padding-right:15px;"><a href="#" title="הסרת מגרש" onclick="app_plots_grid.delete_plot(' + value + ');"><i class="fa fa-remove" style="font-size:14px;color:red;"></i></a></label>';


                    //var link = '<div style="text-align:center"><a title="הצג מגרש" href="PlotsDef?id=' + value + '" >הצג</a>';
                    //if (slf.allowEdit > 0)
                    //    link += ' | <a href="javascript:app_buildings.plotsDelete(' + value + ')" >הסרה</a>';

                    return '<div style="margin:6px 20px;direction:rtl;"><label><a href="#" onclick="app_jqxgrid_menu.rowMenu(' + row + ',' + value + ');"><i class="fa fa-plus-square-o" style="font-size:14px;color:#000;"></i></a></label></div>';

                    //return link + '</div>';
                }
              }, 
              { text: 'עיר', dataField: 'CityName', filtercondition: 'starts_with', width: 200, cellsalign: 'right', align: 'center' },
              { text: 'רחוב', dataField: 'StreetName', filtercondition: 'starts_with', width: 200, cellsalign: 'right', align: 'center'},
              { text: 'בעלים', dataField: 'OwnerName', filtercondition: 'CONTAINS', width: 200, cellsalign: 'right', align: 'center' },
              { text: 'סוכן', dataField: 'AgentName', filtercondition: 'CONTAINS', width: 120, cellsalign: 'right', align: 'center' },
              { text: 'שטח', dataField: 'Size', filtercondition: 'CONTAINS', width: 120, cellsalign: 'right', align: 'center' },
              { text: 'מחיר לדונם', dataField: 'Price', filtercondition: 'equal', width: 100, cellsalign: 'right', align: 'center' },
              { text: 'מועד עדכון', dataField: 'LastUpdate', filtercondition: 'equal', type: 'date', width: 120, cellsformat: 'd', cellsalign: 'right', align: 'center' }
            ]
        });
        //$('#jqxgrid').on('rowclick', function (event) {
        //    var args = event.args;
        //    gridArgs = args;
        //    // row's bound index.
        //    var boundIndex = args.rowindex;
        //    // row's visible index.
        //    var visibleIndex = args.visibleindex;
        //    // right click.
        //    var rightclick = args.rightclick;
        //    // original event.
        //    var ev = args.originalEvent;
        //});

       
    },
    load: function (id,userInfo){//userRule) {

        this.UInfo = userInfo;
        this.allowEdit = (userInfo.UserRole == 9) ? 1 : 0;

        //this.allowEdit = (userRule == 9) ? 1 : 0;
        this.source.data = { 'id': id};
        var ismobile = app.IsMobile();
        var dataAdapter = new $.jqx.dataAdapter(this.source, {
            async: false,
            loadComplete: function (data) { },
            loadError: function (xhr, status, error) { alert(' status: ' + status + '\n error ' + error) }
        });
        this.grid(dataAdapter, ismobile);
        this.loadRowMenu();
        return this;
    },
    loadRowMenu:function(){
        var _slf = this;
        this.rowMenu = app_jqxgrid_menu.init("#jqxgrid");
        if (_slf.allowEdit != 1)
            $("#rmDel").hide();
        $("#rmEdit").on('click', function () {
            //app.redirectTo('/Building/PlotsDef?id=' + _slf.rowMenu.rowValue + '');
            _slf.doEdit(_slf.rowMenu.rowValue);
        });
        $("#rmDel").on('click', function () {
            app_plots_grid.delete_plot(_slf.rowMenu.rowValue);
        });
        $("#plots-new").on('click', function () {
            _slf.doEdit(0);
        });
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
                },
                error: function (e) {
                    app_dialog.alert(e);
                }
            });
        });
    },
    doEdit: function (id) {

        wizard.displayStep(2);
        this.showControl(id, 'e');
    },
    showControl: function (id, option, action) {

        var data_model = { Id: id, UserInfo: this.UInfo , Role: this.UInfo.UserRole, Option: option, Action: action };
        $("#plots-def-window").empty();
        this.Control = null;
        this.Control = new app_plots_control("#plots-def-window");
        this.Control.init(data_model);
        this.Control.display();
    }
};

