const natural = require('natural');
const { SentimentAnalyzer, PorterStemmer } = natural;

const analyzer= new SentimentAnalyzer('English', PorterStemmer, 'afinn');

const FILLER_WORDS= new Set([
    'ah', 'uh', 'um', 'er', 'hm', 'hmm', 'like', 'you know', 
  'actually', 'basically', 'so', 'right', 'well', 'i mean', 'i guess'
]);

function analyzeTone(text){
    try {
        if(!text) return 0;
        const tokens = text.toLowerCase().split(/\s+/);
        return analyzer.getSentiment(tokens);
    } catch (error) {
        console.error("Error in analyzeTone:", e.message);
        return 0;
    }
}

function analyzeConfidence(text){
    try {
        if (!text) return { fillerWordCount: 0, wordCount: 0 };
        const words = text.toLowerCase().split(/\s+/);

        let fillerWordCount = 0;

        words.forEach(word => {
            const cleanWord = word.replace(/[.,?!]/g, '');
            if (FILLER_WORDS.has(cleanWord)) {
            fillerWordCount++;
        }
        });

        return {fillerWordCount, wordCount:words.length};
    } catch (error) {
        console.error("Error in analyzeConfidence:", e.message);
        return { fillerWordCount: 0, wordCount: 0 };
    }
}

module.exports={analyzeTone,analyzeConfidence};