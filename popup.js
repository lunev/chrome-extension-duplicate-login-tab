document.addEventListener('DOMContentLoaded', function () {
	const input = document.getElementById('input');
	const list = document.getElementById('list');
	const btn = document.getElementById('btn');
	const form = document.getElementById('form');
	let links = [];


	let tablink;
	chrome.tabs.getSelected(null,function(tab) {
	    tablink = tab.url;
	});

	(function init() {	
		var htmlText = '';
		chrome.storage.local.get('channels', function(result){
	        channels = result;
		    for ( var key in result.channels ) {
		    	if (JSON.stringify(result.channels[key]).replace(/['"]+/g, '') !== '') {
		    		links.push(JSON.stringify(result.channels[key]).replace(/['"]+/g, ''));
	            	htmlText += '<li data-value="'+ JSON.stringify(result.channels[key]).replace(/['"]+/g, '') + '"><a target="_blank" href="' + getDomain(tablink) + JSON.stringify(result.channels[key]).replace(/['"]+/g, '') + '">' + JSON.stringify(result.channels[key]).replace(/['"]+/g, '') + '</a><span class="clear" data-value="' + JSON.stringify(result.channels[key]).replace(/['"]+/g, '') + '"><span class="icon-clear">x</span></span></li>';
	        	}
	        }
	        list.innerHTML += htmlText;
	    });	
	})();

	function getDomain(url){
		var reg = '^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/\n]+)';
		return url.match(reg)[0];
	}

	function addUrl(e) {
		if (input.value !== ''){
			e.preventDefault();
			list.innerHTML += '<li><a target="_blank" href="' + getDomain(tablink) + input.value + '">' + input.value + '</a><span class="clear" data-value="' + input.value + '"><span class="icon-clear">x</span></span></li>';
			links.push(input.value);
			chrome.storage.local.set({'channels': links});
			input.value = '';
		}
	}
	
	form.addEventListener('submit', addUrl);
	btn.addEventListener('click', addUrl);

	$('body').on('click', '.clear', function() {
		var el = $(this);
		chrome.storage.local.get('channels', function(result){
	        channels = result;
	        if ($.inArray( el.data('value'), result.channels >= 0)) {
	        	el.data('value', result.channels).parent('li').remove();
	        	var itemtoRemove = result.channels[$.inArray( el.data('value'), result.channels)];
	        	result.channels.splice($.inArray(itemtoRemove, result.channels),1);
	        }
	        chrome.storage.local.set({'channels': result.channels});
	    });	
	});

	$('body').on('click', 'a', function(){
		chrome.tabs.create({url: $(this).attr('href')});
		return false;
	});

	
});