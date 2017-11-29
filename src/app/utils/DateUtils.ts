export class DateUtils {

	static formatDateTimeUnit( unit: number ): string {
		return unit.toString().padStart( 2, '0' );
	}

}
