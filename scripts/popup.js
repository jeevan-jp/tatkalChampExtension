$("#createForm").on('click', () => {
	window.open("tatkalForm.html", '_blank');
});

$("#bookNow").on('click', () => {
	window.open("https://www.irctc.co.in/eticketing/loginHome.jsf", '_blank');
});

var storedData;

chrome.storage.sync.get('poorijaankari1', (data) => {
	storedData = JSON.parse(data['poorijaankari1']);
	var count = 0;
	for(var i=1; i<5; i++) {
		if(storedData['p' + i + 'Name'])
			count++;
	}
	console.log(storedData);
	if(storedData) {
		$('#preview').css('display', 'block');
		$('#fromStation').html(storedData['jpform_fromStation']);
		$('#toStation').html(storedData['jpform_toStation']);
		$('#date').html('Date: ' + storedData['jpform:journeyDateInputDate']);
		$('#train').html(storedData['trainNo']);
		$('#class').html('Selected Class: ' + storedData['selectedClass']);
		$('#count').html('No. of tickets: ' + count)
	}
});
