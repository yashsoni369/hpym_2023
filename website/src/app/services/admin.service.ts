import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  url: string = '';
  constructor(private http: HttpClient) {
    this.url = environment.applicationUrl;
  }

  getAll() {
    return this.http.get(this.url + '/regs');
  }

  deRegisterMember(body) {
    return this.http.post(this.url + '/regs/remove',body);
  }
}
