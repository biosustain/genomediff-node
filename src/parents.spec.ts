import {Record} from './records';
import {GenomeDiff} from './gd'

describe('Record#parents', () => {
		
	it('should resolve the parent ids records based on it\'s own property "parent_ids"', () => {
		
		let str =
			'#=GENOME_DIFF	1.0' + '\n' +
			'#=AUTHOR test' + '\n' +
			'SNP	1	2	NC_000913	223	A' + '\n' +
			'RA	2		NC_000913	223	0	G	A';
		
		let gd: GenomeDiff = GenomeDiff.parse(str);
		
		expect(gd[1].parents).toContain(gd[2]);
		
	});
});