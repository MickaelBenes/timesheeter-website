import { Component, OnInit } from '@angular/core';

import { Activity } from './domain/Activity';
import { ActivityService } from './service/activity.service';

@Component({
	selector: 'ts-app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

	title		= 'Activities';
	redmine		= 'http://redmine.cross-systems.ch/issues/';
	displayForm	= false;

	activities: Activity[];
	selectedActivity: Activity;

	constructor( private activityService: ActivityService ) {}

	ngOnInit(): void {
		this.getActivities();
	}

	toggleForm(): void {
		if ( this.displayForm === false ) {
			this.displayForm = true;
		}
		else {
			this.displayForm = false;
		}
	}

	getActivities(): void {
		this.activityService.getActivities()
			.then( activities => this.activities = activities );
	}

	onSelect( activity: Activity ): void {
		this.selectedActivity = activity;
	}

	create( title, activityType, activityTicket ): void {
		const activity = new Activity( title, activityType, activityTicket );

		this.activityService.create( activity )
			.then(newActivity => {
				this.activities.push( newActivity );
				this.toggleForm();
			});
	}

}
