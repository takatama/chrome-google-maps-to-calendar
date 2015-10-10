var timeoutMilliSec = 5000;
module.exports = {
    'Google Maps shows transit directions without details.' : function (browser) {
        var url = 'https://www.google.co.jp/maps/dir/Tokyo+Station,+%E6%9D%B1%E4%BA%AC%E9%83%BD/Tokyo+Disneyland+Station,+Chiba+Prefecture/@35.6586719,139.7863366,13z/data=!3m1!4b1!4m14!4m13!1m5!1m1!1s0x60188bfbd89f700b:0x443025838b0ce6c6!2m2!1d139.766084!2d35.681382!1m5!1m1!1s0x60187d1446bdecef:0xd6029727c59802c2!2m2!1d139.878647!2d35.635886!3e3?hl=en';
        browser
            .url(url)
            //.waitForElementPresent('.cards-directions-transit-trip-time span', timeoutMilliSec) // Start and End time
            .waitForElementPresent('.widget-pane-section-directions-trip-title span', timeoutMilliSec) // Start and End time
            .assert.elementPresent('.date-input') // Date
            .assert.elementPresent('#directions-searchbox-0 input') // From
            .assert.elementPresent('#directions-searchbox-1 input') // To
            //.assert.elementPresent('.cards-directions-duration') // Duration
            .assert.elementPresent('.widget-pane-section-directions-trip-duration') // Duration
            .end();
    },
    'Google Maps shows transit directions with details.' : function (browser) {
        var url = 'https://www.google.co.jp/maps/dir/Tokyo+Station,+%E6%9D%B1%E4%BA%AC%E9%83%BD/Tokyo+Disneyland+Station,+Chiba+Prefecture/@35.6586719,139.7863366,13z/am=t/data=!3m1!4b1!4m14!4m13!1m5!1m1!1s0x60188bfbd89f700b:0x443025838b0ce6c6!2m2!1d139.766084!2d35.681382!1m5!1m1!1s0x60187d1446bdecef:0xd6029727c59802c2!2m2!1d139.878647!2d35.635886!3e3?hl=en';
            browser
            .url(url)
            //.waitForElementPresent('.cards-directions-transit-trip-time span', timeoutMilliSec) // Start and End time
            .waitForElementPresent('.widget-pane-section-directions-trip-title span', timeoutMilliSec) // Start and End time
            .assert.elementPresent('.date-input') // Date
            .assert.elementPresent('.waypoint-address:not([style*="display"]) .first-line span') // From and To
            //.assert.elementPresent('.cards-directions-duration') // Duration
            .assert.elementPresent('.widget-pane-section-directions-trip-duration') // Duration
            .end();
    }
};
