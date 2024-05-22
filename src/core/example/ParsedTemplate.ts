import TemplateWarning from './TemplateWarning';

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

export default ParsedTemplate;
