chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.text && (message.text === "add_calendar")) {
        chrome.storage.sync.get({
            timeZone: null
	    }, function (items) {
            addCalendar(items.timeZone);
        });
    }
});

var parse = function (document) {
    var q = document.querySelectorAll.bind(document);
    var result = {};
    var wp = q('.waypoint-address:not([style*="display"]) .first-line span');
    if (wp.length > 0) { // Details
        result.from = wp[0].innerText;
        result.to = wp[wp.length - 1].innerText;
    } else { // Details is not shown
        result.from = q('#directions-searchbox-0 input')[0].value.split(',')[0];
        result.to = q('#directions-searchbox-1 input')[0].value.split(',')[0];
    }
    var startEnd = q('.cards-directions-transit-trip-time span');
    var to24hour = function (text) {
        var hour = parseInt(text.split(' ')[0].split(':')[0], 10);
        var min = parseInt(text.split(' ')[0].split(':')[1], 10);
        if (text.indexOf('PM') >= 0) {
            hour += 12; 
        }
        return { "hour": hour, "min": min };
    };
    var start = to24hour(startEnd[0].innerText);
    var end = to24hour(startEnd[1].innerText);
    var duration = q('.cards-directions-duration-value')[0].innerText;
    var date = q('.date-input')[0].innerText;
    if (date.match(/(\d+)\s*月\s*(\d+)\s*日/)) {
        var monthes = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        date = monthes[parseInt(RegExp.$1, 10) - 1] + ' ' + RegExp.$2;
    }
    var now = new Date();
    var startDate = new Date(date + ' ' + now.getFullYear() + ' ' + start.hour + ':' + start.min + ':00');
    var endDate = new Date(date + ' ' + now.getFullYear() + ' ' + end.hour + ':' + end.min + ':00');
    if (startDate.getMonth() < now.getMonth()) {
        startDate.setFullYear(startDate.getFullYear() + 1);
    }
    if (endDate.getMonth() < now.getMonth()) {
        endDate.setFullYear(endDate.getFullYear() + 1);
    }
    result.start = startDate;
    result.end = endDate;
    result.adjustTimezone = function (offset) {
        if (!offset) return;
        var currentTimeZoneOffset = Math.floor((new Date()).getTimezoneOffset() / 60);
        var diff = currentTimeZoneOffset + parseInt(offset, 10);
        this.start.setHours(this.start.getHours() - diff);
        this.end.setHours(this.end.getHours() - diff);
    };
    return result;
};

var utc = function (date) {
    var z = function(x) {
        return ('00' + x).slice(-2);
    };
    return date.getUTCFullYear() + z(date.getUTCMonth() + 1) + z(date.getUTCDate()) + 'T' + z(date.getUTCHours()) + z(date.getUTCMinutes()) + '00Z';
};

var timeZoneOffset = function (timeZone) {
    var i;
    for (i = 0; i < timezones.length; i++) {
        if (timezones[i].text === timeZone) {
            return timezones[i].offset;
        }
    }
    return null;
};

var addCalendar = function (timeZone) {
    var e = encodeURIComponent;
    var data = parse(document);
    var text = e(data.from + ' -> ' + data.to);
    var details = e(document.URL);
    if (timeZone) {
        data.adjustTimezone(timeZoneOffset(timeZone))
    }
    var href = 'http://www.google.com/calendar/event?action=TEMPLATE&text=' + text + '&details=' + details + '&dates='+ utc(data.start) + '/' + utc(data.end) + '&location=&trp=true';
    window.open(href);
};

