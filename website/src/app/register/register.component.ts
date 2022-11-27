import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { interval } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { RegisterationService } from '../services/registeration.service';
declare var bootstrap: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  pattern = "^[0-9][0-9]*$";
  message: string = '';
  // sportsArr: any[] = [];
  // sabhaName;
  // ssData;
  formModel = this.fb.group({
    firstName: ['', Validators.required],
    middleName: ['', Validators.required],
    lastName: ['', Validators.required],
    phone: ['', [Validators.required, Validators.minLength(10), Validators.pattern(this.pattern)]],
    gender: ['Male', Validators.required],
    transport: ['Bus', Validators.required],
    sabha: [null, Validators.required],
    reference: [null],
    isNew: [false, Validators.required],
    samparkId: [null],
  });

  autoCompleteMobileList = [];
  searchMobileKeyword = 'Mobile';

  autoCompleteNameList = [];
  searchNameKeyword = 'Full Name';
  selectedMobileNo = '';
  numberModal;
  errorMsg = '';
  referenceDetails = {};
  timeLeft$;

  @ViewChild('refAutoSelector') refAutoSelector;

  constructor(private fb: FormBuilder,
    private service: RegisterationService
  ) {
    this.timeLeft$ = interval(1000).pipe(
      map(x => this.calcDateDiff()),
      shareReplay(1)
    );
  }

  ngOnInit(): void {
    // setTimeout(() => {
    this.numberModal = new bootstrap.Modal(document.getElementById('autoCompleteModal'), {});
    this.numberModal.show();

  }

  get firstName() {
    return this.formModel.get('firstName');
  }
  get middleName() {
    return this.formModel.get('middleName');
  }
  get lastName() {
    return this.formModel.get('lastName');
  }
  get phone() {
    return this.formModel.get('phone');
  }
  get sabha() {
    return this.formModel.get('sabha');
  }
  get isNew() {
    return this.formModel.get('isNew');
  }
  get reference() {
    return this.formModel.get('reference');
  }




  onSubmit() {
    if (this.formModel.valid) {
      // console.log(this.formModel.value);
      var formValue = this.formModel.value;
      var formBody = {};
      formBody['Mobile'] = formValue.phone;
      formBody['First Name'] = formValue.firstName
      formBody['Middle Name'] = formValue.middleName
      formBody['Last Name'] = formValue.lastName
      formBody['Gender'] = formValue.gender
      formBody['transport'] = formValue.transport
      formBody['Ref Name'] = formValue.reference
      formBody['Sabha'] = this.formModel.get('sabha').value
      formBody['isNew'] = formValue.isNew
      formBody['samparkId'] = formValue.samparkId

      console.log(formBody);

      this.service.registerForMohatsav(formBody).subscribe(
        (res: any) => {
          var m = new bootstrap.Modal(document.getElementById('successModal'), {});
          m.show();
          // this.reset();

        }, err => {
          if (err?.error?.message) {
            this.errorMsg = err?.error?.message
          }
          else {
            this.errorMsg = 'Server Error, Please try again later!'
          }
          var m = new bootstrap.Modal(document.getElementById('errorModal'), {});
          m.show();
        })
    }


  }

  reset() {
    if (this.isNew.value == true) {
      this.formModel.reset();
      this.formModel.patchValue({ gender: 'Male', transport: 'Bus', isNew: true });
      this.refAutoSelector.clear();
      this.refAutoSelector.close();
      this.referenceDetails = {};
      this.autoCompleteNameList = [];
    }
    else {
      this.formModel.reset();
      this.formModel.patchValue({ gender: 'Male', transport: 'Bus' });
    }
  }

  // HPYM

  onMobileSelected(e) {
    this.selectedMobileNo = e.Mobile;
    console.log(e);
    this.getFullForm();
  }

  onMobileSearch(e) {
    if (e && e.length >= 3) {
      console.log('ss', e);
      this.service.phoneAutoFill(e).subscribe((res: any) => {
        this.autoCompleteMobileList = res.data;
        console.log(this.autoCompleteMobileList);
      }, err => {

      })
    }
    else {
      this.autoCompleteMobileList = [];
    }
  }

  onNameSelected(e) {
    console.log(e);
    this.selectedMobileNo = e.Mobile;
    this.getFullForm();
  }

  onReferenceSelected(e) {
    this.formModel.patchValue({ 'reference': e['Full Name'], 'sabha': e['Sabha'] });
    this.formModel.get('reference').setErrors(null);
    this.referenceDetails = e;
  }

  onReferenceCleared() {
    this.formModel.patchValue({ 'reference': null });
    this.refAutoSelector.close();
  }


  getFullForm() {
    this.service.getFullForm(this.selectedMobileNo).subscribe((res: any) => {
      console.log(res.data);
      console.log(res.data['First Name']);
      var response = res.data[0];
      this.formModel.patchValue({
        firstName: response['First Name'],
        middleName: response['Middle Name'],
        lastName: response['Last Name'],
        phone: response['Mobile'],
        gender: response['Gender'],
        transport: 'Bus',
        sabha: response['Sabha'],
        isNew: false,
        samparkId: response['_id']
      })
      this.numberModal.hide();
      console.log(this.formModel.value);
      // this.formModel.get('reference').setValidators(Validators.required);
      // this.formModel.patchValue(res.data);
    }, err => {

    })
  }

  onNameSearch(e) {
    if (e && e.length >= 3) {
      console.log('ss name', e);
      this.service.nameAutoFill(e).subscribe((res: any) => {
        this.autoCompleteNameList = res.data;
        console.log(this.autoCompleteNameList);
      }, err => {

      })
    }
    else {
      this.autoCompleteNameList = [];
    }
  }

  onNewMemberClick() {
    console.log('new clicked');
    this.formModel.patchValue({ isNew: true })
    this.formModel.get('sabha').disable();
  }


  calcDateDiff(endDay: Date = new Date('2023/1/8')) {
    const dDay = endDay.valueOf();

    const milliSecondsInASecond = 1000;
    const hoursInADay = 24;
    const minutesInAnHour = 60;
    const secondsInAMinute = 60;

    const timeDifference = dDay - Date.now();

    const daysToDday = Math.floor(
      timeDifference /
      (milliSecondsInASecond * minutesInAnHour * secondsInAMinute * hoursInADay)
    );

    const hoursToDday = Math.floor(
      (timeDifference /
        (milliSecondsInASecond * minutesInAnHour * secondsInAMinute)) %
      hoursInADay
    );

    const minutesToDday = Math.floor(
      (timeDifference / (milliSecondsInASecond * minutesInAnHour)) %
      secondsInAMinute
    );

    const secondsToDday =
      Math.floor(timeDifference / milliSecondsInASecond) % secondsInAMinute;

    return { secondsToDday, minutesToDday, hoursToDday, daysToDday };
  }
}

