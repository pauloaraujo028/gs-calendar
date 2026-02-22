import { db } from "@/lib/prisma";

async function main() {
  console.log("🌱 Seeding database...");

  // Usuário fake (não interfere no login real)
  const user = await db.user.upsert({
    where: { email: "admin@empresa.com" },
    update: {},
    create: {
      id: "seed-user-1",
      name: "Administrador",
      email: "admin@empresa.com",
      emailVerified: true,
    },
  });

  // Salas
  const roomA = await db.room.create({
    data: {
      name: "Sala Alpha",
      capacity: 8,
      resources: ["TV", "Ar-condicionado", "Quadro branco"],
    },
  });

  const roomB = await db.room.create({
    data: {
      name: "Sala Beta",
      capacity: 4,
      resources: ["TV"],
    },
  });

  // Reservas
  await db.reservation.createMany({
    data: [
      {
        title: "Daily",
        description: "Reunião diária do time",
        startTime: new Date("2026-02-22T09:00:00"),
        endTime: new Date("2026-02-22T09:30:00"),
        roomId: roomA.id,
        userId: user.id,
      },
      {
        title: "Planejamento",
        startTime: new Date("2026-02-22T10:00:00"),
        endTime: new Date("2026-02-22T11:00:00"),
        roomId: roomA.id,
        userId: user.id,
      },
      {
        title: "Entrevista",
        startTime: new Date("2026-02-22T14:00:00"),
        endTime: new Date("2026-02-22T15:00:00"),
        roomId: roomB.id,
        userId: user.id,
      },
    ],
  });

  console.log("✅ Seed finalizado");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
