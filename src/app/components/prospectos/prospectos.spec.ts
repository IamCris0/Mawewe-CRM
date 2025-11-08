import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Prospectos } from './prospectos';

describe('Prospectos', () => {
  let component: Prospectos;
  let fixture: ComponentFixture<Prospectos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Prospectos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Prospectos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
