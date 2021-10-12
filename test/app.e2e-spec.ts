import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { CharacterModule } from './../src/character/character.module';
import { MongooseModule } from '@nestjs/mongoose';
import { GraphQLModule } from '@nestjs/graphql';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  let id: string = '';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        CharacterModule,
        MongooseModule.forRoot('mongodb://localhost/nestgraphqltesting'),
        GraphQLModule.forRoot({
          autoSchemaFile: 'schema.gql',
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  const character = {
    name: 'Yoda',
    episodes: ['JEDI', 'EMPIRE'],
  };
  const createCharacterQuery = `
    mutation{
      createCharacter(payload:{
        name: "Yoda"
        episodes: [JEDI, EMPIRE]
      }) {
        _id
        name
        episodes
      }
    }
  `;

  it('createCharacter', () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        operationName: null,
        query: createCharacterQuery,
      })
      .expect(({ body }) => {
        const data = body.data.createCharacter;
        id = data._id;
        expect(data.name).toBe(character.name);
        expect(data.episodes).toStrictEqual(character.episodes);
      })
      .expect(200);
  });

  const getCharactersQuery = `query{
    characters(pagination: {limit: 20}) {
      _id
      name
      episodes
    }
  }
  `;

  it('getCharacters', () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        operationName: null,
        query: getCharactersQuery,
      })
      .expect(({ body }) => {
        const data = body.data.characters;
        expect(data[0].name).toBe(character.name);
        expect(data[0].episodes).toStrictEqual(character.episodes);
      })
      .expect(200);
  });
  
  it('updateCharacter', () => {
    const updateCharacterQuery = `
      mutation {
        updateCharacter(payload: {
          _id: "${id}"
          name: "C-3PO"
        }) {
          _id
          name
          episodes
        }
      }
    `;

    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        operationName: null,
        query: updateCharacterQuery,
      })
      .expect(({ body }) => {
        const data = body.data.updateCharacter;
        expect(data.name).toBe("C-3PO");
        expect(data.episodes).toStrictEqual(character.episodes);
      })
      .expect(200);
  })

  it('deleteCharacter', async () => {
    const deleteCharacterQuery = `
      mutation {
        deleteCharacter(_id: "${id}")
      }
    `;

    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        operationName: null,
        query: deleteCharacterQuery,
      })
      .expect(({ body }) => {
        expect(body.data.deleteCharacter).toBe(true);
      })
      .expect(200);
  })
});
