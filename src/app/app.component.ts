import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Activity } from './domain/Activity';
import { ActivityService } from './service/activity.service';

@Component({
	selector: 'ts-app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

	title	= 'Activities';
	redmine	= 'http://redmine.cross-systems.ch/issues/';

	activities: Activity[];
	selectedActivity: Activity;

	constructor( private activityService: ActivityService ) {}

	ngOnInit(): void {
		this.getActivities();
	}

	getActivities(): void {
		this.activityService.getActivities()
			.then( activities => this.activities = activities );
	}

	onSelect( activity: Activity ): void {
		this.selectedActivity = activity;
	}

}
