import { Resolver, Query, Args, ResolveField, Parent, Mutation, registerEnumType } from '@nestjs/graphql';
import { Character, CharacterDocument } from './character.model';
import { Document, Mongoose, Schema as MongooseSchema } from 'mongoose';

import { CreateCharacterInput, PaginationInput, UpdateCharacterInput } from './character.inputs';
import { CharacterService } from './character.service';

export enum Episodes {
  NEWHOPE,
  EMPIRE,
  JEDI,
}
@Resolver(of => Character)
export class CharacterResolver {
  constructor(
    private characterService: CharacterService
  ) { }

  @Query(() => [Character])
  characters(@Args('pagination') pagination: PaginationInput) {
    return this.characterService.list(pagination);
  }

  @Mutation(() => Character)
  async createCharacter(@Args('payload') payload: CreateCharacterInput) {
    return this.characterService.create(payload);
  }

  @Mutation(() => Boolean)
  async deleteCharacter(@Args('_id', { type: () => String }) _id: MongooseSchema.Types.ObjectId) {
    await this.characterService.delete(_id);
    return true;
  }

  @Mutation(() => Character)
  async updateCharacter(@Args('payload') payload: UpdateCharacterInput) {
    await this.characterService.update(payload)
    return this.characterService.get(payload._id)
  }

}