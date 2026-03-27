import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
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

    it('should populate playerList with the result from GetPlayerListQuery and render the player table', () => {
      const mockPlayers: PlayerModel[] = [
        { id: '1', name: 'Alice', score: 10, createdAt: '2026-01-01' },
        { id: '2', name: 'Bob', score: 7, createdAt: '2026-01-02' },
      ];
      vitest
        .spyOn(fixture.componentInstance['getPlayerListQuery'], 'execute')
        .mockReturnValue(mockPlayers);

      fixture.componentInstance['getPlayerList']();
      fixture.detectChanges();
      const tableRowsAfterRender = fixture.debugElement.queryAll(By.css('tbody tr'));

      expect(fixture.componentInstance['playerList']()).toEqual(mockPlayers);
      expect(tableRowsAfterRender.length).toBe(mockPlayers.length);
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
    it('should render score selected and name unselected by default, even when filters are empty', () => {
      fixture.componentInstance['filters'].set({});
      fixture.detectChanges();

      const selectElement = fixture.debugElement.query(By.css('select'));
      const scoreOption = selectElement.query(By.css('option[value="score"]'))
        .nativeElement as HTMLOptionElement;
      const nameOption = selectElement.query(By.css('option[value="name"]'))
        .nativeElement as HTMLOptionElement;

      expect(scoreOption.selected).toBeTruthy();
      expect(nameOption.selected).toBeFalsy();
    });

    it('should update the sort "by" field when sort by changes', () => {
      const selectElement = fixture.debugElement.query(By.css('select'));
      selectElement.triggerEventHandler('change', {
        target: { value: 'name' },
      });
      fixture.detectChanges();
      const scoreOption = selectElement.query(By.css('option[value="score"]'))
        .nativeElement as HTMLOptionElement;
      const nameOption = selectElement.query(By.css('option[value="name"]'))
        .nativeElement as HTMLOptionElement;

      expect(fixture.componentInstance['filters']().sort?.by).toBe('name');
      expect(nameOption.selected).toBeTruthy();
      expect(scoreOption.selected).toBeFalsy();
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
      const toggleButton = fixture.debugElement.query(By.css('button'));
      toggleButton.triggerEventHandler('click', null);
      fixture.detectChanges();

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

  it('should show a loading indicator while fetching players', () => {
    fixture.componentInstance['isLoading'].set(true);
    fixture.detectChanges();

    const loadingIndicator = fixture.debugElement.query(By.css('p[aria-busy="true"]'));
    expect(loadingIndicator).toBeTruthy();
  });
});
