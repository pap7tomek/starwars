import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { GraphQLModule } from '@nestjs/graphql';
import { CharacterModule } from './character/character.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/starwars'),
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql'
    }),
    CharacterModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
