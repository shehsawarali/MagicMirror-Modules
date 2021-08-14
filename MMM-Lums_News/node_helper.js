var NodeHelper = require('MMM-Lums_News/node_helper');
const fetch = require('node-fetch');
const cheerio = require('cheerio');

module.exports = NodeHelper.create({
	config:null,
	init(){
		console.log("init module helper MMM-PDC");
	},
	start() {
		console.log(`Starting module helper: MMM-PDC`);
	},
	stop(){
		console.log(`Stopping module helper: MMM-PDC`);
	},
	
	socketNotificationReceived(notification, payload) {
		console.log("PDC Request: ", notification);
		
		if (notification === "CONFIG") {
			this.config = payload
		}
		else if(notification === "getNews") {
			 this.getMenu();
		}
	},
	
	getMenu(){
		const url = "http://api.scraperapi.com?api_key=6e5bb3ff854ce6b6ae3bd4d28ff01c16&url=https://sbasse.lums.edu.pk";
		news = [];
		
		fetch(url)
		.then(response => response.text())
		.then(text => {
			$ = cheerio.load(text);
			console.log()
			titles = $('.titl').each( function (index, title){
				news.push($(title).text())
			})
			
			this.sendSocketNotification("sbasseNews", news)
		});
	},
})
