import {GenomeDiffParser} from './parser';
import {Metadata, Record, RecordType} from './records';

export default class GenomeDiff extends Object {
	metadata: any = {};
	mutations: Record[] = [];
	evidence: Record[] = [];
	validation: Record[] = [];
	parents(id): Record[] {
		let record = this[id];
		if (record && record.parent_ids.length) {
			return record.parent_ids.map((id) => this[id]);
		} else {
			return [];
		}
	}
	static parse(str): GenomeDiff {
		let gd = new GenomeDiff();
		
		for (let record of GenomeDiffParser.parse(str)) {
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