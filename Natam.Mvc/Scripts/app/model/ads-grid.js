
//============================================================================================ app_ads_grid

app_ads_grid = {

    AllowEdit: 0,
    source:
    {
        //sort: customsortfunc,
        datatype: "json",
        datafields: [
            { name: 'AdsId', type: 'number' },
            { name: 'BuildingId', type: 'number' },
            { name: 'BuildingName', type: 'string' },
            { name: 'Address', type: 'string' },
            { name: 'AdsDate', type: 'date' },
            { name: 'AdsTypeName', type: 'string' },
            { name: 'PurposeName', type: 'string' },
            { name: 'AreaName', type: 'string' },
            { name: 'Description', type: 'string' },
            { name: 'AgentName', type: 'string' },
            { name: 'Creation', type: 'date' },
            { name: 'StatusName', type: 'string' }
        ],
        id: 'AdsId',
        type: 'POST',
        url: '/Crm/GetAdsGrid',
        //pagenum: 3,
        pagesize: 20,
        //root: 'Rows',
        //beforeprocessing: function (data) {
        //    this.totalrecords = data.TotalRows;
        //},
        //pager: function (pagenum, pagesize, oldpagenum) {
        //    // callback called when a page or page size is changed.
        //}
    },
    adapter: function (source) {

       return new $.jqx.dataAdapter(source, {
           async: false,
           loadComplete: function (data) { },
           loadError: function (xhr, status, error) { alert(' status: ' + status + '\n error ' + error) }
       });
    },
    grid: function (dataAdapter, ismobile) {
        var slf = this;

        var renderstatusbar = function (statusbar) {
            // appends buttons to the status bar.
            var container = $("<div style='overflow: auto;position: relative; margin: 5px;float:right;'></div>");
            var editButton = $("<div style='float: left; margin-left: 5px;' title='הצג את הרשומה המסומנת' ><img src='../scripts/app/images/edit.gif'><span style='margin-left: 4px; position: relative;'>הצג</span></div>");
            var allButton = $("<div style='float: left; margin-left: 5px;' title='הצג הכל'><img src='../scripts/app/images/all.gif'><span style='margin-left: 4px; position: relative;'>הצג הכל</span></div>");
            var reloadButton = $("<div style='float: left; margin-left: 5px;' title='רענון'><img src='../scripts/app/images/refresh.gif'><span style='margin-left: 4px; position: relative;'>רענון</span></div>");
            var clearFilterButton = $("<div style='float: left; margin-left: 5px;' title='הסר סינון' ><img src='../scripts/app/images/filterRemove.gif'><span style='margin-left: 4px; position: relative;'>הסר סינון</span></div>");
            container.append(reloadButton);
            container.append(clearFilterButton);
            if (slf.AllowEdit == 1) {
                container.append(allButton);
            }
            container.append(editButton);
            statusbar.append(container);
            //jqxButton
            editButton.jqxButton({width:70, height: 20 });
            allButton.jqxButton({ width: 70, height: 20 });
            reloadButton.jqxButton({ width: 70, height: 20 });
            clearFilterButton.jqxButton({ width: 70, height: 20 });
            //events
            editButton.click(function (event) {
                var selectedrowindex = $("#jqxgrid").jqxGrid('getselectedrowindex');
                if (selectedrowindex < 0)
                    return;
                var id = $("#jqxgrid").jqxGrid('getrowid', selectedrowindex);
                app.redirectTo("AdsDef?id=" + id + "&op=ads");
            });
            // delete selected row.
            allButton.click(function (event) {

                slf.source.data = { 'id': 0, 'op': 'agent', 'state': 255 };
                $("#jqxgrid").jqxGrid('source').dataBind();
            });
            // reload grid data.
            reloadButton.click(function (event) {
                $("#jqxgrid").jqxGrid('source').dataBind();
            });
            clearFilterButton.click(function (event) {
                $("#jqxgrid").jqxGrid('clearfilters');
            });
        };

        // create Tree Grid
        $("#jqxgrid").jqxGrid(
        {
            width: '100%',
            autoheight: true,
            rtl: true,
            source: dataAdapter,
            localization: getLocalization('he'),
            virtualmode: false,
            rendergridrows: function (obj) {
                //alert('virtualmode');
                console.log(obj)
                return obj.data;
            },
            pageable: true,
            pagermode: 'simple',
            altrows: true,
            sortable: true,
            showfilterrow: true,
            filterable: true,
            //showstatusbar: true,
            //renderstatusbar: renderstatusbar,
            columns: [
              {
                  text: 'קוד פרסום', dataField: 'AdsId', filtercondition: 'equal', width: 80, cellsalign: 'right', align: 'center', cellsrenderer:
                function (row, columnfield, value, defaulthtml, columnproperties) {
                    return '<div style="text-align:center"><a href="AdsDef?id=' + value + '&op=ads" >הצג</a></div>';
                }
              }, 
              { text: 'סוג מדיה', dataField: 'AdsTypeName', width: 120, cellsalign: 'right', align: 'center', hidden: ismobile },
              { text: 'אזור-עיר', dataField: 'AreaName', filtercondition: 'starts_with', width: 120, cellsalign: 'right', align: 'center', hidden: ismobile },
              { text: 'שם הבניין', dataField: 'BuildingName', filtercondition: 'CONTAINS', width: 120, cellsalign: 'right', align: 'center', hidden: ismobile },
              { text: 'כתובת', dataField: 'Address', filtercondition: 'CONTAINS', cellsalign: 'right', align: 'center' },
              { text: 'סוג נכס', dataField: 'PurposeName', filtercondition: 'CONTAINS', width: 100, cellsalign: 'right', align: 'center' },
              { text: 'סוכן', dataField: 'AgentName', filtercondition: 'CONTAINS', width: 100, cellsalign: 'right', align: 'center', hidden: ismobile },
              { text: 'סטאטוס', dataField: 'StatusName', filtercondition: 'equal', width: 80, cellsalign: 'right', align: 'center' },
              { text: 'מועד פרסום', dataField: 'AdsDate', filtercondition: 'equal', type: 'date', width: 100, cellsformat: 'd', cellsalign: 'right', align: 'center' }
            ]
        });

  
        $("#btnShow").click(function (event) {
            //var selectedrowindex = $("#jqxgrid").jqxGrid('getselectedrowindex');
            //if (selectedrowindex < 0)
            //    return;
            //var id = $("#jqxgrid").jqxGrid('getrowid', selectedrowindex);
            var id = getRowId(true);
            if (id > 0)
            app.redirectTo("AdsDef?id=" + id + "&op=ads");
        });
        $("#btnAll").click(function (event) {
            slf.source.data = { 'id': 0, 'op': 'agent', 'state': 255 };
            $("#jqxgrid").jqxGrid('source').dataBind();
        });
        $("#btnRefresh").click(function (event) {
            $("#jqxgrid").jqxGrid('source').dataBind();
        });
        $("#btnRemoveFilter").click(function (event) {
            $("#jqxgrid").jqxGrid('clearfilters');
        });

        $("#btnDelete").click(function (event) {
            var id = getRowId(true);
            if(id>0)
             app_jqx.gridRowDelete("/Crm/AdsDelete", { 'AdsId': id }, "פרסום מספר " + id);
        });

        var getRowId = function (showWarnning) {
            var selectedrowindex = $("#jqxgrid").jqxGrid('getselectedrowindex');
            if (selectedrowindex < 0) {
                if (showWarnning)
                    alert("נא לסמן רשומה");
                return 0;
            }
            var id = $("#jqxgrid").jqxGrid('getrowid', selectedrowindex);
            return id;
        }

    },
    load: function (id, op, state, UserRole) {
        this.AllowEdit = UserRole == 9 ? 1 : 0;
        if (this.AllowEdit == 1) {
            state = 0;
            $("#btnDelete").show();
        }
        else {
            $("#btnAll").hide();
            $("#btnDelete").hide();
        }

        this.source.data = { 'id': id, 'op': op,'state':state};
        var ismobile = app.IsMobile();
       
        //var dataAdapter = new $.jqx.dataAdapter(this.source, {
        //    async: false,
        //    loadComplete: function (data) { },
        //    loadError: function (xhr, status, error) { alert(' status: ' + status + '\n error ' + error) }
        //});
        var dataAdapter = this.adapter(this.source);
        this.grid(dataAdapter, ismobile);
    }
};
