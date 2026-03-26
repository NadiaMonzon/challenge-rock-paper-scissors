import type { OnInit } from '@angular/core';
import { Component, inject, signal } from '@angular/core';
import type { PlayerModel } from '../../player/models/PlayerModel';
import { LocalStoragePlayerRepository } from '../../player/repositories/LocalStoragePlayerRepository';
import { GetPlayerListQuery } from '../../player/services/GetPlayerListQuery';

@Component({
  selector: 'app-stats-page',
  templateUrl: './stats-page.html',
  providers: [
    {
      provide: GetPlayerListQuery,
      useClass: GetPlayerListQuery,
      deps: [LocalStoragePlayerRepository],
    },
    {
      provide: LocalStoragePlayerRepository,
      useClass: LocalStoragePlayerRepository,
    },
  ],
})
export class StatsPage implements OnInit {
  private getPlayerListQuery = inject(GetPlayerListQuery);

  protected playerList = signal<PlayerModel[]>([]);

  ngOnInit(): void {
    this.getPlayerList();
  }

  protected getPlayerList(): void {
    const playerList = this.getPlayerListQuery.execute({ sort: { by: 'score', order: 'desc' } });
    this.playerList.set(playerList);
  }
}
