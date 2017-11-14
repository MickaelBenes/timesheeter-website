import { Component, OnInit, OnChanges, Input, Output } from '@angular/core';

@Component({
	selector: 'ts-activity-pagination',
	templateUrl: 'pagination.template.html'
})

export class PaginationComponent implements OnInit, OnChanges {

	@Input() offset	= 0;
	@Input() limit	= 1;
	@Input() size	= 1;
	@Input() range	= 3;

	constructor() {}

	ngOnInit(): void {

	}

	ngOnChanges(): void {

	}

}
