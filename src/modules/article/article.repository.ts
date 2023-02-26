import { Repository } from 'typeorm';

import { Article } from './article.entity';

export class ArticleRepository extends Repository<Article> {}
