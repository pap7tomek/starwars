import { Schema as MongooseSchema } from 'mongoose';
import { Field, InputType } from '@nestjs/graphql';
import { Episodes } from './character.model';

@InputType()
export class CreateCharacterInput {
  @Field(() => String)
  name: string;

  @Field(() => [Episodes], { nullable: true })
  episodes?: [Episodes]

}

@InputType()
export class PaginationInput {
  @Field(() => Number)
  skip?: number = 0;

  @Field(() => Number)
  limit?: number;
}

@InputType()
export class UpdateCharacterInput {
  @Field(() => String)
  _id: MongooseSchema.Types.ObjectId;

  @Field(() => String, {nullable: true})
  name: string;
  
  @Field(() => [Episodes], {nullable: true})
  episodes?: [Episodes]
}