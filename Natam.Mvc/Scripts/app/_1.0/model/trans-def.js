
//============================================================================================ app_plots_def
//public enum TransTypes
//{
//    Buyer = 1,
//    Seller = 2,
//    Advice=3
//}

function app_trans_def(trans_id, trans_type, parent_id, contact_id, userRule) {

    this.TransId = trans_id;
    //this.Id = id;
    this.TransType = trans_type;
    this.ParentId = parent_id;
    this.ContactId = contact_id;
    //this.srcUploadKey;
    this.UserRole = userRule;
    this.allowEdit = (this.UserRole == 9) ? 1 : 0;

    app_jqxform.CreateDateTimeInput("ContractDate");
    app_jqxform.CreateDateTimeInput("DateEndContract");
    app_jqxform.CreateDateTimeInput("DateEndOption1");
    app_jqxform.CreateDateTimeInput("DateEndOption2");

    if ($("#Property_Type").length){
    //if (trans_type == 1 || trans_type == 2) {
        var purposeAdapter = app_jqxcombos.createComboAdapter("PurposeId", "PurposeName", "Property_Type", '/Building/GetPurposeView', 155);
    }

    this.srcAdapter = app_jqx.createDataAdapter("UserId", "DisplayName", '/Common/GetAgentList');

    app_jqxcombos.setComboSourceAdapter("UserId", "DisplayName", "AgentId", this.srcAdapter, 155, 200);
    app_jqxcombos.setComboSourceAdapter("UserId", "DisplayName", "Payment_In_Item_1", this.srcAdapter, 155, 200);
    app_jqxcombos.setComboSourceAdapter("UserId", "DisplayName", "Payment_In_Item_2", this.srcAdapter, 155, 200);
    app_jqxcombos.setComboSourceAdapter("UserId", "DisplayName", "Payment_In_Item_3", this.srcAdapter, 155, 200);
    app_jqxcombos.setComboSourceAdapter("UserId", "DisplayName", "Payment_In_Item_4", this.srcAdapter, 155, 200);

    this.loadControls();

    this.loadEvents();

    this.loadDataAdapter = function () {

        var slf = this;

        // prepare the data
        var source =
        {
            datatype: "json",
            id: 'TransId',
            type: 'POST',
            url: '/Crm/GetTransaction'
        };

        source.data = { 'id': slf.TransId, 'trans_type': slf.TransType, 'parent_id': slf.ParentId, 'contact_id': slf.ContactId };

        var dataAdapter = new $.jqx.dataAdapter(source, {
            loadComplete: function (record) {

                app_jqxform.loadDataForm("form", record);

                slf.TransId = record.TransId;
                slf.TransType = record.TransType;
                

                if (record.Trans_Status == 3) {
                    $("#submit").hide();
                    $("#reset").hide();
                    $("#cancel").hide();
                    $("#spn_cancel").text(" - מבוטל");
                }
                else if (app.toInt(slf.TransId, 0) > 0) {

                    if (slf.UserRole == 9) {
                        $("#submit").show();
                        $("#reset").show();
                        $("#cancel").show();
                    }
                    else {
                        $("#submit").hide();
                        $("#reset").hide();
                        $("#cancel").hide();
                    }
                }
                else {
                    $("#print").hide();
                    $("#cancel").hide();
                }

                //srcUploadKey = record.UploadKey;
                $("#AgentId").jqxComboBox({ disabled: true });
                $("#ContractDate").val(formatJsonShortDate(record.ContractDate));
                $("#DateEndContract").val(formatJsonShortDate(record.DateEndContract));
                $("#DateEndOption1").val(formatJsonShortDate(record.DateEndOption1));
                $("#DateEndOption2").val(formatJsonShortDate(record.DateEndOption2));
                //selectComboBoxValue("Property_Type", record.Property_Type);
                //sum_RentValue();
                //sum_SaleValue();
                slf.sum_Value_Total();
            },
            loadError: function (jqXHR, status, error) {
            },
            beforeLoadComplete: function (records) {

            }
        });
        // perform data binding.
        dataAdapter.dataBind();
    };

    this.sum_Value_Total = function () {
        var slf = this;
        var sumSale = slf.sum_SaleValue();
        var sumRent = slf.sum_RentValue();

        $('#TotalSaleValue').val(sumSale);
        $('#TotalRentValue').val(sumRent);
        $('#TotalValue').val(sumSale + sumRent);
    };

    this.sum_RentValue =function () {
        return app.toFloat($('#Value_Rent_Total').val(), 0) +
        app.toFloat($('#Value_Rent_Park_Total').val(), 0);
    };

    this.sum_SaleValue =function () {
        return app.toFloat($('#Value_Sale_Total').val(), 0) +
        app.toFloat($('#Value_Sale_Park_Total').val(), 0);
    };

    this.validatePercentSum = function () {
        var sum = app.toInt($('#Payment_In_Percent_4').val(), 0) +
            app.toInt($('#Payment_In_Percent_3').val(), 0) +
            app.toInt($('#Payment_In_Percent_2').val(), 0) +
            app.toInt($('#Payment_In_Percent_1').val(), 0)
        if (sum > 100) {
            alert("סכום העמלות עולה על 100 אחוז.");
            return false;
        }
        return true;
    };
};

