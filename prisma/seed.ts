import { PrismaClient, Condition, ListingStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';
import 'dotenv/config';
import Database from 'better-sqlite3';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

console.log("DATABASE_URL:", process.env.DATABASE_URL ? "Set" : "Not Set");

const adapter = new PrismaBetterSqlite3({ url: 'dev.db' });
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('Start seeding...');

    // 1. Categories
    const categories = [
        'Engineering',
        'Computer Science',
        'Mathematics',
        'Business',
        'General',
    ];

    for (const name of categories) {
        await prisma.category.upsert({
            where: { name },
            update: {},
            create: { name },
        });
    }
    console.log('Categories seeded.');

    // 2. Campus Locations
    const locations = [
        'Library Main Entrance',
        'Student Center',
        'Engineering Building',
        'Cafeteria',
    ];

    for (const name of locations) {
        await prisma.campusLocation.upsert({
            where: { name },
            update: {},
            create: { name },
        });
    }
    console.log('Locations seeded.');

    // 3. Users
    const password = await bcrypt.hash('password123', 10);

    const admin = await prisma.user.upsert({
        where: { email: 'admin@university.edu' },
        update: {},
        create: {
            email: 'admin@university.edu',
            name: 'Admin User',
            password,
            role: 'ADMIN',
        },
    });

    const student = await prisma.user.upsert({
        where: { email: 'student@university.edu' },
        update: {},
        create: {
            email: 'student@university.edu',
            name: 'Jane Student',
            password,
            role: 'STUDENT',
        },
    });

    const student2 = await prisma.user.upsert({
        where: { email: 'john@university.edu' },
        update: {},
        create: {
            email: 'john@university.edu',
            name: 'John Doe',
            password,
            role: 'STUDENT',
        },
    });

    console.log('Users seeded.');

    // 4. Listings
    const csCategory = await prisma.category.findUnique({ where: { name: 'Computer Science' } });
    const engCategory = await prisma.category.findUnique({ where: { name: 'Engineering' } });
    const libLocation = await prisma.campusLocation.findUnique({ where: { name: 'Library Main Entrance' } });

    if (!csCategory || !engCategory || !libLocation) {
        throw new Error('Categories or locations not found');
    }

    const listings = [
        {
            title: 'Introduction to Algorithms',
            author: 'Cormen et al.',
            edition: '3rd',
            courseCode: 'CS101',
            condition: Condition.GOOD,
            description: 'Classic algorithms book. Slightly used.',
            categoryId: csCategory.id,
            locationId: libLocation.id,
            donorId: student.id,
            images: {
                create: [{ url: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=800&q=80' }]
            }
        },
        {
            title: 'Clean Code',
            author: 'Robert C. Martin',
            edition: '1st',
            courseCode: 'CS202',
            condition: Condition.LIKE_NEW,
            description: 'Must read for any developer.',
            categoryId: csCategory.id,
            locationId: libLocation.id,
            donorId: student.id,
            images: {
                create: [{ url: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&q=80' }]
            }
        },
        {
            title: 'Physics for Scientists and Engineers',
            author: 'Serway',
            edition: '9th',
            courseCode: 'PHY101',
            condition: Condition.FAIR,
            description: 'Cover is a bit torn but pages are fine.',
            categoryId: engCategory.id,
            locationId: libLocation.id,
            donorId: student2.id,
            images: {
                create: [{ url: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800&q=80' }]
            }
        },
    ];

    for (const listing of listings) {
        await prisma.bookListing.create({
            data: listing,
        });
    }

    console.log('Listings seeded.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
