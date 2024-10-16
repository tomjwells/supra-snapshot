import countries from "i18n-iso-countries"

import { PrismaClient, Region } from '@prisma/client'
import { Client } from '@planetscale/database';
import { PrismaPlanetScale } from '@prisma/adapter-planetscale';


export * from '@prisma/client'

const fs = require('fs');
const csv = require('csv-parser');

const tableRegionToEnumRegion = (region: string, subregion: string): Region => {
  if (region === "Africa") {
    return Region.AFRICA
  } else if (region === "Americas") {
    if(subregion === "Northern America") {
      return Region.NORTH_AMERICA
    } else if (subregion === "Latin America and the Caribbean") {
      return Region.SOUTH_AMERICA
    }
  } else if (region === "Asia") {
    return Region.ASIA
  } else if (region === "Europe") {
    return Region.EUROPE
  } else if (region === "Oceania") {
    return Region.OCEANIA
  } 
  throw new Error(`Unknown region: ${region}, ${subregion}`)
}

type CountryFromTable = {
  "name": string,
  "alpha-2": string,
  "alpha-3": string,
  "country-code": string,
  "iso_3166-2": string,
  "region": string,
  "sub-region": string,
  "intermediate-region": string,
  "region-code": string,
  "sub-region-code": string,
  "intermediate-region-code": string
}

async function readCSVTable(): Promise<CountryFromTable[]> {
  const results: CountryFromTable[] = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream('./data/countries.csv')
      .pipe(csv())
      .on('data', (data: CountryFromTable) => results.push(data))
      .on('end', () => {
        resolve(results);
      })
      .on('error', reject);
  });
}


const globalForPrisma = globalThis as { prisma?: PrismaClient }
const client = new Client({ url: `${process.env.DATABASE_URL}`, fetch: fetch })
const adapter = new PrismaPlanetScale(client);

export const prisma =   globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === 'development'
        ? ['error', 'warn']
        : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma


async function seedCountries() {

  const countries = await readCSVTable()
  
  const createdCountries = await prisma.country.createMany({
    data: countries.filter((c) => c['region'] && c["sub-region"]).map((c) => ({
      name: c.name,
      code: c["alpha-2"],
      region: tableRegionToEnumRegion(c['region'], c["sub-region"]),
    }))
  })
  console.log(createdCountries)
  return "Succeeded"
}

seedCountries().then(
  (result) => {
    console.log(result)
    process.exit(0)
  },
  (error) => {
    console.error(error)
    process.exit(1)
  },
)
