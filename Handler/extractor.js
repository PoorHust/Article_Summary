var fs = require("fs");
var parser = require("./parser");

function getSentences(sentence) {
    // xử lý dữ liệu nhập vào trả về list các câu
    sentence = sentence.replaceAll("\n", "");
    sentence = parser.convertAbbreviations(sentence);
    sentence = sentence.replaceAll("?", ".");
    sentence = sentence.replaceAll("!", ".");
    var sentences = sentence.split(".");
    sentences = parser.fixBrokenSentences(sentences);
    sentences = parser.removeWhiteSpaceList(sentences);
    sentences = parser.removeBlanks(sentences);
    sentences = parser.addPeriods(sentences);
    sentences = parser.cleanupQuotes(sentences);
    sentences = parser.groupQuotes(sentences);
    sentences = parser.commaHandler(sentences);
    return sentences;
}

function getWords(word) {
    // xử lý dữ liệu nhập vào trả về list các từ
    word = word.replaceAll("\n", " ");
    word = parser.convertAbbreviations(word);
    var words = word.split(" ");
    words = parser.removeBlanks(words);
    for (var i = 0; i < words.length; i++)
        words[i] = parser.cleanWord(words[i]);
    return words;
}

module.exports = {
    getWords,
    getSentences,
};