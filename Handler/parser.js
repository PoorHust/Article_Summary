var fs = require("fs");
// var process = require("process");
// var args = process.argv;

//module xử lý bài viết về dạng thường để chấm điểm
function commaHandler(sentences) {
    // xử lý dấu phẩy
    var newList = [];
    var skip = false;
    for (var i = 0; i < sentences.length; i++) {
        if (skip) {
            skip = false;
            continue;
        }
        if (i + 1 < sentences.length && sentences[i + 1].charAt(0) == ',') {
            newList.push(sentences[i] + sentences[i + 1]);
            skip = true;
        } else
            newList.push(sentences[i]);
    }
    return newList;
}

function isalnum(sentence, num) {
    // Check ký tự
    var code = sentence.charCodeAt(num);
    if (!(code > 47 && code < 58) && // numeric (0-9)
        !(code > 64 && code < 91) && // upper alpha (A-Z)
        !(code > 96 && code < 123)) { // lower alpha (a-z)
        return false;
    }
    return true;
}

function count(sentence, occurence) {
    // Đếm số lần xuất hiện ký tự trong chuỗi
    var count = 0;
    for (var i = 0; i < sentence.length; i++) {
        if (sentence.charAt(i) == occurence)
            count++;
    }
    return count;
}

function groupQuotes(sentences) {
    // Trích dẫn (Quotes) phải là 1 câu kể cả có dấu câu trong đó (ex: "trích từ Bố là chó. Mẹ là Mèo")
    // Ở đây ta nhóm các Quotes lại
    var newList = [];
    var skip = 0;
    for (var i = 0; i < sentences.length; i++) {
        if (skip > 0) {
            skip -= 1;
            continue;
        }
        var sentence = sentences[i];
        while (count(sentence, '\"') % 2 == 1) {
            skip += 1;
            if (i + skip >= sentences.length)
                break;
            if (isalnum(sentences[i + skip], 0))
                sentence = sentence + " " + sentences[i + skip];
            else
                sentence += sentences[i + skip];
        }
        newList.push(sentence);
    }
    return newList;
}

// function isIsolatedQuotation(sentence) {
//     // Check câu có phải là 1 quote riêng biệt
//     if (sentence.charAt(0) == '\"' && sentence.charAt(1) == ' ')
//         return true;
//     else
//         return false;
// }

// function isQuotationWithPeriod(sentence) {
//     // Check câu có phải là quote bị tách ra không
//     if (sentence.charAt(0) == '\"' && sentence.charAt(1) == '.')
//         return true;
//     else
//         return false;
// }

function cleanupQuotes(sentences) {
    // Xử lý Quotes
    var generified = [];
    for (var sentence of sentences) {
        sentence.replaceAll('“', '\"');
        sentence.replaceAll('”', '\"');
        generified.push(sentence);
    }
    var newList = [];
    newList.push(generified[0]);
    for (var i = 1; i < sentences.length; i++) {
        var sentence = sentences[i];
        // if (isIsolatedQuotation(sentence) && isQuotationWithPeriod(sentence)) {
        //     sentence = sentence.substring(2);
        //     newList[newList.length - 1] += "\"";
        // }
        newList.push(sentence);
    }
    return newList;
}

function addPeriods(sentences) {
    // Thêm dấu chấm vào câu
    var newList = [];
    for (var sentence of sentences) {
        if (sentence != "") {
            newList.push(sentence + ".");
        }
    }
    return newList;
}

function removeBlanks(sentences) {
    // Bỏ các thành phần trống
    var newList = [];
    for (var sentence of sentences) {
        if (sentence != "") {
            newList.push(sentence);
        }
    }
    return newList;
}

function removePunctuation(word) {
    // Bỏ dấu câu
    var newWord = word;
    while (newWord != "" && !(isalnum(newWord, 0)))
        newWord = newWord.substring(1);
    while (newWord != "" && !(isalnum(newWord, newWord.length - 1)))
        newWord = newWord.substring(0, newWord.length - 1);
    return newWord;
}

function toSingular(word) {
    // Chuyển về số ít
    var newWord = word;
    if (word.endsWith("ies"))
        newWord = word.substring(0, word.length - 3) + "y";
    else if (word.endsWith("'s") || word.endsWith("s"))
        newWord = word.substring(0, word.length - 1);
    return newWord;
}

function fixBrokenSentences(sentences) {
    // Sửa câu bị lỗi do viết tắt có dấu chấm (bằng cách chuyển về dạng nguyên bản r check từ điển) trường hợp 1 dấu chấm
    var abbreviation = fs.readFileSync("Data/abbreviations.txt");
    var abbreviations = abbreviation.toString().split("\n");
    var newList = [];
    var flag = false;
    for (var i = 0; i < sentences.length; i++) {
        var sentence = sentences[i];
        if (flag) {
            flag = false;
            continue;
        }

        var tArray = sentence.split(" ");
        var lastWord = tArray[tArray.length - 1];
        lastWord = removePunctuation(lastWord);
        lastWord = toSingular(lastWord);
        lastWord = removePunctuation(lastWord);
        lastWord += ".";
        newList.push(sentence);

        for (var word of abbreviations) {
            if (word == lastWord) {
                newList[newList.length - 1] += "." + sentences[i + 1];
                flag = true;
                break;
            }
        }
    }
    return newList;
}

function convertAbbreviations(sentence) {
    // Sửa câu bị lỗi do viết tắt có dấu chấm bằng cách bỏ dấu chấm và check từ câu dài trường hợp nhiều dấu chấm
    //Y.C.m.b
    var abbreviation = fs.readFileSync("Data/abbreviations_multi.txt");
    var abbreviations = abbreviation.toString().split("\n");
    var newSentence = sentence;
    var abbreviationsInString = [];
    for (var word of abbreviations) {
        if (newSentence.includes(word))
            abbreviationsInString.push(word);
    }
    abbreviationsInString.sort((a, b) => b.length - a.length);
    for (var word of abbreviations) {
        if (newSentence.includes(word))
            newSentence.replaceAll(word, word.replaceAll('.', ''));
    }
    return newSentence;
}

function cleanWord(word) {
    // Chuyển từ về dạng nguyên bản
    var newWord = removePunctuation(word);
    newWord = toSingular(newWord);
    newWord = removePunctuation(newWord);
    newWord = newWord.toLowerCase();
    return newWord;
}

function removeWhiteSpace(word) {
    // Bỏ dấu cách đầu cuối
    var newWord = word;
    while (newWord != "" && newWord.charAt(0) == ' ')
        newWord = newWord.substring(1);
    while (newWord != "" && newWord.charAt(newWord.length - 1) == ' ')
        newWord = newWord.substring(0, word.length - 2);
    return newWord;
}

function removeWhiteSpaceList(sentences) {
    var newList = [];
    for (var sentence of sentences) {
        newList.push(removeWhiteSpace(sentence));
    }
    return newList;
}

module.exports = {
    convertAbbreviations,
    fixBrokenSentences,
    removeWhiteSpaceList,
    removeBlanks,
    addPeriods,
    cleanupQuotes,
    cleanWord,
    groupQuotes,
    commaHandler,
};
