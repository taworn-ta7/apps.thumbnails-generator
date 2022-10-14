export enum ErrorEnumType {
	cantOpenImage,
	cantSaveImage,
	alreadyExists,
}

/**
 * Thumbnail building item
 */
export class Thumbnail {
	/**
	 * Source file to read
	 */
	public source: string = '';

	/** 
	 * Source file name
	 */
	public sourceName: string = '';

	/** 
	 * Source file size
	 */
	public sourceSize: number = 0;

	/**
	 * Target file to write
	 */
	public target: string | null = null;

	/**
	 * Result after processing
	 */
	public ok: boolean | null = null;

	/**
	 * Error message, if not ok
	 */
	public error: ErrorEnumType | null = null;

	/// Constructor
	constructor(source: string) {
		this.source = source
	}

}
