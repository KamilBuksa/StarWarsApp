import { BadRequestException } from '@nestjs/common';

export class GeneralUtils {
  static prepareFilters(
    entity_tag: string,
    filterData: any,
    allowedSortOptions: string[],
    entityField?: string,
    sortValue?: string,
  ): Array<any> | Error {
    let sortQuery = [`${entity_tag}.id`, 'ASC'];
    if (entityField && sortValue) {
      sortQuery = [`${entity_tag}.${entityField}`, `${sortValue}`];
    }

    if (filterData['sort_by']) {
      if (filterData['sort_by'].includes('.')) {
        const lastOccurenceOfDot = filterData['sort_by']
          .toString()
          .lastIndexOf('.');
        filterData['sort_by'] = filterData['sort_by']
          .toString()
          .slice(lastOccurenceOfDot + 1);
      }
      const lastOccurence = filterData['sort_by'].toString().lastIndexOf('_');
      if (
        !allowedSortOptions.includes(
          filterData['sort_by'].slice(0, lastOccurence),
        )
      ) {
        throw new BadRequestException(
          `Unsupported sort option, choose one from: ${allowedSortOptions.join(
            ',',
          )}`,
        );
      }
      sortQuery[0] =
        `${entity_tag}.` +
        filterData['sort_by'].toString().slice(0, lastOccurence);
      sortQuery[1] = filterData['sort_by'].toString().slice(lastOccurence + 1);
    }

    return sortQuery;
  }
}
