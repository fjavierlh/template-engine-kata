class TemplateEngine {
  constructor(
    private readonly template: string,
    private readonly variables: Map<string, string>
  ) {}

  static create(template: string, variables: Map<string, string>) {
    if (template == null) {
      return new ParsedTemplate('', [new TemplateWarning('Text is not defined')]);
    }

    return new TemplateEngine(template, variables);
  }

  parse() {
    return this.parseNew();
  }

  parseNew(): ParsedTemplate {
    if (this.variables == null) {
      return ParsedTemplate.create(this.template, [new TemplateWarning('Variables is not defined')]);
    }

    let parsedText = this.template;
    const warnings: TemplateWarning[] = [];
    this.variables.forEach((value, key) => {
      parsedText = parsedText.replaceAll(`\$\{${key}\}`, value);
      if (!parsedText.includes(value)) {
        warnings.push(new TemplateWarning(`Variable ${key} not found in template`));
      }
    });
    const parsedTemplate = ParsedTemplate.create(parsedText, warnings);

    return this.addNotReplacedVariablesWarning(parsedTemplate);
  }

  private addNotReplacedVariablesWarning(parsedTemplate: ParsedTemplate) {
    const regex = /\$\{[a-zA-Z0-9]+\}/g;
    const matches = parsedTemplate.text.match(regex);

    if (!matches) {
      return parsedTemplate;
    }

    const warnings: TemplateWarning[] = [];
    matches.forEach((match) => {
      const variableName = match.substring(2, match.length - 1);
      warnings.push(new TemplateWarning(`Variable ${variableName} was no replaced`));
    });

    return parsedTemplate.addWarnings(warnings);
  }
}

class TemplateWarning {
  constructor(readonly message: string) {}
}

class ParsedTemplate {
  constructor(
    readonly text: string,
    readonly warnings: ReadonlyArray<TemplateWarning>
  ) {}

  static create(text: string, warnings: ReadonlyArray<TemplateWarning>) {
    if (text == null) {
      return new ParsedTemplate('', [new TemplateWarning('Template is not defined')]);
    }

    return new ParsedTemplate(text, warnings);
  }

  containsWarnings() {
    return this.warnings.length > 0;
  }

  addWarnings(warnings: TemplateWarning[]) {
    return new ParsedTemplate(this.text, this.warnings.concat(warnings));
  }
}

describe('The Template Engine', () => {
  it('parses template without variables', () => {
    const template = 'This is a template without variables';
    const variables = new Map<string, string>();

    const parsedTemplate = new TemplateEngine(template, variables).parse().text;

    expect(parsedTemplate).toBe(template);
  });

  it('parses template with one variable', () => {
    const template = 'This is a template with variable ${variable}';
    const variables = new Map<string, string>();
    variables.set('variable', 'foo');

    const parsedTemplate = new TemplateEngine(template, variables).parse().text;

    expect(parsedTemplate).toBe('This is a template with variable foo');
  });

  it('parses template with multiple variables', () => {
    const template = 'This is a template with multiple variables ${variable} and ${anotherVariable}';
    const variables = new Map<string, string>();
    variables.set('variable', 'foo');
    variables.set('anotherVariable', 'bar');

    const parsedTemplate = new TemplateEngine(template, variables).parse().text;

    expect(parsedTemplate).toBe('This is a template with multiple variables foo and bar');
  });

  it('parses template with repeated variable', () => {
    const template = 'This is a template with multiple variables ${variable} and ${variable}';
    const variables = new Map<string, string>();
    variables.set('variable', 'foo');

    const parsedTemplate = new TemplateEngine(template, variables).parse().text;

    expect(parsedTemplate).toBe('This is a template with multiple variables foo and foo');
  });

  it('parses template with repeated variable', () => {
    const template = '${user}';
    const variables = new Map<string, string>();
    variables.set('user', 'John');

    const parsedTemplate = new TemplateEngine(template, variables).parse().text;

    expect(parsedTemplate).toBe('John');
  });

  it('warns when a variable not being found in the template', () => {
    const template = '${user}';
    const variables = new Map<string, string>();
    variables.set('user', 'John');
    variables.set('age', '35');
    const aDate = new Date().toString();
    variables.set('date', aDate);

    const parsedTemplate = new TemplateEngine(template, variables).parse();

    expect(parsedTemplate.text).toBe('John');
    expect(parsedTemplate.containsWarnings()).toBe(true);
    expect(parsedTemplate.warnings[0].message).toBe('Variable age not found in template');
    expect(parsedTemplate.warnings[1].message).toBe('Variable date not found in template');
  });

  it('warns when a variable was no replaced', () => {
    const template = '${user} ${age}';
    const variables = new Map<string, string>();

    const parsedTemplate = new TemplateEngine(template, variables).parse();

    expect(parsedTemplate.text).toBe('${user} ${age}');
    expect(parsedTemplate.containsWarnings()).toBe(true);
    expect(parsedTemplate.warnings[0].message).toBe('Variable user was no replaced');
    expect(parsedTemplate.warnings[1].message).toBe('Variable age was no replaced');
  });

  it('warns when the variables is not defined', () => {
    const template = 'text';
    const variables = null;

    const parsedTemplate = new TemplateEngine(template, variables).parse();

    expect(parsedTemplate.text).toBe('text');
    expect(parsedTemplate.containsWarnings()).toBe(true);
    expect(parsedTemplate.warnings[0].message).toBe('Variables is not defined');
  });

  it('warns when the template is not defined', () => {
    const template = null;
    const variables = new Map<string, string>();

    const parsedTemplate = new TemplateEngine(template, variables).parse();

    expect(parsedTemplate.text).toBe('');
    expect(parsedTemplate.containsWarnings()).toBe(true);
    expect(parsedTemplate.warnings[0].message).toBe('Template is not defined');
  });
});