app_trans_def.prototype.loadControls = function () {

    var slf=this;

    $("form").submit(function (e) {
           
        e.preventDefault();
        
        $("#TransType").val(slf.TransType);

        if (confirm("האם לעדכן?") == false)
            return

        if (!slf.validatePercentSum()) {

            return;
        }

        //var name = $("#CustomerName").val();

        //if (name.length > 0) {
        //    $("#ValidateResult").val("");
        //    validateLeadAccountName(name, "ValidateResult", false);
        //    if ($("#ValidateResult").val() == "false")
        //        return;
        //}
        var actionurl = $('#form').attr('action');

        var validationResult = function (isValid) {

            if (isValid) {
                $.ajax({
                    url: actionurl,
                    type: 'post',
                    dataType: 'json',
                    data: app.serialize('#form'),
                    success: function (data) {
                        alert(data.Message);
                        if (data.Status >= 0) {
                            //window.parent.triggerBuildingComplete(data.OutputId);
                            //$('#form')[0].reset();
                            app_rout.redirectToTrans(data.OutputId, slf.TransType);
                        }

                    },
                    error: function (jqXHR, status, error) {
                        alert(error);
                    }
                });
            }
            else
                $('#linkA').trigger('click');
        }
        // Validate the Form.
        $('#form').jqxValidator('validate', validationResult);

    });

    $('#cancel').on('click', function () {

        //var slf = this;

        //e.preventDefault();
        if (!slf.validatePercentSum()) {
            return;
        }

        if (confirm("האם לבטל דוח עסקה?") == false)
            return

        var actionurl = "/Crm/CancelTransaction";
        var transId = $("#TransId").val();
        $.ajax({
            url: actionurl,
            type: 'post',
            dataType: 'json',
            data: { 'transId': transId },
            success: function (data) {
                alert(data.Message);
                if (data.Status >= 0) {
                    app_rout.redirectToTrans(transId, slf.TransType);
                }

            },
            error: function (jqXHR, status, error) {
                alert(error);
            }
        });

    });

    //$("#form").on('validationSuccess', function () {
    //    // Display the Server's Response which came as result of the Form Submit.
    //    $("#form-iframe").fadeIn('fast');
    //});

    $('#reset').on('click', function () {
        //$("#form-iframe").html('').fadeOut('fast');
        //$("#form-next").html('')
        location.reload();
    });

    $('#print').on('click', function () {
        window.print();
    });
    
};

