var shareWrap = function ($) {

    var GoalSlider = function (min, max, goal, current, referAmount) {
        this.min = min;
        this.max = max;
        this.goal = goal;
        this.current = current;
        this.referAmount = referAmount;

        //Store all the elemenets that will be effected in variables
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

        //Turn everything into integers for maths
        //Generate percentages
        var minNum = parseInt(this.min, 10);
        var maxNum = parseInt(this.max, 10);
        var diff = maxNum - minNum;
        var goalNum = parseInt(this.goal, 10);
        var goalDiff = goalNum - minNum;
        var currentNum = parseInt(this.current, 10);
        var currDiff = currentNum - minNum
        var referAmountNum = parseInt(this.referAmount, 10);
        var completePercentage;
        var goalPercentage;
        //If the minimum amount isn't 0 then the math needs to change some
        if ( minNum ) {
            completePercentage = 100 * (currDiff / diff);
            goalPercentage = goalDiff / diff;
        } else {
            completePercentage = 100 * (currentNum / maxNum);
            goalPercentage = goalNum / maxNum;
        }
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
                'left' : barWrappers.width() * goalPercentage - 22 + 'px',
                'display' : 'block'
            });

            //Load the tooltips
            cashTooltip.children('.tooltip-inner').html('$' + currentNum);
            cashGoalTooltip.children('.tooltip-inner').html('$' + goalNum);
            peopleTooltip.children('.tooltip-inner').html(currentRefer);
            peopleGoalTooltip.children('.tooltip-inner').html(goalNum / referAmountNum);

            setTimeout(function () {
                cashTooltip.css({
                    'left' : barWrappers.width() * (completePercentage / 100) - (cashTooltip.width() / 2) + 'px',
                    'display' : 'block'
                });
                cashGoalTooltip.css({
                    'left' : -(cashGoalTooltip.width() / 2) + 22 + 'px',
                    'display' : 'block'
                });
                peopleTooltip.css({
                    'left' : barWrappers.width() * (completePercentage / 100) - (peopleTooltip.width() / 2) + 'px',
                    'display' : 'block'
                });
                peopleGoalTooltip.css({
                    'left' : -(peopleGoalTooltip.width() / 2) + 22 + 'px',
                    'display' : 'block'
                });
            }, 600);

            //Set points for goal marker to snap to
            dragger.attr('data-points', maxRefer - minRefer);
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
                    'left' : barWrappers.width() * ((parseInt(thisGoal, 10) - minRefer) / (maxRefer - minRefer)) - 22 + 'px',
                    'display' : 'block'
                });
                $('.goalBar').css('width', ((parseInt(dragger.css('left').split('px')[0], 10) + 22) / barWrappers.width() * 100) - completePercentage + '%');
                return false;
            }

            dragger.attr('data-goal', theNum);
            cashGoalTooltip.children('.tooltip-inner').html('$' + theNum * referAmountNum);
            peopleGoalTooltip.children('.tooltip-inner').html(theNum);

            peopleGoalTooltip.css({
                'left' : -(peopleGoalTooltip.width() / 2) + 22 + 'px',
                'display' : 'block'
            });

            cashGoalTooltip.css({
                'left' : -(cashGoalTooltip.width() / 2) + 22 + 'px',
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
        var currentReferrals = parseInt(current, 10) / parseInt(referAmount, 10);
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
        var isTouch = 'ontouchstart' in document.documentElement;

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

        // if ( !isTouch ) {
        //     dragger.hammer().on('touch release drag', function (event) {
        //         event.preventDefault();
        //         event.gesture.preventDefault();
        //         var eventType = event.type;
        //         var dragPosition = event.gesture.center.pageX - bars.offset().left - 22;

        //         switch (eventType) {

        //         case 'touch' :
        //             dragging = true;
        //             break;

        //         case 'release' :
        //             dragging = false;
        //             goalSet.slideChange(false);
        //             break;

        //         case 'drag' :
        //             if ( dragging && dragPosition > -22 && dragPosition < (barWidth) ) {
        //                 var goalNow = dragger.attr('data-goal');

        //                 //Increment while changing
        //                 if ( dragPosition < goalMidPoints[goalNow - 2] && goalNow - 1 !== currentReferrals ) {
        //                     goalSet.slideChange(true, goalNow - 1);
        //                 } else if ( dragPosition > goalMidPoints[goalNow - 1] ) {
        //                     goalSet.slideChange(true, parseInt(goalNow, 10) + 1);
        //                 }

        //                 $('#goalNow').html(dragPosition);

        //                 dragger.css('left', dragPosition + 'px');
        //                 $('.goalBar').css('width', ((parseInt(dragger.css('left').split('px')[0], 10) + 22) / barWidth * 100) - percentage + '%');
        //             }
        //             break;

        //         default :
        //             break;
        //         }
        //     });
        // }

        $(document).on('mouseup', function () {
            dragging = false;
        });

        if ( !isTouch ) {
            bars.on('mouseup mousemove', function (event) {
                var eventType = event.type;
                event.preventDefault();

                switch (eventType) {

                case 'mouseup' :
                    dragging = false;
                    goalSet.slideChange(false);
                    break;

                case 'mousemove' :
                    var mouseX = (event.pageX - bars.offset().left) - 22;
                    var mouseY = event.offsetY;
                    var goalNow = dragger.attr('data-goal');
                    if ( dragging && mouseX > -22 && mouseX < (barWidth - 22) ) {

                        //Increment while changing
                        if ( mouseX < goalMidPoints[(goalNow - min / referAmount) - 2] && goalNow - 1 !== currentReferrals ) {
                            goalSet.slideChange(true, goalNow - 1);
                        } else if ( mouseX > goalMidPoints[(goalNow - min / referAmount) - 1] ) {
                            goalSet.slideChange(true, parseInt(goalNow, 10) + 1);
                        }

                        dragger.css('left', mouseX + 'px');
                        $('.goalBar').css('width', ((parseInt(dragger.css('left').split('px')[0], 10) + 22) / barWidth * 100) - percentage + '%');
                    }
                    break;

                default :
                    break;

                }


            });
        }

    }, false);

}(jQuery);