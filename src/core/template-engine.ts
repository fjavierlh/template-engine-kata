class TemplateEngine {
  replaceFields(template: string, fields: Record<string, string>): string {
    const replaceableTexts = this.replaceableTextsFrom(template);

    if (!replaceableTexts) {
      return template;
    }

    this.checkFieldsToReplaceOrThrow(replaceableTexts, fields);
    return this.replaceMatchedFields(replaceableTexts, fields, template);
  }

  private replaceMatchedFields(
    replaceableTexts: RegExpMatchArray,
    fields: Record<string, string>,
    template: string
  ): string {
    return replaceableTexts.reduce((template, text) => {
      const field = Object.keys(fields).find((field) => text.includes(field));
      if (!field) {
        return template;
      }
      return template.replace(text, fields[field]);
    }, template);
  }

  private checkFieldsToReplaceOrThrow(replaceableTexts: RegExpMatchArray, fields: Record<string, string>) {
    const missingFields = this.matchMissingFieldsBetween(replaceableTexts, fields);
    if (missingFields.length > 0) {
      throw new Error(`The follow fields are not received: [${missingFields.map((field) => `'${field}'`).join(', ')}]`);
    }
  }

  private matchMissingFieldsBetween(replaceableTexts: RegExpMatchArray, fields: Record<string, string>) {
    const missingFields: string[] = [];
    const findMissingFields = (missingFields: string[], text: string): string[] => {
      const field = Object.keys(fields).find((field) => text.includes(field));
      if (!field) {
        missingFields.push(text);
      }
      return missingFields;
    };
    return replaceableTexts.reduce<string[]>(findMissingFields, missingFields);
  }

  private replaceableTextsFrom(template: string) {
    const replaceableTextMatcher = /\$\{([^}]+)\}/g;
    return template.match(replaceableTextMatcher);
  }
}

export default TemplateEngine;
