import {Component, DoCheck, KeyValueDiffers, OnDestroy, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

import {Observable} from 'rxjs';

import {Activity} from './domain/Activity';
import {ActivityService} from './service/activity.service';
import {ActivityUtils} from './utils/ActivityUtils';
import {ActivityType} from './domain/ActivityType';
import {animate, state, style, transition, trigger} from '@angular/animations';

import * as moment from 'moment';
import {Moment} from 'moment';
import {MatDatepickerInputEvent} from '@angular/material';

export const MY_FORMATS = {
	parse: {
		dateInput: 'LL',
	},
	display: {
		dateInput: 'L',
		monthYearLabel: 'MM YYYY',
		dateA11yLabel: 'L',
		monthYearA11yLabel: 'MM YYYY',
	},
};

@Component({
	selector: 'ts-app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css'],
	animations: [
		trigger('formActivity', [
			state( 'void', style({'width': 0, 'max-height': 0}) ),
			state( '*', style({'width': '100%', 'max-height': 250}) ),
			transition(
				'void <=> *',
				animate( '500ms ease-in' )
			)
		])
	],
	providers: [
		{provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
		{provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
		{provide: MAT_DATE_LOCALE, useValue: 'fr-FR'},
	]
})
export class AppComponent implements OnInit, OnDestroy, DoCheck {

	title								= 'Activities';
	date: FormControl					= new FormControl(moment().startOf('day'));
	activityUtils						= ActivityUtils;
	redmine								= 'http://redmine.cross-systems.ch/issues/';
	displayForm							= false;
	durationInterval					= null;
	offset: number						= 0;
	limit: number						= 15;
	nbActivities: number				= 0;
	activities: Activity[]				= [];
	pagedActivities: Activity[]			= [];
	activityTypes: Array<ActivityType>	= [
		new ActivityType( 'Redmine', 'Redmine' )
	];
	objDiffer: any;
	selectedActivity: Activity;
	totalTime: string;

	constructor( private activityService: ActivityService, private differs: KeyValueDiffers ) {
		this.durationInterval = setInterval( () => this.refreshActivitiesDuration(), 1000 );
	}

	ngOnInit(): void {
		this.objDiffer	= [];
		this.getActivities();
	}

	ngOnDestroy(): void {
		clearInterval( this.durationInterval );
	}

	ngDoCheck(): void {
		if (this.activities.length !== this.nbActivities) {
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

	onSelect(activity: Activity): void {
		this.displayForm = false;

		if ( this.selectedActivity === activity ) {
			this.selectedActivity = null;
		}
		else {
			this.selectedActivity = activity;
		}
	}

	onPageChange(offset): void {
		this.offset = offset;

		this.buildPagedActivities();
	}

	onSearch(activities: Activity[]): void {
		this.activities = activities;

		this.getWorkingTime(this.activities);
		this.onPageChange(0);
	}

	onDateChange(event: MatDatepickerInputEvent<Moment>) {
		this.date = new FormControl(event.value);

		console.log(this.date.value.format('DD-MM-YYYY HH:mm'), this.date.value.unix());

		this.getActivities();
		this.onPageChange(0);
	}

	getActivities(): void {
		// const dateStr = this.date.value.format('DD-MM-YYYY');
		this.activityService.getActivities(this.date.value.unix())
			.then(activities => {
				const activitiesTemp = [];

				activities.forEach(act => {
					const activity = ActivityUtils.wrapActivity(act);
					activitiesTemp.push(activity);
				});

				this.activities = activitiesTemp;
				this.activities.forEach(act => {
					this.objDiffer[act.id] = this.differs.find(act).create();
				});
				this.getWorkingTime();
			});
	}

	getActivity(): void {
		this.activityService.getActivity(1)
			.subscribe(activity => {
				console.log(activity);
			});
	}

	create( title, activityType, activityTicket ): void {
		this.stopActiveActivities();

		const activity = new Activity( title.trim(), activityType, activityTicket );

		this.activityService.create( activity )
			.then(act => {
				const activity = ActivityUtils.wrapActivity( act );

				this.activities.push( activity );
				this.toggleForm();

				this.objDiffer[ activity.id ] = this.differs.find( activity ).create();
			});
	}

	update( title, activityType, activityTicket ): void {
		const activity = new Activity( title.trim(), activityType, activityTicket );

		this.activityService.update( this.selectedActivity.id, activity )
			.then(act => {
				const activity					= ActivityUtils.wrapActivity( act );
				const indexOldAct				= this.activities.indexOf( this.selectedActivity );
				this.activities[ indexOldAct ]	= activity;
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
				this.activities[ indexOldAct ] = ActivityUtils.wrapActivity( activity );
			})
			.then( () => this.getWorkingTime() );
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
			})
			.then( () => this.getWorkingTime() );
	}

	duplicate( event, id: number ): void  {
		event.stopPropagation();
		this.stopActiveActivities();

		this.activityService.duplicate( id )
			.then(act => {
				const activity	= ActivityUtils.wrapActivity( act );

				this.activities.push( activity );
				this.objDiffer[ activity.id ] = this.differs.find( activity ).create();
			});
	}

	getWorkingTime(activities?: Activity[]) {
		this.activityService.getWorkingTime(activities)
			.subscribe(totalTime => {
				this.totalTime = totalTime;
			});
	}

	private buildPagedActivities(): void {
		Observable.from( this.activities ) // Create observable from your array
			.skip( this.offset ) // Skip n elements, where n is your offset (eg. 30 if you want to retrieve page 4 with a limit of 10)
			.take( this.limit ) // Take only n elements, where n is your limit (eg. 10 elements)
			.toArray() // Create an array of all elements
			.subscribe( pagedActivities => this.pagedActivities = pagedActivities );
	}

	private toggleForm(): void {
		this.displayForm		= !this.displayForm;
		this.selectedActivity	= null;
	}

	private refreshActivitiesDuration(): void {
		if ( this.activities !== null && this.activities.length > 0 ) {
			this.activities.forEach(activity => {
				if ( activity.isActive() ) {
					activity.duration = this.activityUtils.getElapsedTimeAsString( activity );
				}
			});
		}
	}

	private stopActiveActivities(): void {
		this.activities.forEach(activity => {
			if ( activity.isActive() ) {
				this.stop( null, activity.id );
			}
		});
	}

}
