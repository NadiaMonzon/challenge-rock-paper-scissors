import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CurrentPlayerStore } from '../../auth/store/CurrentPlayerStore';
import type { PlayerModel } from '../../player/models/PlayerModel';
import { FakeStorageRepository } from '../../shared/storage/repositories/FakeStorageRepository';
import { StorageRepository } from '../../shared/storage/repositories/StorageRepository';
import { GetRandomMoveService } from '../services/GetRandomMoveService';
import { GetWinnerService } from '../services/GetWinnerService';
import { SavePlayerScoreService } from '../services/SavePlayerScoreService';
import { GamePage } from './game-page';

const PLAYER: PlayerModel = {
  id: '1',
  name: 'Alice',
  score: 3,
  createdAt: new Date().toISOString(),
};

describe('GamePage', () => {
  let fixture: ComponentFixture<GamePage>;
  let playerStore: CurrentPlayerStore;
  let fakeGetRandomMove: { execute: ReturnType<typeof vitest.fn> };
  let fakeGetWinner: { execute: ReturnType<typeof vitest.fn> };
  let fakeSaveScore: { execute: ReturnType<typeof vitest.fn> };

  beforeEach(async () => {
    fakeGetRandomMove = { execute: vitest.fn().mockReturnValue('scissors') };
    fakeGetWinner = { execute: vitest.fn().mockReturnValue('win') };
    fakeSaveScore = { execute: vitest.fn() };

    await TestBed.configureTestingModule({
      imports: [GamePage],
      providers: [
        CurrentPlayerStore,
        { provide: StorageRepository, useClass: FakeStorageRepository },
      ],
    });

    TestBed.overrideProvider(GetRandomMoveService, {
      useValue: fakeGetRandomMove,
    });
    TestBed.overrideProvider(GetWinnerService, {
      useValue: fakeGetWinner,
    });
    TestBed.overrideProvider(SavePlayerScoreService, {
      useValue: fakeSaveScore,
    });

    await TestBed.compileComponents();

    playerStore = TestBed.inject(CurrentPlayerStore);
    playerStore.currentPlayer.set(PLAYER);

    fixture = TestBed.createComponent(GamePage);
    fixture.detectChanges();
  });

  afterEach(() => {
    vitest.useRealTimers();
  });

  it('should display the player 1 name', () => {
    const header = fixture.nativeElement.querySelector('header p');
    expect(header.textContent).toContain('Alice');
  });

  it('should display the player 1 score', () => {
    const score = fixture.nativeElement.querySelector('header strong');
    expect(score.textContent).toBe('3');
  });

  it('should show 3 move options by default in classic mode', () => {
    const moveButtons = fixture.debugElement.queryAll(By.css('fieldset button'));
    expect(moveButtons).toHaveLength(3);
    expect(fixture.debugElement.query(By.css('button[aria-label="lizard"]'))).toBeFalsy();
    expect(fixture.debugElement.query(By.css('button[aria-label="spock"]'))).toBeFalsy();
  });

  it('should show 5 move options when lizard-spock mode is selected', () => {
    const lizardSpockRadio = fixture.debugElement.query(By.css('input[value="lizard-spock"]'));
    lizardSpockRadio.triggerEventHandler('change', { target: { value: 'lizard-spock' } });
    fixture.detectChanges();

    const moveButtons = fixture.debugElement.queryAll(By.css('fieldset button'));
    expect(moveButtons).toHaveLength(5);
    expect(fixture.debugElement.query(By.css('button[aria-label="lizard"]'))).toBeTruthy();
    expect(fixture.debugElement.query(By.css('button[aria-label="spock"]'))).toBeTruthy();
  });

  describe('when a move is selected', () => {
    beforeEach(() => {
      vitest.useFakeTimers();
      const rockButton = fixture.debugElement.query(By.css('button[aria-label="rock"]'));
      rockButton.triggerEventHandler('click', null);
      fixture.detectChanges();
    });

    it('should disable the buttons while revealing', () => {
      const buttons = fixture.debugElement.queryAll(By.css('fieldset button'));
      expect(buttons.every((b) => b.nativeElement.disabled)).toBe(true);
    });

    it('should mark the selected button as aria-pressed', () => {
      const pressedButton = fixture.debugElement.query(By.css('button[aria-pressed="true"]'));
      expect(pressedButton.nativeElement.getAttribute('aria-label')).toBe('rock');
    });

    it('should show "Machine is thinking"', () => {
      const thinking = fixture.debugElement.query(By.css('[aria-busy="true"]'));
      expect(thinking).toBeTruthy();
    });

    describe('after the timeout', () => {
      beforeEach(() => {
        vitest.advanceTimersByTime(1000);
        fixture.detectChanges();
      });

      it("should show the machine's move", () => {
        expect(fixture.nativeElement.textContent).toContain('scissors');
      });

      it('should request the machine move with player move and moderate difficulty', () => {
        expect(fakeGetRandomMove.execute).toHaveBeenCalledWith(false, 'rock', 0.6);
      });

      it('should re-enable the buttons', () => {
        const buttons = fixture.debugElement.queryAll(By.css('fieldset button'));
        expect(buttons.every((b) => !b.nativeElement.disabled)).toBe(true);
      });

      it('should hide "Machine is thinking"', () => {
        const thinking = fixture.debugElement.query(By.css('[aria-busy="true"]'));
        expect(thinking).toBeFalsy();
      });

      describe('when the player wins', () => {
        it('should show "You win!"', () => {
          const status = fixture.debugElement.query(By.css('[role="status"]'));
          expect(status.nativeElement.textContent).toContain('You win!');
        });

        it('should call savePlayerScoreService', () => {
          expect(fakeSaveScore.execute).toHaveBeenCalledOnce();
        });
      });

      describe('when the player loses', () => {
        let vibrateSpy: ReturnType<typeof vitest.fn>;

        beforeEach(() => {
          vibrateSpy = vitest.fn().mockReturnValue(true);
          Object.defineProperty(navigator, 'vibrate', {
            value: vibrateSpy,
            writable: true,
            configurable: true,
          });

          fakeGetWinner.execute.mockReturnValue('lose');
          fakeSaveScore.execute.mockClear();

          fixture.debugElement
            .query(By.css('button[aria-label="paper"]'))
            .triggerEventHandler('click', null);
          fixture.detectChanges();
          vitest.advanceTimersByTime(1000);
          fixture.detectChanges();
        });

        it('should show "You lose :("', () => {
          const status = fixture.debugElement.query(By.css('[role="status"]'));
          expect(status.nativeElement.textContent).toContain('You lose :(');
        });

        it('should not call savePlayerScoreService', () => {
          expect(fakeSaveScore.execute).not.toHaveBeenCalled();
        });

        it('should vibrate the device for 300ms', () => {
          expect(vibrateSpy).toHaveBeenCalledWith(300);
        });
      });

      describe('when it is a tie', () => {
        beforeEach(() => {
          fakeGetWinner.execute.mockReturnValue('tie');
          fakeSaveScore.execute.mockClear();

          fixture.debugElement
            .query(By.css('button[aria-label="scissors"]'))
            .triggerEventHandler('click', null);
          fixture.detectChanges();
          vitest.advanceTimersByTime(1000);
          fixture.detectChanges();
        });

        it('should show "It\'s a tie :|"', () => {
          const status = fixture.debugElement.query(By.css('[role="status"]'));
          expect(status.nativeElement.textContent).toContain("It's a tie :|");
        });

        it('should not call savePlayerScoreService', () => {
          expect(fakeSaveScore.execute).not.toHaveBeenCalled();
        });
      });

      describe('when lizard-spock mode is selected and a move is played', () => {
        it('should request a random move including lizard-spock options', () => {
          fakeGetWinner.execute.mockReturnValue('win');

          const lizardSpockRadio = fixture.debugElement.query(
            By.css('input[value="lizard-spock"]'),
          );
          lizardSpockRadio.triggerEventHandler('change', { target: { value: 'lizard-spock' } });
          fixture.detectChanges();

          fixture.debugElement
            .query(By.css('button[aria-label="lizard"]'))
            .triggerEventHandler('click', null);
          fixture.detectChanges();
          vitest.advanceTimersByTime(1000);
          fixture.detectChanges();
          expect(fakeGetRandomMove.execute).toHaveBeenLastCalledWith(true, 'lizard', 0.6);
        });
      });
    });
  });
});
