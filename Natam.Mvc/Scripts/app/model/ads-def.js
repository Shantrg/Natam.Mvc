
//============================================================================================ app_ads_def

function app_ads_def(AdsId, AdsOp, userRole) {

    this.AdsId = AdsId;
    this.AdsOp = AdsOp;
    this.UserRole =  userRole;
    this.allowEdit = userRole==9? 1:0;
    this.isMobile = app.IsMobile();
    this.mediaUploader=null;
    var slf = this;
  
    if (AdsId <= 0 || this.allowEdit == 0)
        $("#divAdsCode").hide();

    this.loadMediaItems = function (async) {

        var unitId = $("#PropertyId").val();
        var pt = app_media.propertyTypeToChar($("#PropertyType").val());

        if (this.mediaUploader == null) {
            this.mediaUploader = new media_model('#media-files', { 'buildingId': 0, 'propertyId': unitId, 'propertyType': pt }, true);
            this.mediaUploader.load(async);
        }
    }

    $("#AdsDate").jqxDateTimeInput({ formatString: 'dd/MM/yyyy', rtl:true, width:150 });
    $('#btnImages').attr("disabled", this.isMobile);
 
    $('#btnImages').click(function (e) {
        e.preventDefault();
        slf.loadMediaItems(true);
        $('#media-files').toggle();
    });

    $('#btnReloadImages').click(function (e) {
        var id = $("#PropertyId").val();
        if (id > 0) {
            //app_media.loadImages(id);
            if (slf.mediaUploader != null) {
                slf.mediaUploader.doRefresh();
            }
        }
    });
    

    $("#form").on('validationSuccess', function () {
        // Display the Server's Response which came as result of the Form Submit.
        $("#form-iframe").fadeIn('fast');
    });

    $('#reset').on('click', function () {
        $("#form-iframe").html('').fadeOut('fast');
        $("#form-next").html('')
        location.reload();
    });

    var slf = this;

    //app_jqx_list.adsPropertyTypeComboAdapter();
    //app_select.AdsPropertyType();
    //$("#PropertyType").jqxDropDownList({ enableSelection: false });
    //$("#PropertyType").val();

    //app_jqx_list.adsTypeComboAdapter();
    app_select.AdsTypeJqx();
    $('#MediaType').on('select', function (event) {
        var args = event.args;
        var item = $('#MediaType').jqxDropDownList('getItem', args.index);
        switch (item.value) {
            case "2":
            case "3":
            case "4":
                $('#MediaType-yad2').show();
                break;
            default:
                $('#MediaType-yad2').hide();
                break;
        }
        // var item = $('#jqxDropDownList').jqxDropDownList('getItem', args.index);
        // if (item != null) {
        //     //Selected: ' + item.label;
        //}
    });

    //app_jqx_list.adsStatusComboAdapter();
    app_select.AdsStatus("form", "#Status");

    //if (this.allowEdit == 0) {
    //    $("#Status").attr('disabled', 'disabled');
    //    //$("#Status").jqxComboBox({ enableSelection: false });
    //}

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

            app_form.loadDataForm("form", record);

            $("#AgentName").val(record.AgentName);
            $("#Address").val(record.Address);

            app_select.AdsPropertyType("#PropertyType", record.PropertyType, "form");

            var mediaType = record.MediaType;
            if (record.MediaType==0)
                $("#MediaType").val('');
            else if(mediaType===2 || mediaType===3 || mediaType===4)
            {
                $("#MediaType-yad2").show();
            }

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

            if (record.PropertyId > 0) {
                var pt = app_media.propertyTypeToChar(record.PropertyType);
                slf.loadMediaItems(true);
            }
        },
        loadError: function (jqXHR, status, error) {
        },
    });
   
    this.dataAdapter.dataBind();

   
    $('#form').jqxValidator({
        rtl: true,
        hintType: 'label',
        animationDuration: 0,
        rules: [
               { input: '#Description', message: 'חובה לציין נוסח מודעה!', action: 'keyup, blur', rule: 'required' },
                {
                    input: '#MediaType', message: 'חובה לציין סוג מדיה!', action: 'select', rule: function (input) {
                        //return $("#MediaType").val() > 0;
                       var index = $("#MediaType").jqxDropDownList('getSelectedIndex');
                       if (index >= 0) { return true; } return false;
                   }
               }
        ]
    });


    this.validateImages = function () {
        
        //var propType = $("#PropertyType").val();
        //if (propType == 3)
        //    return true;

        var purpose = $("#PurposeId").val();
        if (purpose == 2) {


            this.loadMediaItems(false);
            var mu = this.mediaUploader;
            var mediaCount = (mu) ? mu.mediaCount() : 0;

            /*
            AdsTypeId	AdsTypeName
            1	אתר החברה
            2	יד2-רגיל
            3	יד2-צהוב
            4	יד2-ורוד
            5	גלובס
            6	דה מרקר
            7	שילוט
            */


            var mediaType = $("#MediaType").val();
            if ((mediaType === "1" || mediaType === "3" || mediaType === "4") && mediaCount == 0)
                return false;
            else
                return true;

            //return mediaCount > 0;
        }
        else
        {
            return true;
        }
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
                            $('#AdsId').val(data.OutputId);
                            app.redirectTo("/Crm/AdsGrid?id=0&op=agent");
                        }
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
