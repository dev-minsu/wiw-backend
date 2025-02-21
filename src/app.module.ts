import {ApolloDriver, ApolloDriverConfig} from '@nestjs/apollo';
import {Module} from '@nestjs/common';
import {GraphQLModule} from '@nestjs/graphql';
import {DirectiveLocation, GraphQLDirective} from 'graphql';
import {upperDirectiveTransformer} from './common/directives/upper-case.directive';
import {join} from 'path';
import {UserModule} from "./chats/infra/user.module";
import {MongooseModule} from "@nestjs/mongoose";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {GameModule} from "./chats/infra/game.module";
import {MessageModule} from "./chats/infra/message.module";

@Module({
  imports: [
    UserModule,
    GameModule,
    MessageModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
      introspection: true,
      transformSchema: schema => upperDirectiveTransformer(schema, 'upper'),
      installSubscriptionHandlers: true,
      buildSchemaOptions: {
        directives: [
          new GraphQLDirective({
            name: 'upper',
            locations: [DirectiveLocation.FIELD_DEFINITION],
          }),
        ],
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'), // 환경변수에서 MONGODB_URI 가져오기
      }),
    }),
  ],
})
export class AppModule {}
