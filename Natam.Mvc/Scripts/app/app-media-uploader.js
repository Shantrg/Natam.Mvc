
function media_uploader(buildingId, propertyId, propertyType) {

    $('#uploadBid').val(buildingId);
    $('#uploadUid').val(propertyId);
    $('#uploadPt').val(propertyType);

    var slf = this;


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

    
    var mediaAdapter = new $.jqx.dataAdapter(mediaSource, {
        loadComplete: function (records) {
            validateMediaListCount();
        }
    });

    //var jqxNavBarCreated=false;
    //var mediaAdapter = new $.jqx.dataAdapter(mediaSource, {
    //    loadComplete: function (records) {
    //        // get data records.
    //        var length = records.length;
    //        // loop through the records and display them in a table.

    //        if (length > 0) {
    //            //$("#MediaList").empty();
    //            var ul = $('<ul></ul>');
    //            for (var i = 0; i < length; i++) {
    //                var record = records[i];
    //                var icon = getImgTumb(record.MediaPath);
    //                ul.append('<li><span title="Media Id : ' + record.MediaId + ', Id :' + propertyId + '">' + icon + '</span></li>');
    //            }
    //            $("#MediaList").html(ul);
               
    //                $("#MediaList").jqxNavBar({ height: 60, theme: 'fresh'});

    //                if (!jqxNavBarCreated) {
    //                    $("#MediaList").on('change', function (e) {
    //                        e.preventDefault();
    //                        //var index = $("#MediaList").jqxNavBar('getSelectedIndex');
    //                        var selectedItem = $('#MediaList').jqxNavBar('selectedItem');
    //                        var record = mediaAdapter.records[selectedItem];
    //                        updatePanelRecord(record);
    //                        $("#spnRemove").show();
    //                    });
    //                }
    //                if ($("#MediaList").length > 0)
    //                    $("#MediaList").jqxNavBar({ selectedItem: 0 });
                
    //            jqxNavBarCreated = true;
    //        }
    //    },
    //    loadError: function (jqXHR, status, error) {
    //    },
    //    beforeLoadComplete: function (records) {
    //    }
    //});
    //// perform data binding.
    //mediaAdapter.dataBind();

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
        itemHeight: 60,
        renderer: function (index, label, value) {
            //var datarecord = mediaAdapter[index];
            var icon = getImgTumb(label);
            var table = '<li><span title="Media Id : ' + value + ', Id :' + propertyId + '">' + icon + '</span></li>';
            //var table = '<table style="min-width: 130px;"><tr><td style="width: 40px;padding:8px;" rowspan="2">' + icon + '</td><td>Media Id : ' + value + '</td></tr><tr><td>Unit Id :' + propertyId + '</td></tr></table>';
            return table;
        }
    });

    $('#MediaList').on('select', function (event) {
        slf.updatePanel(event.args.item);
        //$("#fileremove").prop('disabled', false);
        $("#spnRemove").show();
    });

    var validateMediaListCount=function()
    {
        var items = $("#MediaList").jqxListBox('getItems'); 
        if(items==null || items.length == 0)
        {
            $("#fileupload").show();
            $("#spnRemove").hide();
            $("#ContentPanel").empty();
        }

        else if(items.length <5){
            $("#fileupload").show();
            $("#spnRemove").show();
        }
        else{
            $("#fileupload").hide();
            $("#spnRemove").show();
        }
    }
   
    var slf = this;

    $("#fileremove").on('click', function (event) {
        //e.preventDefault();
        var mediaId = $('#uploadMid').val();
        if (confirm("האם למחוק? קובץ " + mediaId)) {
            slf.doRemove();
        }
    });

    function UrlExists(url) {
        var http = new XMLHttpRequest();
        http.open('HEAD', url, false);
        http.send();
        return http.status != 404;
    }

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

           
            imgtumb = '<img src="' + imgurl + '" style="max-width:80px;max-height:60px; height:auto;"/>'

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

    this.updatePanel = function (item) {

        //var datarecord = data[index];

        var mediaId = item.value;
        var picUrl = item.label;
        var mediaType = getMediaType(picUrl);


        $('#uploadMid').val(mediaId);
        $('#uploadMtype').val(mediaType);
        $('#uploadPath').val(picUrl);

        var container = $('<div style="margin: 5px;"></div>')
 
        container.append('<br/>');
        //var imgtag = getImgTag(mediaType, picUrl);
        var imgurl;
        var imgtag;
        var imgtumb;

        if (mediaType == 'img') {
            imgurl = '/Uploads/img' + '/' + picUrl;
            if (UrlExists(imgurl))
            imgtag = $('<a class="group1" href="' + imgurl + '"><img src="' + imgurl + '" style="max-width:400px; height:auto;"/></a>').colorbox({ rel: 'group1' });
        }
        else if (mediaType == 'video') {
            imgurl = '/Uploads/img' + '/' + picUrl;
            if (UrlExists(imgurl))
            imgtag = $('<a class="group1" href="' + imgurl + '"><img src="' + imgurl + '" style="max-width:400px; height:auto;"/></a>').colorbox({ rel: 'group1' });
        }
        else if (mediaType == 'doc') {
            imgurl = '/Uploads/doc' + '/' + picUrl;
            imgtumb = getImgMediaTumb(mediaType, picUrl);
            if (UrlExists(imgurl))
            imgtag = $('<div style="margin: 10px;text-align:center"><b>מסמך:</b><br/><a href="' + imgurl + '">' + imgtumb + '</a></div>');
        }
        else if (mediaType == 'link') {
            imgtumb = getImgMediaTumb(mediaType, picUrl);
            if (UrlExists(imgurl))
            imgtag = $('<div style="margin: 10px;text-align:center"><b>קישור:</b><br/><a href="' + picUrl + '">' + imgtumb + '</a></div>');
        }
        else {
            imgtumb = getImgMediaTumb(mediaType, picUrl);
            if (UrlExists(imgurl))
            imgtag = $('<div style="margin: 10px;text-align:center"><b>קישור:</b><br/><a href="' + picUrl + '">' + imgtumb + '</a></div>');
        }
        container.append(imgtag);


        //container.append(imgtag);

        //container.append("<div style='margin: 10px;'><b>תמונה:</b><br/></div>" + getImgTag(picUrl));

        $("#ContentPanel").html(container.html());

    };

    var updatePanelRecord = function (record) {

        //var datarecord = data[index];

        var mediaId = record.MediaId;
        var picUrl = record.MediaPath;
        var mediaType = getMediaType(picUrl);


        $('#uploadMid').val(mediaId);
        $('#uploadMtype').val(mediaType);
        $('#uploadPath').val(picUrl);

        var container = $('<div style="margin: 5px;"></div>')

        container.append('<br/>');
        //var imgtag = getImgTag(mediaType, picUrl);
        var imgurl;
        var imgtag;
        var imgtumb;

        if (mediaType == 'img') {
            imgurl = '/Uploads/img' + '/' + picUrl;
            imgtag = $('<a class="group1" href="' + imgurl + '"><img src="' + imgurl + '" style="max-width:300px; height:auto;"/></a>').colorbox({ rel: 'group1' });
        }
        else if (mediaType == 'video') {
            imgurl = '/Uploads/img' + '/' + picUrl;
            imgtag = $('<a class="group1" href="' + imgurl + '"><img src="' + imgurl + '" style="max-width:300px; height:auto;"/></a>').colorbox({ rel: 'group1' });
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
    };
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
                app_messenger.Post(data.result.Message);//app_jqxnotify.notify(data.result.Message);
            else
                app_messenger.Post("Unknown result!");//app_jqxnotify.notify("Unknown result!");
        
            //app_jqxnotify.notify(data.Message);//.textStatus);
            resetPprogress();
            //$('#media_images').jqxScrollView('refresh');
            mediaAdapter.dataBind();
            //parent.triggerImageChanged();
        },
        error: function (jqXHR, status, error) {
            app_dialog.alert(error);
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
    this.doRemove = function () {
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
                    app_messenger.Post(data.Message);//app_jqxnotify.notify(data.Message);
                }
                //alert('הקובץ הוסר');
                $('#files').html('');
                //$('#media_images').jqxScrollView('refresh');

                mediaAdapter.dataBind();
                //parent.triggerImageChanged();
            },
            error: function (jqXHR, status, error) {
                app_dialog.alert(error);
            }
        });
    };

    this.doRefresh = function () {

        mediaAdapter.dataBind();
    };

}

