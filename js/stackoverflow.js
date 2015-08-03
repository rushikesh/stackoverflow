        var app = angular.module('myApp', ['ngSanitize']);
        app.config(function ($sceProvider) {
            // Completely disable SCE.
            $sceProvider.enabled(false);
        });
        app.factory('loadingMaskSrvc', function () {
            return {
                toggleAjaxMask: function (val) {
                    var ele = $('#loadingScreen');
                    if (ele == null) {
                        var div = document.createElement('div');
                        div.id = "loadingScreen";
                        var html = '<img style="position:absolute;top:40%;left:45%;" alt="loading" src = "img/loading.gif" alt = "Loading" / > ';
                        div.innerHTML = html;
                        var body = document.getElementsByTagName('body');
                        body[0].appendChild(div);
                    }
                    $(ele).css('display', val ? 'block' : 'none');
                    console.log('loading');
                }
            }
        });
        app.factory('mySrvc', function ($http, loadingMaskSrvc) {
            return {
                getData: function (topic) {
                    var promise = $http.get('js/' + topic.loc + '.json', function (data) {
                        loadingMaskSrvc.toggleAjaxMask(true);
                        return data;
                    });
                    return promise;
                }
            }
        });
        app.controller('myCtrl', function ($scope, mySrvc, loadingMaskSrvc) {
            $scope.topic = [{
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
                loc: 'HTML5 Top 200 By Vote Stackoverflow'
            }, {
                name: 'CSS3',
                loc: 'CSS3 Top 300 By Vote Stackoverflow'
            }, {
                name: 'SQL',
                loc: 'SQL Top 200 By Vote Stackoverflow'
            }];
            $scope.$watch('pgTopic', function (topic) {
                $scope.pgTitle = topic.loc;
                mySrvc.getData(topic).then(function (resp) {
                    $scope.jsonData = resp.data;
                    $("body").css("background-image", "url('./img/" + topic.name + ".png')");
                    window.scrollTo(0, 0);
                    loadingMaskSrvc.toggleAjaxMask(false);
                });
            });
            $scope.jsonData = [];
            $scope.openPopUp = function (data) {
                $scope.title = data.t;
                $scope.link = data.l;
                $scope.question = data.q;
                $scope.answer = data.a;
                $('#myModal').modal('show');
            };
        });