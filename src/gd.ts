import {GenomeDiffParser} from './parser';
import {Metadata, Record, RecordType} from './records';

export class GenomeDiff extends Object {
	metadata: any = {};
	mutations: Record[] = [];
	evidence: Record[] = [];
	validation: Record[] = [];
	values(): Record[] {
		let items = [];
		var props = Object.keys(this);
    	for (let property of props) {
			if (property !== 'metadata' && property !== 'mutations' && property !== 'evidence' && property !== 'validation' && property !== 'length') {
				items.push(this[property]);
			}
		}
        return items;
	}
	static parse(str): GenomeDiff {
		let gd = new GenomeDiff();
		
		for (let record of GenomeDiffParser.parse(str, gd)) {
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