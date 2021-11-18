    const startBtn = document.getElementById('mp');
	const result = document.getElementById('speech');
	const processing = document.getElementById('disp');
	const delay = ms => new Promise(resu => setTimeout(resu, ms));
	var count=0,heat=null;
	
	// speech to text
	const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
	let toggleBtn = null;
	if (typeof SpeechRecognition === "undefined") {
		startBtn.remove();
		result.innerHTML = "<b>Browser does not support Speech API. Please download latest chrome.<b>";
	} else {
		const recognition = new SpeechRecognition();
		recognition.continuous = true;
		recognition.interimResults = true;
		recognition.onresult = event => {
			const last = event.results.length - 1;
			const tes = event.results[last];
			const text = tes[0].transcript;
			heat=text;
			if (tes.isFinal) {
				processing.innerHTML = "processing ....";

				const response = process(text);
				processing.innerHTML = `You : ${text} </br>Bravo : ${response}`;

				// read it out
				speechSynthesis.speak(new SpeechSynthesisUtterance(response));
			} else {
				processing.innerHTML = `listening: ${text}`;
			}
		}
		let listening = false;
		toggleBtn = () => {
			url='../static/audio/1.wav';
			if(count%2==0){
				new Audio(url).play();
			}
			if (listening) {
				recognition.stop();
				startBtn.classList.remove('anim');
			} else {
				recognition.start();
				startBtn.classList.add('anim');
			}
			listening = !listening;
			count=count+1;
		};

	}
	
	function process(rawText) {
		let text = rawText.replace(/\s/g, "");
		text = text.toLowerCase();
		let response = null;
		let res=null;
		if(text.includes("movie") && text.includes("tellmeabout")){
			text=text.replace("movie","");
			text=text.replace("tellmeabout","");
			$.ajax({
				url: "https://api.themoviedb.org/3/search/movie?api_key=7910374e3a9c43109c4aaf3d543473ac&query="+text,
				async: false,
				dataType: 'json',
				success: function(data) {
					response=data.results[0].overview;
					console.log(data);
				}
			});
			toggleBtn();
			response=response.replace("-","");
		}
		else if(text.includes("tellmeabout")){
			text=text.replace("tellmeabout","");
			var wikiURL = "https://en.wikipedia.org/w/api.php?action=opensearch&search="+text+"&prop=revisions&rvprop=content&format=json&limit=5";
			$.ajax({
				url: wikiURL,
				dataType: 'jsonp',
				async: false,
				success: function(result){
					var secURL=result[3][0];
					window.open(secURL, '_blank');
				},
				
			})
			response="Opening "+text+" in Wikipedia";
			toggleBtn();
		}
		if(text.includes("convert")){
			text=text.replace("convert","");
			var arr=text.split("to");
			var base_code=arr[0];
			var target_code=arr[1];
			
			$.ajax({
				url: "https://v6.exchangerate-api.com/v6/45a89358c7891bcbc26841da/pair/"+base_code+"/"+target_code,
				async: false,
				dataType: 'json',
				success: function(data) {
					response=data.conversion_rate;
					response=" One "+base_code+" equals "+response+" "+target_code;
				}
			});
			toggleBtn();
		}
		
		if(text.includes("whatismyip")){
			$.ajax({
				url: "https://freegeoip.app/json/",
				async: false,
				dataType: 'json',
				success: function(data) {
					response=data.ip;
				}
			});
			response="Your IP Address is "+response.toString();
			toggleBtn();

		}
		if(text=="whatismycurrentlocation"){
			$.ajax({
				url: "https://freegeoip.app/json/",
				async: false,
				dataType: 'json',
				success: function(data) {
					response="Your Current Location is "+data.city;
				}
			});
			toggleBtn();

		}
		if(text.includes("joke")){
			$.ajax({
				url: "https://icanhazdadjoke.com/slack",
				async: false,
				dataType: 'json',
				success: function(data) {
					response=data.attachments[0].text;
					//console.log(data);
				}
			});
			toggleBtn();

		}
		

		if(text.search("mynameis")>-1){
			res=text.replace("mynameis","Hello ");
			response = res;
			toggleBtn();
		}
		if(text.includes("whatisthetemperaturein")){
			text=text.replace("whatisthetemperaturein","temperature");
		}
		if(text.includes("temperature")){
			res=text.replace("temperature","");
			var city=res;
			$.ajax({
				url: "https://api.openweathermap.org/data/2.5/weather?q="+city+"&units=imperial&appid=3e9b0c0c2047a62b6aaea45da33a9487",
				async: false,
				dataType: 'json',
				success: function(data) {
					response = data.main.temp;
				}
			});
			response=(response-32)*5/9;
			response=response.toFixed(2).toString();
			toggleBtn();
			return "The Current Temperature there is "+response+" Degree Celcius";

		}

		if(text.includes("howistheweatherin")){
			text=text.replace("howistheweatherin","weather");
		}

		if(text.includes("weather")){
			res=text.replace("weather","");
			var city=res;
			$.ajax({
				url: "https://api.openweathermap.org/data/2.5/weather?q="+city+"&units=imperial&appid=3e9b0c0c2047a62b6aaea45da33a9487",
				async: false,
				dataType: 'json',
				success: function(data) {
					response = data.weather[0].main;
				}
			});
			toggleBtn();
			if(response=="Clouds"){
				response="Cloudy";
			}
			return "It is "+response+" over there";

		}
		if(text.search("open")==0){
			res=text.replace("open","");
			response=res;
			switch(response){
				case "youtube":
					window.open("https://www.youtube.com", '_blank');
					break;
				case "wikipedia":
				case "wiki":
					window.open("https://www.wikipedia.com", '_blank');
					break;
				case "google":
					window.open("https://www.google.com", '_blank');
					break;
				case "amazon":
					window.open("https://www.amazon.in", '_blank');
					break;
				case "facebook":
					window.open("https://www.facebook.com", '_blank');
					break;
				case "twitter":
					window.open("https://www.twitter.com", '_blank');
					break;
				case "gmail":
					window.open("https://www.gmail.com", '_blank');
					break;
				
				
				}
				response="opening "+response;
				toggleBtn();
			
		}
		if(text.includes("+") || text.includes("-") || text.includes("by") || text.includes("star") || text.includes("into")){
			if(text.includes("by")){
				text=text.replace("by","/");
			}
			if(text.includes("star")){
				text=text.replace("star","*");
			}
			if(text.includes("into")){
				text=text.replace("into","*");
			}
			response=eval(text);
			toggleBtn();
		}
		switch(text) {
			case "hello":
			case "hi":
			case "hai":
				response = "hi, how are you doing?";
				toggleBtn(); 
				break;

			case "whatisyourname":
				response = "My name is Bravo.";
				toggleBtn();  
				break;

			case "howareyou":
				response = "I am good.";
				toggleBtn();
				break;
			case "whoareyou":
				response = "I am a User Friendly Virtual Assistant. I will take user's commands as input after processsing them I will show desired outputs.";
				toggleBtn();
				break;
			case "whattimeisit":
			case "whatisthetimenow":
				response = new Date().toLocaleTimeString(); 
				toggleBtn();
				break;
			
			case "terminate" || "byebravo":
				response = "Bye!! Have a Nice Day";
				toggleBtn();
				break;
						
		}
		if (!response) {
			window.open(`http://google.com/search?q=${rawText.replace("search", "")}`, "_blank");
			return `I found some information for ${rawText}`;
		}
		return response;
	}
	