import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { ElasticsearchModule } from '@nestjs/elasticsearch';

@Module({
    imports: [
        ElasticsearchModule.registerAsync({
            useFactory: () => ({
                node: 'https://search-mynewdomain-fhojlpkz6x5d4tl6lwq6qcingu.ap-northeast-2.es.amazonaws.com',
                auth: {
                    username: 'admin',
                    password: '1q2w#E$R',
                },
                headers: {
                    'Content-Type': 'application/json',
                },
            }),
        }),
    ],
    controllers: [SearchController],
    providers: [SearchService],
    exports: [SearchService],
})
export class SearchModule {}
