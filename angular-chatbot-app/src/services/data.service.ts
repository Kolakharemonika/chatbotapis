import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';
import { CONFIG } from './config';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  _serverUrl: string = 'http://localhost:3000/api/v1';
  // _serverUrl: string = 'https://lab.pixel6.co/api/';

  isloggedIn: boolean = false;

  constructor(private http: HttpClient) {
    this.isloggedIn = false;
  }

  login(data: any) {
    let respData = {
      "statusCode": 200,
      "status": "Success",
      "message": 'Login successfully!'
    }
    let dummydata = { "mobile": 99999988888, "otp": 2222 };

    return new Promise((resolve, reject) => {
      this.postApi('/login', data, null)
        .then((resp: any) => {
          this.isloggedIn = true;
          if (resp && resp.statusCode == 200) {
            resolve(resp);
          } else {
            reject(resp);
          }
        }, (error) => {
          reject(error);
        });
    });
  }

  getAnswer(data: any) {
    //     return this.postApi('api/v1/getAnswer', data);
    let dummydata = { "mobile": 99999988888, "otp": 2222 };

    return new Promise((resolve, reject) => {
      this.postApi('verifyOTP.php', dummydata, null)
        .then((resp: any) => {
          if (resp && resp.statusCode == 200) {
            resp.answer = 'What information are you looking for?'
            resolve(resp);
          } else {
            // resp.message = 'Enter correct email & password'
            reject(resp.message);
          }
        }, (error) => {
          error.message = 'incorrect data'
          reject(error);
        });
    });
  }

  isAuthenticated() {
    return this.isloggedIn;
  }

  getChatbotData() {
    // return this.postApi('api/v1/getBotDetails', data, null)
    let chatbotsData = [{ 'title': 'Personality Development', 'desc': 'It can interpret and respond to queries based on your documents.' },
    { 'title': 'Personality Development', 'desc': 'It can interpret and respond to queries based on your documents.' },
    { 'title': 'Personality Development', 'desc': 'It can interpret and respond to queries based on your documents.' },
    { 'title': 'Personality Development', 'desc': 'It can interpret and respond to queries based on your documents.' }
    ];
    let dummydata = { "mobile": 99999988888, "otp": 2222 };

    return new Promise((resolve, reject) => {
      this.getApi('/chatbots', null)
        .then((resp: any) => {
          if (resp && resp.statusCode == 200) {
            // resp.chatbotsData = chatbotsData;
            resolve(resp);
          } else {
            reject(resp);
          }
        }, (error) => {
          reject(error);
        });
    });
  }

  generatePassword(data: any) {

    // let dummydata = { "mobile": 99999988888, "otp": 2222 };

    return new Promise((resolve, reject) => {
      this.postApi('/generate-password', data, null)
        .then((resp: any) => {
          if (resp && resp.statusCode==200) {
            resolve(resp);
          } else {
            reject(resp);
          }
        }, (error) => {
          reject(error);
        });
    });
  }


  // generatePassword(data: any) {

  //   let dummydata = { "mobile": 99999988888, "otp": 2222 };

  //   return new Promise((resolve, reject) => {
  //     this.postApi('verifyOTP.php', dummydata, null)
  //       .then((resp: any) => {
  //         if (resp && resp.statusCode == 200) {
  //           resp.message = 'Password generated! Check your email for Password.'
  //           resolve(resp);
  //         } else {
  //           resp.message = 'try again later'
  //           reject(resp.message);
  //         }
  //       }, (error) => {
  //         error.message = 'incorrect data';
  //         reject(error);
  //       });
  //   });
  // }

  private handleError(error: HttpErrorResponse) {
    console.error('Error in HTTP request:', error);
    return throwError(() => error);
  }

  getApi(url: string, params: any): Promise<any> {

    return new Promise((resolve, reject) => {

      // this.http.get(CONFIG.SERVER_URL + url, { params: params })
      this.http.get(this._serverUrl + url, { params: params })
        .pipe(
          map((res: any) => res),
          catchError(this.handleError)
        ).subscribe({
          next: (res) => resolve(res),
          error: (error) => reject(error),
        });
    });
  }

  appendCommonParameters(data: any) {
    if (data == undefined || !data) data = {};
    return data;
  }

  postApi(url: any, data: any, headers:any) {
    headers = new Headers();
    headers.append('Content-Type', 'application/json');

    // let options = new RequestOptions({ headers: headers });
    // if (!headers || !headers.get('Content-Type')) {

    //   headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    // }
    headers.append("Access-Control-Allow-Origin", "*");
    headers.append("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
    headers.append("Access-Control-Max-Age", "3600");
    headers.append("Access-Control-Allow-Headers", "x-requested-with, authorization, cache-control");
    headers.append("Access-Control-Expose-Headers", "Authorization");

    data = this.appendCommonParameters(data);

    return new Promise((resolve, reject) => {
      // this.http.post(CONFIG.SERVER_URL + url, JSON.stringify(data), { headers: headers })
      this.http.post(this._serverUrl + url, JSON.stringify(data), { headers: headers })
        .pipe(
          map((res: any) => res),
          catchError(this.handleError)
        ).subscribe({
          next: (res) => resolve(res),
          error: (error) => reject(error),
        });
    });
  }
}
