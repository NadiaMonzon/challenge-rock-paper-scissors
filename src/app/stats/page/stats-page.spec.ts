import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import type { PlayerModel } from '../../player/models/PlayerModel';
import { FakePlayerRepository } from '../../player/repositories/FakePlayerRepository';
import { GetPlayerListQuery } from '../../player/services/GetPlayerListQuery';
import { FakeStorageRepository } from '../../shared/storage/repositories/FakeStorageRepository';
import { StorageRepository } from '../../shared/storage/repositories/StorageRepository';
import { StatsPage } from './stats-page';

describe('StatsPage', () => {
  let fixture: ComponentFixture<StatsPage>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatsPage],
      providers: [
        {
          provide: GetPlayerListQuery,
          useClass: GetPlayerListQuery,
          deps: [FakePlayerRepository],
        },
        FakePlayerRepository,
        { provide: StorageRepository, useClass: FakeStorageRepository },
      ],
    }).compileComponents();

    await TestBed.compileComponents();

    fixture = TestBed.createComponent(StatsPage);
    fixture.detectChanges();
  });

  describe('when the component is initialized', () => {
    it('should load the player list on init', () => {
      const mockPlayers: PlayerModel[] = [
        { id: '1', name: 'Alice', score: 10, createdAt: '2026-01-01' },
      ];
      vitest
        .spyOn(fixture.componentInstance['getPlayerListQuery'], 'execute')
        .mockReturnValue(mockPlayers);

      fixture.componentInstance.ngOnInit();

      expect(fixture.componentInstance['playerList']()).toEqual(mockPlayers);
    });

    it('should set isLoading to false after loading the player list', () => {
      expect(fixture.componentInstance['isLoading']()).toBeFalsy();
    });
  });

  describe('when the component calls getPlayerList', () => {
    it('should set isLoading to true while fetching players', () => {
      vitest
        .spyOn(fixture.componentInstance['getPlayerListQuery'], 'execute')
        .mockImplementation(() => {
          expect(fixture.componentInstance['isLoading']()).toBeTruthy();
          return [];
        });

      fixture.componentInstance['getPlayerList']();

      expect(fixture.componentInstance['isLoading']()).toBeFalsy();
    });

    it('should populate playerList with the result from GetPlayerListQuery', () => {
      const mockPlayers: PlayerModel[] = [
        { id: '1', name: 'Alice', score: 10, createdAt: '2026-01-01' },
        { id: '2', name: 'Bob', score: 7, createdAt: '2026-01-02' },
      ];
      vitest
        .spyOn(fixture.componentInstance['getPlayerListQuery'], 'execute')
        .mockReturnValue(mockPlayers);

      fixture.componentInstance['getPlayerList']();

      expect(fixture.componentInstance['playerList']()).toEqual(mockPlayers);
    });

    it('should use the current filters when fetching players', () => {
      const filters = { sort: { by: 'name' as const, order: 'asc' as const } };
      fixture.componentInstance['filters'].set(filters);
      const getPlayerListQuerySpy = vitest.spyOn(
        fixture.componentInstance['getPlayerListQuery'],
        'execute',
      );

      fixture.componentInstance['getPlayerList']();

      expect(getPlayerListQuerySpy).toHaveBeenCalledWith(filters);
    });
  });

  describe('when the sort by field is changed', () => {
    it('should update the sort "by" field when sort by changes', () => {
      const event = { target: { value: 'name' } } as unknown as Event;

      fixture.componentInstance['onChangeSortBy'](event);

      expect(fixture.componentInstance['filters']().sort?.by).toBe('name');
    });

    it('should keep the current sort order when sort by changes', () => {
      fixture.componentInstance['filters'].set({
        sort: { by: 'score', order: 'asc' },
      });
      const event = { target: { value: 'name' } } as unknown as Event;

      fixture.componentInstance['onChangeSortBy'](event);

      expect(fixture.componentInstance['filters']().sort?.order).toBe('asc');
    });

    it('should reload the player list when sort by changes', () => {
      const getPlayerListSpy = vitest.spyOn(
        fixture.componentInstance as unknown as { getPlayerList: () => void },
        'getPlayerList',
      );
      const event = { target: { value: 'name' } } as unknown as Event;

      fixture.componentInstance['onChangeSortBy'](event);

      expect(getPlayerListSpy).toHaveBeenCalled();
    });
  });

  describe('when the sort order is toggled', () => {
    it('should toggle sort order from "desc" to "asc"', () => {
      fixture.componentInstance['filters'].set({
        sort: { by: 'score', order: 'desc' },
      });

      fixture.componentInstance['onToggleSortOrder']();

      expect(fixture.componentInstance['filters']().sort?.order).toBe('asc');
    });

    it('should toggle sort order from "asc" to "desc"', () => {
      fixture.componentInstance['filters'].set({
        sort: { by: 'score', order: 'asc' },
      });

      fixture.componentInstance['onToggleSortOrder']();

      expect(fixture.componentInstance['filters']().sort?.order).toBe('desc');
    });

    it('should reload the player list when sort order is toggled', () => {
      const getPlayerListSpy = vitest.spyOn(
        fixture.componentInstance as unknown as { getPlayerList: () => void },
        'getPlayerList',
      );

      fixture.componentInstance['onToggleSortOrder']();

      expect(getPlayerListSpy).toHaveBeenCalled();
    });
  });
});
