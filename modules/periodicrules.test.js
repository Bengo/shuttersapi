const periodicrules = require('./periodicrules');


describe('update()', () => {
  it('should exist',() => {
    expect(periodicrules.update).toBeDefined();
  });
  it('should be a function',() => {
    expect(typeof periodicrules.update).toBe("function");
  });

});