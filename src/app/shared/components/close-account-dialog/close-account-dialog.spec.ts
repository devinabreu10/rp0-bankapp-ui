import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CloseAccountDialogComponent } from './close-account-dialog.component';

describe('CloseAccountDialog', () => {
  let component: CloseAccountDialogComponent;
  let fixture: ComponentFixture<CloseAccountDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CloseAccountDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CloseAccountDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should emit confirm when confirmationInput matches accountName', () => {
    const confirmSpy = spyOn(component.confirm, 'emit');
    fixture.componentRef.setInput('accountName', 'test-account'); // Setting the signal value
    component.confirmationInput = 'test-account';

    component.onConfirm();

    expect(confirmSpy).toHaveBeenCalled();
  });

  it('should not emit confirm when confirmationInput does not match accountName', () => {
    const confirmSpy = spyOn(component.confirm, 'emit');
    fixture.componentRef.setInput('accountName', 'test-account');
    component.confirmationInput = 'wrong-name';

    component.onConfirm();

    expect(confirmSpy).not.toHaveBeenCalled();
  });

  it('should emit cancel when onCancel is called', () => {
    const cancelSpy = spyOn(component.cancelChange, 'emit');

    component.onCancel();

    expect(cancelSpy).toHaveBeenCalled();
    expect(component.cancelChange.emit).toHaveBeenCalled();
  });

});
