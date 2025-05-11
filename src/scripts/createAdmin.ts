import { prisma } from '../src/lib/prisma';
import bcrypt from 'bcrypt';

async function main() {
  const email = 'marcos.olimpio2003@gmail.com';
  const senha = 'is148700';
  const nome = 'Administrador';
  const senhaHash = await bcrypt.hash(senha, 10);

  const existe = await prisma.usuario.findUnique({ where: { email } });
  if (existe) {
    console.log('Usuário já existe.');
    return;
  }

  await prisma.usuario.create({
    data: {
      nome,
      email,
      senhaHash,
      admin: true,
    },
  });
  console.log('Usuário admin criado com sucesso!');
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); }); 