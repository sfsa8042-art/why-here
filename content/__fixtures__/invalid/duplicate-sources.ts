/**
 * INVALID fixtures — duplicate underlying sources (V7).
 *
 * NOT RESEARCH CONTENT — synthetic corpora for validator tests.
 * Each exported corpus violates exactly one rule via one normalized
 * identifier collision.
 */

import type { Corpus } from '../../../lib/validate.ts';
import { defaultSources, makeCorpus, makeSource } from '../builders.ts';

/* V7 — same DOI behind prefix/case variants */
export const v7SharedDoi: Corpus = makeCorpus({
  sources: [
    ...defaultSources(),
    makeSource({ id: 'dupe-doi-1', doi: '10.1234/ABC.Def' }),
    makeSource({ id: 'dupe-doi-2', doi: 'https://doi.org/10.1234/abc.def' }),
  ],
});

/* V7 — the same book as ISBN-10 and hyphenated ISBN-13 */
export const v7SharedIsbn: Corpus = makeCorpus({
  sources: [
    ...defaultSources(),
    makeSource({ id: 'dupe-isbn-1', isbn: '0-306-40615-2' }),
    makeSource({ id: 'dupe-isbn-2', isbn: '978-0-306-40615-7' }),
  ],
});

/* V7 — archive references differing only in case and padding */
export const v7SharedArchiveRef: Corpus = makeCorpus({
  sources: [
    ...defaultSources(),
    {
      id: 'dupe-arch-1',
      title: 'Synthetic archived record 1',
      sourceType: 'primary',
      lengthClass: 'short_form',
      archiveRef: ' NA-HaNA-2.06.087 ',
    },
    {
      id: 'dupe-arch-2',
      title: 'Synthetic archived record 2',
      sourceType: 'primary',
      lengthClass: 'short_form',
      archiveRef: 'na-hana-2.06.087',
    },
  ],
});

/* V7 — URLs differing only by scheme, www, tracking params, slash, fragment */
export const v7SharedUrl: Corpus = makeCorpus({
  sources: [
    ...defaultSources(),
    makeSource({ id: 'dupe-url-1', url: 'http://www.example.org/report/annex?utm_source=x#s3' }),
    makeSource({ id: 'dupe-url-2', url: 'https://example.org/report/annex/' }),
  ],
});

/* near-miss: genuinely distinct sources are accepted */
export const nearMissDistinctSources: Corpus = makeCorpus({
  sources: [
    ...defaultSources(),
    makeSource({ id: 'distinct-1', url: 'https://example.org/report/annex-a' }),
    makeSource({ id: 'distinct-2', url: 'https://example.org/report/annex-b' }),
  ],
});
