var ajg = function (options, callback) {
    var default_options = {
        async: "true",
        type: "POST",
        url: "",
        data: {},
        dataType: "json",
        timeout: 0,
        loading: true,
        beforeSend: function (x) {
            gf.log("_____beforesend_____")
        },
        success: function (data) {
            gf.log("_____success_____");
            gf.log(data);
            if (data && data.resultStatus) if (data.resultStatus === "success") callback(data, status, xhr);
            else if (data.resultStatus === "user_alert") options.success_user_alert(data);
            else if (data.resultStatus === "token_error") options.tokenError(data);
        },
        success_user_alert: function (json) {
            gf.log("_____success alert_____")
        },
        tokenError: function (json) {
            gf.log("_____token error_____")
        },
        error: function (res, status, err) {
            gf.log("_____error_____");
            gf.log(res);
            gf.log(status);
            gf.log(err);
            gf.log("____________________");
        }
    };
    var xhr = new XMLHttpRequest,
        data, timerId;
    for (var i in default_options) if (options[i] === undefined) options[i] = default_options[i];
    options.loading && gf.util.loadingPanel.show();
    if (options.beforeSend && options.beforeSend instanceof Function) options.beforeSend.apply(xhr, [xhr, "setting is not supported"]);
    if (options.timeout > 0) timerId = setTimeout(function () {
        xhr.abort();
        if (options.error && options.error instanceof Function) options.error.apply(xhr, [xhr, "timeout", new Error("Ajax timeout: " + options.timeout)])
    }, options.timeout);
    if (options.url) {
        var _separator = "";
        if (options.url.indexOf("?") > -1) if (options.url.slice(-1) ===
            "?" || options.url.slice(-1) === "&") _separator = "";
        else _separator = "&";
        else _separator = "?";
        options.url = options.url + _separator + "__r=" + (new Date).getTime().toString()
    }
    gf.log("ajax URL:" + options.url);
    xhr.open(options.type || "GET", options.url, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) if (xhr.status === 200 || xhr.status === 0) {
            gf.log(xhr);
            if (options.dataType.toLowerCase() === "json") data = JSON.parse(xhr.responseText);
            options.success.apply(xhr, [data, xhr.statusText, xhr]);
            options.loading && gf.util.loadingPanel.hide()
        } else {
            throw new Error("Ajax failed: " + xhr.status);
            if (options.error && options.error instanceof Function) {
                xhr.abort();
                options.error.apply(xhr, [xhr, xhr.statusText, err])
            }
        }
    };
    xhr.onload = function () {
        if (timerId) clearTimeout(timerId)
    };
    if (options.data) {
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        var params = [];
        for (var name in options.data) {
            var value = options.data[name];
            if (value === undefined) value = "";
            var param = encodeURIComponent(name).replace(/%20/g, "+") + "=" + encodeURIComponent(value).replace(/%20/g, "+");
            params.push(param)
        }
        postdata = params.join("&")
    }
    setTimeout(function () {
        xhr.send(postdata)
    }, 100)
};

function add(func) {
        var script = document.createElement("script");
        script.appendChild(document.createTextNode("var ajaxJsonGlobal = " + func.toString()));
        document.body.appendChild(script);
}	

add(ajg);
	
var port = chrome.extension.connect({name: "gf"});
port.postMessage({url: location.href});

port.onMessage.addListener(function(msg) {
	if(msg.id){
		setTimeout(function(){
			location.href = "http://vcard.ameba.jp/profile?userId="+msg.id;
		},retRnd(5000,2000));
	}else if(msg.wait){
		setTimeout(function(){
			port.postMessage({wait: "done"});
		},retRnd(900000,900000));
	}else{
		setTimeout("send()",retRnd(1500,1000));
	}
});

function send(){
	$('.btnBlue')[0].click();
	setTimeout("cancel()",retRnd(1500,1000));
}

function cancel(){
	$('#cancelSend input').click();
	setTimeout("mypage()",retRnd(1500,1000));
}

function retRnd(base,modif){
	return Math.random() * modif + base;
}

function mypage(){
	location.href = "http://vcard.ameba.jp/mypage";
}