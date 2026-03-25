import type { PlayerModel } from '../models/PlayerModel';
import { PlayerRepository } from './PlayerRepository';

export class FakePlayerRepository extends PlayerRepository {
  findOrCreate(_name: string): PlayerModel {
    return { id: 0, name: _name, score: 0 };
  }

  save(): void {
    // no-op fake
  }
}
