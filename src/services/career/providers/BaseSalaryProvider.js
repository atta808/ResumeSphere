class BaseSalaryProvider {
  constructor(name) {
    this.name = name;
  }

  async getSalaryInsights(context) {
    throw new Error('getSalaryInsights must be implemented by the provider');
  }
}

export default BaseSalaryProvider;
