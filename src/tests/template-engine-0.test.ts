class TemplateEngine {
  constructor(
    private readonly template: string,
    private readonly variables: Map<string, string>
  ) {}

  parse() {
    let parsedTemplate = this.template;
    this.variables.forEach((value, key) => {
      parsedTemplate = parsedTemplate.replaceAll(`\$\{${key}\}`, value);
    });

    return parsedTemplate;
  }
}

describe('The Template Engine', () => {
  it('parses template without variables', () => {
    const template = 'This is a template without variables';
    const variables = new Map<string, string>();

    const parsedTemplate = new TemplateEngine(template, variables).parse();

    expect(parsedTemplate).toBe(template);
  });

  it('parses template with one variable', () => {
    const template = 'This is a template with variable ${variable}';
    const variables = new Map<string, string>();
    variables.set('variable', 'foo');

    const parsedTemplate = new TemplateEngine(template, variables).parse();

    expect(parsedTemplate).toBe('This is a template with variable foo');
  });

  it('parses template with multiple variables', () => {
    const template = 'This is a template with multiple variables ${variable} and ${anotherVariable}';
    const variables = new Map<string, string>();
    variables.set('variable', 'foo');
    variables.set('anotherVariable', 'bar');

    const parsedTemplate = new TemplateEngine(template, variables).parse();

    expect(parsedTemplate).toBe('This is a template with multiple variables foo and bar');
  });

  it('parses template with repeated variable', () => {
    const template = 'This is a template with multiple variables ${variable} and ${variable}';
    const variables = new Map<string, string>();
    variables.set('variable', 'foo');

    const parsedTemplate = new TemplateEngine(template, variables).parse();

    expect(parsedTemplate).toBe('This is a template with multiple variables foo and foo');
  });
});
