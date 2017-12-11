import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';
import {ActivityService} from '../service/activity.service';
import {Activity} from '../domain/Activity';
import {ActivityUtils} from '../utils/ActivityUtils';

@Component({
	selector: 'ts-search',
	templateUrl: './search.component.html',
	styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

	private searchTerms = new Subject<string>();

	@Output() activityChange: EventEmitter<Activity[]> = new EventEmitter<Activity[]>();

	constructor(private service: ActivityService) {}

	ngOnInit(): void {
		this.searchTerms
			.pipe(
				debounceTime(300),
				distinctUntilChanged(),
				switchMap((term: string) => this.service.searchActivities(term))
			)
			.subscribe(items => {
				const activities: Activity[] = [];

				if (items.length > 0) {
					items.forEach(item => {
						const activity = ActivityUtils.wrapActivity(item);
						activities.push(activity);
					});
				}

				this.activityChange.emit(activities);
			});
	}

	search(terms: string): void {
		this.searchTerms.next(terms);
	}

	clearSearch(): void {

	}

}
