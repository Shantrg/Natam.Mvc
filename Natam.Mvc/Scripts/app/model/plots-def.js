
//============================================================================================ app_plots_def

function app_plots_def(plotsId, userInfo) {

    this.PlotsId = plotsId;
    this.UserRole = userInfo.UserRole;
    this.allowEdit = 0;
    this.srcDesignation;
    this.srcOwnerId;
    this.srcAreaId;

    this.allowEdit = (this.UserRole == 9) ? 1 : 0;
    this.isMobile = app.IsMobile();

    var slf = this;

    //$('#btnImages').attr("disabled", this.isMobile || plotsId <= 0);

    $("#hImages").css('display', this.PlotsId > 0 ? 'block' : 'none');

    if (plotsId==0)
    {
        $("#ads").hide();
        $("#AgentId").val(userInfo.UserId);
        $("#AgentName").val(userInfo.UserName);
    }
    
    // prepare the data
    this.ownerAdapter = app_jqx_list.ownerPlotsComboAdapter();
    app_jqx_list.areaComboAdapter();



        //var source =
        //    {
        //        dataType: "json",
        //        //async: async,
        //        dataFields: [
        //            { name: "AreaId" },
        //            { name: "AreaName" }
        //        ],
        //        type: 'POST',
        //        url: '/Building/GetAreaViewAll'
        //    };
        //var srcAdapter = new $.jqx.dataAdapter(source,
        //{
        //    formatData: function (data) {
        //        if ($("#AreaId").jqxComboBox('searchString') != undefined) {
        //            data.AreaName_startsWith = $("#AreaId").jqxComboBox('searchString');
        //            return data;
        //        }
        //    }
        //});

    //$("#AreaId").jqxComboBox(
    // {
    //     rtl: true,
    //     source: srcAdapter,
    //     width: 200,
    //     remoteAutoComplete: true,
    //     autoDropDownHeight: true,
    //     selectedIndex: 0,
    //     displayMember: "AreaName",
    //     valueMember: "AreaId",
    //     renderer: function (index, label, value) {
    //         var item = srcAdapter.records[index];
    //        if (item != null) {
    //            var label = item.AreaName;
    //            return label;
    //        }
    //        return "";
    //    },
    //    renderSelectedItem: function(index, item)
    //    {
    //        var item = srcAdapter.records[index];
    //        if (item != null) {
    //            var label = item.AreaName;
    //            return label;
    //        }
    //        return "";   
    //    },
    //    search: function (searchString) {
    //        srcAdapter.dataBind();
    //}
    // });

    app_jqx_list.ownerTypeComboAdapter();
    //app_jqx_list.designationComboAdapter();

    //$("#LastUpdate").jqxDateTimeInput({ formatString: 'dd/MM/yyyy' });
    //$("#Creation").val('');


    //$("#form").on('validationSuccess', function () {
    //    //alert('validationSuccess');
    //    // Display the Server's Response which came as result of the Form Submit.
    //    $("#form-iframe").fadeIn('fast');
    //});

    $('#reset').on('click', function () {
        //$("#form-iframe").html('').fadeOut('fast');
        //$("#form-next").html('')
        location.reload();
    });

    $('#btnImages').click(function (e) {
        e.preventDefault();
        //var unitId = $("#PlotsId").val();
        app_popup.mediaEditor(0, slf.PlotsId, "p");
    });
    $('#btnReloadImages').click(function (e) {
        var id = $("#PlotsId").val();
        if (id > 0)
            app_media.loadImages(id);
    });
    $('#ads').click(function (e) {
        app_rout.redirectToAdsDef(slf.PlotsId, "p");
    });
    this.loadControls();

    this.loadDataAdapter = function () {

        var slf = this;

        if (slf.PlotsId > 0) {
            this.source =
            {
                datatype: "json",
                data: { 'id': slf.PlotsId },
                id: 'PlotsId',
                type: 'POST',
                url: '/Building/GetPlots'

            };
            this.dataAdapter = new $.jqx.dataAdapter(this.source, {
                beforeLoadComplete: function (records) {
                    setTimeout(function () {
                        return records;
                    }, 2000);
                },
                loadComplete: function (record) {

                    slf.syncData(record);

                },
                loadError: function (jqXHR, status, error) {
                },
            });
            // perform data binding.
            this.dataAdapter.dataBind();
        }
    };

    this.doSubmit = function () {
        //e.preventDefault();
        var actionurl = $('#form').attr('action');
        app_jqxcombos.renderCheckList("DesignationList", "Designation");
        var validationResult = function (isValid) {
            if (isValid) {
                //$.blockUI({ timeout: 4000 });
                //$("#form-iframe").load(function () {
                //    $.unblockUI();
                //    $("#form-next").html('<a href="Home/Main">המשך</a>')
                //});
                //========================================

                $.ajax({
                    url: actionurl,
                    type: 'post',
                    dataType: 'json',
                    data: $('#form').serialize(),
                    success: function (data) {

                        if (data.Status >= 0) {
                            //window.parent.triggerBuildingComplete(data.OutputId);
                            //$('#form')[0].reset();
                            $('#PlotsId').val(data.OutputId);
                            //redirectToFinal("building-ok");
                            app.redirectTo("/Building/PlotsGrid");
                        }
                        else
                            alert(data.Message);
                    },
                    error: function (jqXHR, status, error) {
                        alert(error);
                    }
                });

            }
        }
        // Validate the Form.
        $('#form').jqxValidator('validate', validationResult);
    };

    //this.loadPic = function (tag, value) {
    //    if (value) {
    //        var img = $('<img height="60" src="' + value + '"/>');
    //        $("#" + tag).html(img);
    //    }
    //};

    this.reloadImages = function () {

        app_media.loadImages(this.PlotsId,'p');
    };

    app_media.loadImages(this.PlotsId,'p');

};

