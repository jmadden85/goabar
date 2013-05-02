var shareIIN = function () {
    var GoalBar = function (id) {
        this.id = id;
        this.container = document.getElementById(this.id);
        this.bar = document.querySelector('#' + this.id + ' .progress .bar');
        this.progress = document.querySelector('#' + this.id + ' .progress');
        this.goal = document.querySelector('#' + this.id + ' #goalNum');
        this.total = document.querySelector('#' + this.id + ' #totalNum');
        this.totalNum = parseInt(document.querySelector('#' + this.id + ' #total').value);
        this.goalNum = parseInt(document.querySelector('#' + this.id + ' #goal').value);
        this.currNum = parseInt(document.querySelector('#' + this.id + ' #current').value);
        this.goalPercentage = (this.goalNum / this.totalNum) * 100;
        this.currPercentage = (this.currNum / this.totalNum) * 100;
        this.barWidth = this.progress.style.width;
    };

    GoalBar.prototype.initBar = function () {
        this.bar.style.width = this.currPercentage + '%';
    };

    var referralsGoal = new GoalBar ('goalSetter');
    referralsGoal.initBar();
}();