import type { GetPlayerListParams } from '../models/GetPlayerListParams';
import type { PlayerModel } from '../models/PlayerModel';
import type { PlayerRepository } from '../repositories/PlayerRepository';

export class GetPlayerListQuery {
  constructor(private playerRepository: PlayerRepository) {}

  public execute(options: GetPlayerListParams): PlayerModel[] {
    return this.playerRepository.getAllPlayers(options);
  }
}
