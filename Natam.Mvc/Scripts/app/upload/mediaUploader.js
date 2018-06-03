

function mediaUploader(buildingId, propertyId, propertyType) {


    var mediaSource =
    {
        dataType: "json",
        dataFields: [
            { name: 'MediaId', type: 'number' },
            { name: 'PropertyId', type: 'number' },
            { name: 'BuildingId', type: 'number' },
            { name: 'MediaType', type: 'string' },
            { name: 'PropertyType', type: 'string' },
            { name: 'MediaPath', type: 'string' }
        ],
        id: 'MediaId',
        type: 'POST',
        data: { 'buildingId': buildingId, 'propertyId': propertyId, 'propertyType': propertyType },
        url: '/Building/GetMediaView'
    };
    var mediaAdapter = new $.jqx.dataAdapter(mediaSource);
    $("#MediaList").jqxListBox(
    {
        rtl: true,
        source: mediaAdapter,
        width: '100%',
        height: '100%',
        checkboxes: false,
        displayMember: 'MediaPath',
        valueMember: 'MediaId',
        selectedIndex: 0,
        itemHeight: 70,
        renderer: function (index, label, value) {
            //var datarecord = mediaAdapter[index];
            var icon= getImgTumb(label);
            var table = '<table style="min-width: 130px;"><tr><td style="width: 40px;padding:8px;" rowspan="2">' + icon + '</td><td>Media Id : ' + value + '</td></tr><tr><td>Unit Id :' + propertyId + '</td></tr></table>';
            return table;
        }
    });

    $('#MediaList').on('select', function (event) {
        updatePanel(event.args.item);
        //$("#fileremove").prop('disabled', false);
        $("#spnRemove").show();
    });

    $("#fileremove").on('click', function (event) {
        //e.preventDefault();
        var mediaId = $('#uploadMid').val();
        if (confirm("האם למחוק? קובץ " + mediaId)) {
            doRemove();
        }
    });

    //var getMediaType = function (t) {
    //    switch (t) {
    //        case 'p':
    //            return 'photo';
    //        case 'v':
    //            return 'video';
    //    }
    //    return 'photo';
    //};
    var getPropertyType = function (t) {
        switch (t) {
            case 'u':
                return 'Unit';
            case 'b':
                return 'Building';
            case 'p':
                return 'Plots';
        }
        return 'Property';
    };
    function getImgUrl(mediaType, picUrl) {
        if (mediaType == 'img')
            return '/Uploads/img' + '/' + picUrl;
        else if (mediaType == 'video')
            return '/Uploads/img' + '/' + picUrl;
        else if (mediaType == 'doc')
            return '/Uploads/doc' + '/' + picUrl;
        else
            return picUrl;
    };

    function getImgTumb(picUrl) {
        var mediaType = getMediaType(picUrl);
        return getImgMediaTumb(mediaType, picUrl);
    };

    function getImgMediaTumb(mediaType, picUrl) {
        var imgurl;
        var imgtumb;
        if (mediaType == 'img') {
            imgurl = '/Uploads/img' + '/' + picUrl;
            //imgtumb = $('<a class="group1" href="' + imgurl + '"><img src="' + imgurl + '" style="max-width:80px; height:auto;"/></a>').colorbox({ rel: 'group1' });
            //imgtumb = '<a class="group1" href="' + imgurl + '"><img src="' + imgurl + '" style="max-width:80px; height:auto;"/></a>';
            imgtumb = '<img src="' + imgurl + '" style="max-width:80px; height:auto;"/>'

        }
        else if (mediaType == 'video') {
            imgurl = '/Images/video-small.jpg'; //'/Uploads/img' + '/' + picUrl;
            imgtumb = '<img src="' + imgurl + '" style="max-width:80px; height:auto;"/>'
        }
        else if (mediaType == 'doc') {
            imgurl = '/Images/doc-small.jpg';
            imgtumb = '<img src="' + imgurl + '" style="max-width:80px; height:auto;"/>';
        }
        else if (mediaType == 'link') {
            imgurl = '/Images/link-small.jpg';
            imgtumb = '<span><img src="' + imgurl + '" style="max-width:80px; height:auto;"/>';
        }
        else {
            imgurl = '/Images/none-small.jpg';
            imgtumb = '<img src="' + imgurl + '" style="max-width:80px; height:auto;"/>';

        }
        return imgtumb;
    };

    function getImgTag(mediaType, picUrl) {

        var imgurl;
        var imgtag;
        var imgtumb;

        if (mediaType == 'img') {
            imgurl = '/Uploads/img' + '/' + picUrl;
            imgtag = $('<div style="margin: 10px;"><b>תמונה:</b><br/></div><div style="margin: 10px;overflow:auto;"><img src="' + imgurl + '"/></div>');
        }
        else if (mediaType == 'video') {
            imgurl = '/Uploads/img' + '/' + picUrl;
            imgtumb=getImgMediaTumb(mediaType, picUrl);
            imgtag = $('<div style="margin: 10px;"><b>וידאו:</b><br/></div><div style="margin: 10px;overflow:auto;"><img src="' + imgurl + '"/></div>');
        }
        else if (mediaType == 'doc') {
            imgurl = '~/Uploads/doc' + '/' + picUrl;
            imgtumb = getImgMediaTumb(mediaType, picUrl);
            imgtag = $('<div style="margin: 10px;"><b>מסמך:</b><br/></div><div><a href="' + imgurl + '">' + imgtumb + '</a></div>');
        }
        else if (mediaType == 'link') {
            imgtumb = getImgMediaTumb(mediaType, picUrl);
            imgtag = $('<div style="margin: 10px;"><b>קישור:</b><br/></div><div><a href="' + picUrl + '">' + imgtumb + '</a></div>');
        }
        else {
            imgtumb = getImgMediaTumb(mediaType, picUrl);
            imgtag = $('<div style="margin: 10px;"><b>קישור:</b><br/></div><div><a href="' + picUrl + '">' + imgtumb + '</a></div>');

        }
        return imgtag;

        //return '<div style="margin: 10px;overflow:auto;"><img src="' + getImgUrl(mediaType,picUrl) + '"/></div>';
    };

    function getFileExtension(filename) {
        return filename.split('.').pop();
    };
    function getMediaType(filename) {
        if (filename.substr(0, 4) == 'http')
            return 'link';
        var extension = getFileExtension(filename);
        switch (extension.toLowerCase()) {
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
            case 'tif':
                return 'img';
            case 'mp4':
            case 'avi':
                return 'video';
            case 'pdf':
            case 'doc':
            case 'docx':
            case 'xls':
            case 'xlsx':
            case 'txt':
                return 'doc';

        }
        return "none";
    };
    var updatePanel = function (item) {

        //var datarecord = data[index];

        var mediaId = item.value;
        var picUrl = item.label;
        var mediaType = getMediaType(picUrl);


        $('#uploadMid').val(mediaId);
        $('#uploadMtype').val(mediaType);
        $('#uploadPath').val(picUrl);

        var container = $('<div style="margin: 5px;"></div>')
        //container.append("<div style='margin: 10px;'><b>קוד מדיה:</b> " + mediaId + "</div>");
        //container.append("<div style='margin: 10px;'><b>קוד נכס:</b> " + @propertyId + "</div>");
        //container.append("<div style='margin: 10px;'><b>קוד בניין:</b> " + @buildingId + "</div>");
        //container.append("<div style='margin: 10px;'><b>סוג מדיה:</b> " + getMediaType(mediaType) + "</div>");
        //container.append("<div style='margin: 10px;'><b>סוג נכס:</b> " + getPropertyType('@propertyType') + "</div>");

        //container.append("<input type='button' value='הסרת קובץ' onclick='doRemove()' />");
        //.on('click', function () {
        //     //e.preventDefault();
        //     if (confirm("האם למחוק?")) {
        //         doRemove();
        //     }
        // });

        container.append('<br/>');
        //var imgtag = getImgTag(mediaType, picUrl);
        var imgurl;
        var imgtag;
        var imgtumb;

        if (mediaType == 'img') {
            imgurl = '/Uploads/img' + '/' + picUrl;
            imgtag = $('<a class="group1" href="' + imgurl + '"><img src="' + imgurl + '" style="max-width:400px; height:auto;"/></a>').colorbox({ rel: 'group1' });
        }
        else if (mediaType == 'video') {
            imgurl = '/Uploads/img' + '/' + picUrl;
            imgtag = $('<a class="group1" href="' + imgurl + '"><img src="' + imgurl + '" style="max-width:400px; height:auto;"/></a>').colorbox({ rel: 'group1' });
        }
        else if (mediaType == 'doc') {
            imgurl = '/Uploads/doc' + '/' + picUrl;
            imgtumb = getImgMediaTumb(mediaType, picUrl);
            imgtag = $('<div style="margin: 10px;text-align:center"><b>מסמך:</b><br/><a href="' + imgurl + '">' + imgtumb + '</a></div>');
        }
        else if (mediaType == 'link') {
            imgtumb = getImgMediaTumb(mediaType, picUrl);
            imgtag = $('<div style="margin: 10px;text-align:center"><b>קישור:</b><br/><a href="' + picUrl + '">' + imgtumb + '</a></div>');
        }
        else {
            imgtumb = getImgMediaTumb(mediaType, picUrl);
            imgtag = $('<div style="margin: 10px;text-align:center"><b>קישור:</b><br/><a href="' + picUrl + '">' + imgtumb + '</a></div>');
        }
        container.append(imgtag);


        //container.append(imgtag);

        //container.append("<div style='margin: 10px;'><b>תמונה:</b><br/></div>" + getImgTag(picUrl));

        $("#ContentPanel").html(container.html());

    };

    //updatePanel(0);

    //uploader

    function generateUUIDv4() {
        var d = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    };

    function generateUUID(v) {
        if (v == 'v4')
            return Math.uuid() // RFC4122 v4 UUID
        //"4FAC90E7-8CF1-4180-B47B-09C3A246CB67"
        if (v == '62')
            return Math.uuid(17) // 17 digits, base 62 (0-9,a-Z,A-Z)
        //"GaohlDbGYvOKd11p2"

        if (v == '10')
            return Math.uuid(5, 10) // 5 digits, base 10
        //"84274"

        if (v == '16')
            return Math.uuid(8, 16) // 8 digits, base 16
        //"19D954C3"
    };
    var picuuid;
    var doUpload = function (data) {
        $.each(data.files, function (index, file) {
            var extension = getFileExtension(file.name);
            var uuid = generateUUID('16');
            var fname = $('#uploadBid').val() + '_' + $('#uploadUid').val() + '_' + $('#uploadPt').val() + '_' + $('#picid').val() + '.' + extension;
            $('<p/>').text(file.name).appendTo('#files');
            $('#files' + picnum).prepend($('<img>', { style: 'max-width:80px;height:auto', src: '/Uploads/media' + '/' + fname }))//file.name }))
        });
    };
    var doPprogress = function (data) {
        var progress = parseInt(data.loaded / data.total * 100, 10);
        $('#progress .progress-bar').css(
            'width',
            progress + '%'
        );
    };
    var resetPprogress = function () {
        $('#progress .progress-bar').css(
            'width', '0%'
        );
    };
    var getKeys = function (obj) {
        var keys = [];
        for (var key in obj) {
            keys.push(key);
        }
        return keys;
    }
    $('#fileupload').fileupload({
        maxFileSize: 10400000,//10mb
        url: '/Media/MediaUpload',//Url.Content("~/Ws/UploadFiles.asmx/MediaUpload")',
        formData: {
            param1: $('#uploadBid').val(),
            param2: $('#uploadUid').val(),
            param3: $('#uploadPt').val()
        },
        //dataType: 'json',
        done: function (e, data) {
            //var keys = Object.keys(data);
            //alert(data.textStatus);
            if (data.result)
                app_jqxnotify.notify(data.result.Message);
            else
                app_jqxnotify.notify("Unknown result!");
        
            //app_jqxnotify.notify(data.Message);//.textStatus);
            resetPprogress();
            mediaAdapter.dataBind();
            parent.triggerImageChanged();
        },
        error: function (jqXHR, status, error) {
            alert(error);
            //app_jqxnotify.notify(error, "error");
        },
        progressall: function (e, data) {
            doPprogress(data);
        }
    }).prop('disabled', !$.support.fileInput)
         .parent().addClass($.support.fileInput ? undefined : 'disabled')
         .bind('fileuploadsubmit', function (e, data) {
             resetPprogress();
             //picuuid = generateUUID('16');
             //data.formData = {
             //    param1: $('#uploadBid').val(),
             //    param2: $('#uploadUid').val(),
             //    param3: $('#uploadPt').val()
             //};
         });

    //$('#imgremove').click(function (e) {
    //    e.preventDefault();
    //    doRemove();
    //});
    var doRemove = function () {
        var id = $('#uploadMid').val();
        var filename = $('#uploadPath').val();
        var mediaType = $('#uploadMtype').val();

        $.ajax({
            url: '/Media/MediaRemove',//Url.Content("~/Ws/UploadFiles.asmx/MediaRemove")',
            type: "POST",
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            data: "{'id':'" + id + "', 'mediaType' : '" + mediaType + "', 'filename':'" + filename + "'}",
            success: function (data) {
                if (data) {
                    //alert(data.Message);
                    app_jqxnotify.notify(data.Message);
                }
                //alert('הקובץ הוסר');
                $('#files').html('');
                mediaAdapter.dataBind();
                parent.triggerImageChanged();
            },
            error: function (jqXHR, status, error) {
                alert(error);
            }
        });
    };

}


