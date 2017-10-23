document.addEventListener('DOMContentLoaded', function () {
	let input = document.getElementById('input'),
		list = document.getElementById('list'),
		btn = document.getElementById('btn'),
		form = document.getElementById('form'),
		links = [];


	let tablink;
	chrome.tabs.getSelected(null,function(tab) {
	    tablink = tab.url;
	});

	(function init() {	
		let htmlText = '';
		chrome.storage.local.get('channels', function(result){
	        channels = result;
		    for (var key in result.channels) {
		    	let item = JSON.stringify(result.channels[key]).replace(/['"]+/g, '');
		    	if (item !== '') {
		    		links.push(item);
	            	htmlText += '<li data-value="'+ item + '"><a class="link" target="_blank" href="' + getDomain(tablink) + item + '">' + item + '</a><span class="clear" data-value="' + item + '"><span class="icon-clear">x</span></span></li>';
	        	}
	        }
	        list.innerHTML += htmlText;
	    });	
	})();

	function getDomain(url){
		let reg = '^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/\n]+)';
		return url.match(reg)[0];
	}

	function addUrl(e) {
		if (input.value !== ''){
			e.preventDefault();
			list.innerHTML += '<li data-value="'+ input.value + '"><a class="link" target="_blank" href="' + getDomain(tablink) + input.value + '">' + input.value + '</a><span class="clear" data-value="' + input.value + '"><span class="icon-clear">x</span></span></li>';
			links.push(input.value);
			chrome.storage.local.set({'channels': links});
			input.value = '';
		}
	}
	
	form.addEventListener('submit', addUrl);
	btn.addEventListener('click', addUrl);

	document.body.addEventListener('click', function(e) {
		if (e.target && e.target.className == 'icon-clear') {
			var el = e.target;
			chrome.storage.local.get('channels', function(result){
		        channels = result;
		        if (result.channels.indexOf(el.parentNode.parentNode.getAttribute('data-value')) >= 0 ) {
		        	el.parentNode.parentNode.remove()

		        	let itemtoRemove = result.channels.indexOf(el.parentNode.parentNode.getAttribute('data-value'));
		        	result.channels.splice(itemtoRemove,1);
		        }
		        chrome.storage.local.set({'channels': result.channels});
		    });	
	    }
	});

	document.body.addEventListener('click', function(e) {
		if (e.target && e.target.nodeName == 'link') {
			chrome.tabs.create({url: e.target.getAttribute('href')});
			return false;
	    }
	});

});