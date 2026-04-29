const { PrismaClient } = require('./Frontend/node_modules/@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('123456', 10);
  
  const user = await prisma.user.upsert({
    where: { username: 'admin.general' },
    update: {
      password: hashedPassword,
      role: 'ADMIN'
    },
    create: {
      username: 'admin.general',
      password: hashedPassword,
      role: 'ADMIN'
    }
  });

  console.log('Admin user created/updated:', user.username);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
