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
});