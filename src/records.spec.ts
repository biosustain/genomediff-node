import {Record} from './records';
import {GenomeDiff} from './gd'

describe('Record', () => {
	let snp;
	
	beforeEach(function() {
		snp = new Record('SNP', 1, [23423], {seq_id: 'NC_000913', new_seq: 'A', position: 223, test: 'more'});
	});
  
	it('should correctly construct a record object on instantiation', () => {
        expect('SNP').toEqual(snp.type);
		expect(1).toEqual(snp.id);
		expect('A').toEqual(snp.new_seq);
		expect('more').toEqual(snp.test);
	});
	
	describe('#extra_fields', () => {
		it('should return all extra fields excluding all base fileds (id, type, parent_ids)', () => {
			expect(snp.extra_fields).toEqual({
				seq_id: 'NC_000913',
				new_seq: 'A',
				position: 223,
				test: 'more'
			});
		});
	});
	
	describe('#parents', () => {
		
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
	
	describe('.get()', () => {
		
		it('should resolve the value of a property from the parent records', () => {
			
			let str =
				'#=GENOME_DIFF	1.0' + '\n' +
				'#=AUTHOR test' + '\n' +
				'SNP	1	2	NC_000913	223	A' + '\n' +
				'RA	2		NC_000913	223	0	G	A	frequency=0.1366';
			
			let gd: GenomeDiff = GenomeDiff.parse(str);
			let record1 = gd[1];
			let record2 = gd[2]; 
			
			expect(record1.get('frequency')).toBe(record2.frequency);
		});
	});
});