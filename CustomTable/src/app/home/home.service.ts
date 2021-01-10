import { Injectable } from '@angular/core';
import { WebService } from '../web.service';

import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  constructor(private webService: WebService) {}

  getLists() {
    return this.webService.get('home');
  }
}
