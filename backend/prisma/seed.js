const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Début du peuplement de la base de données...");

  // 1. MAPPING FILIÈRES -> DÉPARTEMENTS (Pour la cohérence)
  const filieresInfo = [
    { nom: "ICT4D", dep: "Informatique" },
    { nom: "Info Fonda", dep: "Informatique" },
    { nom: "Mathématiques", dep: "Mathématiques" },
    { nom: "Physique", dep: "Physique" },
    { nom: "Chimie", dep: "Chimie" },
    { nom: "Biologie", dep: "Biologie" }
  ];

  // 2. CRÉATION DES CLASSES
  for (const f of filieresInfo) {
    for (const niveau of ["L1", "L2", "L3"]) {
      const nomClasse = `${f.nom}-${niveau}`;
      await prisma.classe.upsert({
        where: { nom: nomClasse },
        update: {},
        create: {
          nom: nomClasse,
          filiere: f.nom,
          departement: f.dep, // <-- AJOUT DU CHAMP MANQUANT
          effectif: Math.floor(Math.random() * (150 - 40 + 1)) + 40,
        },
      });
    }
  }

  // 3. CRÉATION DES SALLES
  const salles = [
    { nom: 'Amphi 250', capacite: 250 },
    { nom: 'Amphi 502', capacite: 500 },
    { nom: 'S003', capacite: 80 },
    { nom: 'S102', capacite: 40 },
  ];

  for (const s of salles) {
    await prisma.salle.upsert({
      where: { nom: s.nom },
      update: {},
      create: s,
    });
  }

  // 4. COMPTE ADMIN
  await prisma.user.upsert({
    where: { email: 'admin@uy1.cm' },
    update: {},
    create: {
      nom: 'Admin',
      email: 'admin@uy1.cm',
      password: 'admin', // Rappel : à hasher plus tard pour la sécurité
      role: 'ADMIN',
    },
  });

  console.log("✅ Données de démonstration créées avec succès !");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });