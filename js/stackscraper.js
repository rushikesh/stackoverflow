jQuery.ajaxSetup({
    async: false
});
//the tag and totalQuestionsToScan are the ones you need to change as per ur preference
var tag = 'regex'
var totalQuestionsToScan = 300 //multiples of 50

function download(filename, text) {
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    pom.setAttribute('download', filename);

    if (document.createEvent) {
        var event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
    } else {
        pom.click();
    }
}


var questions = [];
var baseUrl = 'http://stackoverflow.com/questions/tagged/';
var pages = totalQuestionsToScan / 50;
var counter = 1;
while (counter <= pages) {
    var reqUrl = baseUrl + tag + '?page=' + counter + '&sort=votes&pagesize=50';
    counter += 1;
    $.get(reqUrl, function (data) {
        var dataDom = $(data);
        var links = dataDom.find('div .summary > h3 > a');
        for (var i = 0; i < links.length; i++) {
            questions.push(links[i]);
        }
    });
}

var stackData = [];
for (var i = 0; i < questions.length; i++) {
    $.get('http://stackoverflow.com/' + $(questions[i]).attr('href'), function (data) {
        var d = $(data);
        var title = d.find('#question-header').text().trim();;
        var question = d.find('.post-text')[0].innerHTML;
        var answer = d.find('.accepted-answer')[0];
        if (!answer) {
            answer = d.find('.answer')[0];
        }
        if (!$(answer).find('.post-text')[0]) {
            answer = 'Some Issue fetching the answer, please click the link in the header to navigate to the actual stackoverflow thread';
        } else {
            answer = $(answer).find('.post-text')[0].innerHTML;
        }

        stackData.push({
            t: title,
            l: questions[i].href,
            q: question,
            a: answer
        });
        console.log(questions[i].href);
    });
}
download(tag + ' Top ' + totalQuestionsToScan + ' By Vote Stackoverflow.json', JSON.stringify(stackData));