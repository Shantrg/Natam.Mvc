
//============================================================================================ app_units_grid

app_units_grid = {
     isMobile:false,
    // prepare the data
    source:
    {
        //sort: customsortfunc,
        datatype: "json",
        datafields: [
            { name: 'UnitId', type: 'number' },
            { name: 'BuildingId', type: 'number' },
            { name: 'BuildingName', type: 'string' },
            { name: 'FloorNum', type: 'number' },
            { name: 'UnitNum', type: 'number' },
            { name: 'UnitSize', type: 'number' },
            { name: 'Price', type: 'number' },
            { name: 'Populate', type: 'bool' },
            { name: 'UserName', type: 'string' },
            { name: 'OwnerId', type: 'number' },
            { name: 'OwnerName', type: 'string' },
            { name: 'Memo', type: 'string' },
            { name: 'LastUpdate', type: 'date' },
            { name: 'PurposeId', type: 'number' },
            { name: 'PurposeName', type: 'string' },
            { name: 'DealType', type: 'string' },
            { name: 'DealName', type: 'string' },
            { name: 'AgentId', type: 'number' },
            { name: 'DealName', type: 'string' },
            { name: 'BuildingName', type: 'string' },
            { name: 'Address', type: 'string' },
            { name: 'CityName', type: 'string' },
            { name: 'PropertyTypeName', type: 'string' },
            { name: 'PropertyType', type: 'number' }
        ],
        id: 'UnitId',
        type: 'POST',
        url: '/Building/GetBuildingUnitGrid',
        //pagenum: 3,
        pagesize: 20,
        root: 'Rows',
        beforeprocessing: function (data) {
            this.totalrecords = data.TotalRows;
        },
        pager: function (pagenum, pagesize, oldpagenum) {
            // callback called when a page or page size is changed.
        },
        filter: function () {
            // update the grid and send a request to the server.
            $("#jqxgrid").jqxGrid('updatebounddata');
        },
        sort: function () {
            // update the grid and send a request to the server.
            $("#jqxgrid").jqxGrid('updatebounddata');
        }
    },
    cellsrenderer: function (row, columnfield, value, defaulthtml, columnproperties) {
        return '<div style="text-align:center"><a href="UnitDef?id=' + value + '&bid=' + this.BuildingId + '&floor=0&op=0" >הצג</a></div>';
    },
    initrowdetails: function (index, parentElement, gridElement, datarecord) {
        var tabsdiv = null;
        var information = null;
        var notes = null;
        var actions = null;
        tabsdiv = $($(parentElement).children()[0]);
        if (tabsdiv != null) {
            information = tabsdiv.find('.information');
            notes = tabsdiv.find('.notes');
            actions = tabsdiv.find('.actions');

            var title = tabsdiv.find('.title');
            title.text(datarecord.BuildingName);

            //info container
            var container = $('<div style="margin: 5px;text-align:right;"></div>')
            container.rtl = true;
            container.appendTo($(information));
            var leftcolumn = $('<div style="float: left; width: 45%;direction:rtl;"></div>');
            var rightcolumn = $('<div style="float: right; width: 40%;direction:rtl;"></div>');
            //var photocolumn = $('<div style="float: left; width: 15%;"></div>');

            //container.append(photocolumn);
            container.append(leftcolumn);
            container.append(rightcolumn);

            //var mediaLink = $('<a class="row_link" href="#popupMedia" data-rel="popup" data-position-to="window" data-role="button" data-theme="a" data-inline="true">תמונות</a>')
            // var mediaLink = $('<input type="button" value="תמונות"/>')
            //.on("click", function (e) {
            //    e.preventDefault();
            //    //dialogIframe("_Media?bid=" + datarecord.BuildingId + "&pid=" + datarecord.UnitId + "&pt=u", "900", "520", "מדיה");
            //    mediaEditor(datarecord.BuildingId, datarecord.UnitId, "u");
            //});
            //$(photocolumn).append(mediaLink);

            var infosection = "<div class='row_detail'><b>{0}:</b>{1}</div>";

            $(leftcolumn).append(infosection.format("מספר קומה", datarecord.FloorNum));
            $(leftcolumn).append(infosection.format("מספר יחידה", datarecord.UnitNum));
            $(leftcolumn).append(infosection.format("שטח", datarecord.UnitSize));
            $(leftcolumn).append(infosection.format("מחיר", datarecord.Price));

            //$(rightcolumn).append(infosection.format("איש קשר", datarecord.ContactName));
            //$(rightcolumn).append(infosection.format("טלפון", datarecord.ContactPhone));
            //$(rightcolumn).append(infosection.format("סלולארי", datarecord.ContactMobile));
            //$(rightcolumn).append(infosection.format("דואל", datarecord.ContactMail));
            //$(rightcolumn).append(infosection.format("קוד יחידה", datarecord.UnitId));
            //$(rightcolumn).append(infosection.format("קוד בניין", datarecord.BuildingId));

            var unitLink = $("<div style='margin: 10px;direction:rtl;'><b>קוד יחידה:</b> <a href='#' data-rel='popup' data-position-to='window' data-role='button' data-theme='a' data-inline='true'>" + datarecord.UnitId + "</a></div>")
             .on("click", function (e) {
                 e.preventDefault();
                 app_units.unitDef(datarecord.UnitId);
             });
            $(rightcolumn).append(unitLink);

            var buildingLink = $("<div style='margin: 10px;direction:rtl;'><b>קוד בניין:</b> <a href='#' data-rel='popup' data-position-to='window' data-role='button' data-theme='a' data-inline='true'>" + datarecord.BuildingId + "</a></div>")
              .on("click", function (e) {
                  e.preventDefault();
                  app_buildings.buildingDef(datarecord.BuildingId);
              });

            $(rightcolumn).append(buildingLink);

            var ownerContainer = $("<div style='margin: 10px;direction:rtl;'><b>בעלים:</b> <a href='#' data-rel='popup' data-position-to='window' data-role='button' data-theme='a' data-inline='true'>" + datarecord.OwnerName + "</a></div>")
              .on("click", function (e) {
                  e.preventDefault();
                  //popupIframe("_AccountInfo?id=" + datarecord.OwnerId, "240", "120");
                  app_accounts.accountDisplay(datarecord.OwnerId, "בעלים");
              });

            $(rightcolumn).append(ownerContainer);

            //notes container
            var notescontainer = $('<div style="white-space: normal; margin: 5px;text-align:right;"><span>' + datarecord.Memo + '</span></div><br/>' +
                '<div style="white-space: normal; margin: 5px;text-align:right;"><span>' + '' + '</span></div>');
            notescontainer.rtl = true;
            $(notes).append(notescontainer);


            //actions container
            var actionscontainer = $('<div style="white-space: normal; margin: 5px;text-align:right;"></div>');
            actionscontainer.rtl = true;
            actionscontainer.append("<span class='row_link'><a href='UnitDef?id=" + datarecord.UnitId + "&bid=" + 0 + "&floor=0&op=0'>הצג יחידה</a></span>");
            actionscontainer.append("<span class='row_link'><a href='../Crm/AdsDef?id=" + datarecord.UnitId + "&op=u'>פרסום חדש</a></span>");
            actionscontainer.append("<span class='row_link'><a href='../Crm/AdsGrid?id=" + datarecord.UnitId + "&op=property'>דוח פרסום</a></span>");

            var userId = getUserId();
            var allowEdit = getAllowEdit();

            var propType = datarecord.PropertyType;
            if (propType == 1 && (userId == datarecord.AgentId || allowEdit == 1)) {
                actionscontainer.append("<span class='row_link'><a href='javascript:deleteUnit(" + datarecord.UnitId + "," + datarecord.BuildingId + "," + datarecord.FloorNum + "," + datarecord.PropertyType + ")'>מחיקת עדכון מידע</a></span>");
            }
            else if (propType == 0 && allowEdit == 1) {
                actionscontainer.append("<span class='row_link'><a href='javascript:deleteUnit(" + datarecord.UnitId + "," + datarecord.BuildingId + "," + datarecord.FloorNum + "," + datarecord.PropertyType + ")'>מחיקת יחידה</a></span>");
            }


            var mediaLink = $('<a class="row_link" href="#">תמונות</a>')
           .on("click", function (e) {
               e.preventDefault();
               //dialogIframe("_Media?bid=" + datarecord.BuildingId + "&pid=" + datarecord.UnitId + "&pt=u", "900", "520", "מדיה");
               app_popup.mediaEditor(datarecord.BuildingId, datarecord.UnitId, "u");
           });
            actionscontainer.append(mediaLink);

            $(actions).append(actionscontainer);

            $(tabsdiv).jqxTabs({ width: '95%', height: 170, rtl: true });
        }
    },
    grid: function (dataAdapter) {
        var slf = this;
        // create Tree Grid
        $("#jqxgrid").jqxGrid(
        {
            width: '100%',
            autoheight: true,
            rtl: true,
            source: dataAdapter,
            localization: getLocalization('he'),
            virtualmode: true,
            rendergridrows: function (obj) {
                //alert('virtualmode');
                console.log(obj)
                return obj.data;
            },
            pageable: true,
            pagermode: 'simple',
            sortable: true,
            altrows: true,
            rowdetails: true,
            rowdetailstemplate: { rowdetails: "<div style='margin: 10px;'><ul style='margin-right: 30px;'><li class='title'>כללי</li><li>פרטים</li><li>אפשרויות</li></ul><div class='information'></div><div class='notes'></div><div class='actions'></div></div>", rowdetailsheight: 200 },
            //ready: function () {
            //    $("#jqxgrid").jqxGrid('showrowdetails', 0);
            //    //$("#jqxgrid").jqxGrid('showrowdetails', 1);
            //},שם בניין, כתובת, עיר, קומה, שטח, מחיר
            initrowdetails: this.initrowdetails,
            columns: [
              {
                  text: '*', dataField: 'UnitId', width: 30, cellsalign: 'right', align: 'center', hidden: slf.isMobile, cellsrenderer:
                function (row, columnfield, value, defaulthtml, columnproperties) {

                    return '<div style="margin:6px 6px;direction:rtl"><a title="עריכת יחידה" href="UnitDef?id=' + value + '&bid=' + 0 + '&floor=0&op=0" ><i class="fa fa-plus-square-o" style="font-size:14px;color:#000;"></i></a></div>';
                    //return '<div style="text-align:center"><a href="UnitDef?id=' + value + '&bid=' + 0 + '&floor=0&op=0" >הצג</a></div>';
                }
              }, 
              { text: 'שם בניין', dataField: 'BuildingName', cellsalign: 'right', align: 'center' },
              { text: 'כתובת', dataField: 'Address',  cellsalign: 'right', align: 'center' },
              { text: 'עיר', dataField: 'CityName', cellsalign: 'right', align: 'center' },
              { text: 'שטח', dataField: 'UnitSize', cellsalign: 'right', align: 'center' },
              { text: 'קומה', dataField: 'FloorNum', cellsalign: 'right', align: 'center' },
              { text: 'סוג', dataField: 'PropertyTypeName', cellsalign: 'right', align: 'center' },
              
              { text: 'מחיר', dataField: 'Price', cellsalign: 'right', align: 'center' },
              { text: 'מאוכלס', datafield: 'Populate', threestatecheckbox: true, columntype: 'checkbox', width: 70, cellsalign: 'right', align: 'center', hidden: slf.isMobile },
              { text: 'בעלים', dataField: 'OwnerName', cellsalign: 'right', align: 'center', hidden: slf.isMobile },
              { text: 'מועד עדכון', dataField: 'LastUpdate', type: 'date', width: 120, cellsformat: 'd', cellsalign: 'right', align: 'center', hidden: slf.isMobile }
            ]
        });
        $('#jqxgrid').on('rowdoubleclick', function (event) {
            var args = event.args;
            var boundIndex = args.rowindex;
            var visibleIndex = args.visibleindex;
            var id = $("#jqxgrid").jqxGrid('getrowid', boundIndex);
            //var mid = $('#jqxgrid').jqxGrid('getrowdata', boundIndex).LeadId;
            app.redirectTo('UnitDef?id=' +id + '&bid=' + 0 + '&floor=0&op=0');
        });
    },
    loadModel: function (model) {
        
        //this.QueryType = QueryType;
        //this.Area = Area;
        //this.DealType = DealType;
        //this.PurposeType = PurposeType;
        //this.AreaSizeMin = AreaSizeMin;
        //this.AreaSizeMax = AreaSizeMax;
        //this.BuildingName = BuildingName;
        //this.BuildingStreet = BuildingStreet;
        //this.StreetNo = StreetNo;
        //this.City = City;
        //this.OwnerId = OwnerId;
        //this.BuildingId = BuildingId;

        //this.source.data = { 'QueryType': this.QueryType, 'Area': this.Area, 'DealType': this.DealType, 'PurposeType': this.PurposeType, 'AreaSizeMin': this.AreaSizeMin, 'AreaSizeMax': this.AreaSizeMax, 'BuildingName': '' + this.BuildingName + '', 'BuildingStreet': '' + this.BuildingStreet + '', 'StreetNo': '' + this.StreetNo + '', 'City': '' + this.City + '', 'OwnerId': this.OwnerId, 'BuildingId': this.BuildingId };


        this.isMobile = app.IsMobile();
        this.source.data = { 'QueryType': model.QueryType, 'Area': model.Area, 'DealType': model.DealType, 'PurposeType': model.PurposeType, 'AreaSizeMin': model.AreaSizeMin, 'AreaSizeMax': model.AreaSizeMax, 'BuildingName': '' + model.BuildingName + '', 'StreetId': model.StreetId, 'StreetNo': '' + model.StreetNo + '', 'CityCode': model.CityCode, 'OwnerId': model.OwnerId, 'BuildingId': model.BuildingId };
        var dataAdapter = new $.jqx.dataAdapter(this.source);

        //var dataAdapter = new $.jqx.dataAdapter(this.source, {
        //    async: false,
        //    loadComplete: function (data) { },
        //    loadError: function (xhr, status, error) {
        //        alert(' status: ' + status + '\n error ' + error)
        //    }
        //});
        this.grid(dataAdapter);
    },
    load: function (QueryType, Area, DealType, PurposeType, AreaSizeMin, AreaSizeMax, BuildingName ,StreetId ,StreetNo,CityCode ,OwnerId, BuildingId) {
        
        //this.QueryType = QueryType;
        //this.Area = Area;
        //this.DealType = DealType;
        //this.PurposeType = PurposeType;
        //this.AreaSizeMin = AreaSizeMin;
        //this.AreaSizeMax = AreaSizeMax;
        //this.BuildingName = BuildingName;
        //this.BuildingStreet = BuildingStreet;
        //this.StreetNo = StreetNo;
        //this.City = City;
        //this.OwnerId = OwnerId;
        //this.BuildingId = BuildingId;

        //this.source.data = { 'QueryType': this.QueryType, 'Area': this.Area, 'DealType': this.DealType, 'PurposeType': this.PurposeType, 'AreaSizeMin': this.AreaSizeMin, 'AreaSizeMax': this.AreaSizeMax, 'BuildingName': '' + this.BuildingName + '', 'BuildingStreet': '' + this.BuildingStreet + '', 'StreetNo': '' + this.StreetNo + '', 'City': '' + this.City + '', 'OwnerId': this.OwnerId, 'BuildingId': this.BuildingId };


        this.isMobile = app.IsMobile();
        this.source.data = { 'QueryType': QueryType, 'Area': Area, 'DealType': DealType, 'PurposeType': PurposeType, 'AreaSizeMin': AreaSizeMin, 'AreaSizeMax': AreaSizeMax, 'BuildingName': '' + BuildingName + '', 'StreetId': StreetId , 'StreetNo': '' + StreetNo + '', 'CityCode': CityCode , 'OwnerId': OwnerId, 'BuildingId': BuildingId };


        var dataAdapter = new $.jqx.dataAdapter(this.source, {
            async: false,
            loadComplete: function (data) { },
            loadError: function (xhr, status, error) { alert(' status: ' + status + '\n error ' + error) }
        });
        this.grid(dataAdapter);
    }
};
