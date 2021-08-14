Module.register("MMM-PDC-Menu", {
	
	//menu: null,
	menu: [],
	
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
		//var title =  document.createElement("p");
		//title.innerHTML = "PDC Menu";
		//title.className = "myContentTitle";
		//list.appendChild(title);
		//list.appendChild(document.createElement('br'));
		
		if(this.menu.length == 0){
			var error = document.createElement('p');
			error.innerHTML = "Today's menu has not been updated.",
			error.className = 'myContentData';
			list.append(error);	
		}
		else{
			
			for(var time in this.menu){	
				var menuByTime = document.createElement('div');
				var title =  document.createElement("p");
				title.innerHTML = time;
				title.className = "myContentTitle";
				menuByTime.appendChild(title);
				menuByTime.appendChild(document.createElement('br'));
				var append = true;
				
				for (const item of this.menu[time]){
					if(item == 'Not defined yet')
						append = false;
					var htmlitem = document.createElement("p");
					htmlitem.innerHTML = item;
					htmlitem.className = "myMenuData";
					menuByTime.appendChild(htmlitem);
				}
				
				if(append)
					list.appendChild(menuByTime);
			}
		}
		return list;
	},
	
	notificationReceived: function(notification, payload, sender) {
		console.log(notification);
		if(notification == 'ALL_MODULES_STARTED'){
			this.sendSocketNotification("CONFIG",this.config)
			//var timer = setInterval(() => {
				console.log("Ask for menu");
				this.sendSocketNotification("getPdcMenu", null);
			//}, 10000)
		}
	},
	socketNotificationReceived: function(notification, payload) {
		console.log(notification);
		if(notification == "dis response"){
			var elem = document.getElementById("COUNT");
			elem.innerHTML = "Count:" + payload;
		}
		
		if(notification == "PdcMenu"){
			this.menu = payload;
			console.log(payload);
		}
	},
})
