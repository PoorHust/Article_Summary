var fs = require("fs");
var extractor = require("./extractor");
var filter = require("./filter");
var scoring = require("./scoring");
let linkExtractor = require('unfluff');
let request = require('request');

// module tổng
function summarizeLocal(path, numOfSentences) {
    // tóm tắt file txt trên máy
    var article = fs.readFileSync(path).toString();
    var allWords = extractor.getWords(article);
    var wordScores = scoring.getWordScore(allWords);
    var allSentences = extractor.getSentences(article);
    allSentences = filter.omitTransitionSentences(allSentences);
    var sentenceScores = scoring.getScoreList(allSentences, wordScores)
    if (numOfSentences > allSentences.length) {
        console.log("The summary cannot be longer than the text.");
        return;
    }
    var threshold = scoring.xHighestScore(sentenceScores, numOfSentences);
    var topSentences = scoring.topSentences(allSentences, sentenceScores, threshold)
    var summary = "";
    for (var sentence of topSentences)
        summary += sentence + " ";
    summary = summary.substring(0, summary.length - 1);
    console.log(summary)
}

// summarizeLocal("Article/test.txt", 1);

function summarizefromLink(link, numOfSentences) {
    //tóm tắt từ 1 link
    request.get(link, function (err, response, body) {
        var data = linkExtractor(body, 'en');
        var article = data['text'];
        var allWords = extractor.getWords(article);
        var wordScores = scoring.getWordScore(allWords);
        var allSentences = extractor.getSentences(article);
        allSentences = filter.omitTransitionSentences(allSentences);
        var sentenceScores = scoring.getScoreList(allSentences, wordScores)
        if (numOfSentences > allSentences.length) {
            console.log("The summary cannot be longer than the text.");
            return;
        }
        var threshold = scoring.xHighestScore(sentenceScores, numOfSentences);
        var topSentences = scoring.topSentences(allSentences, sentenceScores, threshold)
        var summary = "";
        for (var sentence of topSentences)
            summary += sentence + " ";
        summary = summary.substring(0, summary.length - 1);
        console.log(summary)
    });
}

// summarizefromLink("https://en.wikipedia.org/wiki/Climate_change", 2);


