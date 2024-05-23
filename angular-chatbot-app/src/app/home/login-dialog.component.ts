
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login-dialog',
  template: `
  <div class="modal" tabindex="-1" role="dialog" style="display: block;">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header flex-row-reverse border-0">
        <button class="btn btn-close" aria-label="Close" (click)="closeDialog()"></button>
      </div>
      <div class="modal-body col-10">
        <form class="row" [formGroup]="loginFormGroup">
            <div class="mb-3 form-group">
            <input type="text" formControlName="email" class="form-control" id="email" placeholder="Enter your login email">
            <span class="error">
                <small *ngIf="formLogin['email'].errors && (formLogin['email'].dirty || formLogin['email'].touched)">
                  <small *ngIf="formLogin['email'].errors['required']">This field is Required</small>
                  <small *ngIf="formLogin['email'].errors['pattern']">Enter valid email</small>
                  <small *ngIf="formLogin['email'].errors['maxlength']">Enter valid email d</small>
                </small>
            </span>
          </div>
          <div class="mb-3 form-group">
            <input type="password" formControlName="password" class="form-control" length="20" placeholder="Enter your password">
            <span class="error">
                <small *ngIf="formLogin['password'].errors && (formLogin['password'].dirty || formLogin['password'].touched)">
                  <small *ngIf="formLogin['password'].errors['required']">This field is Required</small>
                  <!-- <small *ngIf="formLogin['password'].errors['pattern']">Enter valid password</small> -->
                  <small *ngIf="formLogin['password'].errors['maxlength']">Enter valid password</small>
                </small>
              </span>
          </div>
          <div class="text-center row-cols-3">
            <button class="btn btn-primary" (click)="login()"> Login </button>
          </div>
        </form>
      </div>

    </div>
  </div>
</div>
  `

})

export class LoginDialogComponent {

  loginFormGroup!: FormGroup;
  get formLogin() { return this.loginFormGroup.controls; }

  constructor(public dialogRef: MatDialogRef<LoginDialogComponent>,
    private router: Router,
    private fb: FormBuilder,
    private dataService: DataService,
    private toast: ToastrService
  ) {
    this.createForm()
  }

  createForm() {
    this.loginFormGroup = this.fb.group({
      email: ['mk@gmail.com', Validators.required],
      password: ['12345', [Validators.required, Validators.maxLength(20)]],
    });
  }

  login() {

    if (this.loginFormGroup.valid) {

      const data = this.loginFormGroup.getRawValue();

      this.dataService.login(data).then((resp: any) => {
        if (resp.statusCode == 200) {

          this.router.navigate(['landing'])
          this.dialogRef.close();
          this.toast.success(resp.message);
        }else {
          this.toast.error(resp.message);
        }
      }, (err) => {
        this.toast.error(err.message);
      })
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