app_plots_def.prototype.syncData = function (record) {

    var slf = this;

    if (record.PlotsId > 0) {

        app_jqxform.loadDataForm("form", record);

        this.srcDesignation = record.Designation;
        this.srcOwnerId = record.OwnerId;
        this.srcAreaId = record.AreaId;
        //srcPlotsId = record.PlotsId;

        app_query.getAgentName(record.AgentId, 'AgentName');

        app_jqxcombos.selectCheckList("DesignationList", record.Designation);

        //if (record.ActiveState == 1) {
        //    this.allowEdit = (this.UserRole == 9) ? 1 : 0;
        //}
        //else {
        //    this.allowEdit = 1;
        //}
    }

    if (slf.allowEdit == 0) {
        $("#submit").hide();
        $("#reset").hide();
        //$("#archive").hide();
        $("#editOwner").hide();

        //$("#isSendMailSpan").hide();

    }
    //else {
    //    $("#archive").show();
    //}
};

app_plots_def.prototype.loadControls = function () {

    this.designationSource =
   {
       dataType: "json",
       async: false,
       dataFields: [
           { name: 'DesignationId' },
           { name: 'DesignationName' }
       ],
       type: 'POST',
       url: '/Building/GetDesignationView'
   };
    this.designationAdapter = new $.jqx.dataAdapter(this.designationSource);

    $("#DesignationList").jqxListBox(
    {
        rtl: true,
        source: this.designationAdapter,
        width: 240,
        height: 160,
        checkboxes: true,
        displayMember: 'DesignationName',
        valueMember: 'DesignationId'
    });

    $('#form').jqxValidator({
        rtl: true,
        hintType: 'label',
        animationDuration: 0,
        rules: [
               //{ input: '#BuildingName', message: 'חובה לציין שם בניין!', action: 'keyup, blur', rule: 'required' },
               {
                   input: '#AreaId', message: 'חובה לציין אזור!', action: 'select', rule: function (input) {
                       var index = $("#AreaId").jqxComboBox('getSelectedIndex');
                       if (index >= 0) { return true; } return false;
                   }
               },
               {
                   input: '#DesignationList', message: 'חובה לציין ייעוד!', action: 'select', rule: function (input) {
                       var items = $("#DesignationList").jqxListBox('getCheckedItems');
                       if (items && items.length > 0)
                           return true;
                       return false;
                   }
               },
               {
                   input: '#OwnerId', message: 'חובה לציין בעלים!', action: 'select', rule: function (input) {
                       var index = $("#OwnerId").jqxComboBox('getSelectedIndex');
                       if (index >= 0) { return true; } return false;
                   }
               },
              //{ input: '#Street', message: 'חובה לציין רחוב!', action: 'keyup, blur', rule: 'required' },
              //{ input: '#StreetNo', message: 'חובה לציין מספר בית!', action: 'keyup, blur', rule: 'required' },
              { input: '#City', message: 'חובה לציין עיר!', action: 'keyup, blur', rule: 'required' }
        ]
    });
};
