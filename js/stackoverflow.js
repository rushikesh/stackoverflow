var mevent;
var app = angular.module('myApp', ['ngSanitize']);
app.config(function ($sceProvider) {
    // Completely disable SCE.
    $sceProvider.enabled(false);
});
app.factory('loadingMaskSrvc', function () {
    return {
        toggleAjaxMask: function (val) {
            var ele = document.getElementById('loadingScreen');
            if (!ele) {
                var div = document.createElement('div');
                div.id = "loadingScreen";
                var html = '<img style="position:absolute;top:40%;left:45%;" alt="loading" src = "img/loading.gif" alt = "Loading" / > ';
                div.innerHTML = html;
                var body = document.getElementsByTagName('body');
                body[0].appendChild(div);
            }
            ele = document.getElementById('loadingScreen');
            ele.style.display = val ? 'block' : 'none';
        }
    }
});
app.factory('mySrvc', function ($http, loadingMaskSrvc) {
    return {
        getData: function (topic) {
            loadingMaskSrvc.toggleAjaxMask(true);
            var promise = $http.get('js/' + topic.loc + '.json', function (data) {
                return data;
            });
            return promise;
        }
    }
});
app.controller('myCtrl', function ($scope, mySrvc, loadingMaskSrvc) {
    $scope.topic = [{
        name: 'Java-8',
        loc: 'Java-8 Top 300 By Vote Stackoverflow'
            }, {
        name: 'ECMASCRIPT-6',
        loc: 'ECMASCRIPT-6 Top 300 By Vote Stackoverflow'
            }, {
        name: 'Java',
        loc: 'Java Top 300 By Vote Stackoverflow'
            }, {
        name: 'Javascript',
        loc: 'Javascript Top 300 By Vote Stackoverflow'
            }, {
        name: 'AngularJS',
        loc: 'AngularJS Top 300 By Vote Stackoverflow'
            }, {
        name: 'HTML5',
        loc: 'HTML5 Top 300 By Vote Stackoverflow'
            }, {
        name: 'CSS3',
        loc: 'CSS3 Top 300 By Vote Stackoverflow'
            }, {
        name: 'SQL',
        loc: 'SQL Top 300 By Vote Stackoverflow'
            }, {
        name: 'NoSql',
        loc: 'NoSql Top 300 By Vote Stackoverflow'
            }, {
        name: 'Algorithms',
        loc: 'Algorithms Top 300 By Vote Stackoverflow'
            }];
    $scope.$watch('pgTopic', function (topic) {
        $scope.pgTitle = topic.loc;
        $scope.search = '';
        mySrvc.getData(topic).then(function (resp) {
            $scope.jsonData = resp.data;
            $("body").css("background-image", "url('./img/" + topic.name + ".png')");
            window.scrollTo(0, 0);
            loadingMaskSrvc.toggleAjaxMask(false);
        });
    });
    $scope.jsonData = [];
    $scope.openPopUp = function (event, data) {
        console.dir(event);
        mevent = event;
        $scope.title = data.t;
        $scope.link = data.l;
        $scope.question = data.q;
        $scope.answer = data.a;
        $('#myModal').modal('show');
    };
});

$(document).ready(function () {
    $("#myModal").on('hidden.bs.modal', function () {
        window.scrollTo(mevent.pageX, mevent.pageY - 800);
    });
});