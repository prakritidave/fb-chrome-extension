
var timeoutID;


function setup() {
    this.addEventListener('mousemove', resetTimer, false);
    this.addEventListener('mousedown', resetTimer, false);
    this.addEventListener('keypress', resetTimer, false);
    this.addEventListener('scroll', resetTimer, false);
    this.addEventListener('wheel', resetTimer, false);
    this.addEventListener('touchmove', resetTimer, false);
    this.addEventListener('pointermove', resetTimer, false);

    startTimer();
}

setup();

function startTimer() {
    timeoutID = window.setTimeout(goInactive, 5000);
}

function resetTimer(e) {
    window.clearTimeout(timeoutID);
    goActive();
}

function goInactive() {
    chrome.runtime.sendMessage({ userActive: false });
}

function goActive() {
    chrome.runtime.sendMessage({ userActive: true });
    startTimer();
}



// Listen for messages
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    // If the received message has the expected format...
    if (msg.text === 'report_back') {
        // Call the specified callback, passing
        // the web-page's DOM content as argument                    
         var profilePicElement=document.getElementsByClassName('profilePic img')[0];

         if(profilePicElement != undefined){

            var picSrc=profilePicElement.src;

            var profileName=document.getElementById('fb-timeline-cover-name').innerHTML; 
            
            var x = document.getElementsByClassName('_2nlj _2xc6');
            profileId= x[0].children[0].children[0].getAttribute('href');
        
            sendResponse(picSrc+"#"+profileName+"#"+profileId);
              
         }                         

    }
});




