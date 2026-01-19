const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Création de la classe ICT-L2
  const classe = await prisma.classe.upsert({
    where: { nom: 'ICT-L2' },
    update: {},
    create: {
      nom: 'ICT-L2',
      effectif: 150,
      filiere: 'Informatique',
    },
  });

  // Création d'une salle
  await prisma.salle.upsert({
    where: { nom: 'S003' },
    update: {},
    create: { nom: 'S003', capacite: 80 },
  });

  console.log("Données de démo ICT-L2 créées !");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());