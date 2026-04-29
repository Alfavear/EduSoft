const { PrismaClient } = require('./Frontend/node_modules/@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findUnique({ where: { username: 'admin.general' } });
  if (!user) {
    console.log('User not found');
    return;
  }
  const match = await bcrypt.compare('123456', user.password);
  console.log('Password match:', match);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
