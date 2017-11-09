export class DateUtils {

	static formatDateTimeUnit( unit: number ): string {
		if ( unit.toString().length === 1 ) {
			return '0' + unit;
		}

		return unit.toString();
	}

}
