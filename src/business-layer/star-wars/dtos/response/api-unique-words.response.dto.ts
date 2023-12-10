import { ApiProperty } from '@nestjs/swagger';

export class ApiUniqueWordsResponse {

    @ApiProperty({
        example: {
            "Turmoil has": 1,
            "has engulfed": 1,
            // ... inne pary słów
        }
    })
    uniqueWordPairsAndOccurrences: Record<string, number>;

    @ApiProperty({
        example: {
            "Luke Skywalker": 2,
            "Darth Vader": 1,
            // ... inne postacie
        }
    })
    mostFrequentCharacters: Record<string, number>;
}
