var myForm = document.getElementById('myForm');

function convertDate( date ) {
	var x = date.split('-');
	console.log(x);
}

$('#myForm').on('submit', (e)=> {
	e.preventDefault();
    formData = new FormData(myForm);

	var formObject = {};
	console.log('form: ', formData)

	for( var ent of formData.entries()) {
		formObject[ent[0]] = ent[1];
	}

	// Date formatting form yyyy-mm-dd to dd-mm-yyyy
	var d = formObject['jpform:journeyDateInputDate'].split('-');
	formObject['jpform:journeyDateInputDate'] = $.datepicker.formatDate( "dd-mm-yy", new Date(d[0], d[1]-1, d[2]) );
	// Date formatting ends.

	// Encryption
	r = Math.ceil(Math.random()*10);
	formObject['pin'] = jadoo(parseInt(formObject['pin']), r);
	formObject['expYear'] = jadoo(parseInt(formObject['expYear']), r);
	formObject['cardNo'] = parseInt(formObject['cardNo']) + 100;
	formObject['r'] = r;

	chrome.storage.sync.set({'poorijaankari1': JSON.stringify(formObject)}, function() {
		// Notify that we saved.
		console.log('Settings saved');
		chrome.storage.sync.get('poorijaankari1', function(e) {
			console.log(e);
		});
	});

	console.log('formdata: ', JSON.stringify(formObject));
});
