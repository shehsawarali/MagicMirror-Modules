var NodeHelper = require('MMM-Lums_Calendar/node_helper');
const fetch = require('node-fetch');
const cheerio = require('cheerio');

module.exports = NodeHelper.create({
	config:null,
	init(){
		console.log("init module helper MMM-Lums-Calendar");
	},
	start() {
		console.log(`Starting module helper: MMM-Lums-Calendar`);
	},
	stop(){
		console.log(`Stopping module helper: MMM-Lums-Calendar`);
	},
	
	socketNotificationReceived(notification, payload) {
		console.log("Academic Calendar Request: ", notification);
		
		if (notification === "CONFIG") {
			this.config = payload
		}
		else if(notification === "getLumsCalendar") {
			 this.getMenu();
		}
	},
	
	getMenu(){
		const url = "http://api.scraperapi.com?api_key=6e5bb3ff854ce6b6ae3bd4d28ff01c16&url=https://lums.edu.pk/academic-calendar";
		calendar = [];

		fetch(url)
		.then(response => response.text())
		.then(text => {
			$ = cheerio.load(text);

			var table = $('.table.table-bordered');
			body = $(table[0]).find('tbody');
			rows = $(body).find('tr').each( function (index, row){
				timeStamps = []
				dateArray = []

				title = $(row).find('strong').text();
				if(title == ''){
					title = $(row).find('p').text();
				}
				times = $(row).find('time').each(function (index2, time){
					dateArray.push($(time).text());
					timeStamps.push($(time).attr('datetime'));
				});

				date = dateArray.join(' - ');
				startTime = timeStamps[0];
				endTime = null;
				if(timeStamps.length > 1)
					endTime = timeStamps[1];
				
				calendar.push([date, title, startTime, endTime])
			})

			calendar.sort(function(x, y){
				return x[2] - y[2];
			})

			this.sendSocketNotification("lumsCalendar", calendar)
		});
	},
})
