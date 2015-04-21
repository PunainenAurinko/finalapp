function thumbnail(id, b64) {
	
	////////////////////////////////////////////////////////////////////
	//
	//	FIELDS
	
	this.id = id;
	this.base64 = b64;
	
	//for testing - Remove ///
	this.filepath = "img/DSC_5774.JPG"
	
	////////////////////////////////////////////////////////////////////
	//
	//	METHODS
	
	this.makeDOMElement = function() {
		// list.php
		var parent = document.getElementById('grid'),
			newContainer = document.createElement('div'),
			newImg = document.createElement('img'),
			newBtn = document.createElement('button');
		
		// Set attributes for image container
		newContainer.setAttribute('class', 'imgContainer');
		newContainer.setAttribute('id', 'imgContainer'+id);
		
		// set attributes for image
		newImg.setAttribute('src', this.base64);
		newImg.setAttribute('class', 'thumb')
		newImg.setAttribute('id', 'thumb'+id);
		newImg.setAttribute('width', '180px');

		// Set attributes for delete button
		newBtn.setAttribute('class', 'delBtn');
		newBtn.setAttribute('id', 'btn'+id);
		newBtn.textContent = "Delete";
		
		// Event listeners
		newImg.addEventListener('click', this.getFullImage);
		newBtn.addEventListener('click', this.deleteImage);
		
		// Append new elements to DOM
		newContainer.appendChild(newImg);
		newContainer.appendChild(newBtn);
		parent.appendChild(newContainer);
	}
	
	this.getFullImage = function() {
        
        var fullPhoto = document.getElementById('fullphoto'),
            closeBtn = document.getElementById('photoClose'),
            tab = document.querySelector('.tabs'),
            bigImage = document.createElement('img'),
            first = fullPhoto.firstChild,
            deviceId = app.dev_id,
            picId = id,
            urlString = 'http://m.edumedia.ca/benn0039/mad9022/get.php?dev='+deviceId + '&img_id=' + picId;
        
         //TODO: deviceID will come from Cordova plugin
            
        var jjj = sendRequest(urlString, function(resp){
            var data = JSON.parse(resp.responseText);
                console.log(resp);
            switch(data.code){
                  case 0:
                    console.log("SUCCESS: " +data);
                    
                        bigImage.setAttribute('src', data.data);
                        fullPhoto.insertBefore(bigImage, first);
                    
                         // Display large version of image
                        fullPhoto.style.display = 'block';

                        // hide tabs... a little distracting
                        tab.style.display = 'none';

                        closeBtn.addEventListener('click', close);
                    
                        console.log("SUCCESS and you got some data!");
                    break;
                    
                case 423:
                    console.log("ERROR: " +data.message);
                    break;
                    
                case 543:
                    console.log("ERROR: " +data.message);
                    break;
            }
        }, "POST");
        
        // Close big picture 
        function close() {
            fullPhoto.style.display = 'none';
            tab.style.display = 'block';
            closeBtn.removeEventListener('click', close);
            fullPhoto.removeChild(bigImage);
        }
		 
		
	}
		
	this.deleteImage = function(ev) {
        var deviceId = app.dev_id,
            picId = id,
            urlString = 'http://m.edumedia.ca/benn0039/mad9022/delete.php?dev='+deviceId + '&img_id=' + picId;
        
         //TODO: deviceID will come from Cordova plugin
            
        var jjj = sendRequest(urlString, function(resp){
            var data = JSON.parse(resp.responseText);
                console.log(resp);
            switch(data.code){
                  case 0:
                    console.log("SUCCESS: " +data);
                    var delThisShiz = confirm("Are you sure you want to delete this image?");
                    if(delThisShiz){
                        var delImg = document.getElementById('thumb' + id),
                        delImgContainer = document.getElementById('imgContainer' + id),
                        parent = document.getElementById('grid');
                        var delBtn = document.getElementById('btn' + id);

                        // Remove Event Listeners
                        delBtn.removeEventListener('click', this.deleteImage);
                        delImg.removeEventListener('click', this.getFullImage);
                        alert(id);
                        // Remove nodes from DOM
                        parent.removeChild(delImgContainer);
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
		
	}
}


function createAJAXObj() {
    'use strict';
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
}
function sendRequest(url, callback, postData) {
    'use strict';
    var req = createAJAXObj(), method = (postData) ? "POST" : "GET";
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
}