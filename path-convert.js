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
              'cp',
              'sp',
              'gp',
              'pp'
            ];

            var defaultCoinShift = -1;
            var defaultMultiplier = 2;
            var coinShiftDefecit = 0;

            function findCoinShift (units) {
              var coinIndex = coinTypes.indexOf(units);
              console.log('coin index ' + coinIndex);

              var coinShift = coinIndex + defaultCoinShift;
              var numberCoinTypes = coinTypes.length;
              var lastCoinIndex = coinTypes.length - 1;

              if (coinShift < 0) {
                coinShiftDefecit = coinShift;
                return 0;
              } else if (coinShift > lastCoinIndex) {
                coinShiftDefecit = coinShift - coinTypes.length + 1;
                return lastCoinIndex;
              } else {
                return coinShift;
              }
            }

            function findMultiplier() {
              // If the coin shift is lower than copper (< 0)
              if (coinShiftDefecit < 0) {
                // for every -1 below copper reduce your total after Price Multiplier by 1/2
                //.5 to the power of absolute value of coinShiftDefecit
                return defaultMultiplier * (.5 ** Math.abs(coinShiftDefecit));
              // If coin Shift > pp
            } else if (coinShiftDefecit > 0) {
              // for every +1 above pp, multiply your total after price multiplier by 3x
              // 3 to the power of the value of coinShiftDefecit
              return defaultMultiplier * (3 ** coinShiftDefecit);
              } else {
                return defaultMultiplier;
              }
            }

            function convert(amount, units) {

              // reset global variables
              defaultCoinShift = -1;
              defaultMultiplier = 2;
              coinShiftDefecit = 0;

              var coinShift = findCoinShift(units);
              var multiplier = findMultiplier();
              console.log(coinShift);
              console.log(coinShiftDefecit);
              console.log(multiplier);

              return amount * multiplier + ' ' + coinTypes[coinShift];
            }

            console.log(convert('5', 'gp'));

            var moneyData = $('tr:has(td.money.number) .money.number');

            moneyData.each(function processMoney(index, moneyTD) {
              console.log(moneyTD.innerHTML);
              var moneyArray = moneyTD.innerHTML.split(' ');
              var amount = parseInt(moneyArray[0].replace(/,/g, ""));
              var units = moneyArray[1];
              console.log(amount + ', ' + units);
              $(moneyTD).append(' => ' + convert(amount, units)).css('background', 'red');
            });


        })();
    }

})();
