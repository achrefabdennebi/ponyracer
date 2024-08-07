import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';
import { formatDistanceToNowStrict, parseISO } from 'date-fns';
import { RaceService } from '../race.service';
import { PonyComponent } from '../pony/pony.component';
import { RaceModel } from '../models/race.model';
import { PonyModel } from '../models/pony.model';
import { BetComponent } from './bet.component';

describe('BetComponent', () => {
  let raceService: jasmine.SpyObj<RaceService>;
  const race = { id: 12, name: 'Paris', startInstant: '2020-02-18T08:02:00Z' } as RaceModel;
  const activatedRoute = { snapshot: { paramMap: convertToParamMap({ raceId: 12 }) } };

  beforeEach(() => {
    raceService = jasmine.createSpyObj<RaceService>('RaceService', ['get', 'bet', 'cancelBet']);
    raceService.get.and.returnValue(of(race));
    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: RaceService, useValue: raceService }, { provide: ActivatedRoute, useValue: activatedRoute }]
    });
  });

  it('should display a race name, its date and its ponies', () => {
    const fixture = TestBed.createComponent(BetComponent);
    fixture.detectChanges();

    // given a race in Paris with 5 ponies
    const betComponent = fixture.componentInstance;
    betComponent.raceModel = {
      id: 12,
      name: 'Paris',
      ponies: [
        { id: 1, name: 'Gentle Pie', color: 'YELLOW' },
        { id: 2, name: 'Big Soda', color: 'ORANGE' },
        { id: 3, name: 'Gentle Bottle', color: 'PURPLE' },
        { id: 4, name: 'Superb Whiskey', color: 'GREEN' },
        { id: 5, name: 'Fast Rainbow', color: 'BLUE' }
      ],
      startInstant: '2020-02-18T08:02:00Z'
    };

    // when triggering the change detection
    fixture.detectChanges();

    // then we should have the name and ponies displayed in the template
    const directives = fixture.debugElement.queryAll(By.directive(PonyComponent));
    expect(directives).withContext('You should use the PonyComponent in your template to display the ponies').not.toBeNull();
    expect(directives.length).withContext('You should have five pony components in your template').toBe(5);
    const element = fixture.nativeElement;
    const raceName = element.querySelector('h1');
    expect(raceName).withContext('You need an h1 element for the race name').not.toBeNull();
    expect(raceName.textContent).withContext('The h1 element should contain the race name').toContain('Paris');
    const startInstant = element.querySelector('p');
    expect(startInstant).withContext('You should use a `p` element to display the start instant').not.toBeNull();
    expect(startInstant.textContent)
      .withContext('You should use the `fromNow` pipe you created to format the start instant')
      .toContain(formatDistanceToNowStrict(parseISO(betComponent.raceModel.startInstant), { addSuffix: true }));
  });

  it('should trigger a bet when a pony is clicked', () => {
    const fixture = TestBed.createComponent(BetComponent);
    fixture.detectChanges();

    raceService.bet.and.returnValue(
      of({
        id: 12,
        name: 'Paris',
        ponies: [
          { id: 1, name: 'Gentle Pie', color: 'YELLOW' },
          { id: 2, name: 'Big Soda', color: 'ORANGE' }
        ],
        startInstant: '2020-02-18T08:02:00Z',
        betPonyId: 1
      })
    );

    // given a race in Paris with 2 ponies
    const betComponent = fixture.componentInstance;
    betComponent.raceModel = {
      id: 12,
      name: 'Paris',
      ponies: [
        { id: 1, name: 'Gentle Pie', color: 'YELLOW' },
        { id: 2, name: 'Big Soda', color: 'ORANGE' }
      ],
      startInstant: '2020-02-18T08:02:00Z'
    };
    fixture.detectChanges();

    // when we emit a `ponyClicked` event
    const directives = fixture.debugElement.queryAll(By.directive(PonyComponent));
    const gentlePie = directives[0].componentInstance;

    // then we should have placed a bet on the pony
    gentlePie.ponyClicked.subscribe(() => {
      expect(raceService.bet).toHaveBeenCalledWith(12, 1);
      expect(betComponent.raceModel!.betPonyId).withContext('You must store the response of the bet in the field `raceModel`').toBe(1);
    });

    gentlePie.ponyClicked.emit(betComponent.raceModel.ponies[0]);
  });

  it('should test if the pony is the one we bet on', () => {
    const fixture = TestBed.createComponent(BetComponent);
    const component = fixture.componentInstance;
    component.raceModel = {
      id: 12,
      name: 'Paris',
      ponies: [
        { id: 1, name: 'Gentle Pie', color: 'YELLOW' },
        { id: 2, name: 'Big Soda', color: 'ORANGE' }
      ],
      startInstant: '2020-02-18T08:02:00Z',
      betPonyId: 1
    };
    const pony = { id: 1 } as PonyModel;

    const isSelected = component.isPonySelected(pony);

    expect(isSelected).withContext('The `isPonySelected` method should return true if the pony is selected').toBe(true);
  });

  it('should initialize the race', () => {
    const fixture = TestBed.createComponent(BetComponent);
    const component = fixture.componentInstance;
    expect(component.raceModel).withContext('The component should initialize the `raceModel`').toBe(race);
    expect(raceService.get).toHaveBeenCalledWith(12);
  });

  it('should display an error message if bet failed', () => {
    const fixture = TestBed.createComponent(BetComponent);
    raceService.bet.and.callFake(() => throwError(() => new Error('Oops')));

    const component = fixture.componentInstance;
    expect(component.betFailed).toBe(false);

    const pony = { id: 1 } as PonyModel;
    component.betOnPony(pony);

    expect(component.betFailed).toBe(true);

    fixture.detectChanges();

    const element = fixture.nativeElement;
    const message = element.querySelector('.alert.alert-danger');
    expect(message.textContent).toContain('The race is already started or finished');

    // close the alert
    const alertButton = message.querySelector('button');
    expect(alertButton).withContext('The message should have a close button').not.toBeNull();
    alertButton.click();
    fixture.detectChanges();
    expect(element.querySelector('.alert.alert-danger')).withContext('Clicking on the button should close the alert').toBeNull();
  });

  it('should cancel a bet', () => {
    const fixture = TestBed.createComponent(BetComponent);
    raceService.cancelBet.and.returnValue(of(undefined));

    const component = fixture.componentInstance;
    component.raceModel = { id: 2, betPonyId: 1, name: 'Lyon', ponies: [], startInstant: '2020-02-18T08:02:00Z' };

    const pony = { id: 1 } as PonyModel;
    component.betOnPony(pony);

    expect(raceService.cancelBet).toHaveBeenCalledWith(2);
    expect(component.raceModel.betPonyId).toBeFalsy();
  });

  it('should display a message if canceling a bet fails', () => {
    const fixture = TestBed.createComponent(BetComponent);
    fixture.detectChanges();

    raceService.cancelBet.and.callFake(() => throwError(() => new Error('Oops')));

    const component = fixture.componentInstance;
    component.raceModel = { id: 2, betPonyId: 1, name: 'Lyon', ponies: [], startInstant: '2020-02-18T08:02:00Z' };
    expect(component.betFailed).toBe(false);

    const pony = { id: 1 } as PonyModel;
    component.betOnPony(pony);

    expect(raceService.cancelBet).toHaveBeenCalledWith(2);
    expect(component.raceModel.betPonyId).toBe(1);
    expect(component.betFailed).toBe(true);
  });
});
