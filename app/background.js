chrome.runtime.onInstalled.addListener(function () {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [
                new chrome.declarativeContent.PageStateMatcher({
                    pageUrl: { hostSuffix: 'google.com', urlContains: '/maps/dir/'},
                    css: ['.widget-pane-section-directions-trip-title']
                }),
                new chrome.declarativeContent.PageStateMatcher({
                    pageUrl: { hostSuffix: 'google.co.jp', urlContains: '/maps/dir/'},
                    css: ['.widget-pane-section-directions-trip-title']
                })
            ],
            actions: [
                new chrome.declarativeContent.ShowPageAction()
            ]
	    }]);
    });
});

chrome.pageAction.onClicked.addListener(function (tab) {
    chrome.tabs.sendMessage(tab.id, { text: "add_calendar" });
});
