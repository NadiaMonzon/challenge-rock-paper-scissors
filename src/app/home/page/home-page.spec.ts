import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HomePage } from './home-page';

describe('HomePage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePage],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(HomePage);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
