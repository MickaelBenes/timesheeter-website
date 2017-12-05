import { Component, OnInit, OnDestroy, DoCheck, KeyValueDiffers } from '@angular/core';

import { Observable } from 'rxjs';

import { Activity } from './domain/Activity';
import { ActivityService } from './service/activity.service';
import { ActivityUtils } from './utils/ActivityUtils';
import { ActivityType } from './domain/ActivityType';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
	selector: 'ts-app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css'],
	animations: [
		trigger('formActivity', [
			state( 'void', style({'width': 0, 'max-height': 0}) ),
			state( '*', style({'width': '50%', 'max-height': 250}) ),
			transition(
				'void <=> *',
				animate( '500ms ease-in' )
			)
		])
	]
})

export class AppComponent implements OnInit, OnDestroy, DoCheck {

	title								= 'Activities';
	activityUtils						= ActivityUtils;
	redmine								= 'http://redmine.cross-systems.ch/issues/';
	displayForm							= false;
	durationInterval					= null;
	offset: number						= 0;
	limit: number						= 10;
	nbActivities: number				= 0;
	activities: Activity[]				= [];
	pagedActivities: Activity[]			= [];
	activityTypes: Array<ActivityType>	= [
		new ActivityType( 'Redmine', 'Redmine' )
	];
	objDiffer: any;
	selectedActivity: Activity;

	constructor( private activityService: ActivityService, private differs: KeyValueDiffers ) {
		this.durationInterval = setInterval( () => this.refreshActivitiesDuration(), 1000 );
	}

	ngOnInit(): void {
		this.objDiffer = [];
		this.getActivities()
			.then(() => {
				this.activities.forEach(act => {
					this.objDiffer[ act.id ] = this.differs.find( act ).create( null );
				});
			});
	}

	ngOnDestroy(): void {
		clearInterval( this.durationInterval );
	}

	ngDoCheck(): void {
		if ( this.activities.length !== this.nbActivities ) {
			const hasMoreActivities = this.activities.length > this.nbActivities;
			this.selectedActivity	= null;
			this.nbActivities		= this.activities.length;

			if ( this.nbActivities > 1 ) {
				if ( (this.nbActivities % this.limit === 1) && hasMoreActivities ) { // means we just created a new page
					this.offset += this.limit;
				}
				else if ( (this.nbActivities % this.limit === 0) && !hasMoreActivities ) { // means we just removed a page
					this.offset -= this.limit;
				}
			}

			this.buildPagedActivities();
		}
		else {
			this.activities.forEach(act => {
				const objDiffer = this.objDiffer[ act.id ];

				if ( objDiffer !== undefined ) {
					const objChanged = objDiffer.diff( act );

					if ( objChanged !== null && typeof objChanged === 'object' ) {
						this.buildPagedActivities();
					}
				}
			});
		}
	}

	onSelect( activity: Activity ): void {
		this.displayForm = false;

		if ( this.selectedActivity === activity ) {
			this.selectedActivity = null;
		}
		else {
			this.selectedActivity = activity;
		}
	}

	getActivities(): Promise<void> {
		return this.activityService.getActivities()
			.then(activities => {
				this.activities	= activities;
			});
	}

	create( title, activityType, activityTicket ): void {
		this.stopActiveActivities();

		const activity = new Activity( title.trim(), activityType, activityTicket );

		this.activityService.create( activity )
			.then(newActivity => {
				this.activities.push( newActivity );
				this.toggleForm();
				this.objDiffer[ newActivity.id ] = this.differs.find( newActivity ).create();
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

	stop( event, id: number ): void {
		if ( event !== null ) {
			event.stopPropagation();
		}

		this.activityService.stop( id )
			.then(activity => {
				const indexOldAct = this.activities.findIndex( act => act.id === activity.id );
				this.activities[ indexOldAct ] = activity;
			});
	}

	delete( event, id: number ): void {
		event.stopPropagation();

		this.activityService.delete( id )
			.then(() => {
				const delActIndex = this.activities.findIndex( a => a.id === id );
				this.activities.splice( delActIndex, 1 );
				this.objDiffer.splice( id, 1 );

				if ( this.selectedActivity !== null && this.selectedActivity.id === id ) {
					this.selectedActivity = null;
				}
			});
	}

	duplicate( event, id: number ): void  {
		event.stopPropagation();
		this.stopActiveActivities();

		this.activityService.duplicate( id )
			.then(activity => {
				this.activities.push( activity );
				this.objDiffer[ activity.id ] = this.differs.find( activity ).create();
			});
	}

	onPageChange( offset ) {
		this.offset = offset;

		this.buildPagedActivities();
	}

	private buildPagedActivities(): void {
		Observable.from( this.activities ) // Create observable from your array
			.skip( this.offset ) // Skip n elements, where n is your offset (eg. 30 if you want to retrieve page 4 with a limit of 10)
			.take( this.limit ) // Take only n elements, where n is your limit (eg. 10 elements)
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

		this.selectedActivity = null;
	}

	private refreshActivitiesDuration(): void {
		if ( this.activities !== null && this.activities.length > 0 ) {
			this.activities.forEach(activity => {
				if ( activity.stopTime === null ) {
					activity.duration = this.activityUtils.getElapsedTimeAsString( activity );
				}
			});
		}
	}

	private stopActiveActivities(): void {
		this.activities.forEach(activity => {
			if ( activity.stopTime === null ) {
				this.stop( null, activity.id );
			}
		});
	}

}
