      jqxAlert = {  
           // top offset.  
           top: 0,  
           // left offset.  
           left: 0,  
           // opacity of the overlay element.  
           overlayOpacity: 0.2,  
           // background of the overlay element.  
           overlayColor: '#ddd',  
           // display alert.  
           alert: function (message, title) {  
                if (title == null) title = 'Alert';  
                jqxAlert._show(title, message);  
           },  
           // initializes a new alert and displays it.  
           _show: function (title, msg) {  
                jqxAlert._hide();  
                jqxAlert._handleOverlay('show');  
                $("BODY").append(  
                          '<div class="jqx-alert" style="width: auto; height: auto; overflow: hidden; white-space: nowrap;" id="alert_container">' +  
                          '<div id="alert_title"></div>' +  
                          '<div id="alert_content">' +  
                               '<div id="message"></div>' +  
                               '<input style="margin-top: 10px;" type="button" value="Ok" id="alert_button"/>' +  
                          '</div>' +  
                          '</div>');  
                $("#alert_title").text(title);  
                $("#alert_title").addClass('jqx-alert-header');  
                $("#alert_content").addClass('jqx-alert-content');  
                $("#message").text(msg);  
                $("#alert_button").width(70);  
                $("#alert_button").click(function () {  
                     jqxAlert._hide();  
                });  
                jqxAlert._setPosition();  
           },  
           // hide alert.  
           _hide: function () {  
                $("#alert_container").remove();  
                jqxAlert._handleOverlay('hide');  
           },  
           // initialize the overlay element.   
           _handleOverlay: function (status) {  
                switch (status) {  
                     case 'show':  
                          jqxAlert._handleOverlay('hide');  
                          $("BODY").append('<div id="alert_overlay"></div>');  
                          $("#alert_overlay").css({  
                               position: 'absolute',  
                               zIndex: 99998,  
                               top: '0px',  
                               left: '0px',  
                               width: '100%',  
                               height: $(document).height(),  
                               background: jqxAlert.overlayColor,  
                               opacity: jqxAlert.overlayOpacity  
                          });  
                          break;  
                     case 'hide':  
                          $("#alert_overlay").remove();  
                          break;  
                }  
           },  
           // sets the alert's position.  
           _setPosition: function () {  
                // center screen with offset.  
                var top = (($(window).height() / 2) - ($("#alert_container").outerHeight() / 2)) + jqxAlert.top;  
                var left = (($(window).width() / 2) - ($("#alert_container").outerWidth() / 2)) + jqxAlert.left;  
                if (top < 0) {  
                     top = 0;  
                }  
                if (left < 0) {  
                     left = 0;  
                }  
                // set position.  
                $("#alert_container").css({  
                     top: top + 'px',  
                     left: left + 'px'  
                });  
                // update overlay.  
                $("#alert_overlay").height($(document).height());  
           }  
      }  
 
 /*
 <script type="text/javascript">  
     $(document).ready(function () {  
         jqxAlert.alert('Alert Message');  
     })  
   </script>  
*/