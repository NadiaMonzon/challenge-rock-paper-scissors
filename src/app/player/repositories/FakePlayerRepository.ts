import type { PlayerModel } from '../models/PlayerModel';
import { PlayerRepository } from './PlayerRepository';

export class FakePlayerRepository extends PlayerRepository {
  findOrCreate(_name: string): PlayerModel {
    return { id: '1', name: _name, score: 0, createdAt: new Date().toISOString() };
  }

  save(): void {
    // no-op fake
  }

  getAllPlayers(): PlayerModel[] {
    return [];
  }
}
