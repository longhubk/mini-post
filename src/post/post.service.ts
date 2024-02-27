import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

import { UniqueUser } from 'src/user/user.interface';
import { FindOptionsWhere, Repository, UpdateResult } from 'typeorm';
import { Post } from './entities/post.entity';
import { FindManyPost, IPost, POST_REPO, UniquePost } from './post.interface';

@Injectable()
export class PostService {
  constructor(
    @Inject(POST_REPO)
    private readonly postRepo: Repository<Post>,
  ) {}

  protected async checkExisted(query: FindOptionsWhere<Post>): Promise<number> {
    const existed = await this.postRepo.count({ where: query });
    if (!existed) {
      throw new NotFoundException('POST_NOT_FOUND');
    }
    return existed;
  }

  public async create(
    uniqueUser: Partial<UniqueUser>,
    createPostDto: CreatePostDto,
  ): Promise<IPost> {
    const post = this.postRepo.create({
      ...createPostDto,
      views: 0,
      user: uniqueUser.id,
    });
    return this.postRepo.save(post);
  }

  public findAll(query: FindManyPost): Promise<IPost[]> {
    console.log({ query });
    return this.postRepo.find({ where: query });
  }

  public async findOne(query: UniquePost): Promise<IPost | null> {
    console.log({ query });
    return this.postRepo.findOne({ where: query });
  }

  public async update(
    uniqueUser: Partial<UniqueUser>,
    query: UniquePost,
    updatePostDto: UpdatePostDto,
  ): Promise<UpdateResult> {
    await this.checkExisted({ ...query, user: uniqueUser.id });
    return this.postRepo.update(query, updatePostDto);
  }

  public async remove(
    uniqueUser: Partial<UniqueUser>,
    query: UniquePost,
  ): Promise<UpdateResult> {
    await this.checkExisted({ ...query, user: uniqueUser.id });
    return this.postRepo.softDelete(query);
  }
}
