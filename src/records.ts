export class Metadata {
	name: string;
	value: any;
	constructor(name: string, value: any) {
		this.name = name;
		this.value = value;
	}
}

export enum RecordType {
	MCDELMutationalEvent = 5,
    MutationalEvent = 3,
    Evidence = 2,
    Validation = 4
}

export class Record extends Object {
	type: string;
	id: number;
	parent_ids: number[];
    document: any;
    
	constructor(type: string, id: number, parent_ids: number[] = [], document = null, extra: any = {}) {
		super();
		this.type = type;
		this.id = id;
		this.parent_ids = parent_ids;
        this.document = document;
		if (extra !== null && typeof extra === 'object') {
			for (let key of Object.keys(extra)) {
				this[key] = extra[key];
			}
		}
	}
    
    get parents(): Record[] {
        if (this.document !== null &&  this.parent_ids.length) {
            return this.parent_ids.map((id) => this.document[id]);
        } else {
            return [];
        }
    }
	get attributes() {
		let result = {};
		for (let property of Object.keys(this)) {
			if (property !== 'type' && property !== 'id' && property !== 'parent_ids' && property !== 'document') {
				result[property] = this[property];	
			}
		}
		return result;
	}
    
	get(property: string) {
		if (this.parents.length) {
			for (let parent of this.parents) {
				if (parent.hasOwnProperty(property)) return parent[property];
			}
		}
		return null;
	}
	typedef() {
		return this.type.length;
	}
}
