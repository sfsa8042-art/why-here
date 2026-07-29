/**
 * Netherlands Visual Evidence Pack 1 — production media (Public Atlas V2, Stage 2).
 *
 * A SEPARATE content layer from the evidence corpus. Every asset here was
 * licence-verified via the Wikimedia Commons API before its file was downloaded
 * locally (see docs/research/.../MEDIA_EVIDENCE_PACK_1.md). Nothing is fetched at
 * runtime. All four assets are PRESENT-DAY context or a general technical
 * illustration — NONE is direct historical evidence, and the captions/limitations
 * say so. No unsupported historical conclusion is implied.
 */

import type { MediaPack } from '../../lib/media.ts';

const CASE = 'netherlands-semiconductor-equipment';
const DIR = '/media/netherlands-semiconductor-equipment';

export const netherlandsMedia: MediaPack = {
  assets: [
    {
      id: 'nl-media-asml-veldhoven-2008',
      caseId: CASE,
      type: 'facility_photo',
      title: 'ASML site, Veldhoven (2008)',
      caption:
        'The ASML site in Veldhoven, photographed in 2008 — a present-day view of ' +
        'where the company (which grew out of the 1984 ASM Lithography joint venture) ' +
        'is based. Not the 1980s founding-era premises.',
      creator: 'HHahn',
      date: '2008',
      dateLabel: 'Photographed 25 August 2008',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:20080825_Veldhoven_ASML_DSCF0350.jpg',
      localAssetPath: `${DIR}/20080825_Veldhoven_ASML_DSCF0350.jpg`,
      remoteUrl: null,
      rights: {
        status: 'open_license',
        licenseName: 'CC BY-SA 3.0',
        licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0',
        rightsHolder: 'HHahn',
        requiredCreditLine: 'HHahn, CC BY-SA 3.0, via Wikimedia Commons',
        permittedForPublicWebsite: true,
        permittedForPortfolioPresentation: true,
      },
      attribution: 'Photo: HHahn (Wikimedia Commons), CC BY-SA 3.0',
      historicalLimitations:
        'Present-day (2008) exterior of the ASML site. It does NOT depict the 1984 joint ' +
        'venture, the 1980s premises, or any specific historical event of the case.',
      altText:
        'A modern low-rise office and industrial complex at the ASML site in Veldhoven, ' +
        'the Netherlands, seen from a car park under a partly cloudy sky.',
      width: 2272,
      height: 1704,
      temporalContext: 'present_day',
      derivative: null,
    },
    {
      id: 'nl-media-eindhoven-city-2007',
      caseId: CASE,
      type: 'city_photo',
      title: 'Eindhoven city centre (2007)',
      caption:
        'Eindhoven city centre, photographed in 2007 — present-day regional context for ' +
        'the Brainport region in which the case’s firms are based.',
      creator: 'Robert de Greef',
      date: '2007',
      dateLabel: 'Photographed 2007',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Binnenstad_Eindhoven.jpg',
      localAssetPath: `${DIR}/Binnenstad_Eindhoven.jpg`,
      remoteUrl: null,
      rights: {
        status: 'open_license',
        licenseName: 'CC BY-SA 3.0',
        licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0',
        rightsHolder: 'Robert de Greef',
        requiredCreditLine: 'Robert de Greef, CC BY-SA 3.0, via Wikimedia Commons',
        permittedForPublicWebsite: true,
        permittedForPortfolioPresentation: true,
      },
      attribution: 'Photo: Robert de Greef (Wikimedia Commons), CC BY-SA 3.0',
      historicalLimitations:
        'Present-day (2007) view of Eindhoven’s centre; regional context only. It does not ' +
        'depict the semiconductor firms or any historical event.',
      altText: 'A wide street-level view of the modern Eindhoven city centre with mid-rise buildings.',
      width: 874,
      height: 346,
      temporalContext: 'present_day',
      derivative: null,
    },
    {
      id: 'nl-media-natlab-eindhoven-2017',
      caseId: CASE,
      type: 'facility_photo',
      title: 'Former Philips NatLab building, Strijp, Eindhoven (2017)',
      caption:
        'The former Philips Physics Laboratory (NatLab) building on the Strijp site in ' +
        'Eindhoven, photographed in 2017 — present-day context for the Philips research ' +
        'environment around the case.',
      creator: 'Johan Bakker',
      date: '2017',
      dateLabel: 'Photographed 2017',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:0772GM0277_Natlab_Eindhoven.jpg',
      localAssetPath: `${DIR}/0772GM0277_Natlab_Eindhoven_web1600.jpg`,
      remoteUrl: null,
      rights: {
        status: 'open_license',
        licenseName: 'CC BY-SA 4.0',
        licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
        rightsHolder: 'Johan Bakker',
        requiredCreditLine: 'Johan Bakker, CC BY-SA 4.0, via Wikimedia Commons',
        permittedForPublicWebsite: true,
        permittedForPortfolioPresentation: true,
      },
      attribution: 'Photo: Johan Bakker (Wikimedia Commons), CC BY-SA 4.0',
      historicalLimitations:
        'Present-day (2017) photograph of the surviving NatLab building. Regional/ecosystem ' +
        'context only — it does not evidence any specific claim or date, nor that the case’s ' +
        'firms used this building.',
      altText: 'A large brick industrial research building (the former Philips NatLab) on the Strijp site in Eindhoven.',
      width: 1600,
      height: 1067,
      temporalContext: 'present_day',
      derivative: {
        originalFilename: '0772GM0277_Natlab_Eindhoven.jpg',
        originalWidth: 3000,
        originalHeight: 2000,
        transform: 'Downscaled to 1600×1067 (max 1600px width) and re-encoded as JPEG q82 for web delivery; no crop, no upscale, credits/licence unchanged.',
      },
    },
    {
      id: 'nl-media-step-repeat-diagram',
      caseId: CASE,
      type: 'diagram',
      title: 'Step-and-repeat exposure — schematic',
      caption:
        'A schematic of the “step-and-repeat” exposure method used by wafer steppers such as ' +
        'ASML’s PAS series. A general technical illustration, not a photograph of the case’s ' +
        'equipment (labels in German).',
      creator: 'Cepheiden',
      date: '2010',
      dateLabel: 'Created 2010',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Step_and_Repeat_DE.svg',
      localAssetPath: `${DIR}/Step_and_Repeat_DE.svg`,
      remoteUrl: null,
      rights: {
        status: 'open_license',
        licenseName: 'CC BY-SA 3.0',
        licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0',
        rightsHolder: 'Cepheiden',
        requiredCreditLine: 'Cepheiden, CC BY-SA 3.0, via Wikimedia Commons',
        permittedForPublicWebsite: true,
        permittedForPortfolioPresentation: true,
      },
      attribution: 'Diagram: Cepheiden (Wikimedia Commons), CC BY-SA 3.0',
      historicalLimitations:
        'A generic technical diagram of the step-and-repeat method (German labels). It ' +
        'illustrates the technology in general and is NOT a depiction of the case’s specific ' +
        'PAS machines or any historical event.',
      altText: 'A schematic diagram showing a wafer exposed field-by-field in a step-and-repeat pattern.',
      width: 200,
      height: 300,
      temporalContext: 'timeless_illustration',
      derivative: null,
    },
  ],
  links: [
    {
      id: 'nl-medialink-cover-eindhoven',
      caseId: CASE,
      mediaId: 'nl-media-eindhoven-city-2007',
      claimIds: [],
      placeIds: [],
      role: 'present_day_context',
      note: 'Public Atlas-index cover for the Netherlands case — a present-day view of the Eindhoven region (place-first, not company-first).',
      limitations: 'Present-day regional context only; not tied to a specific claim or place anchor, and not a historical event site.',
      cover: true,
    },
    {
      id: 'nl-medialink-evidence-asml',
      caseId: CASE,
      mediaId: 'nl-media-asml-veldhoven-2008',
      claimIds: [],
      placeIds: ['nl-place-veldhoven'],
      role: 'present_day_context',
      note: 'Evidence-header context image — a present-day exterior of the ASML site in Veldhoven.',
      limitations: 'Not the 1980s founding-era premises; present-day company/site context only.',
      evidenceContext: true,
    },
    {
      id: 'nl-medialink-natlab',
      caseId: CASE,
      mediaId: 'nl-media-natlab-eindhoven-2017',
      claimIds: [],
      placeIds: [],
      role: 'present_day_context',
      note: 'Present-day context for the Philips research ecosystem.',
      limitations: 'Ecosystem context only; does not evidence any claim.',
    },
    {
      id: 'nl-medialink-step-repeat',
      caseId: CASE,
      mediaId: 'nl-media-step-repeat-diagram',
      claimIds: [],
      placeIds: [],
      role: 'sourced_illustration',
      note: 'General illustration of the lithography exposure method relevant to the case’s steppers.',
      limitations: 'Generic method diagram; not the case’s specific equipment.',
    },
  ],
};
