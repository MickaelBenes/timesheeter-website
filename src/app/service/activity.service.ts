import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Activity} from '../domain/Activity';
import {Observable} from 'rxjs/Observable';
import {catchError, tap} from 'rxjs/operators';

@Injectable()
export class ActivityService {

	private endpoint	= 'http://localhost:50000/activities';
	private httpOpts	= {
		headers: new HttpHeaders({
			'Authorization': 'Basic dXNlcjpwYXNz',
			'Content-Type': 'application/json'
		}),
		withCredentials: true
	};

	constructor(private http: HttpClient) {}

	private handleError(error: any): Promise<any> {
		console.error('An error occured : ', error);

		return Promise.reject(error.message || error);
	}

	getActivities(): Promise<Activity[]> {
		return this.http.get(this.endpoint, this.httpOpts)
			.toPromise()
			.then(response => response as Activity[])
			.catch(this.handleError);
	}

	getActivity(id: number): Promise<Activity> {
		const url = `${ this.endpoint }/${ id }`;

		return this.http.get(url, this.httpOpts)
			.toPromise()
			.then(response => response as Activity)
			.catch(this.handleError);
	}

	create(activity: Activity): Promise<Activity> {
		return this.http.post(this.endpoint, JSON.stringify(activity), this.httpOpts)
			.toPromise()
			.then(response => response as Activity)
			.catch(this.handleError);
	}

	stop(id: number): Promise<Activity> {
		const url = `${ this.endpoint }/${ id }/stop`;

		return this.http.post(url, null, this.httpOpts)
			.toPromise()
			.then(response => response as  Activity)
			.catch(this.handleError);
	}

	update(id: number, activity: Activity): Promise<Activity> {
		const url = `${ this.endpoint }/${ id }`;

		return this.http.patch(url, JSON.stringify(activity), this.httpOpts)
			.toPromise()
			.then(response => response as Activity)
			.catch(this.handleError);
	}

	delete(id: number): Promise<void> {
		const url = `${ this.endpoint }/${ id }`;

		return this.http.delete(url, this.httpOpts)
			.toPromise()
			.then(() => null)
			.catch(this.handleError);
	}

	duplicate(id: number): Promise<Activity> {
		const url = `${ this.endpoint }/${ id }/duplicate`;

		return this.http.post(url, null, this.httpOpts)
			.toPromise()
			.then(response => response as Activity)
			.catch(this.handleError);
	}

	getTotalTime(): Promise<string> {
		const url = `${ this.endpoint }/totalTime`;

		return this.http.get(url, this.httpOpts)
			.toPromise()
			.then(response => {
				return response ? response['totalTime'] : '';
			})
			.catch(this.handleError);
	}

	searchActivities(searchTerms: string): Observable<Activity[]> {
		if (!searchTerms.trim() || searchTerms == 'clearSearch') {
			return this.http.get<Activity[]>(this.endpoint, this.httpOpts);
		}

		const url = `${this.endpoint}/search/${searchTerms}`;
		return this.http.get<Activity[]>(url, this.httpOpts).pipe(
			tap(_ => console.log(`found activities matching "${searchTerms}"`, _)),
			catchError(this.handleError)
		);
	}

}
