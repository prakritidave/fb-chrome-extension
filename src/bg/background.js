var interval = null;
var updateTime = 5000;
var currentTabInfo = {};
var currentFacebookProfile={};
var currentFbUrl="";
var userActive = true;
var settings = {};


var getFacebookDetails = function() {
    chrome.storage.local.get('fb', function(data) {
        var index;
        var found =false;             

        if ($.isEmptyObject(data)) {                                  
            var obj = {
                'fb': [{
                    'id': currentFacebookProfile.id,
                    'name':currentFacebookProfile.name,                    
                    'imgSrc': currentFacebookProfile.imgSrc
                }]
            };
            chrome.storage.local.set(obj);
            return;
        }

        $.each(data.fb, function(i, v) {
            if (v.id === currentFacebookProfile.id) {
                index = i;
                found = true;
                return false;
            }
        });

        if (!found) {                                             
            console.log("new Fb Profile "+currentFacebookProfile.name);
            data.fb.push({
                'id': currentFacebookProfile.id,
                'name':currentFacebookProfile.name,                
                'imgSrc': currentFacebookProfile.imgSrc
            });
        }
        chrome.storage.local.set(data);
    });
};



function doStuffWithDom(domContent) {

  if(domContent != undefined){

  	var str=domContent.split("#");

    console.log('I received the following DOM content:\n' + str[0]+' '+str[1]+'profile ID '+str[2]);

    currentFacebookProfile.imgSrc=str[0];
    currentFacebookProfile.name=str[1];
    currentFacebookProfile.id=str[2];
    getFacebookDetails();

  }
      
}


function checkFacebookUrls(tabId){	
       
		console.log('Inside checkFacebookUrls'); 
        chrome.tabs.sendMessage(tabId, {text: 'report_back'}, doStuffWithDom);
}

var getURL = function(url) {
    chrome.storage.local.get('visitedUrls', function(data) {
        var index, found;
        var hostname = new URL(url).hostname;

        if ($.isEmptyObject(data)) {
            currentTabInfo.id = '_' + Math.random().toString(36).substr(2, 9);
            
            currentTabInfo.title = hostname;
            currentTabInfo.time = 0;
            var obj = {
                'visitedUrls': [{
                    'id': currentTabInfo.id,
                    'title': currentTabInfo.title,
                    'time': currentTabInfo.time
                }]
            };
            chrome.storage.local.set(obj);
            return;
        }

        $.each(data.visitedUrls, function(i, v) {
            if (v.title === hostname) {
                index = i;
                found = true;
                return false;
            }
        });

        if (found) {
            var retrieved = data.visitedUrls[index];
            currentTabInfo.id = retrieved.id;
            currentTabInfo.title = retrieved.title;
            currentTabInfo.time = retrieved.time;
        } 
        else {
            currentTabInfo.id = '_' + Math.random().toString(36).substr(2, 9);
            currentTabInfo.title = hostname;
            currentTabInfo.time = 0;
            console.log("currentTabInfo.id "+currentTabInfo.id);
            data.visitedUrls.push({
                'id': currentTabInfo.id,
                'title': currentTabInfo.title,
                'time': currentTabInfo.time
            });
        }

        chrome.storage.local.set(data);
    });
};

var updateURL = function() {
    if (userActive) {
        console.log('User is active on ' + currentTabInfo.title);

        chrome.storage.local.get('visitedUrls', function(data) {
            var index;
            $.each(data.visitedUrls, function(i, v) {
                if (v.title === currentTabInfo.title) {
                    index = i;
                    return false;
                }
            });
            data.visitedUrls[index].time = data.visitedUrls[index].time + 1;

            chrome.storage.local.set(data);
        });
    } else {
        console.log('User is not active on ' + currentTabInfo.title);
    }
};

var getSettings = function() {
    chrome.storage.sync.get('extnSettings', function(data) {
        if (data.extnSettings) {
            settings = data.extnSettings;
            console.log(settings);
        }
    });
};

var getCurrentTab = function() {	
     
    chrome.tabs.query({
        currentWindow: true,
        active: true
    }, function(tabs) {
        var hostname = new URL(tabs[0].url).hostname;

        var found = false;
        for (var i = 0; i < settings.blacklist.length; i++) {
            if (settings.blacklist[i] === hostname) {
                found = true;
            }
        }
        if (!found) {
            console.log('URL not found on blacklist');
            currentTabInfo.blacklist = false;

            console.log('tab id '+tabs[0].id+ 'active tab url '+tabs[0].url);

            if(tabs[0].url.includes("https://www.facebook.com")){ 
                currentFbUrl=  tabs[0].url;   	
            	checkFacebookUrls(tabs[0].id);
            }  

            getURL(tabs[0].url);
            clearInterval(interval);
            interval = null;
            interval = setInterval(function() {
                updateURL();
            }, updateTime);
        } else {
            console.log('URL found on blacklist');
            currentTabInfo.blacklist = true;
            clearInterval(interval);
            interval = null;
        }
    });
};

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (sender.tab) {
        console.log('userActive\'s value is ' + message.userActive);
        userActive = message.userActive;
    } 
});

chrome.runtime.onInstalled.addListener(function(details) {
    if (details.reason === 'install') {
        chrome.storage.sync.get({
            "extnSettings": {
                "blacklist": ['newtab', 'devtools', 'extensions', 'chrome-extensions','hdmagjeicigmhpbeohmojomokncjpnal']
                
            }
        }, function(data) {
            chrome.storage.sync.set(data);
            settings = data.extnSettings;
        });
    }

   
});



chrome.browserAction.onClicked.addListener(function(tab){
    
    chrome.tabs.create( { url: chrome.runtime.getURL("src/override/override.html")} );
   
});


chrome.tabs.onCreated.addListener(function(tab){
    console.log('tab #'+tab.id+' is created!');    
    alert('tab #'+tab.id+' is created!');
});


chrome.windows.onRemoved.addListener(function (windowId){
    console.log('Window #'+windowId+' is closed!');
    alert('Window #'+windowId+' is closed!');
});



function displayMinimizedWindows(windows) {
    for (var i = 0; i < windows.length; i++) {

        console.log('Window #'+windows[i].id+' is minimized!');
        alert('Window #'+windows[i].id+' is minimized!');
        
    }
}

function displayUserInfo(userInfo){
    console.log('user logged in chrome- email '+userInfo.email);
    
    alert('user logged in chrome- email '+userInfo.email);
}

chrome.identity.getProfileUserInfo(function(userInfo){    
   displayUserInfo(userInfo);
});

chrome.windows.getAll(function(windows) {
    var minimized = [];
    
    for (var i = 0; i < windows.length; i++) {
        if (windows[i].state === "minimized") {
            minimized.push(windows[i]);
        }        
    }

    displayMinimizedWindows(minimized);
});



getSettings();
getCurrentTab();

chrome.tabs.onUpdated.addListener(getCurrentTab);
chrome.tabs.onActivated.addListener(getCurrentTab);