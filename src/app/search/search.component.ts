import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';
import {ActivityService} from '../service/activity.service';
import {Activity} from '../domain/Activity';

@Component({
	selector: 'ts-search',
	templateUrl: './search.component.html',
	styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

	private searchTerms = new Subject<string>();

	activities$: Observable<Activity[]>;

	constructor(private service: ActivityService) {}

	ngOnInit(): void {
		console.log('------------------------ INIT ------------------------');
		this.activities$ = this.searchTerms.pipe(
			debounceTime(300),
			distinctUntilChanged(),
			switchMap((term: string) => {
				console.log(`searchActivities(${term})`);
				return this.service.searchActivities(term);
			})
		);
		console.log('---------------------- END INIT ----------------------');
	}

	search(terms: string): void {
		if (terms.length > 2) {
			console.log('searching: ' + terms);

			this.searchTerms.next(terms);
		}
	}

}
