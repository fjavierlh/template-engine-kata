import TemplateEngine from '../core/template-engine';

describe('The template engine', () => {
  it('replace in the template the given configurable fields', () => {
    expect(new TemplateEngine().replaceFields('Hello, ${name}!', { name: 'John' })).toBe('Hello, John!');
    expect(
      new TemplateEngine().replaceFields('${greeting}, ${name}!', { greeting: 'Good morning', name: 'John' })
    ).toBe('Good morning, John!');
  });

  it('if there no fields covered throws an error specifying the missing fields', () => {
    expect(() => new TemplateEngine().replaceFields('${greeting}, ${name}!', { name: 'John' })).toThrow(
      "The follow fields are not received: ['${greeting}']"
    );

    expect(() => new TemplateEngine().replaceFields('${greeting}, ${name}!', {})).toThrow(
      "The follow fields are not received: ['${greeting}', '${name}']"
    );
  });
});
