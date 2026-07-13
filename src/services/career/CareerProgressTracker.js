class CareerProgressTracker {
  calculateOverallScore(metrics, weights) {
    let score = 0;
    let totalWeight = 0;

    for (const [key, weight] of Object.entries(weights)) {
      if (metrics[key] !== undefined) {
        score += metrics[key] * (weight / 100);
        totalWeight += weight;
      }
    }

    // Normalize if some metrics are missing
    if (totalWeight > 0 && totalWeight < 100) {
        score = (score / totalWeight) * 100;
    }

    return Math.min(Math.max(Math.round(score), 0), 100);
  }
}

export default new CareerProgressTracker();
