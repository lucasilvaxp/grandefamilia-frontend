import { db } from '@/db';
import { settings } from '@/db/schema';

async function main() {
    const sampleSettings = [
        {
            id: 1,
            storeName: 'Loja A Grande Família',
            phone: '(93) 99108-4582',
            email: 'lojagrandefamilia@gmail.com',
            address: 'Av. Tancredo Neves, 2035, Santarém, PA',
            instagramUrl: 'https://instagram.com/lojagrandefamilia',
            facebookUrl: 'https://facebook.com/lojagrandefamilia',
            whatsappNumber: '5593991084582',
            logo: null,
            businessHours: null,
            createdAt: new Date('2024-01-01').toISOString(),
            updatedAt: new Date('2024-01-01').toISOString(),
        }
    ];

    await db.insert(settings).values(sampleSettings);
    
    console.log('✅ Settings seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});