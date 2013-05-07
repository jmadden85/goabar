var shareWrap = function () {
    var startingPoint;
    var GoalSlider = function (container) {

        this.container = container;
        this.offSetL = document.getElementsByClassName('wrapper')[0].offsetLeft;
        this.progress = document.getElementsByClassName('progress')[0];
        this.theBar = document.getElementsByClassName('bar')[0];
        this.currValue = parseInt(document.getElementById('curr').value);
        this.goalValue = parseInt(document.getElementById('goal').value);
        this.totalValue = parseInt(document.getElementById('total').value);
        this.barWidth = this.progress.offsetWidth;
        this.dragger = document.getElementById('dragger');
        this.goalTip = document.getElementById('goalNum');
        this.totalTip = document.getElementById('totalNum');
        this.goalMet = false;
        this.dragHovered = false;
        this.hover = false;
        this.clicked = false;

    };

    GoalSlider.prototype.init = function () {
        var goalAdjuster = this.goalAdjuster;
        var dragHovered = this.dragHovered;
        if ( this.goalValue === 0 ) { //Check if goal has been set ever
            this.goalValue = undefined;
        } else if ( this.goalValue < this.currValue ) { // or if it has been completed already
            this.goalMet = true;
        }

        //Event listener for hover events
        this.progress.addEventListener('mouseover', function (e) {
            goalAdjuster('mouseover', e);
        }, false);
        this.progress.addEventListener('mouseout', function (e) {
            goalAdjuster('mouseout', e);
        }, false);

        //Event listener for dragger hover events
        this.dragger.addEventListener('mouseover', function (e) {
            goalAdjuster('mouseover', e);
        }, false);
        this.dragger.addEventListener('mouseout', function (e) {
            goalAdjuster('mouseout', e);
        }, false);

        //Event listener for mouse move events
        this.progress.addEventListener('mousemove', function (e) {

        }, false);
        this.dragger.addEventListener('mousemove', function (e) {
            goalAdjuster('mousemove', e);
        }, false);

        //Event listener for drag events
        this.progress.addEventListener('drag', function (e) {
        }, false);

        //Event listener for click events
        this.progress.addEventListener('mousedown', function (e) {
            goalAdjuster('mousedown', e);
        }, false);
        this.progress.addEventListener('mouseup', function (e) {
            goalAdjuster('mouseup', e);
        }, false);
        this.dragger.addEventListener('mouseup', function (e) {
            goalAdjuster('mouseup', e);
        })


        if ( !this.goalMet && this.goalValue ) {
            this.loadBar();
        }
    };

    GoalSlider.prototype.loadBar = function () {
        //get percentage
        this.goalPercentage = this.currValue / this.goalValue * 100;
        //get and set goal value
        var goalTipValue = this.goalTip.children[1];
        goalTipValue.innerHTML = this.goalValue;
        //Move goal tooltip to end of bar
        var widthToSubtract = this.goalTip.offsetWidth / 2;

        //animate bar percentage
        this.goalTip.style.left = (this.barWidth - widthToSubtract) + 'px';
        this.theBar.style.width = this.goalPercentage + '%';
    };

    GoalSlider.prototype.goalAdjuster = function (e, eObj) {
        var offSetL = document.getElementsByClassName('wrapper')[0].offsetLeft;
        var barWidth = document.getElementsByClassName('progress')[0].offsetWidth;
        var onePercenter = barWidth / 100;
        var currentPoint;
        var currentPercent;
        if ( e === 'mousedown' ) { //on mouse down on bar
            this.clicked = true;
            console.log(eObj);
            this.dragger.style.left = (eObj.offsetX - 25) + 'px';
            this.dragger.style.display = 'block';
            startingPoint = eObj.offsetX - 25;
        } else if ( e === 'mouseup' ) { //on mouse up on bar
            this.clicked = false;
            this.dragger.style.display = 'none';
        } else if ( e === 'mouseover' ) { //on mouse over
            this.hovered = true;
            // setTimeout(function () {
            //     this.hovered ? this.dragger.style.display = 'block' : this.dragger;
            // }, 500);
        } else if ( e === 'mouseout' ) { //on mouse out
            this.hovered = false;
            // setTimeout(function () {
            //     !this.hovered && !this.dragHovered ? this.dragger.style.display = 'none' : this.dragger;
            // }, 500);
        } else if ( e === 'mousemove' ) { //on move
            var pos = (eObj.pageX - offSetL) - 25;
            var theBar = document.getElementsByClassName('bar')[0];
            var currentIncrement =
            this.dragger.style.left = pos + 'px';
            currentPoint = pos - startingPoint;
            currentPercent = Math.ceil(currentPoint / Math.round(onePercenter));
        }
    };

    document.addEventListener('DOMContentLoaded', function() {
        var goalSet = new GoalSlider('goalBarWrapper');
        goalSet.init();
    }, false);

}();