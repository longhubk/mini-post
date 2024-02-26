import { Test, TestingModule } from '@nestjs/testing';
import { CommonResolver } from './common.resolver';

describe('CommonResolver', () => {
  let resolver: CommonResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommonResolver],
    }).compile();

    resolver = module.get<CommonResolver>(CommonResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
