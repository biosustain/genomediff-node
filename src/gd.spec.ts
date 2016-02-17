import {Record} from './records';
import {GenomeDiff} from './gd'

describe('GenomeDiff.parse()', () => {
	let snp;
	let ra;
	
	beforeEach(function() {
		snp = new Record('SNP', 1, [23423], null, {seq_id: 'NC_000913', new_seq: 'A', position: 223});
		ra = new Record('RA', 2, [], null, {position: 223, seq_id: 'NC_000913', insert_position: 0, new_base: 'A', ref_base: 'G'});
	});
  
	it('should correctly parse a genomediff string and return a GD document', () => {
		let str =
			'#=GENOME_DIFF	1.0' + '\n' +
			'#=AUTHOR test' + '\n' +
			'SNP	1	23423	NC_000913	223	A' + '\n' +
			'RA	2		NC_000913	223	0	G	A';
		
		let gd = GenomeDiff.parse(str);
		
		expect(gd.metadata).toEqual({
			GENOME_DIFF: '1.0',
			AUTHOR: 'test'
		});
		
		expect(gd.mutations.length).toBe(1);
		expect(gd.evidence.length).toBe(1);
		
        expect(gd.mutations.find((mutation) => mutation.type === snp.type)).not.toBeUndefined();
        expect(gd.evidence.find((evidence) => evidence.type === ra.type)).not.toBeUndefined();
	});
	
	describe('#values()', () => {
		
		it('should return an iterable', () => {
			
			let str =
				'#=GENOME_DIFF	1.0' + '\n' +
				'#=AUTHOR test' + '\n' +
				'SNP	1	2	NC_000913	223	A' + '\n' +
				'RA	2		NC_000913	223	0	G	A';
			
			let gd: GenomeDiff = GenomeDiff.parse(str);
			
			for (let record of gd.values()) {
				expect(record instanceof Record).toBe(true);
			}
			
		});
	});
});