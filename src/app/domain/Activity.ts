export class Activity {

	public id: number;
	public title: string;
	public activityType: string;
	public activityTicket: string;
	public startTime: object;
	public duration: string;

	constructor( title, activityType, activityTicket ) {
		this.title			= title;
		this.activityType	= activityType;
		this.activityTicket	= activityTicket;
	}

}
