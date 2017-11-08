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

	constructor( private activityService: ActivityService ) {
		setInterval( () => this.refreshActivitiesDuration(), 1000 );
	}

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

	refreshActivitiesDuration(): void {
		this.activities.forEach( activity => {
			if ( activity.stopTime === null ) {
				const now = new Date();
				const startTime = new Date(
					activity.startTime.year,
					activity.startTime.monthValue - 1,
					activity.startTime.dayOfMonth,
					activity.startTime.hour,
					activity.startTime.minute,
					activity.startTime.second
				);
				const difference = now.getTime() - startTime.getTime();
				const seconds = Math.floor(difference / 1000);
				const minutes = Math.floor(seconds / 60);
				const hours = Math.floor(minutes / 60);
				const hoursCur = hours % 60;
				const minutesCur = minutes % 60;
				const secondsCur = seconds % 60;

				function formatTimeUnit(unit: number): string {
					if (unit.toString().length === 1) {
						return '0' + unit;
					}

					return unit.toString();
				}

				activity.duration = formatTimeUnit(hoursCur) + ':' + formatTimeUnit(minutesCur) + ':' + formatTimeUnit(secondsCur);
			}
		});
	}

}
