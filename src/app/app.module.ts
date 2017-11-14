import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';

import { ActivityService} from './service/activity.service';
import { PaginationComponent } from './pagination/pagination.component';

@NgModule({
	declarations: [
		AppComponent,
		PaginationComponent
	],
	imports: [
		BrowserModule, HttpClientModule
	],
	providers: [ ActivityService ],
	bootstrap: [ AppComponent ]
})

export class AppModule {

}
