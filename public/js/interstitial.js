var Interstitial = (function(element){
	
	var el = element;

	if(el === undefined){
		el = document.querySelector('.interstitial');
	}

	if(el === null){
		throw new Error("Interstitial element not set");
	}

	function showInterstitial(){
		console.log("SHOW INTERSTITIAL");
	}

	function hideInterstitial(){
		console.log("HIDE INTERSTITIAL");
	}

	return{
		show : showInterstitial,
		hide : hideInterstitial
	}

});