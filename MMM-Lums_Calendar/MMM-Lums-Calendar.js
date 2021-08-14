Module.register("Lums_Calendar", {
	
	calendar: null,
	
	start: function() {
		this.count = 0;
		var timer = setInterval(() => {
			this.updateDom();
			this.count++;
		}, 10000)
	},
	
	getDom: function() {
		var list = document.createElement("div");
		list.className = "myCalendar";
		var title =  document.createElement("p");
		title.innerHTML = "Academic Calendar";
		title.className = "myContentTitle";
		list.appendChild(title);
		list.appendChild(document.createElement('br'));
		list.appendChild(document.createElement('br'));
		
		if(this.calendar == null){
			var error = document.createElement('p');
			error.innerHTML = "Fetching Academic Calendar...",
			error.className = 'myContentData';
			list.append(error);
		}
		else{
			var table = document.createElement('table');
			var header = document.createElement('tr');
			
			var heading = document.createElement('th');
			heading.innerHTML = "Date";
			heading.className = "dateColumn";
			header.appendChild(heading);
			
			var heading2 = document.createElement('th');
			heading2.innerHTML = "Description";
			heading2.className = "descriptionColumn";
			header.appendChild(heading2);
			
			table.appendChild(header)
			
			for (const event of this.calendar){
				var row = document.createElement('tr');
				var data = document.createElement('td');
				data.className = "myContentData dateColumn";
				data.innerHTML = event[0];
				row.appendChild(data);
				
				if(event.length > 1){
					var data2 = document.createElement('td');
					data2.className = "myContentData descriptionColumn";
					data2.innerHTML = event[1];
					row.appendChild(data2);
				}
				table.appendChild(row)
			}
			
			list.appendChild(table);
		}

		return list;
	},
	
	notificationReceived: function(notification, payload, sender) {
		console.log(notification);
		if(notification == 'ALL_MODULES_STARTED'){
			this.sendSocketNotification("CONFIG",this.config)
			//var timer = setInterval(() => {
				console.log("Fetching Lums Academic Calendar");
				this.sendSocketNotification("getLumsCalendar", null);
			//}, 10000)
		}
	},
	socketNotificationReceived: function(notification, payload) {
		console.log(notification);
		if(notification == "dis response"){
			var elem = document.getElementById("COUNT");
			elem.innerHTML = "Count:" + payload;
		}
		
		if(notification == "lumsCalendar"){
			this.calendar = payload;
			console.log(payload);
		}
	},
})
