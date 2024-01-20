import { getJsObjectFromString } from './get-js-object-from-string';
describe('getJsObject', () => {
  it('should extract the JavaScript object from the string', () => {
    const html =
      'window.__REDUX_STATE__ = {"glossary":{"title":"example glossary","GlossDiv":{"title":"S","GlossList":{"GlossEntry":{"ID":"SGML","SortAs":"SGML","GlossTerm":"Standard Generalized Markup Language","Acronym":"SGML","Abbrev":"ISO 8879:1986","GlossDef":{"para":"A meta-markup language, used to create markup languages such as DocBook.","GlossSeeAlso":["GML","XML"]},"GlossSee":"markup"}}}}} undefined';
    const result = getJsObjectFromString(html);

    const expected =
      '{"glossary":{"title":"example glossary","GlossDiv":{"title":"S","GlossList":{"GlossEntry":{"ID":"SGML","SortAs":"SGML","GlossTerm":"Standard Generalized Markup Language","Acronym":"SGML","Abbrev":"ISO 8879:1986","GlossDef":{"para":"A meta-markup language, used to create markup languages such as DocBook.","GlossSeeAlso":["GML","XML"]},"GlossSee":"markup"}}}}}';
    expect(result).toEqual(expected);
  });

  it('should return undefined if structure not found', () => {
    const html = 'some random string without JS object';
    const result = getJsObjectFromString(html);

    expect(result).toBeUndefined();
  });
});
