/*
 jquery.ios-shake: A jQuery plugin that detects a 'shake' event using
 Safari's accelerometer support in iOS 4.2+.
 
 Revision History:
 0.1.0 - 2011-01-24 - initial release
 
 Copyright 2011 Luke D Hagan, http://lukehagan.com
 
 Permission is hereby granted, free of charge, to any person obtaining
 a copy of this software and associated documentation files (the
 "Software"), to deal in the Software without restriction, including
 without limitation the rights to use, copy, modify, merge, publish,
 distribute, sublicense, and/or sell copies of the Software, and to
 permit persons to whom the Software is furnished to do so, subject to
 the following conditions:
 
 The above copyright notice and this permission notice shall be
 included in all copies or substantial portions of the Software.
 
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 
 */

(function ($) {
    jQuery.shake = function (options) {
        var opts = jQuery.extend({},
            jQuery.shake.defaults, options
        );
        var ax = 0, ay = 0, az = 0, axa = 0, aya = 0, aza = 0;
        var acc, shakecount = 0, shakeaccum = 0, curtime = new Date(), prevtime = new Date(), timeout = false;

        // http://www.mobilexweb.com/samples/ball.html
        if (window.DeviceMotionEvent !== undefined) {
            window.ondevicemotion = function (event) {
                acc = event.accelerationIncludingGravity;
                ax = acc.x;
                ay = acc.y;
                az = acc.y;

                // http://iphonedevelopertips.com/user-interface/accelerometer-101.html
                axa = ax - ((ax * opts.hf) + (axa * (1.0 - opts.hf)));
                aya = ay - ((ay * opts.hf) + (aya * (1.0 - opts.hf)));
                aza = az - ((az * opts.hf) + (aza * (1.0 - opts.hf)));

                // http://discussions.apple.com/thread.jspa?messageID=8224655
                var beenhere = false, shake = false;

                if (beenhere) {
                    return;
                }

                beenhere = true;

                if (Math.abs(ax - 2 * axa) > opts.violence * 1.5 || Math.abs(ay - 2 * aya) > opts.violence * 2 || Math.abs(az - 2 * aza) > opts.violence * 3 && timeout === false) {
                    shakeaccum += 1;
                }

                curtime = new Date();

                var timedelta = curtime.getTime() - prevtime.getTime();

                if (timeout) {
                    if (timedelta >= opts.debounce) {
                        timeout = false;
                    } else {
                        timeout = true;
                    }
                    shakeaccum = 0;
                }

                if (shakeaccum >= opts.shakethreshold && timeout === false) {
                    shakecount += 1;

                    console.log(shakecount);

                    prevtime = curtime;
                    timeout = true;

                    opts.callback.call();
                }
                beenhere = true;
            };
        } else {
            console.log('Your device is not compatible with shake moviments');
        }
    };
})(jQuery);

jQuery.shake.defaults = {
    violence: 3.0,

    hf: 0.2,

    shakethreshold: 5,

    debounce: 1000,

    callback: function () {}
};
