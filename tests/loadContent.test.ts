/**
 * Increment 3 — content registry and loader.
 *
 * Covers: production preview corpus loading and validation, failure
 * attribution to the originating module, duplicate module / entity
 * registration, deterministic ordering, input immutability, assembly
 * reconciliation, and the REAL validate-content command running against
 * production content rather than fixtures.
 */

import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import {
  loadCorpus,
  verifyAssemblyComplete,
  type ContentRegistry,
} from '@/lib/loadContent';
import { validateCorpus } from '@/lib/validate';
import { productionRegistry } from '@/content/index';
import {
  defaultSources,
  makeFlagshipCase,
  makeInterpretive,
  makeQuestion,
} from '@/content/__fixtures__/builders';

/** A minimal well-formed registry for loader-mechanics tests. */
function smallRegistry(): ContentRegistry {
  return {
    sourceModules: [
      { moduleId: 'sources/synthetic', sources: defaultSources() },
    ],
    caseModules: [
      {
        moduleId: 'cases/synthetic',
        caseId: 'builder-case',
        case: makeFlagshipCase({
          thesisClaimId: 'builder-thesis',
          researchQuestionIds: ['builder-question'],
        }),
        claims: [makeInterpretive({ id: 'builder-thesis' })],
        researchQuestions: [makeQuestion({ id: 'builder-question' })],
        nodes: [],
        edges: [],
        alternativeExplanations: [],
      },
    ],
  };
}

describe('production corpus', () => {
  it('loads successfully and passes the full validator', () => {
    const result = loadCorpus(productionRegistry);
    expect(result.ok, JSON.stringify(result.failures, null, 2)).toBe(true);
    if (!result.ok) return;
    expect(validateCorpus(result.corpus)).toEqual([]);
  });

  it('contains the honest Netherlands research case: earned statuses, no thesis, no causal claims', () => {
    const result = loadCorpus(productionRegistry);
    if (!result.ok) throw new Error('production corpus failed to load');
    const nl = result.corpus.modules.find(
      (m) => m.caseId === 'netherlands-semiconductor-equipment',
    );
    expect(nl).toBeDefined();
    expect(nl?.case.status).toBe('research');
    expect(nl?.researchQuestions.length).toBeGreaterThanOrEqual(1);
    expect(nl?.case).not.toHaveProperty('thesisClaimId');
    expect(nl?.claims.length).toBe(10);
    expect(nl?.claims.every(
      (c) => c.claimType === 'factual' || c.claimType === 'interpretive',
    )).toBe(true);
    expect(nl?.claims.every((c) => c.epistemicStatus === 'well_supported')).toBe(true);
  });
});

describe('loader contract', () => {
  it('a schema failure reports the originating module and entity', () => {
    const registry = smallRegistry();
    const broken: ContentRegistry = {
      ...registry,
      caseModules: [{
        ...registry.caseModules[0]!,
        claims: [{
          ...makeInterpretive({ id: 'builder-thesis' }),
          epistemicStatus: 'established', // capped: cannot parse
        }],
      }],
    };
    const result = loadCorpus(broken);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.failures.some(
      (f) => f.moduleId === 'cases/synthetic' && f.entityId === 'builder-thesis',
    )).toBe(true);
  });

  it('rejects duplicate module registration', () => {
    const registry = smallRegistry();
    const doubled: ContentRegistry = {
      ...registry,
      sourceModules: [...registry.sourceModules, ...registry.sourceModules],
    };
    const result = loadCorpus(doubled);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.failures.some(
      (f) => f.moduleId === 'sources/synthetic' && f.message.includes('registered twice'),
    )).toBe(true);
  });

  it('rejects duplicate entity registration across modules', () => {
    const registry = smallRegistry();
    const doubled: ContentRegistry = {
      ...registry,
      sourceModules: [
        ...registry.sourceModules,
        { moduleId: 'sources/zz-second', sources: [defaultSources()[0]!] },
      ],
    };
    const result = loadCorpus(doubled);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    // modules process in moduleId order, so the LATER module is blamed
    expect(result.failures.some(
      (f) => f.moduleId === 'sources/zz-second'
        && f.entityId === 'builder-academic-a'
        && f.message.includes('already registered by module "sources/synthetic"'),
    )).toBe(true);
  });

  it('ordering is deterministic regardless of registration order', () => {
    const registry = smallRegistry();
    const extraSourceModule = {
      moduleId: 'sources/aaa-first-by-id',
      sources: [{ ...defaultSources()[0]!, id: 'zz-extra', doi: '10.9999/zz.extra' }],
    };
    const forward: ContentRegistry = {
      ...registry,
      sourceModules: [...registry.sourceModules, extraSourceModule],
    };
    const reversed: ContentRegistry = {
      ...registry,
      sourceModules: [extraSourceModule, ...registry.sourceModules],
    };
    const a = loadCorpus(forward);
    const b = loadCorpus(reversed);
    expect(a.ok && b.ok).toBe(true);
    if (!a.ok || !b.ok) return;
    expect(a.corpus).toEqual(b.corpus);
    expect(a.corpus.sources.map((s) => s.id))
      .toEqual(['zz-extra', 'builder-academic-a', 'builder-academic-b', 'builder-primary']);
  });

  it('does not mutate the registered content', () => {
    const registry = smallRegistry();
    const before = JSON.stringify(registry);
    loadCorpus(registry);
    expect(JSON.stringify(registry)).toBe(before);
  });

  it('the corpus shares no object identity with registered content', () => {
    const registry = smallRegistry();
    const result = loadCorpus(registry);
    if (!result.ok) throw new Error('load failed');
    expect(result.corpus.sources[0]).not.toBe(registry.sourceModules[0]!.sources[0]);
  });

  it('reconciliation fails when a registered module is missing from a corpus', () => {
    const registry = smallRegistry();
    const failures = verifyAssemblyComplete(registry, { sources: [], modules: [] });
    expect(failures.some(
      (f) => f.moduleId === 'cases/synthetic' && f.message.includes('missing'),
    )).toBe(true);
    expect(failures.some((f) => f.moduleId === '(registry)')).toBe(true);
  });
});

describe('validate-content command', () => {
  it('runs against production content and reports the Netherlands preview', () => {
    const projectRoot = fileURLToPath(new URL('..', import.meta.url));
    const run = spawnSync(
      process.execPath,
      ['scripts/validate-content.ts'],
      { cwd: projectRoot, encoding: 'utf8', timeout: 60_000 },
    );
    expect(run.status, run.stderr).toBe(0);
    expect(run.stdout).toContain('netherlands-semiconductor-equipment (research)');
    expect(run.stdout).not.toContain('fixture');
  });
});
