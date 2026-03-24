import { TestBed } from '@angular/core/testing';
import { FakePlayerRepository } from '../repositories/FakePlayerRepository';
import { PlayerRepository } from '../repositories/PlayerRepository';
import { JoinPlayerCommand } from './JoinPlayerCommand';

describe('JoinPlayerCommand', () => {
  let command: JoinPlayerCommand;
  let fakeRepository: FakePlayerRepository;

  beforeEach(() => {
    fakeRepository = new FakePlayerRepository();

    TestBed.configureTestingModule({
      providers: [JoinPlayerCommand, { provide: PlayerRepository, useValue: fakeRepository }],
    });

    command = TestBed.inject(JoinPlayerCommand);
  });

  it('should call playerRepository.findOrCreate with the given name', () => {
    const fakeRepositorySpy = vitest.spyOn(fakeRepository, 'findOrCreate');
    command.execute('Alice');
    expect(fakeRepositorySpy).toHaveBeenCalledExactlyOnceWith('Alice');
  });
});
