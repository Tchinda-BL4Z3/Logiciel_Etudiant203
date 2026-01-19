// logique pour trouver une salle adaptée

const getSallesDisponibles = async (req, res) => {
  const { effectifClasse, jour, plageHoraire } = req.query;

  // 1. Trouver les salles qui ont assez de places
  const sallesAssezGrandes = await prisma.salle.findMany({
    where: {
      capacite: { gte: parseInt(effectifClasse) }
    }
  });

  // 2. Vérifier lesquelles ne sont pas déjà occupées à ce moment-là
  const sallesOccupees = await prisma.session.findMany({
    where: { jour, plageHoraire },
    select: { salleId: true }
  });

  const idsOccupees = sallesOccupees.map(s => s.salleId);
  const disponibles = sallesAssezGrandes.filter(s => !idsOccupees.includes(s.id));

  res.json(disponibles);
};