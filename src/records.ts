export class Metadata {
	name: string;
	value: any;
	constructor(name: string, value: any) {
		this.name = name;
		this.value = value;
	}
}

export enum RecordType {
    MutationalEvent = 3,
    Evidence = 2,
    Validation = 4
}

export class Record extends Object {
	type: string;
	id: number;
	parent_ids: number[];
	constructor(type: string, id: number, parent_ids: number[] = [], extra?: any) {
		super();
		this.type = type;
		this.id = id;
		this.parent_ids = parent_ids;
		if (extra !== null && typeof extra === 'object') {
			for (let key of Object.keys(extra)) {
				this[key] = extra[key];
			}
		}
	}
	typedef() {
		return this.type.length;
	}
}