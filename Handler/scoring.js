var fs = require("fs");
var parser = require("./parser");

// module chấm điểm
function getWordScore(allWords) {
    // Trả lại HashMap với key là từ và value là số lần xuất hiện của từ tương ứng
    var ignoredWords;
    var dictionary = new Map();
    var wordsToIgnore = fs.readFileSync("Data/words_to_ignore.txt").toString().split("\n");
    for (var i = 0; i < allWords.length; i++) {
        var word = allWords[i];
        if (wordsToIgnore.includes(word))
            continue;
        var count = 1.0;
        var dictKeys = Array.from(dictionary, ([key, value]) => (key));
        if (dictKeys.includes(word))
            count += dictionary.get(word);
        dictionary.set(word, count);
    }
    return dictionary;
}

function count(word, sentence) {
    // Đếm số lần xuất hiện của từ trong câu
    var tLWords = sentence.split(" ");
    var count = 0;
    for (var i = 0; i < tLWords.length; i++)
        if (word == tLWords[i])
            count++;
    return count;
}

function score(sentence, wordScores) {
    // Tính điểm của câu (wordScores là data số điểm)
    var denominator = 1.0;
    var score = 0.0;
    var words = sentence.split(" ");
    for (var i = 0; i < words.length; i++) {
        var word = words[i];
        var wordScoreKeys = Array.from(wordScores, ([key, value]) => (key));
        if (!(wordScoreKeys.includes(word)))
            continue;
        if (count(word, sentence) == 1)
            denominator += 1.0;
        word = parser.cleanWord(word);
        score += wordScores.get(word);
    }
    return (score / denominator);
}

function getSentenceScoreDict(allSentences, wordScores) {
    // Trả lại HashMap với key là câu và value là điểm mỗi câu tương ứng 
    var dictionary = new Map();
    for (var i = 0; i < allSentences.length; i++) {
        var sentence = allSentences[i];
        var temp = score(sentence, wordScores);
        dictionary.set(sentence, temp);
    }
    return dictionary;
}

function getScoreList(allSentences, wordScores) {
    // Trả lại danh sách điểm cùng thứ tự với câu
    var sScore = [];
    for (var i = 0; i < allSentences.length; i++) {
        var sentence = allSentences[i];
        sScore.push(score(sentence, wordScores));
    }
    return sScore;
}

// function printPopular(dictionary, sortedItems, top = 10) {
//     // In top 10 từ xuất hiện nhiều nhất
//     if (top >= sortedItems.length)
//         top = sortedItems.length - 1;
//     console.log("Rank:", "Score:", "Content:");
//     for (var i = 0; i < top; i++) {
//         word = sortedItems[i];
//         count = dictionary.get(word);
//         console.log("#" + (i + 1) + ".", count, word);
//     }
// }

function xHighestScore(sentenceScores, x) {
    // Tìm từ có điểm top x
    var list = [];
    for (var score of sentenceScores)
        list.push(score);
    list.sort((a, b) => b - a);
    return list[x - 1];
}


function topSentences(allSentences, sentenceScores, threshold) {
    // trả danh sách các câu có điểm > threhold
    var result = [];
    for (var i = 0; i < allSentences.length; i++)
        if (sentenceScores[i] >= threshold)
            result.push(allSentences[i]);
    return result;
}

module.exports = {
    getWordScore,
    getScoreList,
    xHighestScore,
    topSentences,
};