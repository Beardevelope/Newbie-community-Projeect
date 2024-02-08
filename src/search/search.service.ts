import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class SearchService {
    constructor(private readonly esService: ElasticsearchService) {}

    async indexPost(post: any) {
        return await this.esService.index({
            index: 'posts',
            body: post,
        });
    }

    // 기본셋팅
    async search(text: string) {
        const { body } = await this.esService.search<any>({
            index: 'posts',
            body: {
                query: {
                    multi_match: {
                        query: text,
                        fuzziness: 2,
                        fields: ['title', 'content', 'tags.name'],
                    },
                },
            },
        });

        const hits = body.hits.hits;
        console.log(body);
        console.log(body.hits)
        return hits.map((item: any) => item._source);
    }
}


// fuzziness: 1
// {
//     took: 12,
//     timed_out: false,
//     _shards: { total: 5, successful: 5, skipped: 0, failed: 0 },
//     hits: {
//       total: { value: 4, relation: 'eq' },
//       max_score: 0.42081726,
//       hits: [ [Object], [Object], [Object], [Object] ] 
//     }
//   }


// fuzziness: 2
// {
//     took: 30,
//     timed_out: false,
//     _shards: { total: 5, successful: 5, skipped: 0, failed: 0 },
//     hits: {
//       total: { value: 5, relation: 'eq' },
//       max_score: 0.42081726,
//       hits: [ [Object], [Object], [Object], [Object], [Object] ]
//     }
//   }