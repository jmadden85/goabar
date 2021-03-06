var barWrap = function ($) {

    var GoalSlider = function (goal, current) {
        this.goal = goal;
        this.current = current;

        //Conver values to integers for maths
        var minNum = 0;
        var maxNum = 0;
        var goalNum = parseInt(this.goal, 10);
        var currentNum = parseInt(this.current, 10);
        var completedPercentage = 0;
        var goalPercentage = 0;
        var level = 0;

        //Grab elements to be effected
        var indicator = $('.peopleWrapper .indicators span');
        var barWrappers = $('.barWrappers');
        var bar = $('#people .bar');
        var dragger = $('.dragger');
        var tooltip = $('#peopleCurrent');
        var goalTooltip = $('#peopleGoal');
        var indicators = [];

        this.init = function () {
            //Figure out the ambassador level and set the appropriate min and max
            if ( currentNum < 6 ) {
                maxNum = 6;
                minNum = 0;
            } else if ( currentNum > 6 && currentNum < 20 ) {
                maxNum = 20;
                minNum = 4;
                level = 1;
            } else if ( currentNum > 20 && currentNum < 50 ) {
                maxNum = 50;
                minNum = 15;
                level = 2;
            } else {
                maxNum = currentNum + 20;
                minNum = currentNum - 20;
                level = 3;
            }

            //Calculate percentages
            completedPercentage = (currentNum - minNum) / (maxNum - minNum);
            goalPercentage = (goalNum - minNum) / (maxNum - minNum);
            indicators = [minNum, Math.round(((maxNum - minNum) / 2)) + minNum, maxNum];

            //Set some hidden inputs
            $('#level').val(level);

            //Set indicators
            for ( var i = 0; i < indicators.length; i++ ) {
                $(indicator[i]).html(indicators[i]);
            }

            //Set up the tooltips
            tooltip.children('.tooltip-inner').html(currentNum);
            goalTooltip.children('.tooltip-inner').html(goalNum);

            //Load lead bar and progress bar
            $(bar[0]).css('width', completedPercentage * 100 + '%');
            //Stagger showing the tooltip till the bars are loaded
            setTimeout(function () {
                tooltip.css({
                    'left' : barWrappers.width() * completedPercentage - (tooltip.width() / 2) + 'px',
                    'display' : 'block'
                });
                $(bar[1]).css('width', (goalPercentage - completedPercentage) * 100 + '%');
                setTimeout(function () {
                    $(bar[1]).addClass('loaded');
                    goalTooltip.css({
                        'left' : -(goalTooltip.width() / 2) + 22 + 'px',
                        'display' : 'block'
                    });
                }, 600);
            }, 600);

            //Position the dragger
            dragger.css({
                'left' : barWrappers.width() * goalPercentage - 22 + 'px',
                'display' : 'block'
            });

            //Set data points for goal marker to snap to
            dragger.attr('data-points', maxNum - minNum);
            dragger.attr('data-goal', goalNum )


        };

        this.slideChange = function (sliding, num) {
            this.sliding = sliding;
            this.num = num;
            var isAdjusting = this.sliding;
            var theNum = parseInt(this.num, 10);
            var thisGoal = dragger.attr('data-goal');

            if ( !isAdjusting ) {
                dragger.css({
                    'left' : barWrappers.width() * ((parseInt(thisGoal, 10) - minNum) / (maxNum - minNum)) - 22 + 'px',
                    'display' : 'block'
                });
                $('.goalBar').css('width', ((parseInt(dragger.css('left').split('px')[0], 10) + 22) / barWrappers.width() * 100) - (completedPercentage * 100) + '%');
                return false;
            }

            dragger.attr('data-goal', theNum);
            goalTooltip.children('.tooltip-inner').html(theNum);

            goalTooltip.css({
                'left' : -(goalTooltip.width() / 2) + 22 + 'px',
                'display' : 'block'
            });
        };
    };

    document.addEventListener('DOMContentLoaded', function() {
        //Grab all the hidden input data
        var current = parseInt($('#current').val(), 10);
        var goal = parseInt($('#goal').val(), 10);
        var dragging = false;
        var dragger = $('.dragger');
        var bars = $('.barWrappers');
        var barWidth = bars.width();
        var goalIncrements = 1;

        //Create the object
        var goalBar = new GoalSlider(goal, current);

        goalBar.init();
        var min = parseInt($('.min').html(), 10);
        var max = parseInt($('.max').html(), 10);
        var level = parseInt($('#level').val(), 10);
        var firstBarPercentage = ((current - min) / (max - min)) * 100;

        //Create a variable with the goal break points
        var goalBreakPoints = [];
        var dragPoints = parseInt(dragger.attr('data-points'), 10);
        //Check ambassadors level for incremented break points
        if ( level === 1 ) {
            goalIncrements = 2;
        } else if ( level === 2 ) {
            goalIncrements = 5;
        }
        dragPoints = dragPoints / goalIncrements;
        var spaceBetweenGoals = barWidth / dragPoints;
        for ( var i = 0; i < dragPoints; i++ ) {
            var startingSpace = spaceBetweenGoals * 1.5;
            var thisSpace = spaceBetweenGoals * i;
            goalBreakPoints.push(Math.round(startingSpace + thisSpace));
        }
        console.log(goalBreakPoints);

        //Set up some dragging events
        dragger.on('mousedown mouseup mousemove', function (event) {
            var eventType = event.type;
            event.preventDefault();

            switch (eventType) {
            case 'mousedown' :
                dragging = true;
                break;

            case 'mouseup' :
                dragging = false;
                goalBar.slideChange(dragging);
                break;

            default :
                break;
            }
        });

        //In case they mouse up while still not on the dragger
        $(document).on('mouseup', function () {
            dragging = false;
            goalBar.slideChange(dragging);
        });

        //Set up draggin for bars
        bars.on('mouseup mousemove', function (event) {
            var eventType = event.type;
            event.preventDefault();

            switch ( eventType ) {
            case 'mouseup' :
                dragging = false;
                goalBar.slideChange(dragging);
                break;

            case 'mousemove' :
                var mouseX = (event.pageX - bars.offset().left) - 22;
                var goalNow = parseInt(dragger.attr('data-goal'), 10);

                if ( dragging && mouseX > -22 && mouseX < (barWidth - 22) ) {

                    console.log(mouseX, goalBreakPoints[(goalNow / goalIncrements) - min]);
                    //Increment while changing
                    if ( mouseX < goalBreakPoints[(goalNow - min) / goalIncrements - 2] && goalNow - goalIncrements > current ) {
                        goalBar.slideChange(true, goalNow - goalIncrements);
                    } else if ( mouseX > goalBreakPoints[(goalNow - min) / goalIncrements - 1] ) {
                        goalBar.slideChange(true, parseInt(goalNow, 10) + goalIncrements);
                    }

                    dragger.css('left', mouseX + 'px');
                    $('.goalBar').css('width', ((parseInt(dragger.css('left').split('px')[0], 10) + 22) / barWidth * 100) - firstBarPercentage + '%');
                }

                break;

            default :
                break;
            }
        });





    });

}(jQuery);