import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

	readonly redmine: string	= 'http://redmine.cross-systems.ch/issues/';
	readonly api: string		= 'http://localhost:50000/activities';
	readonly headers: HttpHeaders;

	public activities	= [];

	constructor( private http: HttpClient ) {
		this.headers = new HttpHeaders({
			'Authorization': 'Basic dXNlcjpwYXNz',
			'Content-Type': 'application/json'
		});
	}

	ngOnInit(): void {
		this.http.get<object[]>( this.api, {headers: this.headers, withCredentials: true} )
			.subscribe(
				data => {
					data.forEach(activity => {
						console.log( activity['activity'] );
						this.activities.push( activity['activity'] );
					});
				},
				err => {
					console.log( err );
				}
			);
	}

}
