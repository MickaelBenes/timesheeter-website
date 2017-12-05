import { Activity } from '../domain/Activity';
import { DateUtils } from './DateUtils';

export class ActivityUtils {

	static wrapActivity( actObj: Activity ): Activity {
		const activity		= new Activity( actObj.title, actObj.activityType, actObj.activityTicket );
		activity.id			= actObj.id;
		activity.startTime	= actObj.startTime;
		activity.stopTime	= actObj.stopTime;
		activity.duration	= actObj.duration;

		return activity;
	}

	static getDateAsString( activity: Activity ): string {
		return activity.startTime[ 0 ] + '-'
			+ DateUtils.formatDateTimeUnit( activity.startTime[1] ) + '-'
			+ DateUtils.formatDateTimeUnit( activity.startTime[2] );
	}

	static getDateTimeAsString( activity: Activity ): string {
		return this.getDateAsString( activity ) + ' '
			+ DateUtils.formatDateTimeUnit( activity.startTime[3] ) + ':'
			+ DateUtils.formatDateTimeUnit( activity.startTime[4] );
	}

	static getElapsedTimeAsString( activity: Activity ): any {
		const now		= new Date();
		const startTime	= new Date(
			activity.startTime[ 0 ],
			activity.startTime[ 1 ] - 1,
			activity.startTime[ 2 ],
			activity.startTime[ 3 ],
			activity.startTime[ 4 ],
			activity.startTime[ 5 ]
		);
		const difference	= now.getTime() - startTime.getTime();
		const seconds		= Math.floor( difference / 1000 );
		const minutes		= Math.floor( seconds / 60 );
		const hours			= Math.floor( minutes / 60 );
		const hoursCur		= hours % 60;
		const minutesCur	= minutes % 60;
		const secondsCur	= seconds % 60;

		return DateUtils.formatDateTimeUnit( hoursCur ) + ':'
			+ DateUtils.formatDateTimeUnit( minutesCur ) + ':'
			+ DateUtils.formatDateTimeUnit( secondsCur );
	}

}
