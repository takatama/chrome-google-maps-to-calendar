chrome.runtime.onInstalled.addListener(function () {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [
                new chrome.declarativeContent.PageStateMatcher({
                    pageUrl: { hostSuffix: 'google.com', urlContains: '/maps/', urlContains: '/am=t'}
                }),
                new chrome.declarativeContent.PageStateMatcher({
                    pageUrl: { hostSuffix: 'google.co.jp', urlContains: '/maps/', urlContains: '/am=t'}
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
