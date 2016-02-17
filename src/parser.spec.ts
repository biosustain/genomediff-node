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
		snp = new Record('SNP', 1, [23423], null, {new_seq: 'A', seq_id: 'NC_000913', position: 223, gene_name: 'mhpE', total_cov: '39/41'});
		ra = new Record('RA', 2, [], null, {new_base: 'A', frequency: 0.1366, position: 223, seq_id: 'NC_000913', insert_position: 0, ref_base: 'G'});
	});
  
	it('should correctly parse a genomediff string', () => {
		let str =
			'#=GENOME_DIFF	1.0' + '\n' +
			'#=AUTHOR test' + '\n' +
			'SNP	1	23423	NC_000913	223	A	gene_name=mhpE	total_cov=39/41' + '\n' +
			'RA	2		NC_000913	223	0	G	A	frequency=0.1366';
		
		let records = GenomeDiffParser.parse(str);
		
		expect(records.length).toBe(4);
		
		for (let record of [snp, ra, version, author]) {
			expect(records).toContain(record);
		}
	});
	
	it('should parse MC records as a custom type MCDEL if not referenced by DEL with "parent_ids"', () => {
		
		let str =
			'#=GENOME_DIFF	1.0' + '\n' +
			'#=AUTHOR test' + '\n' +
			'SNP	1	23423	NC_000913	223	A	gene_name=mhpE	total_cov=39/41' + '\n' +
			'DEL	2	4	CP009273	2400028	9	gene_list=lrhA	gene_name=lrhA	gene_position=coding (85-93/939 nt)	gene_product=transcriptional repressor of flagellar, motility and chemotaxis genes	gene_strand=<	html_gene_name=<i>lrhA</i>&nbsp;&larr;	locus_tag=BW25113_2289' + '\n' +
			'RA	3	.	NC_000913	223	0	G	A	frequency=0.1366' + '\n' +
			'MC	4	.	CP009273	2400028	2400036	0	0	gene_list=lrhA	gene_name=lrhA	gene_position=coding (85-93/939 nt)	gene_product=transcriptional repressor of flagellar, motility and chemotaxis genes	gene_strand=<	html_gene_name=<i>lrhA</i>&nbsp;&larr;	left_inside_cov=0	left_outside_cov=102	locus_tag=BW25113_2289	right_inside_cov=0	right_outside_cov=101' + '\n' +
			'MC	5	.	CP009273	2732283	2733469	0	0	gene_list=tyrA,[aroF]	gene_name=tyrA–[aroF]	gene_product=tyrA, [aroF]	html_gene_name=<i>tyrA</i>–<i>[aroF]</i>	left_inside_cov=57	left_outside_cov=58	locus_tag=[BW25113_2600]–[BW25113_2601]	right_inside_cov=56	right_outside_cov=63';
		
		let records = GenomeDiffParser.parse(str);
		let MCDELRecords = records.filter((record) => record.type === 'MCDEL');
		
		expect(MCDELRecords.length).toBe(1);
		expect(MCDELRecords[0].size).toBe(1187);
	});
	
	it('should parse the dot for missing parent ids', () => {

		let str =
			'#=GENOME_DIFF	1.0' + '\n' +
			'#=AUTHOR test' + '\n' +
			'SNP	1	23423	NC_000913	223	A	gene_name=mhpE	total_cov=39/41' + '\n' +
			'RA	2	.	NC_000913	223	0	G	A	frequency=0.1366';
		
		let records = GenomeDiffParser.parse(str);
		
		expect(records.length).toBe(4);
		
		for (let record of [snp, ra, version, author]) {
			expect(records).toContain(record);
		}
	});
});