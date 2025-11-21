import { db } from '@/db';
import { brands } from '@/db/schema';

async function main() {
    const sampleBrands = [
        {
            name: 'Nike',
            slug: 'nike',
            createdAt: new Date('2024-01-10').toISOString(),
        },
        {
            name: 'Adidas',
            slug: 'adidas',
            createdAt: new Date('2024-01-11').toISOString(),
        },
        {
            name: 'Zara',
            slug: 'zara',
            createdAt: new Date('2024-01-12').toISOString(),
        },
        {
            name: 'H&M',
            slug: 'h-m',
            createdAt: new Date('2024-01-13').toISOString(),
        },
        {
            name: 'Farm',
            slug: 'farm',
            createdAt: new Date('2024-01-14').toISOString(),
        },
        {
            name: 'Reserva',
            slug: 'reserva',
            createdAt: new Date('2024-01-15').toISOString(),
        },
        {
            name: 'Animale',
            slug: 'animale',
            createdAt: new Date('2024-01-16').toISOString(),
        },
        {
            name: 'Shoulder',
            slug: 'shoulder',
            createdAt: new Date('2024-01-17').toISOString(),
        }
    ];

    await db.insert(brands).values(sampleBrands);
    
    console.log('✅ Brands seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});