import BaseSalaryProvider from './BaseSalaryProvider';

class LocalSalaryProvider extends BaseSalaryProvider {
  constructor() {
    super('LOCAL_SALARY');
  }

  async getSalaryInsights(context) {
    // Dummy static implementation. In a real app, this could use a local JSON database or be replaced by an external API provider.
    return {
      salaryInsights: {
        entryLevel: "$60,000 - $80,000",
        midLevel: "$80,000 - $110,000",
        seniorLevel: "$110,000 - $150,000+",
        executiveLevel: "$150,000+",
        freelanceRate: "$50 - $100 / hr",
        currency: "USD",
        marketTrend: "Stable",
        negotiationTips: [
          "Highlight your recent certifications.",
          "Focus on the value you bring to the specific team."
        ]
      }
    };
  }
}

export default LocalSalaryProvider;
