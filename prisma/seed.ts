import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create coins
  const ton = await prisma.coin.upsert({
    where: { symbol: 'TON' },
    update: {},
    create: {
      symbol: 'TON',
      name: 'Toncoin'
    }
  })

  const usdt = await prisma.coin.upsert({
    where: { symbol: 'USDT' },
    update: {},
    create: {
      symbol: 'USDT',
      name: 'Tether'
    }
  })

  console.log('Created coins:', { ton, usdt })

  // Create coin pairs
  const tonUsdtPair = await prisma.coinPair.upsert({
    where: {
      baseCoinId_quoteCoinId: {
        baseCoinId: ton.id,
        quoteCoinId: usdt.id
      }
    },
    update: {},
    create: {
      baseCoinId: ton.id,
      quoteCoinId: usdt.id
    }
  })

  const usdtTonPair = await prisma.coinPair.upsert({
    where: {
      baseCoinId_quoteCoinId: {
        baseCoinId: usdt.id,
        quoteCoinId: ton.id
      }
    },
    update: {},
    create: {
      baseCoinId: usdt.id,
      quoteCoinId: ton.id
    }
  })

  console.log('Created coin pairs:', { tonUsdtPair, usdtTonPair })

  // Create data provider
  const coinmarketcap = await prisma.dataProvider.upsert({
    where: { name: 'CoinMarketCap' },
    update: {},
    create: {
      name: 'CoinMarketCap',
      apiKeyEnvVar: 'COINMARKET_API_KEY',
      apiKeyHeader: 'X-CMC_PRO_API_KEY',
      url: 'https://pro-api.coinmarketcap.com/v2',
    }
  })

  console.log('Created data provider:', coinmarketcap)

  console.log('Seed data created successfully!')
}

main()
  .catch((e) => {
    console.error('Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    console.log('Seed done!')
    await prisma.$disconnect()
  })