var app_media = {
    propertyTypeToChar: function (propertyType) {

        if (propertyType == 1)
            return "u";
        if (propertyType == 2)
            return "b";
        if (propertyType == 3)
            return "p"
        //default
        return "u";
    },

    loadImages: function (id, pt) {
        if (id === undefined || id == 0)
            return;
        if (typeof pt === 'undefined' || pt == null) { pt = 'u'; }

        for (var i = 0; i < 3; i++) {
            $("#media_image" + i).html('');
        }

        $.ajax({
            async: true,
            type: "POST",
            url: "/Building/GetMediaView",
            data: { 'buildingId': 0, 'propertyId': id, 'propertyType': '' + pt + '' },
            dataType: "json",
            success: function (data) {
                if (data === undefined || data == null)
                    return;
                $("#media_images").empty();
                $.each(data, function (index, value) {
                    console.log(value.MediaPath);
                    if (value.MediaPath && value.MediaType == 'img') {
                        var src = app_rout.mediaPath() + value.MediaType + "/" + value.MediaPath;
                        $("#media_images").append('<div><img id="theImg" src="' + src + '" style="max-width:240px;border:solid 1px #808080" /></div>');
                    }
                    else if (value.MediaPath && value.MediaType == 'doc') {
                        var src = app_rout.mediaPath() + value.MediaType + "/" + value.MediaPath;
                        $("#media_images").append('<div><a href="' + src + '"><img id="theImg" src="/Images/doc.jpg" style="max-width:240px;border:solid 1px #808080" /></a></div>');
                    }
                    else if (value.MediaPath && value.MediaType == 'video') {
                        var src = app_rout.mediaPath() + value.MediaType + "/" + value.MediaPath;
                        $("#media_images").append('<div><a href="' + src + '"><img id="theImg" src="/Images/video.jpg" style="max-width:240px;border:solid 1px #808080" /></a></div>');
                    }
                    if (index > 2)
                        return;
                });

            },
            error: function (e) {
                //alert(e);
            }
        });

    }
};

