import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';

import { Activity } from './domain/Activity';
import { ActivityService } from './service/activity.service';
import { ActivityUtils } from './utils/ActivityUtils';

import * as $ from 'jquery';

@Component({
	selector: 'ts-app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, AfterViewInit, OnDestroy {

	title				= 'Activities';
	redmine				= 'http://redmine.cross-systems.ch/issues/';
	displayForm			= false;
	durationInterval	= null;
	getDateAsString		= ActivityUtils.getDateAsString;

	activities: Activity[];
	selectedActivity: Activity;

	constructor( private activityService: ActivityService ) {
		this.durationInterval = setInterval( () => this.refreshActivitiesDuration(), 1000 );
	}

	ngOnInit(): void {
		this.getActivities();
	}

	ngAfterViewInit(): void {
		// $( function() {
		// 	$( document ).on('click', function() {
		// 		$( '.activities tr' ).removeClass( 'selected' );
		// 	});
		//
		// 	$( '.activities td' ).on('click', function() {
		// 		$( '.activities tr' ).removeClass( 'selected' );
		// 		$( this ).parent().addClass( 'selected' );
		// 	});
		// });

		$(function() {
			$( '.activities tr' ).focusout(function() {
				$( this ).removeClass( 'selected' );
			});

		});
	}

	ngOnDestroy(): void {
		clearInterval( this.durationInterval );
	}

	toggleForm(): void {
		if ( this.displayForm === false ) {
			this.displayForm = true;
		}
		else {
			this.displayForm = false;
		}
	}

	onSelect( activity: Activity ): void {
		this.selectedActivity = activity;
	}

	getActivities(): void {
		this.activityService.getActivities()
			.then( activities => this.activities = activities );
	}

	create( title, activityType, activityTicket ): void {
		this.stopActiveActivities();

		const activity = new Activity( title, activityType, activityTicket );

		this.activityService.create( activity )
			.then(newActivity => {
				this.activities.push( newActivity );
				this.toggleForm();
				this.selectedActivity = null;
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
				const indexOldAct = this.activities.findIndex( act => act.id === id );
				this.activities.splice( indexOldAct, 1 );

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

	private refreshActivitiesDuration(): void {
		this.activities.forEach( activity => {
			if ( activity.stopTime === null ) {
				activity.duration = ActivityUtils.getElapsedTimeAsString( activity );
			}
		});
	}

	private stopActiveActivities(): void {
		this.activities.forEach(activity => {
			if ( activity.stopTime === null ) {
				this.stop( activity.id );
			}
		});
	}

}
