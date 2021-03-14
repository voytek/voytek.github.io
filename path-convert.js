(function(){

    // the minimum version of jQuery we want
    var v = "3.6.0";

    // check prior inclusion and version
    if (window.jQuery === undefined || window.jQuery.fn.jquery < v) {
        var done = false;
        var script = document.createElement("script");
        script.src = "https://ajax.googleapis.com/ajax/libs/jquery/" + v + "/jquery.min.js";
        script.onload = script.onreadystatechange = function(){
            if (!done && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete")) {
                done = true;
                initMyBookmarklet();
            }
        };
        document.getElementsByTagName("head")[0].appendChild(script);
    } else {
        initMyBookmarklet();
    }

    function initMyBookmarklet() {
        (window.myBookmarklet = function() {
            //money selector tr:has(td.money.number) .money.number

            var coinTypes = [
              'pp',
              'gp',
              'sp',
              'cp'
            ];

            var coinShift = 1;
            var multiplier = 2;

            function convert(amount, units) {
              coinIndex = coinTypes.indexOf(units);
              console.log(coinIndex);

              return amount * multiplier + ' ' + coinTypes[coinIndex + coinShift];
            }

            console.log(convert('5', 'gp'));

            var moneyData = $('tr:has(td.money.number) .money.number').html;

            console.log(moneyData);


        })();
    }

})();
