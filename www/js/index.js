/////////////////////////
///
///     Course: MAD9022 Cross-Platform App Development
///     Students: Justin Bennet & Vladimir Tonkonogov
///     Project: Final App

/////////////////////////
///
///     Application Constructor

var app = {
    pages: [],
    links: [],
    numLinks: 0,
    numPages: 0,
    canvas: null,
    context: null,
    img: null,
    dev_id: null,
    full_img: null,
    thumb: null,
    req: null,
    //    urlString: '',
    initialize: function () {
        this.bindEvents();
    },

    /////////////////////////
    ///
    ///     Bind Event Listeners
    
    bindEvents: function () {
        document.addEventListener('DOMContentLoaded', this.onContentLoaded, false);
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    /////////////////////////
    ///
    ///     DOMContentLoaded Event Handler - set up navigation listener
    
    onContentLoaded: function () {
        pages = document.querySelectorAll('[data-role="page"]');
        numPages = pages.length;
        links = document.querySelectorAll('[data-role="pagelink"]');
        numLinks = links.length;
        for (var i = 0; i < numLinks; i++) {
            links[i].addEventListener('click', app.handleNav, false);
        }
        app.loadPage(null);
    },

    /////////////////////////
    ///
    ///     Handle tab click event to navigate between pages

    handleNav: function (ev) {
        ev.preventDefault();
        var href = ev.currentTarget.href;
        var parts = href.split('#');
        console.log('Clicked: page ' + parts[1]);
        app.loadPage(parts[1]);
        return false;
    },

    /////////////////////////
    ///
    ///     Handle page transitions

    loadPage: function (url) {
        if (url == null) {
            //home page first call
            pages[0].style.display = 'block';
            history.replaceState(null, null, '#home');
        } else {

            for (var i = 0; i < numPages; i++) {
                if (pages[i].id == url) {
                    pages[i].style.display = 'block';
                    pages[i].className = 'active';
                    history.pushState(null, null, '#' + url);
                } else {
                    pages[i].className = '';
                    pages[i].style.display = 'block';
                }
            }
            for (var t = 0; t < numLinks; t++) {
                links[t].className = '';
                if (links[t].href == location.href) {
                    links[t].className = 'activetab';
                }
            }
        }
    },

    /////////////////////////
    ///
    ///     deviceready Event Handler function - get unique device id
    
    onDeviceReady: function () {
        console.log("DEVICE IS READY");
        app.dev_id = device.uuid;
        console.log('Device ID: ' + app.dev_id);
        app.receivedEvent('deviceready');
    },

    /////////////////////////
    ///
    ///     Set up event listener for take photos button
    
    receivedEvent: function () {
        var camlink = document.querySelector('#camlink');
        camlink.addEventListener('click', app.takePhoto);
        
        // Event listener for Grid tab.... may need to add one for the other tab to clear out
        // existing elements. 
		
		var gridpage = document.getElementById('gridpage');
		gridpage.addEventListener('click', app.showGridPage);
    },
    
    /////////////////////////////////////////////////////////////////
    //
    // JUSTIN ADDED
    
    showGridPage: function() {
        
        //TODO: deviceID will come from Cordova plugin
        var deviceId = app.dev_id,
            urlString = 'http://m.edumedia.ca/benn0039/mad9022/list.php?dev=' + deviceId;
            
        var jjj = sendRequest(urlString, function(resp){
            var data = JSON.parse(resp.responseText);
            console.log(resp);
            switch(data.code){
                  case 0:
                    console.log("SUCCESS: " +data.message);
                    
                    //successfully returned an object but could be empty...
                    if (data.thumbnails.length != 0) {
                        
                    // create new thumbnail for each record
                        for(var i = 0; i < data.thumbnails.length; i++) {
                            var thumb = new thumbnail(data.thumbnails[i].id, data.thumbnails[i].data);
                            thumb.makeDOMElement();
                        }                       
                        console.log("SUCCESS and you got some data!");
                    } else {
                        console.log("Connected to the database but it appears you don't have anything to get?");
                    }
                    break;
                    
                case 423:
                    console.log("ERROR: " +data.message);
                    break;
                    
                case 543:
                    console.log("ERROR: " +data.message);
                    break;
            }
        }, "POST");
    },
    //
    //
    ///////////////////////////////////////////////////////////////
    
    /////////////////////////
    ///
    ///     Take photos using the device camera

    takePhoto: function () {
        console.log('takePhoto func');
        navigator.camera.getPicture(app.cameraSuccess, app.cameraError, {
            quality: 50,
            destinationType: Camera.DestinationType.DATA_URL
        });
    },

    /////////////////////////
    ///
    ///     Camera success function - resize the taken image and display it on canvas
    
    cameraSuccess: function (imageData) {
        canvas = document.querySelector('#canvas');
        context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
        canvas.width = 700;
        canvas.height = 500;
        //        context.drawImage("data:image/jpeg;base64," + imageData, 0, 0, canvas.width, canvas.height);
        img = document.createElement('img');
        img.addEventListener('load', function (ev) {
            console.log('Original image width: ' + img.width + '\nOriginal image height: ' + img.height)
            var imgWidth = ev.currentTarget.width;
            var imgHeight = ev.currentTarget.height;
            var aspectRatio = imgWidth / imgHeight;
            console.log(aspectRatio);
            ev.currentTarget.height = canvas.height;
            ev.currentTarget.width = canvas.height * aspectRatio;
            var w = img.width;
            var h = img.height;
            console.log('width: ', w, ' height: ', h, ' aspect ratio: ', aspectRatio);
            canvas.width = w;
            canvas.style.width = w + 'px';
            canvas.height = h;
            canvas.style.height = h + "px";
            context.drawImage(img, 0, 0, w, h);
        });
        img.src = 'data:image/jpeg;base64,' + imageData;
        document.querySelector('#btnAdd').addEventListener('click', app.addText);
    },
    
    /////////////////////////
    ///
    ///     Add text to image
    
    addText: function (ev) {
        var txt = document.querySelector('#txt').value;
        if (txt != '') {
            //clear the canvas
            context.clearRect(0, 0, canvas.w, canvas.h);
            //reload the image
            var w = img.width;
            var h = img.height;
            context.drawImage(img, 0, 0, w, h);
            //THEN add the new text to the image
            var middle = canvas.width / 2;
            if (document.getElementById('radiotop').checked == true) {
                var bottom = canvas.height - 400;
                console.log('top radio button checked');
            } else {
                var bottom = canvas.height - 50;
            }
            context.font = '30px "Helvetica Neue", Helvetica, Arial, sans-serif';
            context.fillStyle = "red";
            context.strokeStyle = "black";
            context.textAlign = "center";
            context.fillText(txt, middle, bottom);
            context.strokeText(txt, middle, bottom);
        }
        app.full_img = canvas.toDataURL("image/png");
        document.querySelector('#btnSave').addEventListener('click', app.saveImage);
    },
    
    /////////////////////////
    ///
    ///     Resize thumbnal image and save both images to a postData variable
    ///     Send request to database

    saveImage: function () {
        console.log("SaveImage function");
        var imgWidth = img.width;
        var imgHeight = img.height;
        var aspectRatio = imgWidth / imgHeight;
        
        // Resize the thumbnail image to be 180px wide & save base64 png image to thumb variable
        var h = 180 / aspectRatio;
        var w = 180;
        console.log("width: ", w, " height: ", h, " aspect ratio: ", aspectRatio);
        img.height = h / aspectRatio;
        img.width = w;
        canvas.height = h;
        canvas.style.height = h + "px";
        canvas.width = w;
        canvas.style.width = w + "px";
        context.drawImage(img, 0, 0, w, h);
        app.thumb = canvas.toDataURL("image/png");
        
        app.full_img = encodeURIComponent(app.full_img);
        app.thumb = encodeURIComponent(app.thumb);
        var url = "http://m.edumedia.ca/tonk0006/mad9022/final/save.php";
        var postData = "dev=" + app.dev_id + "&img=" + app.full_img  + "&thumb=" + app.thumb;
        app.sendRequest(url, app.imgSaved, postData);

//        context.clearRect(0, 0, canvas.width, canvas.height);
    },

    
    /////////////////////////
    ///
    ///     CROSS BROWSER AJAX CALL
    ///     Create ajax obj

    createAJAXObj: function () {
        try {
            return new XMLHttpRequest();
        } catch (er1) {
            try {
                return new ActiveXObject("Msxml3.XMLHTTP");
            } catch (er2) {
                try {
                    return new ActiveXObject("Msxml2.XMLHTTP.6.0");
                } catch (er3) {
                    try {
                        return new ActiveXObject("Msxml2.XMLHTTP.3.0");
                    } catch (er4) {
                        try {
                            return new ActiveXObject("Msxml2.XMLHTTP");
                        } catch (er5) {
                            try {
                                return new ActiveXObject("Microsoft.XMLHTTP");
                            } catch (er6) {
                                return false;
                            }
                        }
                    }
                }
            }
        }
    },

    /////////////////////////
    ///
    ///     Make an ajax call

    sendRequest: function (url, callback, postData) {
        req = app.createAJAXObj(), method = (postData) ? "POST" : "GET";
        if (!req) {
            return;
        }
        req.open(method, url, true);
        //req.setRequestHeader('User-Agent', 'XMLHTTP/1.0');
        if (postData) {
            req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        }
        req.onreadystatechange = function () {
            if (req.readyState !== 4) {
                return;
            }
            if (req.status !== 200 && req.status !== 304) {
                return;
            }
            callback(req);
        }
        req.send(postData);
    },
    
    /////////////////////////
    ///
    ///     Handle ajax call response

    imgSaved: function (req) {
        alert(req.responseText);
        console.log(req.responseText);
    },
    
    /////////////////////////
    ///
    ///     Handle camera errors

    cameraError: function (message) {
        alert('Error: ' + message);
        console.log('Error: ' + message);
    }

};

/////////////////////////
///
///     Initialize the app variable

app.initialize();