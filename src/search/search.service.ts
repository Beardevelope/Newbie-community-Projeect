import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class SearchService {
    constructor(private readonly esService: ElasticsearchService) {}

    // 인덱싱
    async indexPost(index: string, post: any) {
        return await this.esService
            .index({
                index,
                body: post,
            })
            .catch((error) => {
                console.error(
                    'Elasticsearch Create Error:',
                    error,
                    '----------------------------',
                    error.meta.body.error,
                    '----------------------------',
                );
                throw error;
            });
    }

    // 검색 기본셋팅
    async search(text: string) {
        const { body } = await this.esService.search<any>({
            index: 'posts',
            body: {
                query: {
                    multi_match: {
                        query: text,
                        fuzziness: 1,
                        fields: ['title', 'content', 'tags.name'],
                    },
                },
            },
        });

        const hits = body.hits.hits;
        console.log(body);
        console.log(body.hits);
        return hits.map((item: any) => item._source);
    }

    // 데이터 수정
    async update(index: string, postId: number, post) {
        const newTags = post.tags;

        const script = `
        ctx._source.id='${postId}'; 
        ctx._source.title='${post.title}';
        ctx._source.content='${post.content}';
        ctx._source.image='${post.image}';
        ctx._source.remove('tags');
        ctx._source.tags = params.newTags;
        ctx._source.updatedAt='${new Date(post.updatedAt).toISOString()}';
        `;

        this.esService
            .updateByQuery({
                index,
                body: {
                    query: {
                        match: {
                            id: postId,
                        },
                    },
                    script: {
                        inline: script,
                        lang: 'painless',
                        params: { newTags: newTags },
                    },
                },
            })
            .catch((error) => {
                console.error(
                    'Elasticsearch Update Error:',
                    error,
                    '----------------------------',
                    error.meta.body.failures,
                    '----------------------------',
                );
                throw error;
            });
    }

    // 데이터 삭제
    async remove(index: string, postId: number) {
        this.esService.deleteByQuery({
            index,
            body: {
                query: {
                    match: {
                        id: postId,
                    },
                },
            },
        });
    }

    // 매핑 정보 가져오기
    async getMapping(index: string) {
        const { body } = await this.esService.indices.getMapping({
            index,
        });

        // 필드 및 데이터 타입 정보 출력
        console.log(body[index]?.mappings.properties);
        return body[index]?.mappings;
    }
}
