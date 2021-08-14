Module.register("MMM-Lums-News", {
	
	news: ["There is currrently no news available but check back later"],
	
	start: function() {
		this.count = 0;
		var timer = setInterval(() => {
			this.updateDom();
			this.count++;
		}, 10000)
	},
	
	getDom: function() {
		var list = document.createElement("div");
		list.className = "myContent";
		var title =  document.createElement("p");
		title.innerHTML = "News & Events";
		title.className = "myContentTitle";
		list.appendChild(title);
		list.appendChild(document.createElement('br'));
		
		for (const item of this.news){
			var htmlitem = document.createElement("p");
			htmlitem.innerHTML = item;
			htmlitem.className = "myContentData";
			list.appendChild(htmlitem);
		}
		return list;
	},
	
	notificationReceived: function(notification, payload, sender) {
		console.log(notification);
		if(notification == 'ALL_MODULES_STARTED'){
			this.sendSocketNotification("CONFIG",this.config)
			//var timer = setInterval(() => {
				console.log("Fetching SBASSE news and events");
				this.sendSocketNotification("getNews", null);
			//}, 10000)
		}
	},
	socketNotificationReceived: function(notification, payload) {
		console.log(notification);
		if(notification == "dis response"){
			var elem = document.getElementById("COUNT");
			elem.innerHTML = "Count:" + payload;
		}
		
		if(notification == "sbasseNews"){
			this.news = payload;
			console.log(payload);
		}
	},
})
