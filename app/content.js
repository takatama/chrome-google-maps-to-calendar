var currentTimeZoneOffsetHour = function() {
    return Math.floor((new Date()).getTimezoneOffset() / 60);
};

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.text && (message.text === "add_calendar")) {
        chrome.storage.sync.get({
            timeZone: currentTimeZoneOffsetHour()
	}, function (items) {
            addCalendar(items.timeZone);
        });
    }
});

var addCalendar = function (timeZoneOffsetHour) {
    if (document.URL.indexOf('/am=t') < 0) {
        alert('Please open Details');
        return;
    }
    var e = encodeURIComponent;
    var q = document.querySelectorAll.bind(document);
    var text = function () {
        var wp = q('.waypoint-address:not([style*="display"]) .first-line span');
        var from = wp[0].innerText;
        var to = wp[wp.length - 1].innerText;
        return e(from + ' -> ' + to);
    };
    var details = function () {
        return e(document.URL);
    };
    var dates = function () {
        var z = function(x) {
	    return ('00' + x).slice(-2);
        };
        var utcMsec = function (msec) {
            var d = new Date(msec);
            var diff = currentTimeZoneOffsetHour() + parseInt(timeZoneOffsetHour, 10);
            d.setHours(d.getHours() - diff);
            return d.getUTCFullYear() + z(d.getUTCMonth() + 1) + z(d.getUTCDate()) + 'T' + z(d.getUTCHours()) + z(d.getUTCMinutes()) + '00Z';
        };
        var parseTransitTime = function (span) {
            var h = parseInt(span.innerText.split(' ')[0].split(':')[0], 10);
            var m = parseInt(span.innerText.split(' ')[0].split(':')[1], 10);
            var ampm = span.innerText.split(' ')[1];
            if (ampm === 'PM' && h < 12) {
                h += 12;
            }
            return { hour: h, minutes: m };
        };
        var transitTime = q('.cards-directions-transit-trip-time span');
        var start = parseTransitTime(transitTime[0]);
        var end = parseTransitTime(transitTime[1]);
        var duration = q('.cards-directions-duration-value')[0].innerText;
        var today = new Date();
        var todayLabel = q('.date-input')[0].innerText;
        if (todayLabel.match(/(\d+)\s*月\s*(\d+)\s*日/)) {
            var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            todayLabel = monthNames[parseInt(RegExp.$1, 10) - 1] + ' ' + RegExp.$2;
        }
        var startMsec = Date.parse(todayLabel + ' ' + today.getFullYear() + ' ' + start.hour + ':' + start.minutes + ':00');
        if (!startMsec) return;
        if (startMsec < today.getTime()) {
        var sd = new Date(startMsec);
            sd.setMonth(sd.getMonth() + 1);
            startMsec = sd.getTime();
        }
        if (duration.match(/(\d+)\s*h\s*(\d+)\s*min/) || duration.match(/(\d+)\s*時間\s*(\d+)\s*分/)) {
            var endMsec = startMsec + (parseInt(RegExp.$1) * 60 + parseInt(RegExp.$2)) * 60 * 1000;
        } else if (duration.match(/(\d+)\s*min/) || duration.match(/(\d+)\s*分/)) {
            var endMsec = startMsec + parseInt(RegExp.$1) * 60 * 1000;
        }
        return utcMsec(startMsec) + '/' + utcMsec(endMsec);
    };
    var d = dates();
    if (d) {
        var href = 'http://www.google.com/calendar/event?action=TEMPLATE&text=' + text() + '&details=' + details() + '&dates='+ d + '&location=&trp=true';
        window.open(href);
    }
};

