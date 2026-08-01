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
      presentationRole: 'present_day_company',
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
      presentationRole: 'present_day_regional',
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
      presentationRole: 'industrial_heritage',
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
      presentationRole: 'technology_illustration',
      derivative: null,
    },
    /* ---------------- Visual Story Photography Pack (Stage 5) ----------
     * Eight additional licence-verified photographs (Wikimedia Commons; each
     * per-file licence checked via the API before download). Every asset is
     * present-day CONTEXT, industrial-heritage CONTEXT, a general technology
     * illustration, or a HISTORICAL photograph that PREDATES the case — none is
     * direct evidence of the 1984 founding, the PAS 2000/5500, DEEP-UV work, or
     * the 1995 IPO, and each historicalLimitations note says so. Delivery files
     * are self-hosted, server-scaled derivatives (no upscale, aspect preserved).
     */
    {
      id: 'nl-media-philips-fabrieken-1949',
      caseId: CASE,
      type: 'historical_photo',
      title: 'Philips factories, Eindhoven, illuminated at night (1949)',
      caption:
        'The Philips factories in Eindhoven under night illumination, photographed in 1949 — ' +
        'industrial-heritage context for the Philips environment decades before the 1984 venture.',
      creator: 'Nationaal Archief',
      date: '1949',
      dateLabel: 'Photographed 1949',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Kunstverlichting_bij_de_Philipsfabrieken_te_Eindhoven,_Bestanddeelnr_256-3257.jpg',
      localAssetPath: `${DIR}/philips-fabrieken-1949.jpg`,
      remoteUrl: null,
      rights: {
        status: 'public_domain',
        licenseName: 'CC0 (Public Domain Dedication)',
        licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
        rightsHolder: 'Nationaal Archief (Netherlands)',
        requiredCreditLine: 'Nationaal Archief / Anefo, CC0, via Wikimedia Commons',
        permittedForPublicWebsite: true,
        permittedForPortfolioPresentation: true,
      },
      attribution: 'Photo: Nationaal Archief / Anefo (Wikimedia Commons), CC0',
      historicalLimitations:
        'A genuine 1949 photograph of the Philips factories — thirty-five years BEFORE the 1984 ' +
        'joint venture. Industrial-heritage context only; it does not depict the case’s firms, ' +
        'the founding, or any event in the case.',
      altText: 'The Philips factory buildings in Eindhoven lit up at night in 1949, with illuminated signage.',
      width: 1800,
      height: 1268,
      temporalContext: 'historical',
      presentationRole: 'industrial_heritage',
      derivative: {
        originalFilename: 'Kunstverlichting bij de Philipsfabrieken te Eindhoven, Bestanddeelnr 256-3257.jpg',
        originalWidth: 5832,
        originalHeight: 4109,
        transform: 'Server-scaled to 1800px width via the Wikimedia thumbnail API; no crop, no upscale, licence/credit unchanged.',
      },
    },
    {
      id: 'nl-media-philips-strijp-1936',
      caseId: CASE,
      type: 'historical_photo',
      title: 'Philips Strijp works, Eindhoven (1936)',
      caption:
        'The Philips Strijp works in Eindhoven, photographed in 1936 — early industrial-heritage ' +
        'context for the Philips manufacturing environment.',
      creator: 'Unknown (serc.nl collection)',
      date: '1936',
      dateLabel: 'Photographed 1936',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Philips_Strijp_works_Eindhoven.jpg',
      localAssetPath: `${DIR}/philips-strijp-works-1936.jpg`,
      remoteUrl: null,
      rights: {
        status: 'public_domain',
        licenseName: 'Public domain',
        licenseUrl: null,
        rightsHolder: null,
        requiredCreditLine: 'Public domain, via Wikimedia Commons',
        permittedForPublicWebsite: true,
        permittedForPortfolioPresentation: true,
      },
      attribution: 'Photo: public domain (Wikimedia Commons)',
      historicalLimitations:
        'A 1936 photograph of the Philips Strijp works — long before the case. Industrial-heritage ' +
        'context only; it does not depict the case’s firms or events.',
      altText: 'A black-and-white 1936 view of the Philips Strijp factory works in Eindhoven.',
      width: 726,
      height: 438,
      temporalContext: 'historical',
      presentationRole: 'industrial_heritage',
      derivative: null,
    },
    {
      id: 'nl-media-philips-terrein-2008',
      caseId: CASE,
      type: 'facility_photo',
      title: 'Former Philips factory buildings, Strijp, Eindhoven (2008)',
      caption:
        'Surviving Philips factory buildings on the Strijp site in Eindhoven, photographed in 2008 ' +
        'for the national heritage register — present-day industrial-heritage context.',
      creator: 'Bert van As',
      date: '2008',
      dateLabel: 'Photographed 2008',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Fabrieksgebouwen_op_het_Philips-terrein_-_Eindhoven_-_20528215_-_RCE.jpg',
      localAssetPath: `${DIR}/philips-terrein-2008.jpg`,
      remoteUrl: null,
      rights: {
        status: 'open_license',
        licenseName: 'CC BY-SA 4.0',
        licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
        rightsHolder: 'Bert van As / Rijksdienst voor het Cultureel Erfgoed',
        requiredCreditLine: 'Bert van As, Rijksdienst voor het Cultureel Erfgoed, CC BY-SA 4.0, via Wikimedia Commons',
        permittedForPublicWebsite: true,
        permittedForPortfolioPresentation: true,
      },
      attribution: 'Photo: Bert van As / RCE (Wikimedia Commons), CC BY-SA 4.0',
      historicalLimitations:
        'Present-day (2008) photograph of surviving Philips-terrein buildings. Industrial-heritage ' +
        'context only — it does not depict the 1980s premises or any event in the case.',
      altText: 'Brick industrial factory buildings on the former Philips terrain in Eindhoven, 2008.',
      width: 1200,
      height: 800,
      temporalContext: 'present_day',
      presentationRole: 'industrial_heritage',
      derivative: {
        originalFilename: 'Fabrieksgebouwen op het Philips-terrein - Eindhoven - 20528215 - RCE.jpg',
        originalWidth: 4368,
        originalHeight: 2912,
        transform: 'Server-scaled to 1200px width via the Wikimedia thumbnail API; no crop, no upscale, licence/credit unchanged.',
      },
    },
    {
      id: 'nl-media-klokgebouw-2014',
      caseId: CASE,
      type: 'facility_photo',
      title: 'Klokgebouw, Strijp-S, Eindhoven (2014)',
      caption:
        'The Klokgebouw on the former Philips Strijp-S site in Eindhoven, photographed in 2014 — ' +
        'present-day view of the redeveloped Philips industrial heritage.',
      creator: 'Peter Beekmans',
      date: '2014',
      dateLabel: 'Photographed 2014',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Klokgebouw_en_Ketelhuisplein.jpg',
      localAssetPath: `${DIR}/klokgebouw-strijp-s-2014.jpg`,
      remoteUrl: null,
      rights: {
        status: 'open_license',
        licenseName: 'CC BY 2.0',
        licenseUrl: 'https://creativecommons.org/licenses/by/2.0',
        rightsHolder: 'Peter Beekmans',
        requiredCreditLine: 'Peter Beekmans, CC BY 2.0, via Wikimedia Commons',
        permittedForPublicWebsite: true,
        permittedForPortfolioPresentation: true,
      },
      attribution: 'Photo: Peter Beekmans (Wikimedia Commons), CC BY 2.0',
      historicalLimitations:
        'Present-day (2014) photograph of a redeveloped Philips Strijp-S building. Industrial-heritage ' +
        'context only; not a depiction of the case’s firms or events.',
      altText: 'The brick Klokgebouw clock building on the Strijp-S site in Eindhoven, 2014.',
      width: 1000,
      height: 667,
      temporalContext: 'present_day',
      presentationRole: 'industrial_heritage',
      derivative: null,
    },
    {
      id: 'nl-media-asml-lens-engineer-2006',
      caseId: CASE,
      type: 'portrait',
      title: 'Engineer holding an ASML projection lens (2006)',
      caption:
        'An engineer holds a projection lens made for ASML lithography systems, photographed in 2006 — ' +
        'present-day company context for the precision optics at the heart of a wafer stepper.',
      creator: 'The Next Web',
      date: '2006',
      dateLabel: 'Photographed 2006',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Ton_Willekens_wih_a_lens_from_ASML_(cropped).jpg',
      localAssetPath: `${DIR}/asml-lens-engineer-2006.jpg`,
      remoteUrl: null,
      rights: {
        status: 'open_license',
        licenseName: 'CC BY-SA 2.0',
        licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0',
        rightsHolder: 'The Next Web',
        requiredCreditLine: 'The Next Web, CC BY-SA 2.0, via Wikimedia Commons',
        permittedForPublicWebsite: true,
        permittedForPortfolioPresentation: true,
      },
      attribution: 'Photo: The Next Web (Wikimedia Commons), CC BY-SA 2.0',
      historicalLimitations:
        'Present-day (2006) photograph of a person with an ASML projection lens. Present-day company ' +
        'context for the technology; it is NOT from the 1980s and does not depict the PAS 2000/5500 ' +
        'or any event in the case.',
      altText: 'A person in a suit holds a large cylindrical projection lens manufactured for ASML, 2006.',
      width: 850,
      height: 1354,
      temporalContext: 'present_day',
      presentationRole: 'present_day_company',
      derivative: {
        originalFilename: 'Ton Willekens wih a lens from ASML (cropped).jpg',
        originalWidth: 966,
        originalHeight: 1539,
        transform: 'Server-scaled to 850px width via the Wikimedia thumbnail API; no crop, no upscale, licence/credit unchanged.',
      },
    },
    {
      id: 'nl-media-microelectronics-1989',
      caseId: CASE,
      type: 'historical_photo',
      title: 'Microelectronics production, VEB Mikroelektronik, Erfurt (1989)',
      caption:
        'Semiconductor microelectronics production at VEB Mikroelektronik in Erfurt, photographed in ' +
        'May 1989 — a period-compatible view of late-1980s chip manufacturing, elsewhere in Europe.',
      creator: 'Heinz Hirndorf (Bundesarchiv)',
      date: '1989',
      dateLabel: 'Photographed May 1989',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Bundesarchiv_Bild_183-1989-0523-018,_Erfurt,_VEB_Mikroelektronik.jpg',
      localAssetPath: `${DIR}/microelectronics-1989.jpg`,
      remoteUrl: null,
      rights: {
        status: 'open_license',
        licenseName: 'CC BY-SA 3.0 de',
        licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/de/deed.en',
        rightsHolder: 'Bundesarchiv (German Federal Archive)',
        requiredCreditLine: 'Bundesarchiv, Bild 183-1989-0523-018 / Heinz Hirndorf, CC BY-SA 3.0 de, via Wikimedia Commons',
        permittedForPublicWebsite: true,
        permittedForPortfolioPresentation: true,
      },
      attribution: 'Photo: Bundesarchiv / Heinz Hirndorf (Wikimedia Commons), CC BY-SA 3.0 de',
      historicalLimitations:
        'A genuine 1989 photograph of microelectronics production in Erfurt (VEB Mikroelektronik) — a ' +
        'DIFFERENT company and country, shown only as period-compatible technology context. It is NOT ' +
        'the case’s equipment, not ASM Lithography, and not the PAS 2000/5500.',
      altText: 'A worker in a light coat operates semiconductor production equipment at VEB Mikroelektronik, Erfurt, 1989.',
      width: 800,
      height: 512,
      temporalContext: 'historical',
      presentationRole: 'historical_photograph',
      derivative: null,
    },
    {
      id: 'nl-media-cleanroom-2009',
      caseId: CASE,
      type: 'facility_photo',
      title: 'Semiconductor cleanroom (2009)',
      caption:
        'A semiconductor cleanroom, photographed in 2009 — present-day illustration of the controlled ' +
        'environment that precision chip-making equipment operates in.',
      creator: 'Yorudun',
      date: '2009',
      dateLabel: 'Photographed 2009',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Clean_room_NMDC.JPG',
      localAssetPath: `${DIR}/cleanroom-2009.jpg`,
      remoteUrl: null,
      rights: {
        status: 'open_license',
        licenseName: 'CC BY-SA 3.0',
        licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0',
        rightsHolder: 'Yorudun',
        requiredCreditLine: 'Yorudun, CC BY-SA 3.0, via Wikimedia Commons',
        permittedForPublicWebsite: true,
        permittedForPortfolioPresentation: true,
      },
      attribution: 'Photo: Yorudun (Wikimedia Commons), CC BY-SA 3.0',
      historicalLimitations:
        'A generic present-day (2009) cleanroom, shown as technology context. It is NOT the case’s ' +
        'facility and does not depict any event in the case.',
      altText: 'A brightly lit semiconductor cleanroom with equipment and a worker in protective coveralls.',
      width: 1600,
      height: 1200,
      temporalContext: 'present_day',
      presentationRole: 'technology_illustration',
      derivative: {
        originalFilename: 'Clean room NMDC.JPG',
        originalWidth: 3264,
        originalHeight: 2448,
        transform: 'Server-scaled to 1600px width via the Wikimedia thumbnail API; no crop, no upscale, licence/credit unchanged.',
      },
    },
    {
      id: 'nl-media-silicon-wafer',
      caseId: CASE,
      type: 'product_photo',
      title: 'Silicon wafer',
      caption:
        'A patterned silicon wafer — a general technology illustration of the object a lithography ' +
        'machine prints patterns onto, layer by layer.',
      creator: 'Peellden',
      date: null,
      dateLabel: 'Modern wafer',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:12-inch_silicon_wafer.jpg',
      localAssetPath: `${DIR}/silicon-wafer.jpg`,
      remoteUrl: null,
      rights: {
        status: 'open_license',
        licenseName: 'CC BY-SA 3.0',
        licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0',
        rightsHolder: 'Peellden',
        requiredCreditLine: 'Peellden, CC BY-SA 3.0, via Wikimedia Commons',
        permittedForPublicWebsite: true,
        permittedForPortfolioPresentation: true,
      },
      attribution: 'Photo: Peellden (Wikimedia Commons), CC BY-SA 3.0',
      historicalLimitations:
        'A general photograph of a modern silicon wafer, shown only to illustrate the technology. It ' +
        'is larger than the wafers of the case’s era and is NOT the case’s equipment or product.',
      altText: 'A round, iridescent silicon wafer patterned with a grid of rectangular chip dies.',
      width: 1000,
      height: 1000,
      temporalContext: 'present_day',
      presentationRole: 'technology_illustration',
      derivative: {
        originalFilename: '12-inch silicon wafer.jpg',
        originalWidth: 2000,
        originalHeight: 2000,
        transform: 'Server-scaled to 1000px width via the Wikimedia thumbnail API; no crop, no upscale, licence/credit unchanged.',
      },
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
    /* Photography Pack links — all context/illustration, none asserts a Claim. */
    {
      id: 'nl-medialink-philips-1949',
      caseId: CASE, mediaId: 'nl-media-philips-fabrieken-1949', claimIds: [], placeIds: [],
      role: 'sourced_illustration',
      note: 'Historical industrial-heritage context: the Philips factories in 1949.',
      limitations: 'Predates the 1984 case by decades; heritage context, not case evidence.',
    },
    {
      id: 'nl-medialink-philips-1936',
      caseId: CASE, mediaId: 'nl-media-philips-strijp-1936', claimIds: [], placeIds: [],
      role: 'sourced_illustration',
      note: 'Historical industrial-heritage context: the Philips Strijp works in 1936.',
      limitations: 'Predates the case; heritage context, not case evidence.',
    },
    {
      id: 'nl-medialink-philips-terrein-2008',
      caseId: CASE, mediaId: 'nl-media-philips-terrein-2008', claimIds: [], placeIds: [],
      role: 'present_day_context',
      note: 'Present-day industrial-heritage context: surviving Philips-terrein buildings.',
      limitations: 'Present-day (2008); not the 1980s premises or any case event.',
    },
    {
      id: 'nl-medialink-klokgebouw-2014',
      caseId: CASE, mediaId: 'nl-media-klokgebouw-2014', claimIds: [], placeIds: [],
      role: 'present_day_context',
      note: 'Present-day industrial-heritage context: redeveloped Strijp-S.',
      limitations: 'Present-day (2014); heritage context only.',
    },
    {
      id: 'nl-medialink-asml-lens-2006',
      caseId: CASE, mediaId: 'nl-media-asml-lens-engineer-2006', claimIds: [], placeIds: [],
      role: 'present_day_context',
      note: 'Present-day company context: precision optics for ASML lithography systems.',
      limitations: 'Present-day (2006); not the 1980s and not the case’s specific machines.',
    },
    {
      id: 'nl-medialink-microelectronics-1989',
      caseId: CASE, mediaId: 'nl-media-microelectronics-1989', claimIds: [], placeIds: [],
      role: 'sourced_illustration',
      note: 'Period-compatible technology context: 1989 microelectronics production elsewhere in Europe.',
      limitations: 'A different company and country; not the case’s equipment or firms.',
    },
    {
      id: 'nl-medialink-cleanroom-2009',
      caseId: CASE, mediaId: 'nl-media-cleanroom-2009', claimIds: [], placeIds: [],
      role: 'sourced_illustration',
      note: 'General technology context: a semiconductor cleanroom environment.',
      limitations: 'Generic present-day cleanroom; not the case’s facility.',
    },
    {
      id: 'nl-medialink-silicon-wafer',
      caseId: CASE, mediaId: 'nl-media-silicon-wafer', claimIds: [], placeIds: [],
      role: 'sourced_illustration',
      note: 'General technology illustration: the wafer a lithography machine prints onto.',
      limitations: 'A modern wafer, larger than the case era’s; illustration only.',
    },
  ],
};
