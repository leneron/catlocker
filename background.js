// string constants for defining the state of the extension
ON = "on"
OFF = "off"

// enable/disable extension
chrome.browserAction.onClicked.addListener(function(tab) {
	var enabled = false;
	//read the state
	chrome.storage.sync.get('enabled', function (result) {
		enabled = result.enabled;

		// switch the state
		enabled = !enabled;
		// change the label
		chrome.browserAction.setBadgeText({text: enabled ? ON : OFF});
		chrome.browserAction.setBadgeBackgroundColor({color: enabled ? "#76c900" : "#ff0707"})

		// save to the storage
		chrome.storage.sync.set({'enabled': enabled});
	});
});

// redirecting to the new page
chrome.webNavigation.onDOMContentLoaded.addListener(function(details) {
	var enabled = false;
	//read the state
	chrome.storage.sync.get('enabled', function (result) {
		enabled = result.enabled;

		if (enabled) {
		//read the keeper that saves redirection sites and the blocked ones
		var blocked;
		chrome.storage.sync.get('blocked', function (result) {
			blocked = result.blocked;

			var redirection;
			chrome.storage.sync.get('redirection', function (result) {
				redirection = result.redirection;

				for (var i = 0; i < blocked.length; i++) {
					if (details.url.includes(blocked[i])) {
						var randomAllowed = getRandomValue(redirection);
						chrome.tabs.update(details.tabId, {url: randomAllowed});
						return; 
					}
				}
			});
		});
	}
	// do nothing if the extension is disabled
	});
});

// returns the random value of the collection arr
function getRandomValue(arr) {
	if (arr.length > 0) {
		return arr[Math.floor(Math.random() * arr.length)];
	}

	return '';
}
