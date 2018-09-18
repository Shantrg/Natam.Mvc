
//============================================================================================ app_plots_def

function app_plots_def(plotsId, userInfo) {

    this.PlotsId = plotsId;
    this.UserId = userInfo.UserId;
    this.UserRole = userInfo.UserRole;
    this.allowEdit = 0;
    this.srcDesignation;
    this.srcOwnerId;
    this.srcAreaId;
    this.srcStreetId;
    this.srcCityCode;
    this.allowEdit = (this.UserRole == 9) ? 1 : 0;
    this.isMobile = app.IsMobile();
    this.mediaUploader = null;
    //this.mediaUploader = new media_model('#media-files', { 'buildingId': this.PlotsId, 'propertyId': this.PlotsId, 'propertyType': "p" }, this.allowEdit == 0).mediaFiles();
    var slf = this;

    

    //$('#btnImages').attr("disabled", this.isMobile || plotsId <= 0);
    $("#hImages").css('display', this.PlotsId > 0 ? 'block' : 'none');
    if (plotsId==0)
    {
        $("#ads").hide();
        app_lookups.setInput("form", "AgentId", slf.UserId);
        //$("#AgentId").val(userInfo.UserId);
        //$("#AgentName").val(userInfo.UserName);
    }

    //app_jqx_list.ownerTypeComboAdapter();
    app_select.OwnerType();

    $('#reset').on('click', function () {
        //$("#form-iframe").html('').fadeOut('fast');
        //$("#form-next").html('')
        location.reload();
    });


    $('#ads').click(function (e) {
        app_rout.redirectToAdsDef(slf.PlotsId, "p");
    });
   
    //======================== events


    $('#queryOwner').click(function (e) {
        e.preventDefault();
        app_popup.ownerGrid();
    });

    $('#showOwner').click(function (e) {
        e.preventDefault();
        var item = $("#OwnerId").val();
        if (item && item.value != 0)
            app_accounts.accountDisplay(item.value, "בעלים");
    });

    $('#refreshOwner').click(function () {
        var item = $("#OwnerId").val();
        app_jqx_combo_async.ownerInputAdapter("#OwnerId", item.value);
    });

    $('#editOwner').click(function (e) {
        e.preventDefault();
        var item = $("#OwnerId").val();
        var val = (item && item.value != 0) ? item.value : 0;
        app_accounts.accountPanel(item.value, 2, "OwnerId");
    });

    // prepare the data
    $("form").submit(function (e) {
        e.preventDefault();
        slf.doSubmit();

    });
    //==============================

    this.addresssModel = new app_addres_model();

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
                    slf.loadControls(record);

                },
                loadError: function (jqXHR, status, error) {
                },
            });
            // perform data binding.
            this.dataAdapter.dataBind();
        }
    };

    if (this.PlotsId > 0) {
        this.loadDataAdapter();
    }
    else {
        this.loadControls();
    }

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
                    data: app.serialize('#form'),
                    success: function (data) {

                        app_messenger.Post(data);

                        if (data.Status >= 0) {
                            //window.parent.triggerBuildingComplete(data.OutputId);
                            //$('#form')[0].reset();
                            $('#PlotsId').val(data.OutputId);
                            //app_messenger.Post(data);

                            //app_jqxnotify.notify(data);

                            //redirectToFinal("building-ok");
                            app.redirectTo("/Building/PlotsGrid");
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

  
};

app_plots_def.prototype.syncData = function (record) {

    var slf = this;

    if (record.PlotsId > 0) {

        app_form.loadDataForm("form", record,["OwnerId", "CityCode", "StreetId"]);

        this.srcDesignation = record.Designation;
        this.srcOwnerId = record.OwnerId;
        this.srcAreaId = record.AreaId;
        this.srcStreetId = record.StreetId;
        this.srcCityCode = record.CityCode;

        //srcPlotsId = record.PlotsId;

        //app_accounts.getAgentName(record.AgentId, 'AgentName');

        app_jqxcombos.selectCheckList("DesignationList", record.Designation);

        this.allowEdit = (this.UserId == record.AgentId || this.UserRole == 9) ? 1 : 0;
        this.mediaUploader = new media_model('#media-files', { 'buildingId': this.PlotsId, 'propertyId': this.PlotsId, 'propertyType': "p" }, this.allowEdit == 0).mediaFiles();
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

app_plots_def.prototype.loadControls = function (record) {


    if (record) {
        if (record.CityCode > 0)
            this.addresssModel.SetCityValue(record.CityCode);// app_jqx_adapter.setInputAdapterValue("#CityCode", record.CityCode);
        if (record.StreetId > 0)
            this.addresssModel.SetStreetValue(record.CityCode, record.StreetId);
        //app_jqx_adapter.setInptValue("#StreetId", record.StreetId, record.StreetName,true);

        app_jqx_combo_async.ownerInputAdapter("#OwnerId", record.OwnerId);
    }
    else
    {
        app_jqx_combo_async.ownerInputAdapter("#OwnerId");
    }
    


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
    this.designationAdapter = new $.jqx.dataAdapter(this.designationSource, {
        loadComplete: function (data) {
            if (record)
                app_jqxcombos.selectCheckList("DesignationList", record.Designation, "Designation");
        },
        loadError: function (jqXHR, status, error) {
        },
    });

    $("#DesignationList").jqxListBox(
    {
        rtl: true,
        source: this.designationAdapter,
        width: 240,
        height: 180,
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
               { input: '#OwnerId', message: 'חובה לציין בעלים עיקריים!', action: 'keyup, blur', rule: 'required' },
               { input: '#CityCode', message: 'חובה לציין עיר!', action: 'keyup, blur', rule: 'required' },
               { input: '#StreetId', message: 'חובה לציין רחוב!', action: 'keyup, blur', rule: 'required' },

               //{
               //    input: '#OwnerId', message: 'חובה לציין בעלים!', action: 'select', rule: function (input) {
               //        var index = $("#OwnerId").jqxComboBox('getSelectedIndex');
               //        if (index >= 0) { return true; } return false;
               //    }
               //},
              //{ input: '#Street', message: 'חובה לציין רחוב!', action: 'keyup, blur', rule: 'required' },
              //{ input: '#StreetNo', message: 'חובה לציין מספר בית!', action: 'keyup, blur', rule: 'required' },
              //{ input: '#City', message: 'חובה לציין עיר!', action: 'keyup, blur', rule: 'required' }
                //{
                //    input: '#StreetId', message: 'חובה לציין רחוב!', action: 'select', rule: function (input) {
                //        var index = $("#StreetId").jqxComboBox('getSelectedIndex');
                //        if (index >= 0) { return true; } return false;
                //    }
                //},
                //{
                //         input: '#CityCode', message: 'חובה לציין עיר!', action: 'select', rule: function (input) {
                //             var index = $("#CityCode").jqxComboBox('getSelectedIndex');
                //             if (index >= 0) { return true; } return false;
                //         }
                //}
        ]
    });
};


app_trigger = {

    triggerAccComplete: function (accType, accId) {
        app_jqx_combo_async.ownerInputAdapter("#OwnerId", accId);

        //$("#OwnerId").jqxComboBox("source").dataBind();
        //if (accId)
        //    $("#OwnerId").val(accId);

        app_iframe.panelSwitchClose("OwnerId");
        //app_dialog.dialogIframClose();
    },
    triggerAccCancel: function () {
        app_iframe.panelSwitchClose("OwnerId", false);
    },
    triggerImageChanged: function () {
        var id = currentDef.PlotsId;
        app_media.loadImages(id, 'p');
    }
};



app_plots_control = function (tagDiv) {

    //this.entityDef;
    this.Model;
    this.tagDiv = tagDiv;

    this.init = function (model, userInfo) {//id, acctype,role

        //if (currentDef == null) {

        var slf = this;

        this.Model = model;
        this.load();
        currentDef = new app_plots_def(model.Id, model.UserInfo);
        //this.entityDef.loadDataAdapter();
    };

    this.load = function () {

        var html = (function () {/*
               <div class="global-view">
    <div id="wizard" class="row_link"></div>
    <div class="container-box">
        <div class="box-title">
            <h3 id="hBuildingName">הגדרת מגרש</h3>
        </div>
        <div class="section-table">
            <div class="panel-area">
                <div class="panel-area-title"><h3 id="hImages" class="rtl right"><a id="btnImages" href="#">תמונות</a></h3></div>
                <div id="media-files"></div>
            </div>
            <form class="form" id="form" method="post" action="/Building/UpdatePlots">
                <input type="hidden" id="Designation" name="Designation" />
                <input type="hidden" id="Creation" name="Creation" />
                <div class="panel-area">
                    <div class="panel-area-title">פרטי מגרש</div>
                    <div class="section-table">
                        <div class="section-cell">
                            <div class="form-group">
                                <label class="column">
                                    קוד מגרש:
                                </label>
                                <input id="PlotsId" type="number" name="PlotsId" class="number" readonly="true" />
                            </div>
                            <div class="form-group">
                                <label class="column">
                                    ייעוד<span class="mandatory">(*)</span>:
                                </label>
                                <div id="DesignationList" name="DesignationList" style="padding: 10px" data-type="checklist">
                                </div>
                            </div>
                        </div>
                        <div class="section-cell">
                            <div class="form-group">
                                <label class="column">
                                    שם האזור<span class="mandatory">(*)</span>:
                                </label>
                                <div id="AreaId" name="AreaId">
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="column">
                                    עיר<span class="mandatory">(*)</span>:
                                </label>
                                <input type="text" id="CityCode" name="CityCode" /><i class="fa fa-search"></i>
                            </div>
                            <div class="form-group">
                                <label class="column">
                                    רחוב<span class="mandatory">(*)</span>:
                                </label>
                                <input type="text" id="StreetId" name="StreetId" /><i class="fa fa-search"></i>
                            </div>
                            <div class="form-group">
                                <label class="column">
                                    מס' בית:
                                </label>
                                <input id="StreetNo" name="StreetNo" type="text" maxlength="10" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="panel-area">
                    <div class="panel-area-title">פרטי בעלים</div>
                    <div class="form-group">
                        <label class="column">
                            בעלים<span class="mandatory">(*)</span>:
                            <a id="showOwner" href="#">הצג</a>|
                            <a id="refreshOwner" href="#">רענן</a>|
                            <a id="queryOwner" href="#">איתור</a>|
                            <a id="editOwner" href="#">עריכה</a>
                        </label>
                        <input type="text" id="OwnerId" name="OwnerId" /><i class="fa fa-search"></i>
                    </div>
                    <div class="form-group">
                        <label class="column">
                            סוג בעלות<span class="mandatory">(*)</span>:
                        </label>
                        <select id="OwnerType" name="OwnerType"></select>
                    </div>
                </div>
                <div class="panel-area">
                    <div class="panel-area-title">פרטי חלקה</div>
                    <div class="section-table">
                        <div class="section-cell">
                            <div class="form-group">
                                <label class="column">
                                    גוש:
                                </label>
                                <input id="Bloc" name="Bloc" type="text" maxlength="250" />
                            </div>
                            <div class="form-group">
                                <label class="column">
                                    חלקה:
                                </label>
                                <input id="Lot" name="Lot" type="text" maxlength="250" />
                            </div>
                            <div class="form-group">
                                <label class="column">
                                    זכויות בניה:
                                </label>
                                <input id="Rights" name="Rights" type="text" maxlength="250" />
                            </div>
                        </div>
                        <div class="section-cell">
                            <div class="form-group">
                                <label class="column">
                                    תב"ע:
                                </label>
                                <input id="Taba" name="Taba" type="text" maxlength="250" />
                            </div>
                            <div class="form-group">
                                <label class="column">
                                    שטח במ"ר":
                                </label>
                                <input id="Size" name="Size" type="number" step="any" class="number" />
                            </div>
                            <div class="form-group">
                                <label class="column">
                                    מחיר לדונם:
                                </label>
                                <input id="Price" name="Price" type="number" step="any" class="number" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="panel-area">
                    <div class="panel-area-title">הערות</div>
                    <div class="form-group">
                        <label class="column">
                            מועד עדכון:
                        </label>
                        <input id="LastUpdate" name="LastUpdate" readonly type="text" class="text" />
                    </div>
                    <div class="form-group">
                        <label class="column">
                            סוכן:
                        </label>
                        <input type="hidden" name="AgentId" data-type="lookup" />
                        <input id="AgentId" type="text" readonly="readonly" />
                    </div>
                    <div class="form-group">
                        <label class="column">
                            הערות:
                        </label>
                        <textarea id="Memo" name="Memo" style="width:99%;height:60px"></textarea>
                    </div>
                    <div style="height: 10px"></div>
                </div>
                <div class="panel-area">
                    <input id="submit" type="submit" value="עדכון" class="btn-default btn2" />
                    <input id="control-cancel" type="button" value="x" class="btn-default btn2" />
                    <input id="reset" type="reset" value="רענון" class="btn-default btn2" />
                    <input id="ads" type="button" value="פרסום" class="btn-default btn2" />
                </div>

                <span dir="rtl" class="mandatory">שדות חובה(*)</span>
            </form>
        </div>
    </div>    
 </div>*/}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1];

        var container = $(html);
        $(this.tagDiv).empty();
        $(this.tagDiv).append(container);

        $('#control-cancel').click(function () {
            wizard.wizHome();
        });
    };
    this.display = function () {
        $(this.tagDiv).show();
    };
    this.hide = function () {
        $(this.tagDiv).hide();
    };
    this.update = function (callback) {
        if (this.accDef != null) {
            currentDef.doSubmit(callback);
        }
        return false;
    };

};

//============================================================================================ app_scheduler_def





