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

            var robyCoinTypes = [
              'Confirm',
              'Market Confirm',
              'Fair Confirm',
              'Gold Confirm',
              'Rachtmark'
            ]

            var defaultCoinShift = -1;
            var defaultMultiplier = 2;
            var coinShiftDefecit = 0;

            // must use confirms
            function reduceRobyCoinValues(confirmAmount) {
              // 1 confirm == 1 confrim
              // 1 market confirm == 10 confirm
              // 1 fair confirm == 20 confirm
              // 1 gold confirm == 400 confirm
              // 1 rachtmark == 24000 confirms

              if (confirmAmount >= 24000) {
                return [Math.ceil(confirmAmount/24000), 'Rachtmark'];
              } else if (confirmAmount >= 400) {
                return [Math.ceil(confirmAmount/400), 'Gold Confirm'];
              } else if (confirmAmount >= 20) {
                return [Math.ceil(confirmAmount/20), 'Fair Confirm'];
              } else {
                return [confirmAmount, 'Confirms'];
              }
            }

            function exchangeCoinValues(amount, units) {
              var newValues = [amount, units];

              // convert all values to smallest denomination of roby bucks aka "confirms"
              // change to copper pieces (powers of 10 1sp == 10cp)
              // find how many steps to copper pieces
              var coinPower = coinTypes.indexOf(units);
              var copperValue = amount * (10**coinPower);

              // convert to confirms (multiply by 2)
              var confirmAmount = copperValue * 2;

              // reduce values to fewest coins and round up
              var robyCoins = reduceRobyCoinValues(confirmAmount);
              var robyCounAmount = robyCoins[0];
              var robyCounUnits = robyCoins[1];

              newValues = [robyCounAmount, robyCounUnits];

              return newValues;
            }

            function findCoinShift (units) {
              var coinIndex = coinTypes.indexOf(units);
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

              console.log('original amount = ' + amount + ' ' + units);
              console.log('coinShift = ' + coinShift);
              console.log('multiplier = ' + multiplier);

              var newAmount = amount * multiplier;
              var newUnits = coinTypes[coinShift];
              console.log('newAmount = ' + newAmount);
              console.log('newUnits = ' + newUnits);

              var robyBucks = exchangeCoinValues(newAmount, newUnits);
              console.log('robyBucks = ' + robyBucks[0] + ' ' + robyBucks[1]);

              return robyBucks[0] + ' ' + robyBucks[1];

            }

            var moneyData = $('tr:has(td.money.number) .money.number');

            moneyData.each(function processMoney(index, moneyTD) {
              var moneyArray = moneyTD.innerHTML.split(' ');
              var amount = parseInt(moneyArray[0].replace(/,/g, ""));
              var units = moneyArray[1];
              $(moneyTD).append(' => ' + convert(amount, units)).css('background', 'red');
            });


        })();
    }

})();
