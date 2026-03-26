import { DatePipe } from '@angular/common';
import type { OnInit } from '@angular/core';
import { Component, inject, signal } from '@angular/core';
import type { GetPlayerListParams } from '../../player/models/GetPlayerListParams';
import type { PlayerModel } from '../../player/models/PlayerModel';
import { LocalStoragePlayerRepository } from '../../player/repositories/LocalStoragePlayerRepository';
import { GetPlayerListQuery } from '../../player/services/GetPlayerListQuery';

@Component({
  selector: 'app-stats-page',
  templateUrl: './stats-page.html',
  styleUrl: './stats-page.scss',
  imports: [DatePipe],
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

  protected isLoading = signal<boolean>(true);
  protected playerList = signal<PlayerModel[]>([]);
  protected filters = signal<GetPlayerListParams>({
    sort: { by: 'score', order: 'desc' },
  });

  ngOnInit(): void {
    this.getPlayerList();
  }

  protected getPlayerList(): void {
    this.isLoading.set(true);
    const playerList = this.getPlayerListQuery.execute(this.filters());
    this.playerList.set(playerList);
    this.isLoading.set(false);
  }

  protected onChangeSortBy(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const by = selectElement.value as 'name' | 'score';
    this.filters.update((previousFilter) => ({
      ...previousFilter,
      sort: { by, order: previousFilter.sort?.order ?? 'desc' },
    }));
    this.getPlayerList();
  }

  protected onToggleSortOrder(): void {
    this.filters.update((previousFilter) => {
      const currentOrder = previousFilter.sort?.order ?? 'desc';
      const newOrder = currentOrder === 'asc' ? 'desc' : 'asc';
      return {
        ...previousFilter,
        sort: { by: previousFilter.sort?.by ?? 'score', order: newOrder },
      };
    });
    this.getPlayerList();
  }
}
