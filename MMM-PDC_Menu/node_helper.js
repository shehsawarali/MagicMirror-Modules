var NodeHelper = require('MMM-PDC_Menu/node_helper');
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
		else if(notification === "getPdcMenu") {
			 this.getMenu();
		}
	},
	
	getMenu(){
		const url = "http://api.scraperapi.com?api_key=6e5bb3ff854ce6b6ae3bd4d28ff01c16&url=https://pdc.lums.edu.pk";
		menu = {};
		timing = [];

		fetch(url)
		.then(response => response.text())
		.then(text => {
			$ = cheerio.load(text);

				//GET ALL TIMINGS AND STORE IN TIMING ARRAY
				var tableHeadings = $('table').filter(function(){
					var margin = $(this).css("margin-top");
					return margin === "50px";
				}).each( function (index, heading){
					timing.push($("h3", heading).text())
				});
				
				var foodTable = $('.table_border');
				// console.log(foodTable);
			
				for(var i = 0; i < timing.length; i++){
					if(i < foodTable.length){
						temp = []
						tableRows = $("tr", foodTable[i]).each(function(index, row){
							item = $('td', row).eq(1);
			
							if(item){
								temp.push($(item).text());
							}
						})
			
						temp.shift();
						if(temp.length <= 1){
							temp.shift();
							temp.push("Not defined yet")
						}
			
						menu[timing[i]] = temp;
					}
				}
				
				this.sendSocketNotification('PdcMenu', menu);
				console.log(menu);
		});
	},
})
