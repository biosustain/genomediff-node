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
	parents: Record[];
	constructor(type: string, id: number, parent_ids: number[] = [], extra: any = {}, document = null) {
		super();
		this.type = type;
		this.id = id;
		this.parent_ids = parent_ids;
		if (extra !== null && typeof extra === 'object') {
			for (let key of Object.keys(extra)) {
				this[key] = extra[key];
			}
		}
		Object.defineProperty(this, 'parents', {
			get: () => {
				if (document !== null &&  this.parent_ids.length) {
					return this.parent_ids.map((id) => document[id]);
				} else {
					return [];
				}
			}
		});
	}
	get extra_fields() {
		let result = {};
		for (let property of Object.keys(this)) {
			if (property !== 'type' && property !== 'id' && property !== 'parent_ids') {
				result[property] = this[property];	
			}
		}
		return result;
	}
	typedef() {
		return this.type.length;
	}
}
