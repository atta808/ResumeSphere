export default `
  .classic-ats-container {
    max-width: 800px;
    margin: 0 auto;
    font-family: var(--font-family, 'Arial, sans-serif');
    color: var(--text-color, #000);
    line-height: 1.4;
  }
  .classic-ats-container h1,
  .classic-ats-container h2,
  .classic-ats-container h3 {
    color: var(--primary-color, #000);
    margin-bottom: 0.5em;
  }
  .classic-ats-container h1 {
    font-size: 2em;
    text-transform: uppercase;
    text-align: center;
    border-bottom: 1px solid var(--primary-color, #000);
    padding-bottom: 5px;
  }
  .classic-ats-container h2 {
    font-size: 1.2em;
    text-align: center;
  }
  .classic-ats-container .contact-info {
    text-align: center;
    margin-bottom: 1em;
    font-size: 0.9em;
  }
  .classic-ats-container section {
    margin-bottom: 1.5em;
  }
  .classic-ats-container section > h3 {
    font-size: 1.1em;
    border-bottom: 1px solid #ccc;
    text-transform: uppercase;
    padding-bottom: 3px;
  }
  .experience-item, .education-item {
    margin-bottom: 1em;
  }
  .experience-item .header, .education-item .header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
  }
  .experience-item .dates, .education-item .dates {
    font-weight: bold;
    font-size: 0.9em;
  }
  .skills-list {
    list-style-type: disc;
    padding-left: 20px;
    column-count: 2;
  }
`;
