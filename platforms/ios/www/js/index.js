/*
Course: MAD9022 Cross-Platform App Development
Students: Justin Bennet & Vladimir Tonkonogov
Project: Final App
 */

var app = {
    // Application Constructor
    pages: [],
    links: [],
    numLinks: 0,
    numPages: 0,
    initialize: function () {
        this.bindEvents();
    },

    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        document.addEventListener('DOMContentLoaded', this.onContentLoaded, false);
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    // DOMContentLoaded Event Handler function
    //
    onContentLoaded: function () {
        pages = document.querySelectorAll('[data-role="page"]');
        numPages = pages.length;
        links = document.querySelectorAll('[data-role="pagelink"]');
        numLinks = links.length;
        for (var i = 0; i < numLinks; i++) {
            //either add a touch or click listener

            links[i].addEventListener("click", app.handleNav, false);
        }
        app.loadPage(null);
    },

    // deviceready Event Handler function
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function () {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function (id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },

    // Handle the click event

    handleNav: function (ev) {
        ev.preventDefault();
        var href = ev.currentTarget.href;
        var parts = href.split("#");
        console.log("Clicked: page " + parts[1]);
        app.loadPage(parts[1]);
        return false;
    },

    // Deal with history API and switching between tabs, and enable transitions

    loadPage: function (url) {
        if (url == null) {
            //home page first call
            pages[0].style.display = 'block';
            history.replaceState(null, null, "#home");
        } else {

            for (var i = 0; i < numPages; i++) {
                if (pages[i].id == url) {
                    pages[i].style.display = "block";
                    pages[i].className = "active";
                    history.pushState(null, null, "#" + url);
                } else {
                    pages[i].className = "";
                    pages[i].style.display = "block";
                }
            }
            for (var t = 0; t < numLinks; t++) {
                links[t].className = "";
                if (links[t].href == location.href) {
                    links[t].className = "activetab";
                }
            }
        }
    }

};

app.initialize();