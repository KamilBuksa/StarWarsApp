import { ValueTransformer } from 'typeorm';

export class DecimalTransformer implements ValueTransformer {
    to(entityValue: number): string {
        return entityValue.toString();
    }
    from(databaseValue: string): number {
        return parseFloat(databaseValue);
    }
}
