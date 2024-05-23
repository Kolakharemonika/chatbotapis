
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { CustomValidators } from '../../services/custome-validators.service';

@Component({
  selector: 'app-captcha-dialog',
  template: `
<div class="modal" tabindex="-1" role="dialog" style="display: block;">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header flex-row-reverse border-0">
        <button class="btn btn-close" aria-label="Close" (click)="closeDialog()"></button>
      </div>
      <div class="modal-body col-10">
        <form class="row" [formGroup]="captchaFormGroup">
          <div class="mb-3">
            <input type="email" formControlName="emailId" class="form-control" length="50" placeholder="Enter your email address">
            <span class="error">
                <small *ngIf="formCaptcha['emailId'].errors && (formCaptcha['emailId'].dirty || formCaptcha['emailId'].touched)">
                <small *ngIf="formCaptcha['emailId'].errors['required']">This field is Required</small>
                <small *ngIf="formCaptcha['emailId'].errors['pattern']">Enter valid email</small>
                <small *ngIf="formCaptcha['emailId'].errors['maxlength']">Enter valid email</small>
               </small>
            </span>
          </div>
           <div class="mb-3 col-6">
            <span id="generated-captcha" class="row">
               {{generatedCaptcha}}
            </span>
          </div>
          <div class="mb-3 col-6">
            <input type="text" formControlName="captcha" class="form-control" placeholder="Enter the captcha">
             <span class="error">
                <small *ngIf="formCaptcha['captcha'].errors && (formCaptcha['captcha'].dirty || formCaptcha['captcha'].touched)">
                  <small *ngIf="formCaptcha['captcha'].errors['required']">This field is Required</small>
                  <small *ngIf="formCaptcha['captcha'].errors['match']">This captcha not matched</small>
                </small>
            </span>
          </div>
          <div class="text-center">
            <button class="btn btn-primary" (click)="validateCaptcha()"> Generate Password </button>
          </div>
        </form>
      </div>

    </div>
  </div>
</div>
`,
})

export class CaptchaDialogComponent {
  captchaFormGroup!: FormGroup;
  generatedCaptcha: string = '';
  get formCaptcha() { return this.captchaFormGroup.controls; }

  constructor(private dialogRef: MatDialogRef<CaptchaDialogComponent>,
    private fb: FormBuilder,
    private toast: ToastrService,
    private dataService: DataService) {

    this.generateCaptcha()
    this.createForm();
  }


  generateCaptcha() {
    let length = 6; //captcha length
    let captcha = '';
    let alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";

    for (var i = length; i > 0; --i) {
      captcha += alphabets[Math.floor(Math.random() * alphabets.length)]
    }
    this.generatedCaptcha = captcha;
  }

  createForm() {
    this.captchaFormGroup = this.fb.group({
      emailId: ['mk@gmail.com', [Validators.required, CustomValidators.emailValidator]],
      captcha: ['', [Validators.required]],
    });
  }

  validateCaptcha() {
    console.log()
    console.log(this.captchaFormGroup.invalid, 'isbvalid')

    if (this.captchaFormGroup.valid) {
      const form = this.captchaFormGroup.getRawValue()
      const EnteredCaptcha = form.captcha;
      const generatedCaptcha = this.generatedCaptcha;

      if (form.emailId.trim() == '' || !form.captcha) {
        return;
      }
      console.log(form)

      if (EnteredCaptcha == generatedCaptcha) {
        this.generatePassword();
      } else {
        this.toast.error('Please enter valid captcha');
        // this.captchaFormGroup?.get('captcha')?.setErrors({ match: true })
        this.captchaFormGroup.reset()
        this.generateCaptcha();
      }
    }
  }

  generatePassword() {
    let data = {
      "email": this.captchaFormGroup.get('emailId')?.value
    }

    this.dataService.generatePassword(data).then((resp: any) => {
      if (resp.statusCode == 200) {
        this.toast.success(resp.message);
      } else {
        this.toast.error(resp.message);
      }
    }, (err) => {
      this.toast.error(err.message);
    })

    this.closeDialog();
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
