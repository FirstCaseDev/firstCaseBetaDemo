import { Component, Input, OnInit } from '@angular/core';
import Case from '../models/case';
import { CaseService } from './case.service';

@Component({
  selector: 'app-cases',
  templateUrl: './cases.component.html',
  styleUrls: ['./cases.component.css'],
})
export class CasesComponent implements OnInit {
  rows: Case[] = [];
  query: string = '';
  results_count: number = 0;
  arrayOne: Array<number> = [];
  page: number = 1;
  limit: number = 5;

  constructor(private caseService: CaseService) {}

  ngOnInit(): void {}

  search_by_object_id() {
    this.caseService.getSpecificCase(this.query).subscribe((data: any) => {
      console.log(data.case_list);
      this.rows = data.case_list;
    });
    this.rows = [];
  }

  first_search() {
    this.page = 1;
    this.search();
  }

  search() {
    this.caseService
      .getSearchedCases(this.query, this.page, this.limit)
      .subscribe((data: any) => {
        console.log(data.case_list);
        console.log(data.result_count);
        this.rows = data.case_list;
        this.results_count = data.result_count;
      });

    this.createArray(this.results_count);
  }

  sendNextPage() {
    this.page = this.page + 1;
    this.search();
  }

  sendPreviousPage() {
    this.page = this.page - 1;
    this.search();
  }

  createArray(count: number) {
    this.arrayOne = new Array<number>(count);
  }
}
