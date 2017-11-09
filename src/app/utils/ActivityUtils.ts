import { Activity } from '../domain/Activity';
import { DateUtils } from './DateUtils';

export class ActivityUtils {

	static getDateAsString( activity: Activity ): string {
		return activity.startTime.year + '-'
			+ DateUtils.formatDateTimeUnit( activity.startTime.monthValue ) + '-'
			+ DateUtils.formatDateTimeUnit( activity.startTime.dayOfMonth );
	}

	static getElapsedTimeAsString( activity: Activity ): any {
		const now		= new Date();
		const startTime	= new Date(
			activity.startTime.year,
			activity.startTime.monthValue - 1,
			activity.startTime.dayOfMonth,
			activity.startTime.hour,
			activity.startTime.minute,
			activity.startTime.second
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
