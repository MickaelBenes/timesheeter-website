import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
	selector: 'ts-activity-pagination',
	templateUrl: 'pagination.component.html',
	styleUrls: ['pagination.component.css']
})

export class PaginationComponent implements OnInit, OnChanges {

	@Input() offset	= 0;
	@Input() limit	= 1;
	@Input() size	= 1;
	@Input() range	= 3;

	@Output() pageChange: EventEmitter<number> = new EventEmitter<number>();

	currentPage: number;
	totalPages: number;
	pages: Observable<number[]>;

	constructor() {}

	ngOnInit(): void {
		this.getPages( this.offset, this.limit, this.size );
	}

	ngOnChanges(): void {
		this.getPages( this.offset, this.limit, this.size );
	}

	getPages( offset: number, limit: number, size: number ): void {
		this.currentPage	= this.getCurrentPage( offset, limit );
		this.totalPages		= this.getTotalPages( limit, size );
		this.pages			= Observable.range(-this.range, this.range * 2 + 1)
			.map(offset => this.currentPage + offset)
			.filter(page => this.isValidPageNumber(page, this.totalPages))
			.toArray();
	}

	getCurrentPage( offset: number, limit: number ): number {
		return Math.floor( offset / limit ) + 1;
	}

	getTotalPages( limit: number, size: number ): number {
		return Math.ceil( Math.max(size, 1) / Math.max(limit, 1) );
	}

	selectPage( page: number, event ) {
		event.preventDefault();

		if ( this.isValidPageNumber(page, this.totalPages) ) {
			this.pageChange.emit( (page - 1) * this.limit );
		}
	}

	private isValidPageNumber( page: number, totalPages: number ): boolean {
		return page > 0 && page <= totalPages;
	}

}
