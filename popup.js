$("#createForm").on('click', () => {
	window.open("tatkalForm.html", '_blank');
});

chrome.tabs.getSelected(null, function(tab) { 
    console.log(tab.url);
});	// Will be used later.

$("#bookNow").on('click', () => {
	chrome.tabs.getSelected(null, function(tab) {
		if(tab.url !== 'https://www.irctc.co.in/eticketing/loginHome.jsf') {
			window.open("https://www.irctc.co.in/eticketing/loginHome.jsf", '_blank');
		}
	});
});

var storedData;

chrome.storage.sync.get('poorijaankari1', (data) => {
	storedData = JSON.parse(data['poorijaankari1']);
	var count = 0;
	for(var i=1; i<5; i++) {
		if(storedData['p' + i + 'Name'])
			count++;
	}
	if(storedData && storedData['userName'] && storedData['mobileNo']) {
		$('#fromStation').html(storedData['jpform_fromStation']);
		$('#toStation').html(storedData['jpform_toStation']);
		$('#date').html('Date: ' + storedData['jpform:journeyDateInputDate']);
		$('#train').html(storedData['trainNo']);
		$('#class').html('Selected Class: ' + storedData['selectedClass']);
		$('#count').html('No. of tickets: ' + count)
	} else {
		$('#preview').html('<br/><br/><i>No data to display.<br/><br/>either you\'ve not filled the form<br/><br/> or details filled by you may be incomplete.</i>');
	}
});
