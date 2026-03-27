import { Component } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter, Router } from '@angular/router';
import { JoinPlayerCommand } from '../../auth/commands/JoinPlayerCommand';
import { SetCurrentPlayerCommand } from '../../auth/commands/SetCurrentPlayerCommand';
import { CurrentPlayerStore } from '../../auth/store/CurrentPlayerStore';
import { FakePlayerRepository } from '../../player/repositories/FakePlayerRepository';
import { PlayerRepository } from '../../player/repositories/PlayerRepository';
import { FakeStorageRepository } from '../../shared/storage/repositories/FakeStorageRepository';
import { StorageRepository } from '../../shared/storage/repositories/StorageRepository';
import { HomePage } from './home-page';

@Component({ template: '' })
class GamePageStub {}

describe('HomePage', () => {
  let fixture: ComponentFixture<HomePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePage],
      providers: [
        provideRouter([{ path: 'game', component: GamePageStub }]),
        { provide: StorageRepository, useClass: FakeStorageRepository },
        JoinPlayerCommand,
        SetCurrentPlayerCommand,
        CurrentPlayerStore,
      ],
    });

    TestBed.overrideProvider(PlayerRepository, {
      useValue: new FakePlayerRepository(),
    });

    await TestBed.compileComponents();

    fixture = TestBed.createComponent(HomePage);
    fixture.detectChanges();
  });

  it('should render the title', () => {
    const h1 = fixture.nativeElement.querySelector('h1');
    expect(h1.textContent).toBe('Create new player');
  });

  describe('when the input is empty', () => {
    it('should have the button disabled', () => {
      const button = fixture.debugElement.query(By.css('button'));
      expect(button.nativeElement.disabled).toBeTruthy();
    });

    it('should show the error message', () => {
      const error = fixture.debugElement.query(By.css('small'));
      expect(error).toBeTruthy();
    });

    it('should mark the input as aria-invalid', () => {
      const input = fixture.debugElement.query(By.css('input#name'));
      expect(input.nativeElement.getAttribute('aria-invalid')).toBe('true');
    });

    it('should not navigate on join', async () => {
      const button = fixture.debugElement.query(By.css('button'));
      button.nativeElement.click();
      await fixture.whenStable();

      expect(TestBed.inject(Router).url).toBe('/');
    });
  });

  describe('when the input has a value', () => {
    beforeEach(() => {
      const input = fixture.debugElement.query(By.css('input#name'));
      input.nativeElement.value = 'Player 1';
      input.triggerEventHandler('input', { target: input.nativeElement });
      fixture.detectChanges();
    });

    it('should have the button enabled', () => {
      const button = fixture.debugElement.query(By.css('button'));
      expect(button.nativeElement.disabled).toBeFalsy();
    });

    it('should hide the error message', () => {
      const error = fixture.debugElement.query(By.css('small'));
      expect(error).toBeFalsy();
    });

    it('should not mark the input as aria-invalid', () => {
      const input = fixture.debugElement.query(By.css('input#name'));
      expect(input.nativeElement.getAttribute('aria-invalid')).toBeNull();
    });

    it('should navigate to /game on join', async () => {
      const button = fixture.debugElement.query(By.css('button'));
      button.triggerEventHandler('click', null);
      await fixture.whenStable();

      expect(TestBed.inject(Router).url).toBe('/game');
    });
  });

  describe('when the input has only whitespace', () => {
    beforeEach(() => {
      const input = fixture.debugElement.query(By.css('input#name'));
      input.nativeElement.value = '   ';
      input.triggerEventHandler('input', { target: input.nativeElement });
      fixture.detectChanges();
    });

    it('should have the button disabled', () => {
      const button = fixture.debugElement.query(By.css('button'));
      expect(button.nativeElement.disabled).toBeTruthy();
    });

    it('should mark the input as aria-invalid', () => {
      const input = fixture.debugElement.query(By.css('input#name'));
      expect(input.nativeElement.getAttribute('aria-invalid')).toBe('true');
    });
  });

  describe('when two-player mode is selected', () => {
    beforeEach(() => {
      const twoPlayersRadio = fixture.debugElement.query(By.css('input#player-count-2'));
      twoPlayersRadio.triggerEventHandler('change', {
        target: twoPlayersRadio.nativeElement,
      });
      fixture.detectChanges();
    });

    it('should show player 2 input', () => {
      const player2Input = fixture.debugElement.query(By.css('input#player-2-name'));
      expect(player2Input).toBeTruthy();
    });

    it('should keep join button disabled when player 2 name is empty', () => {
      const player1Input = fixture.debugElement.query(By.css('input#name'));
      player1Input.nativeElement.value = 'Player 1';
      player1Input.triggerEventHandler('input', { target: player1Input.nativeElement });
      fixture.detectChanges();

      const player2Input = fixture.debugElement.query(By.css('input#player-2-name'));
      expect(player2Input.nativeElement.getAttribute('aria-invalid')).toBe('true');

      const button = fixture.debugElement.query(By.css('button'));
      expect(button.nativeElement.disabled).toBeTruthy();
    });

    it('should enable join button when both names are valid', () => {
      const player1Input = fixture.debugElement.query(By.css('input#name'));
      player1Input.nativeElement.value = 'Player 1';
      player1Input.triggerEventHandler('input', { target: player1Input.nativeElement });

      const player2Input = fixture.debugElement.query(By.css('input#player-2-name'));
      player2Input.nativeElement.value = 'Player 2';
      player2Input.triggerEventHandler('input', { target: player2Input.nativeElement });

      fixture.detectChanges();

      const button = fixture.debugElement.query(By.css('button'));
      expect(button.nativeElement.disabled).toBeFalsy();
    });

    it('should send both players on join', () => {
      const joinPlayerCommand = fixture.debugElement.injector.get(JoinPlayerCommand);
      const joinPlayerCommandSpy = vitest.spyOn(joinPlayerCommand, 'execute');

      const player1Input = fixture.debugElement.query(By.css('input#name'));
      player1Input.nativeElement.value = 'Player 1';
      player1Input.triggerEventHandler('input', { target: player1Input.nativeElement });

      const player2Input = fixture.debugElement.query(By.css('input#player-2-name'));
      player2Input.nativeElement.value = 'Player 2';
      player2Input.triggerEventHandler('input', { target: player2Input.nativeElement });
      fixture.detectChanges();

      const button = fixture.debugElement.query(By.css('button'));
      button.triggerEventHandler('click', null);

      expect(joinPlayerCommandSpy).toHaveBeenCalledExactlyOnceWith(['Player 1', 'Player 2']);
    });
  });
});