app_trans_def.prototype.loadEvents = function () {

    var slf = this;

    //rent property
    $('#Value_Rent_Size').keyup(function () {
        calc_Value_Rent_Total();
    });
    $('#Value_Rent_Price').keyup(function () {
        calc_Value_Rent_Total();
    });
    $('#Value_Rent_Period').keyup(function () {
        calc_Value_Rent_Total();
    });

    function calc_Value_Rent_Total() {
        $('#Value_Rent_Total').val(
        app.toFloat($('#Value_Rent_Size').val(), 0) *
        app.toFloat($('#Value_Rent_Price').val(), 0) *
        app.toFloat($('#Value_Rent_Period').val(), 0)
        );
        slf.sum_Value_Total();
    };

    //rent park
    $('#Value_Rent_Park_No').keyup(function () {
        calc_Value_Rent_Park_Total();
    });
    $('#Value_Rent_Park_Price').keyup(function () {
        calc_Value_Rent_Park_Total();
    });
    $('#Value_Rent_Park_Period').keyup(function () {
        calc_Value_Rent_Park_Total();
    });
    function calc_Value_Rent_Park_Total() {
        $('#Value_Rent_Park_Total').val(
       app.toFloat($('#Value_Rent_Park_No').val(), 0) *
       app.toFloat($('#Value_Rent_Park_Price').val(), 0) *
       app.toFloat($('#Value_Rent_Park_Period').val(), 0)
       );
        slf.sum_Value_Total();
    };

    //Sale property
    $('#Value_Sale_Size').keyup(function () {
        calc_Value_Sale_Total();
    });
    $('#Value_Sale_Price').keyup(function () {
        calc_Value_Sale_Total();
    });
    //$('#Value_Sale_Period').keyup(function () {
    //    calc_Value_Sale_Total();
    //});

    function calc_Value_Sale_Total() {
        $('#Value_Sale_Total').val(
        app.toFloat($('#Value_Sale_Size').val(), 0) *
        app.toFloat($('#Value_Sale_Price').val(), 0)
        //toFloat($('#Value_Sale_Period').val(), 0)
           );
        slf.sum_Value_Total();
    };


    //Sale park
    $('#Value_Sale_Park_No').keyup(function () {
        calc_Value_Sale_Park_Total();
    });
    $('#Value_Sale_Park_Price').keyup(function () {
        calc_Value_Sale_Park_Total();
    });
    //$('#Value_Sale_Park_Period').keyup(function () {
    //    calc_Value_Sale_Park_Total();
    //});
    function calc_Value_Sale_Park_Total() {
        $('#Value_Sale_Park_Total').val(
     app.toFloat($('#Value_Sale_Park_No').val(), 0) *
     app.toFloat($('#Value_Sale_Park_Price').val(), 0)
     //toFloat($('#Value_Sale_Park_Period').val(), 0)
     );
        slf.sum_Value_Total();
    };


    $('#ComissionNet').keyup(function () {
        sum_Payment(false);
    });

    $('#Payment_Ex_Net').keyup(function () {
        //calc_Payment_Ex_Net();
        sum_Payment(true);
    });

    $('#Payment_Ex_Percent').keyup(function () {
        //calc_Payment_Ex_Net();
        sum_Payment(false);
    });

    function sum_Payment(isnet) {
        calc_Payment_Ex_Net(isnet);
        calc_Payment_In_Net_1();
        calc_Payment_In_Net_2();
        calc_Payment_In_Net_3();
        calc_Payment_In_Net_4();
    };

    function calc_Payment_Ex_Net(isnet) {
        if (isnet) {
            if ($('#ComissionNet').val() > 0) {
                $('#Payment_Ex_Percent').val(
                (app.toFloat($('#Payment_Ex_Net').val(), 0) /
                app.toFloat($('#ComissionNet').val(), 0))*100
                );
            }
        }
        else {
            $('#Payment_Ex_Net').val(
           app.toFloat($('#ComissionNet').val(), 0) *
           app.toFloat($('#Payment_Ex_Percent').val(), 0) / 100
           );
        }
    };

    $('#Payment_In_Percent_1').keyup(function () {
        calc_Payment_In_Net_1();
        slf.validatePercentSum();
    });

    function calc_Payment_In_Net_1() {
        $('#Payment_In_Net_1').val(
        (app.toFloat($('#ComissionNet').val(), 0) - app.toFloat($('#Payment_Ex_Net').val(), 0)) *
        app.toFloat($('#Payment_In_Percent_1').val(), 0) / 100
        );
    };

    $('#Payment_In_Percent_2').keyup(function () {
        calc_Payment_In_Net_2();
        slf.validatePercentSum();
    });

    function calc_Payment_In_Net_2() {
        $('#Payment_In_Net_2').val(
        (app.toFloat($('#ComissionNet').val(), 0) - app.toFloat($('#Payment_Ex_Net').val(), 0)) *
        app.toFloat($('#Payment_In_Percent_2').val(), 0) / 100
        );
    };

    $('#Payment_In_Percent_3').keyup(function () {
        calc_Payment_In_Net_3();
        slf.validatePercentSum();
    });

    function calc_Payment_In_Net_3() {
        $('#Payment_In_Net_3').val(
        (app.toFloat($('#ComissionNet').val(), 0) - app.toFloat($('#Payment_Ex_Net').val(), 0)) *
        app.toFloat($('#Payment_In_Percent_3').val(), 0) / 100
        );
    };

    $('#Payment_In_Percent_4').keyup(function () {
        calc_Payment_In_Net_4();
        slf.validatePercentSum();
    });

    function calc_Payment_In_Net_4() {
        $('#Payment_In_Net_4').val(
        (app.toFloat($('#ComissionNet').val(), 0) - app.toFloat($('#Payment_Ex_Net').val(), 0)) *
        app.toFloat($('#Payment_In_Percent_4').val(), 0) / 100
        );
    };
};
