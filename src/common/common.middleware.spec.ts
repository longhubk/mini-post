import { CommonMiddleware } from './common.middleware';

describe('CommonMiddleware', () => {
  it('should be defined', () => {
    expect(new CommonMiddleware()).toBeDefined();
  });
});
