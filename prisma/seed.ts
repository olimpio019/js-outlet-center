import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const senhaHash = await bcrypt.hash('123456', 10);

  // Criar ou atualizar usuário admin
  const admin = await prisma.usuario.upsert({
    where: { email: 'admin@example.com' },
    update: {
      role: 'ADMIN',
      admin: true
    },
    create: {
      nome: 'Admin',
      email: 'admin@example.com',
      senhaHash,
      role: 'ADMIN',
      admin: true
    },
  });

  console.log('Usuário admin criado/atualizado:', admin);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 