var app_media_uploader = function (tagWindow) {
    this.tagDiv = tagWindow;
    this.Model,
    this.appMedia;
    this.init = function (refId, refType) {

        var slf = this;

        if (this.Model == null) {

            app_model.postModel('/Media/GetMediaFilesModel', { 'refid': refId, 'reftype': refType }, function (data) {
                slf.Model = data;
            });

            var html = (function () {/*
        <div style="margin:20px;">
               <div id="jqxWidget" style="margin: 0 auto; display: block; direction: rtl">
                <div id="splitter">
                    <div style="overflow:hidden;" id="MediaPanel">
                        <div style="border: none;" id="MediaList">
                        </div>
                    </div>
                    <div style="overflow: auto;" id="ContentPanel">
                    </div>
                </div>
                <div id="uploader" style="width:100%;display:block;">
                    <div style="width: 90%">
                        <div class="form-group active" style="padding: 10px">
                            <span class="btn btn-success fileinput-button">
                                <i class="glyphicon glyphicon-plus"><span>הוספת קובץ</span></i>
                                <input id="fileupload" type="file" name="files[]" multiple>
                            </span>
                            <span id="spnRemove" class="btn btn-success fileinput-button">
                                <i class="glyphicon glyphicon-minus"><span>הסרת קובץ</span></i>
                                <input id="fileremove" type="button" value="הסרת קובץ" />
                            </span>
                            <span id="spnRefresh" class="btn btn-success fileinput-button">
                                <i class="glyphicon glyphicon-minus"><span>רענון</span></i>
                                <input id="filerefresh" type="button" value="רענון" />
                            </span>
                            <br>
                            <div id="progress" class="progress">
                                <div class="progress-bar progress-bar-success"></div>
                            </div>
                            </div>
                        <div id="files" class="files"></div>
                     <div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    */}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1];

            if (slf.Model.Option == "a") {
                html = html.replace('form-group active', 'form-group pasive')
            }

            var container = $(html);
            $(slf.tagDiv).append(container);

            $('.group1').colorbox({ rel: 'group1' });
            this.appMedia = app_media.load(slf.Model);

            $("#spnRemove").hide();
            $("#splitter").jqxSplitter({//orientation: 'horizontal',
                width: '100%', height: '250px',
                panels: [
                   { size: "50%", min: "10%", collapsible: false },
                   { size: '50%', min: "5%" }]
            });

            $('#MediaList').on('select', function (event) {
                slf.updatePanel(event.args.item);
                //$("#fileremove").prop('disabled', false);
                $("#spnRemove").show();
            });

            $('#fileremove').click(function (e) {
                //e.preventDefault();
                slf.doRemove();//fileId, mediaType, filename);
            });
            $('#filerefresh').click(function (e) {
                slf.doRefresh();
            });
        }

        return this;
    };
    this.show = function () {
        $(this.tagDiv).show();
    };
    this.hide = function () {
        $(slf.tagDiv).hide();
    };
    this.doRefresh = function () {
        this.appMedia.doRefresh();
    };
    this.doRemove = function () {
        this.appMedia.doRemove();
    };
    this.updatePanel = function (item) {
        this.appMedia.updatePanel(item);
    };
}


