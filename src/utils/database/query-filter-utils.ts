import { SelectQueryBuilder } from 'typeorm';

export class QueryFilterUtils {
    /**
     * Applies a date range filter to the query.
     * @param query The query object to be modified.
     * @param entityName The name of the entity to which the date field belongs.
     * @param fieldName The name of the date field.
     * @param filterData The object with the start and end dates.
     */

    static applyDateRangeFilter<T>(
        query: SelectQueryBuilder<T>,
        entityName: string,
        fieldName: string,
        filterData: { dateFrom?: string; dateTo?: string }
    ): SelectQueryBuilder<T> {
        if (filterData.dateFrom || filterData.dateTo) {
            const field = `${entityName}.${String(fieldName)}`;
            if (filterData.dateFrom && !filterData.dateTo) {
                query.andWhere(`${field} >= :dateFrom`, { dateFrom: new Date(filterData.dateFrom) });
            } else if (!filterData.dateFrom && filterData.dateTo) {
                query.andWhere(`${field} <= :dateTo`, { dateTo: new Date(filterData.dateTo) });
            } else if (filterData.dateFrom && filterData.dateTo) {
                query.andWhere(`${field} BETWEEN :dateFrom AND :dateTo`, {
                    dateFrom: new Date(filterData.dateFrom),
                    dateTo: new Date(filterData.dateTo)
                });
            }
        }
        return query;
    }

    static applySearchQuery<T>(
        query: SelectQueryBuilder<T>,
        searchFields: string[],
        searchText: string
    ): SelectQueryBuilder<T> {
        if (searchText && searchFields.length > 0) {
            const searchQuery = searchFields
                .map(field => `(${field} LIKE :searchText)`)
                .join(' OR ');

            query.andWhere(`(${searchQuery})`, { searchText: `%${searchText}%` });
        }

        return query;
    }
}
