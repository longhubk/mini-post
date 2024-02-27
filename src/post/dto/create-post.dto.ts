import { ICreatePost } from '../post.interface';

export interface CreatePostDto extends Omit<ICreatePost, 'views' | 'user'> {}
