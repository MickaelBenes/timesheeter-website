import {Injectable} from '@angular/core';
import {ActivityService} from './activity.service';
import {HttpClient} from '@angular/common/http';
import { Activity } from '../domain/Activity';
import {Observable} from 'rxjs/Observable';
import {of} from 'rxjs/observable/of';
import {catchError, tap} from 'rxjs/operators';

@Injectable()
export class ActivitySearchService extends ActivityService {

	protected endpoint = this.endpoint + '/search/';

	constructor(protected http: HttpClient) {
		super(http);
	}

	search(searchTerms: string): Observable<Activity[]> {
		if (!searchTerms.trim()) {
			return of([]);
		}

		return this.http.get<Activity[]>(this.endpoint + searchTerms).pipe(
			tap(_ => console.log(`found activities matching "${searchTerms}"`)),
			catchError(this.handleError)
		);
	}

}
