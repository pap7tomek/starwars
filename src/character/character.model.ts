
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Document, Schema as MongooseSchema } from 'mongoose';

export enum Episodes {
  NEWHOPE = 'NEWHOPE',
  EMPIRE = 'EMPIRE',
  JEDI = 'JEDI',
}

registerEnumType(Episodes, {
  name: 'Episode',
});

@ObjectType()
@Schema()
export class Character {
  @Field(() => String)
  _id: MongooseSchema.Types.ObjectId;

  @Field(() => String)
  @Prop()
  name: string;

  @Field(() => [Episodes],  { nullable: true })
  @Prop()
  episodes?: Episodes[];
}

export type CharacterDocument = Character & Document;

export const CharacterSchema = SchemaFactory.createForClass(Character);