//functions for saving, initializing options, etc.

// there is prohibited calling the functions via onclick=...
// in accordance to the Content Security Policy
document.addEventListener('DOMContentLoaded', initOptions);
document.querySelector('#save_button').addEventListener('click', saveOptions);

// sets the saved values in the storage to the fields
function initOptions() {
	// rewrite the values by the saved data
	extractFromStoragePutHtml('blocked');
	extractFromStoragePutHtml('redirection');
}

// extracts the value with identifier id from the chrome storage
// put the data in .html file in the fields with the same identifier
function extractFromStoragePutHtml(id) {
	var values;
	chrome.storage.sync.get(id, function (result) {
		values = result[id];

		var append = "";
		for (var i = 0; i < values.length; i++) {
			append += values[i]+'\n';
		}
		// remove the extra char '\n' we added
		append = append.substring(0, append.length - 1);
		$("#" + id).val(append);
	});

}

function saveOptions() {
	// extracting data from the fields
	var blocked = listById('#blocked');
	var redirection = listById('#redirection');

	// saving to the json object
	var keeper = {
		'blocked': blocked,
		'redirection': redirection
	}

	// saving keeper to the chrome storage
	chrome.storage.sync.set(keeper, function() {
		var notification = $('#notification');
		notification.html('Options are saved');
		setTimeout(function() { notification.html(''); }, 5000);
	});
}

// returns the splitted array of values 
// that are stored at the source with identifier id
function listById(id) {
	var str = $(id).val();
	var arr = str.split('\n');

	for (var i = 0; i < arr.length; i++) {
		if (!arr[i].match('https:\/\/'))
			arr[i] = 'https:\/\/' + arr[i];
	}
	return arr;
}
