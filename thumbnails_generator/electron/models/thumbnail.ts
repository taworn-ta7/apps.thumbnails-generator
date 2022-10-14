export enum ErrorEnumType {
	cantOpenImage = 1,
	cantCreateThumbImage = 2,
	cantSaveImage = 3,
	alreadyExists = 4,
}

/**
 * Thumbnail building item
 */
export class Thumbnail {
	/**
	 * Source file to read
	 */
	public source: string = ''

	/**
	 * Target file to write
	 */
	public target: string | null = null

	/**
	 * Result after processing
	 */
	public ok: boolean | null = null

	/**
	 * Error message, if not ok
	 */
	public error: ErrorEnumType | null = null

	/// Constructor
	constructor(source: string) {
		this.source = source
	}

}
