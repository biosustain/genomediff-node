import {Metadata, Record} from './records';

const METADATA_PATTERN = /^#=(\w+)\s+(.*)$/i;
const MUTATION_PATTERN = /^([A-Z]{2,4})\t(\d+)\t((\d+(,\s*\d+)*)|\.?)\t(.+)?$/i;

const TYPE_SPECIFIC_FIELDS = {
    // Mutational Event Types
    // http://barricklab.org/twiki/pub/Lab/ToolsBacterialGenomeResequencing/documentation/gd_format.html#mutational-event-types
    SNP: ['seq_id', 'position', 'new_seq'],
    SUB: ['seq_id', 'position', 'size', 'new_seq'],
    DEL: ['seq_id', 'position', 'size'],
    INS: ['seq_id', 'position', 'new_seq'],
    MOB: ['seq_id', 'position', 'repeat_name', 'strand', 'duplication_size'],
    AMP: ['seq_id', 'position', 'size', 'new_copy_number'],
    CON: ['seq_id', 'position', 'size', 'region'],
    INV: ['seq_id', 'position', 'size'],
    // Evidence Types
    // http://barricklab.org/twiki/pub/Lab/ToolsBacterialGenomeResequencing/documentation/gd_format.html#evidence-types
    RA: ['seq_id', 'position', 'insert_position', 'ref_base', 'new_base'],
    MC: ['seq_id', 'start', 'end', 'start_range', 'end_range'],
    JC: ['side_1_seq_id', 'side_1_position', 'side_1_strand', 'side_2_seq_id', 'side_2_position', 'side_2_strand', 'overlap'],
    UN: ['seq_id', 'start', 'end'],
    // Validation Types
    // http://barricklab.org/twiki/pub/Lab/ToolsBacterialGenomeResequencing/documentation/gd_format.html#validation-types
    CURA: ['expert'],
    FPOS: ['expert'],
    PHYL: ['gd'],
    TSEQ: ['seq_id', 'primer1_start', 'primer1_end', 'primer2_start', 'primer2_end'],
    PFLP: ['seq_id', 'primer1_start', 'primer1_end', 'primer2_start', 'primer2_end'],
    RFLP: ['seq_id', 'primer1_start', 'primer1_end', 'primer2_start', 'primer2_end', 'enzyme'],
    PFGE: ['seq_id', 'restriction_enzyme'],
    NOTE: ['note']
}

export class GenomeDiffParser {
    static parse(str, document = null): any[] {
        let lines = str.split('\n');
        let records = lines
            .filter((line) => line !== '')
            .map(function (line): any {
                
                // Metadata
                // http://barricklab.org/twiki/pub/Lab/ToolsBacterialGenomeResequencing/documentation/gd_format.html#metadata-lines
                if (line.indexOf('#=') === 0) {
                    let match = line.match(METADATA_PATTERN);
                    if (match) {
                        let name = match[1];
                        let value = match[2];
                        return new Metadata(name, value);
                    } else {
                        return null;
                    }
                } else {
                    let match = line.match(MUTATION_PATTERN);
                    
                    if (match) {
                        // Data
                        let type = match[1];
                        let id: number = parseInt(match[2], 10);
                        let parent_ids = match[3];
                        
                        if (parent_ids !== '.' && parent_ids !== '') {
                            parent_ids = parent_ids.split(',').map((id) => parseInt(id), 10);
                        } else {
                            parent_ids = [];
                        }
                        
                        let extra = match[6].split('\t');
                        let attrs = {};
                        
                        // Mutational Event Types
                        // Evidence Types
                        // Validation Types
                        for (let name of TYPE_SPECIFIC_FIELDS[type]) {
                            let value = extra.shift();
                            attrs[name] = convert(value);
                        }
                        
                        // Other properties
                        for (let property of extra) {
                            let kv = property.split('=');
                            let key = kv[0];
                            let value = kv[1];
                            attrs[key] = convert(value);
                        }
                        
                        return new Record(type, id, parent_ids, document, attrs);
                    }
                    
                    return null;
                }
                
            })
            .filter((record) => record !== null);
        
        return records;
    }
}

function convert(value: any): any {
    let float = Number(value);
    if (!isNaN(float) && typeof float === 'number') {
        return float;
    }
    if (value === '.' || value === '') {
        value = null; 
    }
    return value;
}