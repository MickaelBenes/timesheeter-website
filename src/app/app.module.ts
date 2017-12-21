import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatDatepickerModule} from '@angular/material';
import {MatMomentDateModule} from '@angular/material-moment-adapter';
import {AppComponent} from './app.component';
import {PaginationComponent} from './pagination/pagination.component';
import {SearchComponent} from './search/search.component';
import {ActivityService} from './service/activity.service';

@NgModule({
	declarations: [AppComponent, PaginationComponent, SearchComponent],
	imports: [
		BrowserModule, HttpClientModule, BrowserAnimationsModule,
		MatDatepickerModule, MatMomentDateModule
	],
	providers: [ActivityService],
	bootstrap: [AppComponent]
})

export class AppModule {}
