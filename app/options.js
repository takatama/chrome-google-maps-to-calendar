function saveOptions() {
    var timeZone = document.getElementById('time-zone').value;
    chrome.storage.sync.set({
        timeZone: timeZone
    }, function () {
        var status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function() {
            status.textContent = '\u00A0';
        }, 750);
    });
}

function restoreOptions() {
    chrome.storage.sync.get({
        timeZone: Math.floor((new Date()).getTimezoneOffset() / 60),
    }, function (items) {
        document.getElementById('time-zone').value = items.timeZone;
    });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('time-zone').addEventListener('change', saveOptions);
document.getElementById('save').addEventListener('click', saveOptions);

