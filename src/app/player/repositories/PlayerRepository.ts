import type { PlayerModel } from '../models/PlayerModel';

export abstract class PlayerRepository {
  abstract findOrCreate(name: string): PlayerModel;
  abstract save(player: PlayerModel): void;
}
