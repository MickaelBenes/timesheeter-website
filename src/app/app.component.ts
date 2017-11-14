import { Component, OnInit, OnDestroy } from '@angular/core';

import { Activity } from './domain/Activity';
import { ActivityService } from './service/activity.service';
import { ActivityUtils } from './utils/ActivityUtils';

import {ActivityType} from './domain/ActivityType';

import { Observable } from 'rxjs';

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

	offset: number			= 0;
	limit: number			= 15;
	nbActivities: number	= 0;

	activities: Activity[];
	pagedActivities: Activity[];
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
			.then(activities => {
				this.activities		= activities;
				this.nbActivities	= this.activities.length;
				this.buildPagedActivities();
			});
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

	onPageChange( offset ) {
		this.offset = offset;

		this.buildPagedActivities();
	}

	private buildPagedActivities(): void {
		Observable.from( this.activities ) // Create observable from your array
			.skip( this.offset ) // Skip n elements, where n is your offset (eg. 30 if you want to retrieve page 3 with a limit of 15)
			.take( this.limit ) // Take only n elements, where n is your limit (eg. 15 elements)
			.toArray() // Create an array of all elements
			.subscribe( pagedActivities => this.pagedActivities = pagedActivities );
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
