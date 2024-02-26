import { DATA_SOURCE, POST_REPO } from 'src/database/database.constants';
import { DataSource } from 'typeorm';
import { Post } from './entities/post.entity';

export const postProviders = [
  {
    provide: POST_REPO,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Post),
    inject: [DATA_SOURCE],
  },
];