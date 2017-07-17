$(function() {
    var settings;

    var getSettings = function() {
        chrome.storage.sync.get('extnSettings', function(data) {
            if (data.extnSettings) {
                settings = data.extnSettings;
                
            }
        });
    };

    getSettings();

    $('.container #clear').on('click', function() {
        chrome.storage.local.remove('visitedUrls');
        location.reload();
    });

     $('.profiles #clearFb').on('click', function() {
        chrome.storage.local.remove('fb');
        location.reload();
    });


    chrome.storage.local.get('visitedUrls', function(data) {
        if ($.isEmptyObject(data)) {
            var $container = $('.container');
            $container.empty();            
            $container.append('<div class="message"><h1>No URLs visited yet</h1></div>');
            return;
        }
        else{
            var urlData = [];
             $.each(data.visitedUrls, function(i, v) {

            if (v.time !== 0) {
                var value = v.time * 5;
                value = value / 60;               
                value = parseFloat(parseFloat(Math.round(value * 100) / 100).toFixed(2));
                if (value === 0) return;
                urlData.push({
                    value: value,                    
                    label: v.title

                });
            }
        });
             var table1=$('.legend')[0];
             mytable=document.createElement("table");

              th1=document.createElement("th");
              th2=document.createElement("th");
     
              th1.innerHTML= "URL";
              th2.innerHTML="Time Spent";
     
              mytable.appendChild(th1);
              mytable.appendChild(th2);            
            
             for(x = 0; x < urlData.length; x++) {
            
                  var urlObj=urlData[x];

            tr=document.createElement("tr");
            td1=document.createElement("td");
            td2=document.createElement("td");                         
            

            td1.innerHTML=urlObj.label;
            td2.innerHTML=urlObj.value;
            
            tr.appendChild(td1);
            tr.appendChild(td2);
            
            mytable.appendChild(tr);
                                    
           }
           table1.appendChild(mytable);

        }

    });
                                         


    chrome.storage.local.get('fb', function(data) {

        if ($.isEmptyObject(data)) {
            var $profiles = $('.profiles');
            $profiles.empty();
            $profiles.append('<div class="fbmessage"><h1>No facebook profiles visited yet</h1></div>');
            return;
        }
        else{

            var fbData = [];

        $.each(data.fb, function(i, v) {
                fbData.push({
                    id: v.id,
                    name: v.name,                  
                    imgSrc: v.imgSrc
                });            
        });

     var table2=$('.fbProfiles')[0];
     tableCreate=document.createElement("table");
     th1=document.createElement("th");
     th2=document.createElement("th");
     th3=document.createElement("th");
     th1.innerHTML= "Name";
     th2.innerHTML="Profile";
     th3.innerHTML="Picture";
     tableCreate.appendChild(th1);
     tableCreate.appendChild(th2);
     tableCreate.appendChild(th3);
     


     for(x = 0; x < fbData.length; x++) {
            
            var fbObj=fbData[x];

            tr=document.createElement("tr");
            td1=document.createElement("td");
            td2=document.createElement("td");
             td3=document.createElement("td");
             anchorTag=document.createElement("a");
            imageTag=document.createElement("img");

            anchorTag.setAttribute("href",fbObj.id);
            anchorTag.innerHTML=fbObj.id;
            imageTag.setAttribute("src", fbObj.imgSrc);

            td1.innerHTML=fbObj.name;
            td2.appendChild(anchorTag);
            td3.appendChild(imageTag);
            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);

            tableCreate.appendChild(tr);

           }
     table2.appendChild(tableCreate);
   }

        
    });
});
