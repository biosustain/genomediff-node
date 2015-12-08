import {Record} from './records';
import {GenomeDiff} from './gd'

describe('GenomeDiff.parse()', () => {
	let snp;
	let ra;
	
	beforeEach(function() {
		snp = new Record('SNP', 1, [23423], {seq_id: 'NC_000913', new_seq: 'A', position: 223});
		ra = new Record('RA', 2, [], {position: 223, seq_id: 'NC_000913', insert_position: 0, new_base: 'A', ref_base: 'G'});
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
		
		expect(gd.mutations).toContain(snp);
		expect(gd.evidence).toContain(ra);
		
		expect(gd[1]).toEqual(snp);
		expect(gd[2]).toEqual(ra);
	});
	
	describe('#parents()', () => {
		
		it('should resolve the parents for the given id', () => {
			
			let str =
				'#=GENOME_DIFF	1.0' + '\n' +
				'#=AUTHOR test' + '\n' +
				'SNP	1	2	NC_000913	223	A' + '\n' +
				'RA	2		NC_000913	223	0	G	A';
			
			let gd: GenomeDiff = GenomeDiff.parse(str);
			
			expect(gd.parents(gd[1].id)).toContain(gd[2]);
			
		});
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
	})
	
});