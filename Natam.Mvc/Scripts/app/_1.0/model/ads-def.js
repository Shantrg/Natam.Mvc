
//============================================================================================ app_plots_def

function app_ads_def(AdsId, AdsOp, userRole) {

    this.AdsId = AdsId;
    this.AdsOp = AdsOp;
    this.UserRole =  userRole;
    this.allowEdit = userRole==9? 1:0;
    this.isMobile = app.IsMobile();
    this.mediaUploader=null;

    var slf = this;
    // prepare the data
    //this.adsTypeAdapter = app_jqx_list.adsTypeComboAdapter();
  
    if (AdsId <= 0 || this.allowEdit == 0)
        $("#divAdsCode").hide();

    this.loadMediaItems = function () {

        var unitId = $("#PropertyId").val();
        var pt = app_media.propertyTypeToChar($("#PropertyType").val());

        if (this.mediaUploader == null) {
            this.mediaUploader = new media_model('#media-files', { 'buildingId': 0, 'propertyId': unitId, 'propertyType': pt }, true);
            this.mediaUploader.load();
            //slf.mediaUploader = new app_media_uploader('#media-files');
            //slf.mediaUploader.init(0, unitId, pt,true);
        }
    }

    this.loadMediaItems();

    //$("#divAdsCode").prop('disabled', AdsId <= 0 || this.allowEdit == 0);

    $("#AdsDate").jqxDateTimeInput({ formatString: 'dd/MM/yyyy' });
    //$("#Creation").val('');
     
    $('#btnImages').attr("disabled", this.isMobile);

 
    $('#btnImages').click(function (e) {
        e.preventDefault();


        //var unitId = $("#PropertyId").val();
        //var pt = app_media.propertyTypeToChar($("#PropertyType").val());

        //if (slf.mediaUploader == null) {
        //    slf.mediaUploader = new media_model('#media-files', { 'buildingId': 0, 'propertyId': unitId, 'propertyType': pt }, true);
        //    slf.mediaUploader.load();
        //    //slf.mediaUploader = new app_media_uploader('#media-files');
        //    //slf.mediaUploader.init(0, unitId, pt,true);
        //}

        slf.loadMediaItems();
        $('#media-files').toggle();

        //app_popup.mediaEditor(0, unitId, pt);
    });

    $('#btnReloadImages').click(function (e) {
        var id = $("#PropertyId").val();
        if (id > 0) {
            //app_media.loadImages(id);
            if (slf.mediaUploader != null) {
                slf.mediaUploader.doRefresh();
            }
        }

        //if (id > 0)
        //    app_media.loadImages(id);
    });

    $("#form").on('validationSuccess', function () {
        //alert('validationSuccess');
        // Display the Server's Response which came as result of the Form Submit.
        $("#form-iframe").fadeIn('fast');
    });

    $('#reset').on('click', function () {
        $("#form-iframe").html('').fadeOut('fast');
        $("#form-next").html('')
        location.reload();
    });

    var slf = this;

    app_jqx_list.adsPropertyTypeComboAdapter();
    $("#PropertyType").jqxDropDownList({ enableSelection: false });
    $("#PropertyType").val();
    app_jqx_list.adsTypeComboAdapter();
    app_jqx_list.adsStatusComboAdapter();
    if (this.allowEdit == 0) {
        $("#Status").jqxComboBox({ enableSelection: false });
    }

    this.source =
        {
            datatype: "json",
            data: { 'id': AdsId, 'op': AdsOp },
            id: 'AdsId',
            type: 'POST',
            url: '/Crm/GetAds'

        };
    this.dataAdapter = new $.jqx.dataAdapter(this.source, {
        beforeLoadComplete: function (records) {
            setTimeout(function () {
                return records;
            }, 2000);
        },
        loadComplete: function (record) {

            app_jqxform.loadDataForm("form", record);

            $("#AgentName").val(record.AgentName);
            //$("#BuildingName").val(record.BuildingName);
            $("#Address").val(record.Address);

            if (record.MediaType==0)
                $("#MediaType").val('');

            if (record.PropertyId > 0) {
                var pt = app_media.propertyTypeToChar(record.PropertyType);
                app_media.loadImages(record.PropertyId, pt);
            }

            //selectCheckList("AdsTypeList", record.MediaType);

            var disabled = false;
            if (record.Status == 0) {
                disabled = false;
            }
            else if (record.Status > 0) {
                disabled = (slf.allowEdit == 0);
            }
            $("#Status").prop('disabled', disabled);
            if (disabled)
                $("#submit").hide();

            //this.allowEdit = (this.UserRole == 9) ? 1 : 0;

            //if (record.Status > 0) {
            //    this.allowEdit = (this.UserRole == 9) ? 1 : 0;
            //}
            //else {
            //    this.allowEdit = 1;
            //}

            //if (this.allowEdit == 0) {
            //    $("#submit").hide();
            //    //$("#reset").hide();
            //    //$("#archive").hide();
            //    $("#Status").prop('disabled', true);
            //}
            //else {
            //    $("#Status").prop('disabled', false);
            //}
        },
        loadError: function (jqXHR, status, error) {
        },
    });
    // perform data binding.
    this.dataAdapter.dataBind();

    //this.AdsTypeSource =
    //  {
    //      dataType: "json",
    //      async: false,
    //      dataFields: [
    //          { name: 'AdsTypeId' },
    //          { name: 'AdsTypeName' }
    //      ],
    //      type: 'POST',
    //      url: '/Building/GetAdsTypeView'
    //  };
    //this.AdsTypeAdapter = new $.jqx.dataAdapter(this.AdsTypeSource);

    //$("#AdsTypeList").jqxListBox(
    //{
    //    rtl: true,
    //    source: this.AdsTypeAdapter,
    //    width: 240,
    //    height: 120,
    //    checkboxes: true,
    //    displayMember: 'AdsTypeName',
    //    valueMember: 'AdsTypeId'
    //});

    $('#form').jqxValidator({
        rtl: true,
        hintType: 'label',
        animationDuration: 0,
        rules: [
               { input: '#Description', message: 'חובה לציין נוסח מודעה!', action: 'keyup, blur', rule: 'required' },
               //{
               //    input: '#Description', message: 'חובה לציין נוסח מודעה!', action: 'select', rule: function (input) {
               //        var index = $("#AreaId").jqxComboBox('getSelectedIndex');
               //        if (index >= 0) { return true; } return false;
               //    }
               //},
                {
                    input: '#MediaType', message: 'חובה לציין סוג מדיה!', action: 'select', rule: function (input) {
                       var index = $("#MediaType").jqxDropDownList('getSelectedIndex');
                       if (index >= 0) { return true; } return false;
                   }
               }
               //{
               //    input: '#AdsTypeList', message: 'חובה לציין סוג מדיה!', action: 'select', rule: function (input) {
               //        var items = $("#AdsTypeList").jqxListBox('getCheckedItems');
               //        if (items && items.length > 0)
               //            return true;
               //        return false;
               //    }
               //}
               //{
               //    input: '#OwnerId', message: 'חובה לציין בעלים!', action: 'select', rule: function (input) {
               //        var index = $("#OwnerId").jqxComboBox('getSelectedIndex');
               //        if (index >= 0) { return true; } return false;
               //    }
               //}
              //{ input: '#Street', message: 'חובה לציין רחוב!', action: 'keyup, blur', rule: 'required' },
              //{ input: '#StreetNo', message: 'חובה לציין מספר בית!', action: 'keyup, blur', rule: 'required' },
              //{ input: '#City', message: 'חובה לציין עיר!', action: 'keyup, blur', rule: 'required' }
        ]
    });


    this.validateImages = function () {
        
        var propType = $("#PropertyType").val();
        if (propType == 3)
            return true;
        var mu = this.mediaUploader;

        var mediaCount = (mu) ? mu.mediaCount() : 0;

        return mediaCount > 0;

        //var mediaType = $("#MediaType").val();


        //if (mediaType == 1 || mediaType == 3 || mediaType == 4)
        //{
        //    if ($("#media_image0").find('> img').length)
        //        return true;
        //    else if($("#media_image1").find('> img').length)
        //        return true;
        //    else if ($("#media_image2").find('> img').length)
        //        return true;
        //    else
        //        return false;

        //}
        //return true;
    }

    this.doSubmit = function () {
        //e.preventDefault();

        if (!this.validateImages())
        {
            app_dialog.alert("חובה להוסיף תמונה");
            return;
        }
        var actionurl = $('#form').attr('action');
        //renderCheckList("AdsTypeList", "MediaType");
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
                    data: app.serialize('#form'),
                    success: function (data) {
                        app_messenger.Post(data);
                        if (data.Status >= 0) {
                            //window.parent.triggerBuildingComplete(data.OutputId);
                            //$('#form')[0].reset();
                            $('#AdsId').val(data.OutputId);
                            //redirectToFinal("building-ok");
                            //alert(data.Message);
                            //window.history.back();
                            app.redirectTo("/Crm/AdsGrid?id=0&op=agent");
                            //app.redirectTo(document.referrer);
                        }
                        //else
                        //    alert(data.Message);
                    },
                    error: function (jqXHR, status, error) {
                        app_dialog.alert(error);
                    }
                });

            }
        }
        // Validate the Form.
        $('#form').jqxValidator('validate', validationResult);
    };


    this.loadPic = function (tag, value) {
        if (value) {
            var img = $('<img height="60" src="' + value + '"/>');
            $("#" + tag).html(img);
        }
    };

};
