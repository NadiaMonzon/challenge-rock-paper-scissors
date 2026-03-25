import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter, Router } from '@angular/router';
import { JoinPlayerCommand } from '../../auth/commands/JoinPlayerCommand';
import { SetCurrentPlayerCommand } from '../../auth/commands/SetCurrentPlayerCommand';
import { CurrentPlayerStore } from '../../auth/store/CurrentPlayerStore';
import { LocalStoragePlayerRepository } from '../../player/repositories/LocalStoragePlayerRepository';
import { PlayerRepository } from '../../player/repositories/PlayerRepository';
import { LocalStorageRepository } from '../../shared/storage/repositories/LocalStorageRepository';
import { StorageRepository } from '../../shared/storage/repositories/StorageRepository';
import { HomePage } from './home-page';

describe('HomePage', () => {
  let fixture: ComponentFixture<HomePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePage],
      providers: [
        provideRouter([]),
        { provide: StorageRepository, useClass: LocalStorageRepository },
        { provide: PlayerRepository, useClass: LocalStoragePlayerRepository },
        JoinPlayerCommand,
        SetCurrentPlayerCommand,
        CurrentPlayerStore,
      ],
    }).compileComponents();

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
      const input = fixture.debugElement.query(By.css('input'));
      expect(input.nativeElement.getAttribute('aria-invalid')).toBe('true');
    });

    it('should not navigate on join', () => {
      const router = TestBed.inject(Router);
      const navigateSpy = vitest.spyOn(router, 'navigate');

      const button = fixture.debugElement.query(By.css('button'));
      button.nativeElement.click();

      expect(navigateSpy).not.toHaveBeenCalled();
    });
  });

  describe('when the input has a value', () => {
    beforeEach(() => {
      const input = fixture.debugElement.query(By.css('input'));
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
      const input = fixture.debugElement.query(By.css('input'));
      expect(input.nativeElement.getAttribute('aria-invalid')).toBeNull();
    });

    it('should navigate on join', () => {
      const router = TestBed.inject(Router);
      const navigateSpy = vitest.spyOn(router, 'navigate');

      const button = fixture.debugElement.query(By.css('button'));
      button.triggerEventHandler('click', null);

      expect(navigateSpy).toHaveBeenCalledExactlyOnceWith(['/game']);
    });
  });

  describe('when the input has only whitespace', () => {
    beforeEach(() => {
      const input = fixture.debugElement.query(By.css('input'));
      input.nativeElement.value = '   ';
      input.triggerEventHandler('input', { target: input.nativeElement });
      fixture.detectChanges();
    });

    it('should have the button disabled', () => {
      const button = fixture.debugElement.query(By.css('button'));
      expect(button.nativeElement.disabled).toBeTruthy();
    });

    it('should mark the input as aria-invalid', () => {
      const input = fixture.debugElement.query(By.css('input'));
      expect(input.nativeElement.getAttribute('aria-invalid')).toBe('true');
    });
  });
});
