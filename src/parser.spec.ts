import {GenomeDiffParser} from './parser';
import {Metadata, Record} from './records';

describe('GenomeDiffParser.parse()', () => {
	let version;
	let author;
	let snp;
	let ra;
	
	beforeEach(function() {
		version = new Metadata('GENOME_DIFF', '1.0');
		author = new Metadata('AUTHOR', 'test');
		snp = new Record('SNP', 1, [23423], {new_seq: 'A', seq_id: 'NC_000913', position: 223, gene_name: 'mhpE'});
		ra = new Record('RA', 2, [], {new_base: 'A', frequency: 0.1366, position: 223, seq_id: 'NC_000913', insert_position: 0, ref_base: 'G'});
	});
  
	it('should correctly parse a genomediff string', () => {
		let str =
			'#=GENOME_DIFF	1.0' + '\n' +
			'#=AUTHOR test' + '\n' +
			'SNP	1	23423	NC_000913	223	A	gene_name=mhpE' + '\n' +
			'RA	2		NC_000913	223	0	G	A	frequency=0.1366';
		
		let records = GenomeDiffParser.parse(str);
		
		expect(records.length).toBe(4);
		
		for (let record of [snp, ra, version, author]) {
			expect(records).toContain(record);
		}
	});
	
	it('should parse the dot for missing parent ids', () => {

		let str =
			'#=GENOME_DIFF	1.0' + '\n' +
			'#=AUTHOR test' + '\n' +
			'SNP	1	23423	NC_000913	223	A	gene_name=mhpE' + '\n' +
			'RA	2	.	NC_000913	223	0	G	A	frequency=0.1366';
		
		let records = GenomeDiffParser.parse(str);
		
		expect(records.length).toBe(4);
		
		for (let record of [snp, ra, version, author]) {
			expect(records).toContain(record);
		}
	});
});