import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { ElasticsearchModule } from '@nestjs/elasticsearch';

@Module({
    imports: [
        ElasticsearchModule.registerAsync({
            useFactory: () => ({
                node: process.env.SEARCH_ENDPOINT,
                auth: {
                    username: process.env.SEARCH_USERNAME,
                    password: process.env.SEARCH_USERPASSWORD,
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