/*
(function ($) {

    app_media_uploader={
    wizControl,
    dataSource,
    buildingId:0, 
    propertyId:0, 
    propertyType:'',
        init:function(buildingId, propertyId, propertyType){
            this.buildingId=buildingId;
            this.propertyId=propertyId;
            this.propertyType=propertyType;

            this.dataSource =
             {
                 datatype: "json",
                 id: 'RecordId',
                 data: { 'id': this.RecordId },
                 type: 'POST',
                 url: '/Main/GetMemberEdit'
             };
            //var pasive = dataModel.Option == "a" ? " pasive" : "";

            var html='<div style="margin:20px;">'+
              '<div id="jqxWidget" style="margin: 0 auto; display: block; direction: rtl">'+
                  '<h3 class="rightPan">מדיה</h3>'+
                  '<div id="splitter">'+
                      '<div style="overflow: hidden;">'+
                          '<div style="border: none;" id="MediaList">'+
                          '</div>'+
                      '</div>'+
                      '<div style="overflow: auto;" id="ContentPanel">'+
                      '</div>'+
                  '</div>'+
                  '<div id="uploader">'+
                      '<div style="width: 250px">'+
                          '<span>Select files...</span>'+
                          '<input type="hidden" id="uploadBid" value="" />'+
                          '<input type="hidden" id="uploadUid" value="" />'+
                          '<input type="hidden" id="uploadPt" value="" />'+
                          '<input type="hidden" id="uploadMid" value="" />'+
                          '<input type="hidden" id="uploadMtype" value="" />'+
                          '<input type="hidden" id="uploadPath" value="" />'+
                          '<input type="hidden" id="uploadUuid" value="" />'+
                          '<div style="padding: 10px">'+
                              '<span class="btn btn-success fileinput-button">'+
                                  '<i class="glyphicon glyphicon-plus"><span>הוספת תמונה</span></i>'+
                                  '<input id="fileupload" type="file" name="files[]" multiple>'+
                              '</span>'+
                              '<span id="spnRemove" class="btn btn-success fileinput-button">'+
                                  '<i class="glyphicon glyphicon-minus"><span>הסרת תמונה</span></i>'+
                                  '<input id="fileremove" type="button" value="הסרת תמונה"/>'+
                              '</span>'+
                              '<br>'+
                              '<div id="progress" class="progress">'+
                                  '<div class="progress-bar progress-bar-success"></div>'+
                              '</div>'+
                              '<div id="files" class="files"></div>'+
                          '</div>'+
                          '<div>'+
                          '</div>'+
                      '</div>'+
                 '</div>'+
              '</div>'+
      '</div>';

            if (this.wizControl != null) {
                this.wizControl.clearDataForm("fcForm");
                app_jqxcombos.clearCheckList("#listCategory");
            }
            else{
                this.wizControl = new wiz_control("media_uploader", tagWindow);
                this.wizControl.init(html, this.ExType, function (data) {

                    $('.group1').colorbox({ rel: 'group1' });

                    $('#uploadBid').val(buildingId);
                    $('#uploadUid').val(propertyId);
                    $('#uploadPt').val(propertyType);
                    //$("#fileremove").prop('disabled', true);
                    $("#spnRemove").hide();
                    //$("#splitter").jqxSplitter({width: '100%', height: 300, panels: [{ size: '40%' }] });
                })
             }
        },
        display:function () {
            $(tagWindow).show();
            $("#ExType").val(this.ExType);

            if (this.RecordId > 0) {
                this.wizControl.load("fcForm", this.dataSource, function (record) {

                    app_jqxform.loadDataForm("fcForm", record);

                    app_jqxcombos.selectCheckList("listCategory", record.Categories);

                    app_jqxcombos.initComboValue('City', 0);

                });
            }
            else {
                $("#AccountId").val(this.AccountId);
                $("#RecordId").val(0);
            }
        },
        doCancel: function () {
            this.wizControl.doCancel();
        },
        doSubmit: function () {
            this.wizControl.doSubmit(
                function () {
                    app_jqxcombos.renderCheckList("listCategory", "Categories");
                },
                function (data) {
                    app_dialog.alert(data.Message);
                    if (data.Status >= 0) {
                        //if (slf.IsDialog) {
                        window.parent.triggerWizControlCompleted("member_def", data.OutputId);

                        //    //$('#fcForm').reset();
                        //}
                        //else {
                        //    app.refresh();
                        //}
                        //$('#RecordId').val(data.OutputId);
                    }
                }
            );
        },
        doClear: function () {
            this.wizControl.clearDataForm("fcForm");
            app_jqxcombos.clearCheckList("#listCategory");
        },
        doSubmitAdd: function () {
            this.wizControl.doSubmit(
                function () {
                    app_jqxcombos.renderCheckList("listCategory", "Categories");
                },
                function (data) {
                    app_dialog.alert(data.Message);
                    //if (data.Status >= 0) {
                    //    window.parent.triggerWizControlCompleted("member_def", data.OutputId);
                    //}
                }
            );
        }
    }

})(jquery)
*/


