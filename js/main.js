var shareWrap = function ($) {

    var GoalSlider = function (min, max, goal, current, referAmount) {
        this.min = min;
        this.max = max;
        this.goal = goal;
        this.current = current;
        this.referAmount = referAmount;
        var moneyIndicators = $('.cashMoneyWrapper .indicators span');
        var peopleIndicators = $('.peopleWrapper .indicators span');
        var barWrappers = $('.barWrappers');
        var moneyBar = $('#cashMoney .bar');
        var peopleBar = $('#people .bar');
        var dragger = $('.dragger');
        var cashTooltip = $('#cashMoneyCurrent');
        var cashGoalTooltip = $('#cashMoneyGoal');
        var peopleTooltip = $('#peopleCurrent');
        var peopleGoalTooltip = $('#peopleGoal');

        var minNum = parseInt(this.min, 10);
        var maxNum = parseInt(this.max, 10);
        var goalNum = parseInt(this.goal, 10);
        var currentNum = parseInt(this.current, 10);
        var referAmountNum = parseInt(this.referAmount, 10);
        var completePercentage = 100 * (currentNum / maxNum);
        var goalPercentage = goalNum / maxNum;
        var indicators = [minNum, maxNum / 2, maxNum];
        var minRefer = minNum / referAmountNum;
        var maxRefer = maxNum / referAmountNum;
        var currentRefer = currentNum / referAmountNum;
        var referIndicators = [minRefer, maxRefer / 2, maxRefer];

        this.init = function () {

            //Set indicators
            for ( var i = 0; i < 3; i++ ) {
                $(moneyIndicators[i]).html('$' + indicators[i]);
                $(peopleIndicators[i]).html(referIndicators[i]);
            }

            //Load bars
            $(moneyBar[0]).css('width', completePercentage + '%');
            $(peopleBar[0]).css('width', completePercentage + '%');
            $('.goalBar').css('width', (goalPercentage * 100) - completePercentage + '%');
            $('.goalBar').addClass('loaded');

            //Load goal marker
            dragger.css({
                'left' : barWrappers.width() * goalPercentage - 17 + 'px',
                'display' : 'block'
            });

            //Load the tooltips
            cashTooltip.children('.tooltip-inner').html(currentNum);
            cashGoalTooltip.children('.tooltip-inner').html(goalNum);
            peopleTooltip.children('.tooltip-inner').html(currentRefer);
            peopleGoalTooltip.children('.tooltip-inner').html(goalNum / referAmountNum);

            setTimeout(function () {
                cashTooltip.css({
                    'left' : barWrappers.width() * (completePercentage / 100) - (cashTooltip.width() / 2) + 'px',
                    'display' : 'block'
                });
                cashGoalTooltip.css({
                    'left' : -(cashGoalTooltip.width() / 2) + 17 + 'px',
                    'display' : 'block'
                });
                peopleTooltip.css({
                    'left' : barWrappers.width() * (completePercentage / 100) - (peopleTooltip.width() / 2) + 'px',
                    'display' : 'block'
                });
                peopleGoalTooltip.css({
                    'left' : -(peopleGoalTooltip.width() / 2) + 17 + 'px',
                    'display' : 'block'
                });
            }, 600);

            //Set points for goal marker to snap to
            dragger.attr('data-points', maxRefer);
            dragger.attr('data-goal', goalNum / referAmountNum);


        };

        this.slideChange = function (sliding, num) {
            this.sliding = sliding;
            this.num = num;
            var isAdjusting = this.sliding;
            var theNum = parseInt(this.num, 10);
            var thisGoal = dragger.attr('data-goal');

            if ( !isAdjusting ) {
                dragger.css({
                    'left' : barWrappers.width() * (thisGoal / maxRefer) - 17 + 'px',
                    'display' : 'block'
                });
                $('.goalBar').css('width', ((parseInt(dragger.css('left').split('px')[0], 10) + 17) / barWrappers.width() * 100) - completePercentage + '%');
                return false;
            }

            dragger.attr('data-goal', theNum);
            cashGoalTooltip.children('.tooltip-inner').html(theNum * referAmountNum);
            peopleGoalTooltip.children('.tooltip-inner').html(theNum);

            peopleGoalTooltip.css({
                'left' : -(peopleGoalTooltip.width() / 2) + 17 + 'px',
                'display' : 'block'
            });

            cashGoalTooltip.css({
                'left' : -(cashGoalTooltip.width() / 2) + 17 + 'px',
                'display' : 'block'
            });

        };

    };

    document.addEventListener('DOMContentLoaded', function() {
        var current = $('#current').val();
        var goal = $('#goal').val();
        var min = $('#min').val();
        var max = $('#max').val();
        var referAmount = $('#referAmount').val();
        var goalSet = new GoalSlider(min, max, goal, current, referAmount);
        var dragger = $('.dragger');
        var dragging = false;
        var bars = $('.barWrappers');
        var minBar = $('#minBar').val();
        var maxBar = $('#maxBar').val();
        var setter = $('a.btn');
        var barWidth = bars.width();
        var goalMidPoints = [];
        var percentage = parseInt(current, 10) / parseInt(max, 10) * 100;

        setter.click(function () {

        });

        goalSet.init();

        var dragPoints = parseInt(dragger.attr('data-points'), 10);
        var spaceBetweenGoals = barWidth / dragPoints;

        for ( var i = 0; i < (dragPoints - 1); i++ ) {
            var startingSpace = spaceBetweenGoals * 1.5;
            var thisSpace = spaceBetweenGoals * i;
            goalMidPoints.push(Math.round(startingSpace + thisSpace));
        }

        dragger.on('mousedown mouseup mousemove', function (event) {
            var eventType = event.type;
            var mouseX = event.offsetX;
            var mouseY = event.offsetY;
            event.preventDefault();

            switch (eventType) {

            case 'mousedown' :
                dragging = true;
                break;

            case 'mouseup' :
                dragging = false;
                break;

            default :
                break;

            }


        });

        $(document).on('mouseup', function () {
            dragging = false;
        });

        bars.on('mouseup mousemove', function (event) {
            var eventType = event.type;
            event.preventDefault();

            switch (eventType) {

            case 'mouseup' :
                dragging = false;
                goalSet.slideChange(false);
                break;

            case 'mousemove' :
                var mouseX = (event.pageX - bars.offset().left) - 17;
                var mouseY = event.offsetY;
                var goalNow = dragger.attr('data-goal');
                if ( dragging && mouseX > -17 && mouseX < (barWidth - 17) ) {

                    //Increment while changing
                    if ( mouseX < goalMidPoints[goalNow - 2] ) {
                        goalSet.slideChange(true, goalNow - 1);
                    } else if ( mouseX > goalMidPoints[goalNow - 1] ) {
                        goalSet.slideChange(true, parseInt(goalNow, 10) + 1);
                    }

                    dragger.css('left', mouseX + 'px');
                    console.log(parseInt(dragger.css('left').split('px')[0], 10) + ', ' + $($('.bar')[0]).width() + ', ' + barWidth);
                    $('.goalBar').css('width', ((parseInt(dragger.css('left').split('px')[0], 10) + 17) / barWidth * 100) - percentage + '%');
                }
                break;

            default :
                break;

            }


        });

    }, false);

}(jQuery);