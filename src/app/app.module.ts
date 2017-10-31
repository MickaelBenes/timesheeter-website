import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';

import { ActivityService} from './service/activity.service';

@NgModule({
	declarations: [
		AppComponent
	],
	imports: [
		BrowserModule, HttpClientModule
	],
	providers: [ ActivityService ],
	bootstrap: [ AppComponent ]
})

export class AppModule {

}
