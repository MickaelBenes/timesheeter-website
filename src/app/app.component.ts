import { Component, OnInit, OnDestroy } from '@angular/core';

import { Activity } from './domain/Activity';
import { ActivityService } from './service/activity.service';
import { ActivityUtils } from './utils/ActivityUtils';

import * as $ from 'jquery';
import {ActivityType} from './domain/ActivityType';

@Component({
	selector: 'ts-app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, OnDestroy {

	title				= 'Activities';
	redmine				= 'http://redmine.cross-systems.ch/issues/';
	displayForm			= false;
	durationInterval	= null;
	getDateAsString		= ActivityUtils.getDateAsString;

	activityTypes: Array<ActivityType> = [
		new ActivityType( 'Redmine', 'Redmine' )
	];
	activities: Activity[];
	selectedActivity: Activity;

	constructor( private activityService: ActivityService ) {
		this.durationInterval = setInterval( () => this.refreshActivitiesDuration(), 1000 );
	}

	ngOnInit(): void {
		this.getActivities();
	}

	ngOnDestroy(): void {
		clearInterval( this.durationInterval );
	}

	onSelect( activity: Activity ): void {
		if ( this.selectedActivity === activity ) {
			this.selectedActivity = null;
		}
		else {
			this.selectedActivity = activity;
		}
	}

	getActivities(): void {
		this.activityService.getActivities()
			.then( activities => this.activities = activities );
	}

	create( title, activityType, activityTicket ): void {
		this.stopActiveActivities();

		const activity = new Activity( title.trim(), activityType, activityTicket );

		this.activityService.create( activity )
			.then(newActivity => {
				this.activities.push( newActivity );
				this.toggleForm();
				this.selectedActivity = null;
			});
	}

	update( title, activityType, activityTicket ): void {
		const activity = new Activity( title.trim(), activityType, activityTicket );

		this.activityService.update( this.selectedActivity.id, activity )
			.then(updatedAct => {
				const indexOldAct				= this.activities.indexOf( this.selectedActivity );
				this.activities[ indexOldAct ]	= updatedAct;
				this.selectedActivity			= null;
			});
	}

	stop( id: number ): void {
		this.activityService.stop( id )
			.then(activity => {
				const indexOldAct = this.activities.findIndex( act => act.id === activity.id );
				this.activities[ indexOldAct ] = activity;
				this.selectedActivity = null;
			});
	}

	delete( id: number ): void {
		this.activityService.delete( id )
			.then(() => {
				this.activities	= this.activities.filter( a => a.id !== id );

				if ( this.selectedActivity.id === id ) {
					this.selectedActivity = null;
				}
			});
	}

	duplicate( id: number ): void  {
		this.stopActiveActivities();

		this.activityService.duplicate( id )
			.then(activity => {
				this.activities.push( activity );
			});
	}

	private toggleForm(): void {
		if ( this.displayForm === false ) {
			this.displayForm = true;
		}
		else {
			this.displayForm = false;
		}
	}

	private refreshActivitiesDuration(): void {
		if ( this.activities != undefined && this.activities.length > 0 ) {
			this.activities.forEach(activity => {
				if ( activity.stopTime === null ) {
					activity.duration = ActivityUtils.getElapsedTimeAsString(activity);
				}
			});
		}
	}

	private stopActiveActivities(): void {
		this.activities.forEach(activity => {
			if ( activity.stopTime === null ) {
				this.stop( activity.id );
			}
		});
	}

}
