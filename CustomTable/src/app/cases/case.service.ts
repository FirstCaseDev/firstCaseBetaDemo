import { Injectable } from '@angular/core';

import { WebService } from '../web.service';

import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CaseService {
  constructor(private webService: WebService) {}

  getCases() {
    return this.webService.get('cases');
  }
  getSpecificCase(object_id: string) {
    return this.webService.get(`cases/_id=${object_id}`);
  }
  getSearchedCases(query: string, page: number, limit: number) {
    return this.webService.get(
      `cases/query=${query}?page=${page}&limit=${limit}`
    );
  }
  getLists() {
    return this.webService.get('lists');
  }
}
