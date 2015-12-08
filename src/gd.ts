import {GenomeDiffParser} from './parser';
import {Metadata, Record, RecordType} from './records';

export class GenomeDiff {
	metadata: any = {};
	mutations: Record[] = [];
	evidence: Record[] = [];
	validation: Record[] = [];
	length: number;
	constructor(length?: number) {
		this.length = length || 0;
	}
	// Note that this only works in the browser
	[Symbol.iterator]() {
		let items = new Array(this.length);
		var props = Object.keys(this);
    	for (let property of props) {
			if (property !== 'metadata' && property !== 'mutations' && property !== 'evidence' && property !== 'validation') {
				items[property] = this[property];
			}
		}
        return items;
	}
	parents(id): Record[] {
		let record = this[id];
		if (record && record.parent_ids.length) {
			return record.parent_ids.map((id) => this[id]);
		} else {
			return [];
		}
	}
	static parse(str): GenomeDiff {
		let records = GenomeDiffParser.parse(str);
		let length = records.filter((record) => record instanceof Metadata !== true).length;
		let gd = new GenomeDiff(length);
		
		for (let record of records) {
			if (record instanceof Metadata) {
				gd.metadata[record.name] = record.value;
			} else {
				switch (record.typedef()) {
					case RecordType.MutationalEvent:
						gd.mutations.push(record);
						break;
					case RecordType.Evidence:
						gd.evidence.push(record);
						break;
					case RecordType.Validation:
						gd.validation.push(record);
						break;
					default:
						break;
				}
				gd[record.id] = record;
			}
		}
		
		return gd;
	}
}