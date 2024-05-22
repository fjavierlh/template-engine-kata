import ParsedTemplate from './ParsedTemplate';
import TemplateWarning from './TemplateWarning';

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
      return this.templateWithNonVariablesDefinedWarning();
    }

    const parsedTemplate = this.templateWithReplacedVariables();
    return this.addNotReplacedVariablesWarning(parsedTemplate);
  }

  private templateWithNonVariablesDefinedWarning(): ParsedTemplate {
    return ParsedTemplate.create(this.template, [new TemplateWarning('Variables is not defined')]);
  }

  private templateWithReplacedVariables() {
    let parsedText = this.template;
    const warnings: TemplateWarning[] = [];
    this.variables.forEach((value, key) => {
      parsedText = parsedText.replaceAll(this.formTemplateVariable(key), value);
      if (!parsedText.includes(value)) {
        warnings.push(new TemplateWarning(`Variable ${key} not found in template`));
      }
    });
    return ParsedTemplate.create(parsedText, warnings);
  }

  private formTemplateVariable(key: string): string | RegExp {
    return `\$\{${key}\}`;
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

export default TemplateEngine;
