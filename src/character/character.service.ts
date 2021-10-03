import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema as MongooseSchema } from 'mongoose';

import { Character, CharacterDocument } from './character.model';
import { CreateCharacterInput, PaginationInput, UpdateCharacterInput } from './character.inputs'

@Injectable()
export class CharacterService {
  constructor(
    @InjectModel(Character.name) private characterModel: Model<CharacterDocument>,
  ) {}

  create(payload: CreateCharacterInput) {
    const createdCharacter = new this.characterModel(payload);
    return createdCharacter.save();
  }

  list(pagination: PaginationInput) {
    const query = this.characterModel
      .find()
      .sort({_id: 1})
      .skip(pagination.skip)

    if(pagination.limit) {
      query.limit(pagination.limit)
    }
    
    return query.exec();
  }

  delete(_id: MongooseSchema.Types.ObjectId) {
    return this.characterModel.findByIdAndDelete(_id).exec();
  }

  update(payload: UpdateCharacterInput) {
    return this.characterModel.findByIdAndUpdate(payload._id, payload).exec();
  }

  get(_id: MongooseSchema.Types.ObjectId) {
    return this.characterModel.findById(_id).exec();
  }

}