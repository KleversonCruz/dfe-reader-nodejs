import { ReportOptions } from '../interfaces/report-options';
import { ReportMapping } from '../mappings/report-mapping';
import { jsonParser } from '../utils/json-parser';
import { Dfes } from './dfes';

export class Report {
  constructor(private documents: Dfes) {}

  private options: ReportOptions = {
    delimiter: {
      wrap: '"',
      field: ',',
      eol: '\n',
    },
    trimHeaderFields: true,
    emptyFieldValue: '',
    keys: ReportMapping.getKeys(),
    excelBOM: true,
    preventCsvInjection: true,
    useLocaleFormat: true
  };

  private setKeys(keys: string[]) {
    if (keys.filter(Boolean).length > 0) {
      this.options.keys = keys.map((key) => {
        return ReportMapping.getKey(key);
      });
    }
  }

  private setExcludeKeys(keys: string[]) {
    if (keys.filter(Boolean).length > 0) {
      this.options.excludeKeys = keys.map((key) => {
        return ReportMapping.getKey(key).field;
      });
    }
  }

  public generate(
    keys: string[] = [],
    excludeKeys: string[] = [],
    unwindArrays = false,
    fieldDelimiter = ',',
  ) {
    this.setKeys(keys);
    this.setExcludeKeys(excludeKeys);
    this.options.unwindArrays = unwindArrays;
    this.options.delimiter = {
      field: fieldDelimiter,
    };

    this.documents.addTotalizerRow();
    const rows = this.documents.list.flat();

    return jsonParser.toCsv(rows, this.options);
  }
}
