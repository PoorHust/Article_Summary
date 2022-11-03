var fs = require("fs");
var process = require("process");
var args = process.argv;
var extractor = require("./extractor");
// module này để gắn các câu có liên quan tới nhau thành 1 (câu sau có các từ nối như because of that)
function trim(line) {
    // bỏ hết dấu trống (/s) đầu và cuối câu
    return line.replace(/^\s+|\s+$/gm, '');
}

function getTransitionPhrases() {
    // lấy các từ nối từ data
    var tLines = fs.readFileSync("Data/transition_phrases.txt").toString();
    var lines = tLines.split("\n");
    result = [];
    for (var line of lines)
        result.push(trim(line));
    return result;
}

function isTransitionPhrase(transitionPhrases, sentence) {
    // xem câu có bắt đầu = từ nối không
    var lower = sentence.toLowerCase();
    for (var phrase of transitionPhrases)
        if (lower.startsWith(phrase))
            return true;
    return false;
}


function omitTransitionSentences(sentences) {
    // ghép
    var transitionPhrases = getTransitionPhrases();
    result = [];
    for (var sentence of sentences)
        if (!isTransitionPhrase(transitionPhrases, sentence))
            result.push(sentence);
    return result;
}

module.exports = {
    omitTransitionSentences,
};