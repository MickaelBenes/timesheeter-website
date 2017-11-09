import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import 'rxjs/add/operator/toPromise';

import { Activity } from '../domain/Activity';

@Injectable()
export class ActivityService {

	private apiUrl		= 'http://localhost:50000/activities';
	private httpOpts	= {
		headers: new HttpHeaders({
			'Authorization': 'Basic dXNlcjpwYXNz',
			'Content-Type': 'application/json'
		}),
		withCredentials: true
	};

	constructor( private http: HttpClient ) {}

	private handleError( error: any ): Promise<any> {
		console.error( 'An error occured : ', error );

		return Promise.reject( error.message || error );
	}

	getActivities(): Promise<Activity[]> {
		return this.http.get( this.apiUrl, this.httpOpts )
			.toPromise()
			.then( response => response as Activity[] )
			.catch( this.handleError );
	}

	getActivity( id: number ): Promise<Activity> {
		const url = `${ this.apiUrl }/${ id }`;

		return this.http.get( url, this.httpOpts )
			.toPromise()
			.then( response => response as Activity )
			.catch( this.handleError );
	}

	create( activity: Activity ): Promise<Activity> {
		return this.http.post( this.apiUrl, JSON.stringify(activity), this.httpOpts )
			.toPromise()
			.then( response => response as Activity )
			.catch( this.handleError );
	}

	stop( id: number ): Promise<Activity> {
		const url = `${ this.apiUrl }/${ id }/stop`;

		return this.http.post( url, null, this.httpOpts )
			.toPromise()
			.then( response => response as  Activity )
			.catch( this.handleError );
	}

	update( id: number, activity: Activity ): Promise<Activity> {
		const url = `${ this.apiUrl }/${ id }`;

		return this.http.patch( this.apiUrl, JSON.stringify(activity), this.httpOpts )
			.toPromise()
			.then( response => response as Activity )
			.catch( this.handleError );
	}

	delete( id: number ): Promise<void> {
		const url = `${ this.apiUrl }/${ id }`;

		return this.http.delete( url, this.httpOpts )
			.toPromise()
			.then( () => null )
			.catch( this.handleError );
	}

	duplicate( id: number ): Promise<Activity> {
		const url = `${ this.apiUrl }/startFrom/${ id }`;

		return this.http.post( url, null, this.httpOpts )
			.toPromise()
			.then( response => response as Activity )
			.catch( this.handleError );
	}

}
