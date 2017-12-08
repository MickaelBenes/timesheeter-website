import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';
import {ActivitySearchService} from '../service/activity-search.service';
import {Activity} from '../domain/Activity';

@Component({
	selector: 'ts-search',
	templateUrl: './search.component.html',
	styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

	private searchTerms = new Subject<string>();

	activities$: Observable<Activity[]>;

	constructor(private service: ActivitySearchService) {}

	ngOnInit(): void {
		this.activities$ = this.searchTerms.pipe(
			debounceTime(300),
			distinctUntilChanged(),
			switchMap((term: string) => this.service.search(term))
		);
	}

	search(searchTerms: string): void {
		// if ( searchTerms.length > 2 ) {
			console.log('searching: ' + searchTerms);
			console.log(this.activities$);

			this.searchTerms.next(searchTerms);
		// }
	}

}
