import {Record} from './records';

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
});