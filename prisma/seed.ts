import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed de base de datos...");

  // Hash de la contraseña
  const hashedPassword = await bcrypt.hash("Espanoles@2027", 12);

  // Crear admin
  const admin = await prisma.user.upsert({
    where: { email: "miguel@zaba.la" },
    update: {},
    create: {
      email: "miguel@zaba.la",
      password: hashedPassword,
      name: "Miguel Zabala",
      role: "ADMIN",
      locale: "es",
    },
  });

  console.log("✅ Admin creado:", admin);

  // Crear algunos planes de ejemplo (opcional)
  const planProfessional = await prisma.plan.upsert({
    where: { id: "plan-professional" },
    update: {},
    create: {
      id: "plan-professional",
      nameEs: "Plan Profesional",
      nameEn: "Professional Plan",
      descriptionEs: "Soporte dedicado para profesionales",
      descriptionEn: "Dedicated support for professionals",
      priceRemote: 29.99,
      priceOnSite: 49.99,
      billingCycle: "MONTHLY",
      features: JSON.stringify([
        "Soporte remoto ilimitado",
        "Visitas presenciales incluidas",
        "Prioridad en tickets",
      ]),
      segment: "PROFESSIONAL",
    },
  });

  console.log("✅ Plan Professional creado:", planProfessional);

  const planBusiness = await prisma.plan.upsert({
    where: { id: "plan-business" },
    update: {},
    create: {
      id: "plan-business",
      nameEs: "Plan Empresarial",
      nameEn: "Business Plan",
      descriptionEs: "Solución completa para empresas",
      descriptionEn: "Complete solution for businesses",
      priceRemote: 79.99,
      priceOnSite: 129.99,
      billingCycle: "MONTHLY",
      features: JSON.stringify([
        "Soporte 24/7",
        "Múltiples usuarios",
        "API access",
        "SLA garantizado",
      ]),
      segment: "BUSINESS",
    },
  });

  console.log("✅ Plan Business creado:", planBusiness);

  console.log("✅ Seed completado exitosamente!");
}

main()
  .catch((e) => {
    console.error("❌ Error en seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
