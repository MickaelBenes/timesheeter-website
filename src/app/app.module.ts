import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';

import { ActivityService} from './service/activity.service';
import { PaginationComponent } from './pagination/pagination.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
	declarations: [
		AppComponent,
		PaginationComponent
	],
	imports: [
		BrowserModule, HttpClientModule, BrowserAnimationsModule
	],
	providers: [ ActivityService ],
	bootstrap: [ AppComponent ]
})

export class AppModule {

}
