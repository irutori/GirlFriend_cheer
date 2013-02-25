var myport = null;
var flag = false;

chrome.extension.onConnect.addListener(function(port){
	port.onMessage.addListener(function(msg){
		myport = port;
		if(flag){
			if(msg.url && msg.url.match("mypage")){
				saveId();
				if(getId()%500 == 0){
					port.postMessage({wait: "please"});
				}else{
					port.postMessage({id: localStorage["gf_id"]});
				}
			}else if(msg.wait == "done"){
				port.postMessage({id: localStorage["gf_id"]});
			}else{
				port.postMessage({});
			}
		}
	});
});

chrome.browserAction.onClicked.addListener(function(tab){
	if(flag){
		flag = false;
	}else{
		flag = true;
		myport.postMessage({id: localStorage["gf_id"]});
	}
});

function getId(){
	var temp = localStorage["gf_id"]?localStorage["gf_id"]:"1001";
	return parseInt(temp,10);
}

function saveId(){
	temp = getId();
	console.log(temp);
	temp++;
	console.log(temp);
	localStorage["gf_id"] = ""+temp;
}