var app_media_uploader = function (tagWindow) {
    this.tagDiv = tagWindow;
    //this.Model,
    this.appMedia;
    this.init = function (buildingId, propertyId, propertyType, readonly) {

        var slf = this;

        if (this.appMedia == null) {

            //app_model.postModel('/Media/GetMediaFilesModel', { 'refid': refId, 'reftype': refType }, function (data) {
            //    slf.Model = data;
            //});

            var html = (function () {/*
                <div style="margin:5px;max-width:600px">
                    <input type="hidden" id="uploadBid" value="" />
                    <input type="hidden" id="uploadUid" value="" />
                    <input type="hidden" id="uploadPt" value="" />
                    <input type="hidden" id="uploadMid" value="" />
                    <input type="hidden" id="uploadMtype" value="" />
                    <input type="hidden" id="uploadPath" value="" />
                    <input type="hidden" id="uploadUuid" value="" />
               <div id="jqxWidget" style="margin: 0 auto; display: block; direction: rtl">
                <div id="splitter">
                    <div style="overflow: auto;" id="ContentPanel">
                    </div>
                    <div style="overflow:hidden;" id="MediaPanel">
                        <div style="border: none;" id="MediaList">
                        </div>
                    </div>
                </div>
                <div id="uploader" style="width:100%;display:block;">
                    <div style="width: 90%">
                        <div class="form-group active" style="padding: 10px">
                            <span class="btn-sm btn-success fileinput-button">
                                <i class="glyphicon glyphicon-plus"><span>הוספת קובץ</span></i>
                                <input id="fileupload" type="file" name="files[]" multiple>
                            </span><span>&nbsp;</span>
                            <span id="spnRemove" class="btn-sm btn-success fileinput-button">
                                <i class="glyphicon glyphicon-minus"><span>הסרת קובץ</span></i>
                                <input id="fileremove" type="button" value="הסרת קובץ" />
                            </span><span>&nbsp;</span>
                            <span id="spnRefresh" class="btn-sm btn-success fileinput-button">
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
    </div>*/}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1];

            if (readonly)
                html = html.replace('form-group active', 'form-group pasive')

            //if (slf.Model.Option == "a") {
            //    html = html.replace('form-group active', 'form-group pasive')
            //}

            var container = $(html);
            $(slf.tagDiv).empty();
            $(slf.tagDiv).append(container);

            $('.group1').colorbox({ rel: 'group1' });
            this.appMedia = new media_uploader(buildingId, propertyId, propertyType);

            $("#spnRemove").hide();
            $("#splitter").jqxSplitter({//orientation: 'horizontal',
                width: '100%', height: '300px',
                panels: [
                   { size: '85%', min: "5%" },
                   { size: "15%", min: "10%", collapsible: false }
                ]
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
                    if (index <= 2)
                    {
                        console.log(value.MediaPath);
                        var id ='media-item-'+ value.MediaId;
                        if (value.MediaPath && value.MediaType == 'img') {
                            var src = app_rout.mediaPath() + value.MediaType + "/" + value.MediaPath;
                            $("#media_images").append('<div id="' + id + '"><img id="theImg" src="' + src + '" style="max-width:240px;border:solid 1px #808080" /></div>');
                        }
                        else if (value.MediaPath && value.MediaType == 'doc') {
                            var src = app_rout.mediaPath() + value.MediaType + "/" + value.MediaPath;
                            $("#media_images").append('<div id="' + id + '"><a href="' + src + '"><img id="theImg" src="/Images/doc.jpg" style="max-width:240px;border:solid 1px #808080" /></a></div>');
                        }
                        else if (value.MediaPath && value.MediaType == 'video') {
                            var src = app_rout.mediaPath() + value.MediaType + "/" + value.MediaPath;
                            $("#media_images").append('<div id="' + id + '"><a href="' + src + '"><img id="theImg" src="/Images/video.jpg" style="max-width:240px;border:solid 1px #808080" /></a></div>');
                        }
                    }
                    //if (index > 2)
                    //    return;
                });
                if ($("#media_images").length > 0) {
                    $('#media_images').jqxScrollView({
                        width: 300,
                        height: 250,
                        buttonsOffset: [0, 0]
                    });
                }

            },
            error: function (e) {
                //alert(e);
            }
        });

    }
};
*/


