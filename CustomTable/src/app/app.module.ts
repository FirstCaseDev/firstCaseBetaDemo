import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { FilterPipe } from './home/filter.pipe';

@NgModule({
  declarations: [AppComponent, HomeComponent, FilterPipe],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule],
  providers: [Title],
  bootstrap: [AppComponent],
})
export class AppModule {}
