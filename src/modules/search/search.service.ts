import { RequestParams } from '@elastic/elasticsearch';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import logger from '@utils/logger';

@Injectable()
export class SearchService {
  constructor(
    private readonly elasticSearchService: ElasticsearchService,
    private readonly configService: ConfigService,
  ) {}

  async searchIndex(search: string, index: string) {
    const results = [];
    const { body } = await this.elasticSearchService.search({
      index: index,
      body: {
        size: 12,
        query: {
          match: {
            'title.complete': {
              query: search,
            },
          },
        },
      },
    });
    const hits = body.hits.hits;
    hits.map((item) => {
      results.push(item._source);
    });

    return { results, total: body.hits.total.value };
  }

  async findIndex(params: RequestParams.Search) {
    return this.elasticSearchService.search(params);
  }

  // use to add
  async addIndex(params: RequestParams.Index) {
    try {
      return await this.elasticSearchService.index(params);
    } catch (error) {
      throw error;
    }
  }

  async createIndex(index: string): Promise<void> {
    logger.info(`Creating ${index} index`);
    await this.elasticSearchService.indices.create({ index });
  }

  async delete(index: string, id: number) {
    try {
      return await this.elasticSearchService.deleteByQuery({
        index,
        body: {
          query: {
            match: {
              id,
            },
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async deleteIndex(index: string): Promise<void> {
    const exists = await this.elasticSearchService.indices.exists({ index });
    try {
      if (!exists) {
        throw new NotFoundException(`Index ${index} not found`);
      }
      logger.info(`Deleting ${index} index`);
      await this.elasticSearchService.indices.delete({ index });
    } catch (error) {
      throw error;
    }
  }
  //TODO update case
  async updateMapping(index: string): Promise<void> {
    logger.info(`Updating mapping for ${index} index`);
    // id: string;
    // name: string;
    // description: string;
    // done: boolean;
    await this.elasticSearchService.indices.putMapping({
      index,
      body: {
        properties: {
          id: {
            type: 'keyword',
          },
          title: {
            type: 'text',
            fields: {
              keyword: {
                type: 'keyword',
              },
              lowercase: {
                type: 'keyword',
                normalizer: 'lowercase_normalizer',
              },
              en: {
                type: 'text',
                analyzer: 'english',
              },
              de: {
                type: 'text',
                analyzer: 'german',
              },
            },
          },
          description: {
            type: 'text',
            fields: {
              keyword: {
                type: 'keyword',
              },
              lowercase: {
                type: 'keyword',
                normalizer: 'lowercase_normalizer',
              },
              en: {
                type: 'text',
                analyzer: 'english',
              },
              de: {
                type: 'text',
                analyzer: 'german',
              },
            },
          },
          done: {
            type: 'boolean',
          },
        },
      },
    });
  }
}