/*
function mediaUploader(buildingId, propertyId, propertyType) {



    //$('.group1').colorbox({ rel: 'group1' });

    //$('#uploadBid').val('@buildingId');
    //$('#uploadUid').val('@propertyId');
    //$('#uploadPt').val('@propertyType');
    ////$("#fileremove").prop('disabled', true);
    //$("#spnRemove").hide();


    //$("#splitter").jqxSplitter({width: '100%', height: 300, panels: [{ size: '40%' }] });

    var mediaSource =
    {
        dataType: "json",
        dataFields: [
            { name: 'MediaId', type: 'number' },
            { name: 'PropertyId', type: 'number' },
            { name: 'BuildingId', type: 'number' },
            { name: 'MediaType', type: 'string' },
            { name: 'PropertyType', type: 'string' },
            { name: 'MediaPath', type: 'string' }
        ],
        id: 'MediaId',
        type: 'POST',
        data: { 'buildingId': buildingId, 'propertyId': propertyId, 'propertyType': propertyType },
        url: "/Building/GetMediaView"
    };
    var mediaAdapter = new $.jqx.dataAdapter(mediaSource);
    $("#MediaList").jqxListBox(
    {
        rtl: true,
        source: mediaAdapter,
        width: '100%',
        height: '100%',
        checkboxes: false,
        displayMember: 'MediaPath',
        valueMember: 'MediaId',
        selectedIndex: 0,
        itemHeight: 70,
        renderer: function (index, label, value) {
            //var datarecord = mediaAdapter[index];
            var table = '<table style="min-width: 130px;"><tr><td style="width: 40px;padding:8px;" rowspan="2">' + getImgTumb(label) + '</td><td>Media Id : ' + value + '</td></tr><tr><td>Unit Id :' + '@propertyId' + '</td></tr></table>';
            return table;
        }
    });

    $('#MediaList').on('select', function (event) {
        updatePanel(event.args.item);
        //$("#fileremove").prop('disabled', false);
        $("#spnRemove").show();
    });

    $("#fileremove").on('click', function (event) {
        //e.preventDefault();
        var mediaId = $('#uploadMid').val();
        if (confirm("האם למחוק? קובץ " + mediaId)) {
            doRemove();
        }
    });

    //var getMediaType = function (t) {
    //    switch (t) {
    //        case 'p':
    //            return 'photo';
    //        case 'v':
    //            return 'video';
    //    }
    //    return 'photo';
    //};
    var getPropertyType = function (t) {
        switch (t) {
            case 'u':
                return 'Unit';
            case 'b':
                return 'Building';
            case 'p':
                return 'Plots';
        }
        return 'Property';
    };
    function getImgUrl(mediaType, picUrl) {
        if (mediaType == 'img')
            return "/Uploads/img" + '/' + picUrl;
        else if (mediaType == 'video')
            return "/Uploads/img" + '/' + picUrl;
        else if (mediaType == 'doc')
            return "/Uploads/doc" + '/' + picUrl;
        else
            return picUrl;
    };

    function getImgTumb(picUrl) {
        var mediaType = getMediaType(picUrl);

        var imgurl;
        var imgtumb;
        if (mediaType == 'img') {
            imgurl = "/Uploads/img" + '/' + picUrl;
            //imgtumb = $('<a class="group1" href="' + imgurl + '"><img src="' + imgurl + '" style="max-width:80px; height:auto;"/></a>').colorbox({ rel: 'group1' });
            //imgtumb = '<a class="group1" href="' + imgurl + '"><img src="' + imgurl + '" style="max-width:80px; height:auto;"/></a>';
            imgtumb = '<img src="' + imgurl + '" style="max-width:80px; height:auto;"/>'

        }
        else if (mediaType == 'video') {
            imgurl = "/Uploads/img" + '/' + picUrl;
            imgtumb = '<img src="' + imgurl + '" style="max-width:80px; height:auto;"/>'
        }
        else if (mediaType == 'doc') {
            imgurl = "/Images/doc.jpg";
            imgtumb = $('<span><img src="' + imgurl + '" style="max-width:80px; height:auto;"/></span>');
        }
        else if (mediaType == 'link') {
            imgurl = "/Images/link.jpg";
            imgtumb = $('<span><img src="' + imgurl + '" style="max-width:80px; height:auto;"/></span>');
        }
        else {
            imgurl = "~/Images/none.jpg";
            imgtumb = $('<span><img src="' + imgurl + '" style="max-width:80px; height:auto;"/></span>');

        }
        return imgtumb;
    };
    function getImgTag(mediaType, picUrl) {

        var imgurl;
        var imgtag;

        if (mediaType == 'img') {
            imgurl = "/Uploads/img" + '/' + picUrl;
            imgtag = $('<div style="margin: 10px;"><b>תמונה:</b><br/></div><div style="margin: 10px;overflow:auto;"><img src="' + imgurl + '"/></div>');
        }
        else if (mediaType == 'video') {
            imgurl = "/Uploads/img" + '/' + picUrl;
            imgtag = $('<div style="margin: 10px;"><b>וידאו:</b><br/></div><div style="margin: 10px;overflow:auto;"><img src="' + imgurl + '"/></div>');
        }
        else if (mediaType == 'doc') {
            imgurl = "/Uploads/doc" + '/' + picUrl;
            imgtag = $('<div style="margin: 10px;"><b>מסמך:</b><br/></div><div><a href="' + imgurl + '">לצפיה</a></div>');
        }
        else if (mediaType == 'link') {
            imgtag = $('<div style="margin: 10px;"><b>קישור:</b><br/></div><div><a href="' + picUrl + '">לצפיה</a></div>');
        }
        else {
            imgtag = $('<div style="margin: 10px;"><b>קישור:</b><br/></div><div><a href="' + picUrl + '">לצפיה</a></div>');

        }
        return imgtag;

        //return '<div style="margin: 10px;overflow:auto;"><img src="' + getImgUrl(mediaType,picUrl) + '"/></div>';
    };

    function getFileExtension(filename) {
        return filename.split('.').pop();
    };
    function getMediaType(filename) {
        if (filename.substr(0, 4) == 'http')
            return 'link';
        var extension = getFileExtension(filename);
        switch (extension.toLowerCase()) {
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
            case 'tif':
                return 'img';
            case 'mp4':
            case 'avi':
                return 'video';
            case 'pdf':
            case 'doc':
            case 'docx':
            case 'xls':
            case 'xlsx':
            case 'txt':
                return 'doc';

        }
        return "none";
    };
    var updatePanel = function (item) {

        //var datarecord = data[index];

        var mediaId = item.value;
        var picUrl = item.label;
        var mediaType = getMediaType(picUrl);


        $('#uploadMid').val(mediaId);
        $('#uploadMtype').val(mediaType);
        $('#uploadPath').val(picUrl);

        var container = $('<div style="margin: 5px;"></div>')
        //container.append("<div style='margin: 10px;'><b>קוד מדיה:</b> " + mediaId + "</div>");
        //container.append("<div style='margin: 10px;'><b>קוד נכס:</b> " + @propertyId + "</div>");
        //container.append("<div style='margin: 10px;'><b>קוד בניין:</b> " + @buildingId + "</div>");
        //container.append("<div style='margin: 10px;'><b>סוג מדיה:</b> " + getMediaType(mediaType) + "</div>");
        //container.append("<div style='margin: 10px;'><b>סוג נכס:</b> " + getPropertyType('@propertyType') + "</div>");

        //container.append("<input type='button' value='הסרת קובץ' onclick='doRemove()' />");
        //.on('click', function () {
        //     //e.preventDefault();
        //     if (confirm("האם למחוק?")) {
        //         doRemove();
        //     }
        // });

        container.append('<br/>');
        //var imgtag = getImgTag(mediaType, picUrl);
        var imgurl;
        var imgtag;
        if (mediaType == 'img') {
            imgurl = "/Uploads/img" + '/' + picUrl;
            imgtag = $('<a class="group1" href="' + imgurl + '"><img src="' + imgurl + '" style="max-width:400px; height:auto;"/></a>').colorbox({ rel: 'group1' });
        }
        else if (mediaType == 'video') {
            imgurl = "/Uploads/img" + '/' + picUrl;
            imgtag = $('<a class="group1" href="' + imgurl + '"><img src="' + imgurl + '" style="max-width:400px; height:auto;"/></a>').colorbox({ rel: 'group1' });
        }
        else if (mediaType == 'doc') {
            imgurl = "/Uploads/doc" + '/' + picUrl;
            imgtag = $('<div style="margin: 10px;"><b>מסמך:</b><br/></div><div><a href="' + imgurl + '">לצפיה</a></div>');
        }
        else if (mediaType == 'link') {
            imgtag = $('<div style="margin: 10px;"><b>קישור:</b><br/></div><div><a href="' + picUrl + '">לצפיה</a></div>');
        }
        else {
            imgtag = $('<div style="margin: 10px;"><b>קישור:</b><br/></div><div><a href="' + picUrl + '">לצפיה</a></div>');
        }
        container.append(imgtag);


        //container.append(imgtag);

        //container.append("<div style='margin: 10px;'><b>תמונה:</b><br/></div>" + getImgTag(picUrl));

        $("#ContentPanel").html(container.html());

    };

    //updatePanel(0);

    //uploader

    function generateUUIDv4() {
        var d = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    };

    function generateUUID(v) {
        if (v == 'v4')
            return Math.uuid() // RFC4122 v4 UUID
        //"4FAC90E7-8CF1-4180-B47B-09C3A246CB67"
        if (v == '62')
            return Math.uuid(17) // 17 digits, base 62 (0-9,a-Z,A-Z)
        //"GaohlDbGYvOKd11p2"

        if (v == '10')
            return Math.uuid(5, 10) // 5 digits, base 10
        //"84274"

        if (v == '16')
            return Math.uuid(8, 16) // 8 digits, base 16
        //"19D954C3"
    };
    var picuuid;
    var doUpload = function (data) {
        $.each(data.files, function (index, file) {
            var extension = getFileExtension(file.name);
            var uuid = generateUUID('16');
            var fname = $('#uploadBid').val() + '_' + $('#uploadUid').val() + '_' + $('#uploadPt').val() + '_' + $('#picid').val() + '.' + extension;
            $('<p/>').text(file.name).appendTo('#files');
            $('#files' + picnum).prepend($('<img>', { style: 'max-width:80px;height:auto', src: "/Uploads/media" + '/' + fname }))//file.name }))
        });
    };
    var doPprogress = function (data) {
        var progress = parseInt(data.loaded / data.total * 100, 10);
        $('#progress .progress-bar').css(
            'width',
            progress + '%'
        );
    };
    var resetPprogress = function () {
        $('#progress .progress-bar').css(
            'width', '0%'
        );
    };
    var getKeys = function (obj) {
        var keys = [];
        for (var key in obj) {
            keys.push(key);
        }
        return keys;
    }
    $('#fileupload').fileupload({
        url: "/Media/MediaUpload",//Url.Content("~/Ws/UploadFiles.asmx/MediaUpload")',
        formData: {
            param1: $('#uploadBid').val(),
            param2: $('#uploadUid').val(),
            param3: $('#uploadPt').val()
        },
        //dataType: 'json',
        done: function (e, data) {
            //var keys = Object.keys(data);
            alert(data.textStatus);
            resetPprogress();
            mediaAdapter.dataBind();
        },
        error: function (jqXHR, status, error) {
            alert(error);
        },
        progressall: function (e, data) {
            doPprogress(data);
        }
    }).prop('disabled', !$.support.fileInput)
         .parent().addClass($.support.fileInput ? undefined : 'disabled')
         .bind('fileuploadsubmit', function (e, data) {
             resetPprogress();
             //picuuid = generateUUID('16');
             //data.formData = {
             //    param1: $('#uploadBid').val(),
             //    param2: $('#uploadUid').val(),
             //    param3: $('#uploadPt').val()
             //};
         });

    //$('#imgremove').click(function (e) {
    //    e.preventDefault();
    //    doRemove();
    //});
    var doRemove = function () {
        var id = $('#uploadMid').val();
        var filename = $('#uploadPath').val();
        var mediaType = $('#uploadMtype').val();

        $.ajax({
            url: "/Media/MediaRemove",//Url.Content("~/Ws/UploadFiles.asmx/MediaRemove")',
            type: "POST",
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            data: "{'id':'" + id + "', 'mediaType' : '" + mediaType + "', 'filename':'" + filename + "'}",
            success: function (data) {
                if (data) {
                    alert(data.Message);

                }
                //alert('הקובץ הוסר');
                $('#files').html('');
                mediaAdapter.dataBind();
            },
            error: function (jqXHR, status, error) {
                alert(error);
            }
        });

    };
}
*/
/*

 <script type="text/javascript">
        $(document).ready(function () {

            $('.group1').colorbox({ rel: 'group1' });

            $('#uploadBid').val('@buildingId');
            $('#uploadUid').val('@propertyId');
            $('#uploadPt').val('@propertyType');
            //$("#fileremove").prop('disabled', true);
            $("#spnRemove").hide();
            

            $("#splitter").jqxSplitter({width: '100%', height: 300, panels: [{ size: '40%' }] });

            var mediaSource =
            {
                dataType: "json",
                dataFields: [
                    { name: 'MediaId', type: 'number' },
                    { name: 'PropertyId', type: 'number' },
                    { name: 'BuildingId', type: 'number' },
                    { name: 'MediaType', type: 'string' },
                    { name: 'PropertyType', type: 'string' },
                    { name: 'MediaPath', type: 'string' }
                ],
                id: 'MediaId',
                type: 'POST',
                data: { 'buildingId': '@buildingId', 'propertyId': '@propertyId', 'propertyType': '@propertyType' },
                 url: '@Url.Action("GetMediaView", "Building")'
             };
            var mediaAdapter = new $.jqx.dataAdapter(mediaSource);
            $("#MediaList").jqxListBox(
            {
                rtl: true,
                source: mediaAdapter,
                width: '100%',
                height: '100%',
                checkboxes: false,
                displayMember: 'MediaPath',
                valueMember: 'MediaId',
                selectedIndex: 0,
                itemHeight: 70,
                renderer: function (index, label, value) {
                    //var datarecord = mediaAdapter[index];
                    var table = '<table style="min-width: 130px;"><tr><td style="width: 40px;padding:8px;" rowspan="2">' + getImgTumb(label) + '</td><td>Media Id : ' + value + '</td></tr><tr><td>Unit Id :' + '@propertyId' + '</td></tr></table>';
                     return table;
                 }
            });

            $('#MediaList').on('select', function (event) {
                updatePanel(event.args.item);
                //$("#fileremove").prop('disabled', false);
                $("#spnRemove").show();
            });

            $("#fileremove").on('click', function (event) {
                //e.preventDefault();
                var mediaId=$('#uploadMid').val();
                if (confirm("האם למחוק? קובץ " + mediaId)) {
                    doRemove();
                }
            });

            //var getMediaType = function (t) {
            //    switch (t) {
            //        case 'p':
            //            return 'photo';
            //        case 'v':
            //            return 'video';
            //    }
            //    return 'photo';
            //};
            var getPropertyType = function (t) {
                switch (t) {
                    case 'u':
                        return 'Unit';
                    case 'b':
                        return 'Building';
                    case 'p':
                        return 'Plots';
                }
                return 'Property';
            };
            function getImgUrl(mediaType, picUrl) {
                if (mediaType == 'img')
                    return '@Url.Content("~/Uploads/img")' + '/' + picUrl;
                else if (mediaType == 'video')
                    return '@Url.Content("~/Uploads/img")' + '/' + picUrl;
                else if (mediaType == 'doc')
                     return '@Url.Content("~/Uploads/doc")' + '/' + picUrl;
                 else
                     return picUrl;
         };

            function getImgTumb(picUrl) {
                var mediaType = getMediaType(picUrl);

                var imgurl;
                var imgtumb;
                if (mediaType == 'img') {
                    imgurl = '@Url.Content("~/Uploads/img")' + '/' + picUrl;
                     //imgtumb = $('<a class="group1" href="' + imgurl + '"><img src="' + imgurl + '" style="max-width:80px; height:auto;"/></a>').colorbox({ rel: 'group1' });
                     //imgtumb = '<a class="group1" href="' + imgurl + '"><img src="' + imgurl + '" style="max-width:80px; height:auto;"/></a>';
                     imgtumb = '<img src="' + imgurl + '" style="max-width:80px; height:auto;"/>'

                }
                else if (mediaType == 'video') {
                    imgurl = '@Url.Content("~/Uploads/img")' + '/' + picUrl;
                    imgtumb = '<img src="' + imgurl + '" style="max-width:80px; height:auto;"/>'
                }
                 else if (mediaType == 'doc') {
                     imgurl = '@Url.Content("~/Images/doc.jpg")';
                     imgtumb = $('<span><img src="' + imgurl + '" style="max-width:80px; height:auto;"/></span>');
                 }
                 else if (mediaType == 'link') {
                     imgurl = '@Url.Content("~/Images/link.jpg")';
                     imgtumb = $('<span><img src="' + imgurl + '" style="max-width:80px; height:auto;"/></span>');
                 }
                 else {
                     imgurl = '@Url.Content("~/Images/none.jpg")';
                     imgtumb = $('<span><img src="' + imgurl + '" style="max-width:80px; height:auto;"/></span>');

                 }
         return imgtumb;
     };
            function getImgTag(mediaType, picUrl) {

                var imgurl;
                var imgtag;

                if (mediaType == 'img') {
                    imgurl = '@Url.Content("~/Uploads/img")' + '/' + picUrl;
                     imgtag = $('<div style="margin: 10px;"><b>תמונה:</b><br/></div><div style="margin: 10px;overflow:auto;"><img src="' + imgurl + '"/></div>');
                 }
                else if (mediaType == 'video') {
                    imgurl = '@Url.Content("~/Uploads/img")' + '/' + picUrl;
                    imgtag = $('<div style="margin: 10px;"><b>וידאו:</b><br/></div><div style="margin: 10px;overflow:auto;"><img src="' + imgurl + '"/></div>');
                }
                else if (mediaType == 'doc') {
                     imgurl = '@Url.Content("~/Uploads/doc")' + '/' + picUrl;
                         imgtag = $('<div style="margin: 10px;"><b>מסמך:</b><br/></div><div><a href="' + imgurl + '">לצפיה</a></div>');
                     }
                     else if (mediaType == 'link') {
                         imgtag = $('<div style="margin: 10px;"><b>קישור:</b><br/></div><div><a href="' + picUrl + '">לצפיה</a></div>');
                     }
                     else {
                         imgtag = $('<div style="margin: 10px;"><b>קישור:</b><br/></div><div><a href="' + picUrl + '">לצפיה</a></div>');

                     }
                 return imgtag;

                 //return '<div style="margin: 10px;overflow:auto;"><img src="' + getImgUrl(mediaType,picUrl) + '"/></div>';
             };

            function getFileExtension(filename) {
                return filename.split('.').pop();
            };
            function getMediaType(filename) {
                if (filename.substr(0, 4) == 'http')
                    return 'link';
                var extension = getFileExtension(filename);
                switch (extension.toLowerCase()) {
                    case 'jpg':
                    case 'jpeg':
                    case 'png':
                    case 'gif':
                    case 'tif':
                        return 'img';
                    case 'mp4':
                    case 'avi':
                        return 'video';
                    case 'pdf':
                    case 'doc':
                    case 'docx':
                    case 'xls':
                    case 'xlsx':
                    case 'txt':
                        return 'doc';

                }
                return "none";
            };
            var updatePanel = function (item) {

                //var datarecord = data[index];

                var mediaId = item.value;
                var picUrl = item.label;
                var mediaType = getMediaType(picUrl);


                $('#uploadMid').val(mediaId);
                $('#uploadMtype').val(mediaType);
                $('#uploadPath').val(picUrl);

                var container = $('<div style="margin: 5px;"></div>')
                //container.append("<div style='margin: 10px;'><b>קוד מדיה:</b> " + mediaId + "</div>");
                //container.append("<div style='margin: 10px;'><b>קוד נכס:</b> " + @propertyId + "</div>");
                //container.append("<div style='margin: 10px;'><b>קוד בניין:</b> " + @buildingId + "</div>");
                //container.append("<div style='margin: 10px;'><b>סוג מדיה:</b> " + getMediaType(mediaType) + "</div>");
                //container.append("<div style='margin: 10px;'><b>סוג נכס:</b> " + getPropertyType('@propertyType') + "</div>");

                //container.append("<input type='button' value='הסרת קובץ' onclick='doRemove()' />");
                    //.on('click', function () {
                //     //e.preventDefault();
                //     if (confirm("האם למחוק?")) {
                //         doRemove();
                //     }
                // });

                 container.append('<br/>');
                 //var imgtag = getImgTag(mediaType, picUrl);
                 var imgurl;
                 var imgtag;
                 if (mediaType == 'img') {
                     imgurl = '@Url.Content("~/Uploads/img")' + '/' + picUrl;
                     imgtag = $('<a class="group1" href="' + imgurl + '"><img src="' + imgurl + '" style="max-width:400px; height:auto;"/></a>').colorbox({ rel: 'group1' });
                 }
                else if (mediaType == 'video') {
                    imgurl = '@Url.Content("~/Uploads/img")' + '/' + picUrl;
                    imgtag = $('<a class="group1" href="' + imgurl + '"><img src="' + imgurl + '" style="max-width:400px; height:auto;"/></a>').colorbox({ rel: 'group1' });
                }
                else if (mediaType == 'doc') {
                     imgurl = '@Url.Content("~/Uploads/doc")' + '/' + picUrl;
                         imgtag = $('<div style="margin: 10px;"><b>מסמך:</b><br/></div><div><a href="' + imgurl + '">לצפיה</a></div>');
                     }
                     else if (mediaType == 'link') {
                         imgtag = $('<div style="margin: 10px;"><b>קישור:</b><br/></div><div><a href="' + picUrl + '">לצפיה</a></div>');
                     }
                     else {
                         imgtag = $('<div style="margin: 10px;"><b>קישור:</b><br/></div><div><a href="' + picUrl + '">לצפיה</a></div>');
                     }
                 container.append(imgtag);


                 //container.append(imgtag);

                 //container.append("<div style='margin: 10px;'><b>תמונה:</b><br/></div>" + getImgTag(picUrl));

                 $("#ContentPanel").html(container.html());

             };

            //updatePanel(0);

            //uploader

            function generateUUIDv4() {
                var d = new Date().getTime();
                var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    var r = (d + Math.random() * 16) % 16 | 0;
                    d = Math.floor(d / 16);
                    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
                });
                return uuid;
            };

            function generateUUID(v) {
                if (v == 'v4')
                    return Math.uuid() // RFC4122 v4 UUID
                //"4FAC90E7-8CF1-4180-B47B-09C3A246CB67"
                if (v == '62')
                    return Math.uuid(17) // 17 digits, base 62 (0-9,a-Z,A-Z)
                //"GaohlDbGYvOKd11p2"

                if (v == '10')
                    return Math.uuid(5, 10) // 5 digits, base 10
                //"84274"

                if (v == '16')
                    return Math.uuid(8, 16) // 8 digits, base 16
                //"19D954C3"
            };
            var picuuid;
            var doUpload = function (data) {
                $.each(data.files, function (index, file) {
                    var extension = getFileExtension(file.name);
                    var uuid = generateUUID('16');
                    var fname = $('#uploadBid').val() + '_' + $('#uploadUid').val() + '_' + $('#uploadPt').val() + '_' + $('#picid').val() + '.' + extension;
                    $('<p/>').text(file.name).appendTo('#files');
                    $('#files' + picnum).prepend($('<img>', { style: 'max-width:80px;height:auto', src: '@Url.Content("~/Uploads/media")' + '/' + fname }))//file.name }))
                 });
             };
            var doPprogress = function (data) {
                var progress = parseInt(data.loaded / data.total * 100, 10);
                $('#progress .progress-bar').css(
                    'width',
                    progress + '%'
                );
            };
            var resetPprogress = function () {
                $('#progress .progress-bar').css(
                    'width', '0%'
                );
            };
            var getKeys = function (obj) {
                var keys = [];
                for (var key in obj) {
                    keys.push(key);
                }
                return keys;
            }
            $('#fileupload').fileupload({
                url: '@Url.Action("MediaUpload", "Media")',//Url.Content("~/Ws/UploadFiles.asmx/MediaUpload")',
                 formData: {
                     param1: $('#uploadBid').val(),
                     param2: $('#uploadUid').val(),
                     param3: $('#uploadPt').val()
                 },
                 //dataType: 'json',
                 done: function (e, data) {
                     //var keys = Object.keys(data);
                     alert(data.textStatus);
                     resetPprogress();
                     mediaAdapter.dataBind();
                 },
                 error: function (jqXHR, status, error) {
                     alert(error);
                 },
                 progressall: function (e, data) {
                     doPprogress(data);
                 }
             }).prop('disabled', !$.support.fileInput)
                 .parent().addClass($.support.fileInput ? undefined : 'disabled')
                 .bind('fileuploadsubmit', function (e, data) {
                     resetPprogress();
                     //picuuid = generateUUID('16');
                     //data.formData = {
                     //    param1: $('#uploadBid').val(),
                     //    param2: $('#uploadUid').val(),
                     //    param3: $('#uploadPt').val()
                     //};
                 });

            //$('#imgremove').click(function (e) {
            //    e.preventDefault();
            //    doRemove();
            //});
            var doRemove = function () {
                var id = $('#uploadMid').val();
                var filename = $('#uploadPath').val();
                var mediaType = $('#uploadMtype').val();

                $.ajax({
                    url: '@Url.Action("MediaRemove","Media")',//Url.Content("~/Ws/UploadFiles.asmx/MediaRemove")',
                    type: "POST",
                    dataType: 'json',
                    contentType: "application/json; charset=utf-8",
                    data: "{'id':'" + id + "', 'mediaType' : '" + mediaType + "', 'filename':'" + filename + "'}",
                    success: function (data) {
                        if (data) {
                            alert(data.Message);

                        }
                        //alert('הקובץ הוסר');
                        $('#files').html('');
                        mediaAdapter.dataBind();
                    },
                    error: function (jqXHR, status, error) {
                        alert(error);
                    }
                });
            };

        });

    </script>

*/