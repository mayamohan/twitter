window.addEventListener("load", function(){
	var countField = document.getElementById("countWord");
	var countDisplay = document.getElementById("displayCount");
	// countField.addEventListener("keyup", function(evt){ var abbrev = countField.value;
	// 	var xhr = new XMLHttpRequest(); xhr.onreadystatechange = function() {
	// 		if (xhr.readyState == 4 && xhr.status == 200){
	// 			var resp = xhr.response;
	// 			countDisplay.innerHTML = "";
	// 			for (var i=0; i<resp.length; i++) {
	// 				var item = document.createElement("li");
	// 				item.innerHTML = resp[i].count + " words match " + resp[i].abbrev;
 //       				countDisplay.appendChild(item);
 //    			}
	// 			var resp = xhr.response;
	// 		} 	
​
	// 	};
	// xhr.open("GET", "/wordsapi/v2/count/" + abbrev); 
	// xhr.responseType='json';
	// xhr.send();
	//}); 
​
	var searchField = document.getElementById("searchWord"); 
	var searchList = document.getElementById("wordlist");
​
	searchField.addEventListener("keyup", function(evt){
 		var abbrev = searchField.value;
 		var xhr = new XMLHttpRequest();
 		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4 && xhr.status == 200) {
				if(xhr.response.length>0){
		 			searchList.innerHTML = "";
					for (var i=0; i<xhr.response.length; i++) {
						var opt = document.createElement("option"); 
						opt.value    = xhr.response[i].id; 
						opt.label    = xhr.response[i].word;
						opt.innerHTML= xhr.response[i].word; 
						searchList.appendChild(opt);
					} 
				}else{
					var addDiv = document.getElementById("addDiv");
					addDiv.innerHTML="";
					var addButton = document.createElement("input");
					addButton.setAttribute("id","addWord");
					addButton.setAttribute("type","button");
					addButton.setAttribute("value","Add New Word");
​
					addButton.addEventListener("click",function(){
						var uri ="/wordsapi/v2/dictionary/"+searchField.value;
						xhr.open('POST',uri);
						xhr.responseType = 'json';
						xhr.send();
​
						console.log("in the add button event "+uri);
					});
					var searchDiv = document.getElementById('wordsearch');
					addDiv.appendChild(addButton);
					
					console.log("ELSE");
				}
			}	
		};
		var uri = "/wordsapi/v2/search/" + abbrev;
		var params = [];
		
		var thresh = searchField.dataset.threshold;
			
		if(thresh && Number(thresh)>0){
		params.push("threshold="+Number(thresh));
	}
		var noCase = document.getElementById("noCase").checked;
		if(noCase){
			params.push("noCase=true");
		}
		if(params.length){
			uri += "?"+params.join("&");
		}
		
		xhr.open('GET',uri);
		xhr.responseType = 'json';
		xhr.send();
	}); //Word search keyup callback
    
​
	searchList.addEventListener("change",function(){
		var xhr = new XMLHttpRequest();
		var deleteButton = document.createElement("input");
		deleteButton.setAttribute("id","deleteButton");
		deleteButton.setAttribute("type","button");
		deleteButton.setAttribute("value","Delete Word");
		deleteButton.addEventListener("click",function(){
			var uri = "/wordsapi/v2/dictionary/"+searchList.options[searchList.selectedIndex].value;
			console.log(uri);
			xhr.open('DELETE',uri);
			xhr.responseType = 'json';
			xhr.send();
		
		});
		var updateButton = document.createElement("input");
		updateButton.setAttribute("id","deleteButton");
		updateButton.setAttribute("type","button");
		updateButton.setAttribute("value","Update Word");
		updateButton.addEventListener("click",function(){
			var uri ="/wordsapi/v2/dictionary/"+searchField.value;
			xhr.open('POST',uri);
			xhr.responseType = 'json';
			xhr.send();
		});
		var updateField = document.createElement("input");
		updateField.setAttribute("id","updateField");
		updateField.setAttribute("value",searchList.options[searchList.selectedIndex].label);
		var displayDiv = document.getElementById("actOnSearch");
		displayDiv.appendChild(updateField);
		displayDiv.appendChild(deleteButton);
		displayDiv.appendChild(updateButton);
		searchField.value=searchList.options[searchList.selectedIndex].label; 
		console.log(searchList.options[searchList.selectedIndex].value);
	});
​
​
​
​
});