import KeywordAnalyzer from './KeywordAnalyzer';
import SkillAnalyzer from './SkillAnalyzer';
import FormattingAnalyzer from './FormattingAnalyzer';
import SectionAnalyzer from './SectionAnalyzer';
import GrammarAnalyzer from './GrammarAnalyzer';
import ReadabilityAnalyzer from './ReadabilityAnalyzer';
import ScoringEngine from './ScoringEngine';
import RecommendationEngine from './RecommendationEngine';

class LocalATSProvider {
    async analyze(resumeData) {
        const startTime = Date.now();

        // Instantiate analyzers
        const keywordAnalyzer = new KeywordAnalyzer();
        const skillAnalyzer = new SkillAnalyzer();
        const formattingAnalyzer = new FormattingAnalyzer();
        const sectionAnalyzer = new SectionAnalyzer();
        const grammarAnalyzer = new GrammarAnalyzer();
        const readabilityAnalyzer = new ReadabilityAnalyzer();

        // Run all analyzers in parallel
        const [
            keywords,
            skills,
            formatting,
            sections,
            grammar,
            readability
        ] = await Promise.all([
            keywordAnalyzer.analyze(resumeData),
            skillAnalyzer.analyze(resumeData),
            formattingAnalyzer.analyze(resumeData),
            sectionAnalyzer.analyze(resumeData),
            grammarAnalyzer.analyze(resumeData),
            readabilityAnalyzer.analyze(resumeData)
        ]);

        const results = {
            keywords,
            skills,
            formatting,
            sections,
            grammar,
            readability
        };

        // Generate final score
        const { overallScore, categoryScores } = ScoringEngine.generateScore(results);

        // Process recommendations
        const { recommendations, strengths, warnings } = RecommendationEngine.processRecommendations(results);

        const totalProcessingTime = Date.now() - startTime;

        return {
            overallScore,
            categoryScores,
            recommendations,
            strengths,
            warnings,
            missingSections: [], // Handled inside SectionAnalyzer strengths/recommendations for now
            processingTime: totalProcessingTime,
            version: '1.0',
            provider: 'LocalATSProvider',
            createdAt: new Date().toISOString()
        };
    }
}

export default new LocalATSProvider();
