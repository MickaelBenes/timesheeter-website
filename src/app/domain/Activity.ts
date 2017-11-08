export class Activity {

	public id: number;
	public title: string;
	public activityType: string;
	public activityTicket: string;
	public startTime;
	public stopTime;
	public duration: string;

	constructor( title, activityType, activityTicket ) {
		this.title			= title;
		this.activityType	= activityType;
		this.activityTicket	= activityTicket;
	}

	isActive(): boolean {
		return this.stopTime === null || this.stopTime === undefined;
	}

}
