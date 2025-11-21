import { db } from '@/db';
import { categories } from '@/db/schema';

async function main() {
    const sampleCategories = [
        {
            name: 'Roupas Femininas',
            slug: 'roupas-femininas',
            subcategories: ['Vestidos', 'Blusas', 'Calças', 'Saias', 'Jaquetas'],
            image: '',
            createdAt: new Date('2024-01-10').toISOString(),
            updatedAt: new Date('2024-01-10').toISOString(),
        },
        {
            name: 'Roupas Masculinas',
            slug: 'roupas-masculinas',
            subcategories: ['Camisas', 'Camisetas', 'Calças', 'Jaquetas', 'Shorts'],
            image: '',
            createdAt: new Date('2024-01-10').toISOString(),
            updatedAt: new Date('2024-01-10').toISOString(),
        },
        {
            name: 'Acessórios',
            slug: 'acessorios',
            subcategories: ['Bolsas', 'Sapatos', 'Joias', 'Óculos', 'Cintos'],
            image: '',
            createdAt: new Date('2024-01-10').toISOString(),
            updatedAt: new Date('2024-01-10').toISOString(),
        }
    ];

    await db.insert(categories).values(sampleCategories);
    
    console.log('✅ Categories seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});