# 🚀 Iniciación Rápida - Soporte Granada

Una guía rápida para empezar a trabajar con Soporte Granada en tu máquina local.

## ⚙️ Instalación y Setup

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/soportegranada.git
cd soportegranada
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar Variables de Entorno

```bash
cp .env.example .env.local
```

Edita `.env.local` con tus valores locales:

```env
DATABASE_URL="postgresql://localhost/soportegranada"
NEXTAUTH_SECRET="dev-secret-key-change-in-production"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Configurar la Base de Datos

#### Opción A: Con Docker (Recomendado)

```bash
docker-compose up -d db

# Espera a que la BD esté lista
sleep 5

# Ejecutar migraciones
npx prisma migrate dev --name init
```

#### Opción B: PostgreSQL Local

```bash
# Crear BD (macOS con Homebrew)
brew services start postgresql
createdb soportegranada

# Ejecutar migraciones
npx prisma migrate dev --name init
```

### 5. Iniciar el Servidor de Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📁 Estructura del Proyecto

```
soportegranada/
├── app/                      # Next.js App Router
│   ├── [locale]/             # Rutas dinámicas por idioma (es, en)
│   │   ├── page.tsx          # Página de inicio
│   │   ├── servicios/        # Página de servicios
│   │   ├── planes/           # Página de planes
│   │   ├── sobre-nosotros/   # Página about
│   │   ├── contacto/         # Formulario de contacto
│   │   ├── blog/             # Artículos del blog
│   │   │   └── [slug]/       # Artículos individuales
│   │   ├── dashboard/        # Panel privado de cliente
│   │   │   ├── tickets/      # Gestión de tickets
│   │   │   ├── account/      # Perfil de cliente
│   │   │   ├── plan/         # Mi plan
│   │   │   └── invoices/     # Mis facturas
│   │   ├── admin/            # Panel admin (protegido)
│   │   │   ├── customers/    # Gestión de clientes
│   │   │   ├── plans/        # Gestión de planes
│   │   │   ├── tickets/      # Gestión de tickets
│   │   │   ├── invoices/     # Gestión de facturas
│   │   │   └── analytics/    # Reportes
│   │   └── auth/             # Autenticación
│   │       ├── login/        # Login
│   │       ├── register/     # Registro
│   │       └── forgot-password/
│   ├── api/                  # API Routes
│   │   ├── auth/
│   │   ├── tickets/
│   │   ├── invoices/
│   │   ├── payments/
│   │   ├── webhooks/         # Webhooks de Stripe/PayPal
│   │   └── admin/
│   ├── layout.tsx            # Root layout
│   └── middleware.ts         # Middleware (i18n, auth)
│
├── components/               # Componentes reutilizables
│   ├── ui/                   # shadcn/ui components
│   ├── navigation/           # Navegación
│   ├── footer/               # Footer
│   ├── forms/                # Formularios
│   ├── dashboard/            # Componentes del dashboard
│   └── admin/                # Componentes del admin
│
├── lib/                      # Utilidades y helpers
│   ├── prisma.ts             # Cliente Prisma
│   ├── notification-*.ts     # Sistema de notificaciones
│   ├── ticket-utils.ts       # Utilidades de tickets
│   ├── schemas.ts            # Validaciones Zod
│   ├── auth.ts              # Configuración de autenticación
│   └── api-client.ts        # Cliente HTTP
│
├── messages/                 # Archivos i18n
│   ├── es.json              # Traducciones español
│   └── en.json              # Traducciones inglés
│
├── prisma/                  # Base de datos
│   ├── schema.prisma        # Schema de BD
│   └── migrations/          # Historial de migraciones
│
├── public/                  # Assets estáticos
│   ├── images/
│   ├── icons/
│   └── fonts/               # Fuentes personalizadas
│
├── styles/                  # Estilos globales
│   └── globals.css          # CSS global + Tailwind
│
├── middleware.ts            # Middleware global
├── i18n.ts                  # Configuración i18n
├── .env.example             # Template de variables
├── .env.local              # Variables locales (no subir)
├── tsconfig.json           # Config TypeScript
├── tailwind.config.ts      # Config Tailwind
├── next.config.js          # Config Next.js
├── vercel.json             # Config Vercel
└── package.json            # Dependencias
```

## 🗄️ Base de Datos

### Ver datos

```bash
# Abrir Prisma Studio (interfaz gráfica)
npm run prisma:studio
```

### Crear migraciones

```bash
# Después de cambiar schema.prisma
npx prisma migrate dev --name nombre-de-cambio
```

### Resetear BD (desarrollo)

```bash
# ⚠️ SOLO en desarrollo
npx prisma migrate reset
```

## 🎨 Componentes UI

Los componentes vienen de shadcn/ui. Para añadir un nuevo componente:

```bash
npx shadcn-ui@latest add [component-name]

# Ejemplos:
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add form
```

## 🌍 Internacionalización (i18n)

Los textos están en `messages/es.json` y `messages/en.json`.

Para usar una traducción en un componente:

```typescript
import { useTranslations } from 'next-intl';

export default function MyComponent() {
  const t = useTranslations();
  
  return <h1>{t('home.hero.title')}</h1>;
}
```

## 🔐 Autenticación

La autenticación usa NextAuth.js. Para proteger rutas:

```typescript
import { auth } from '@/lib/auth';

export default async function ProtectedPage() {
  const session = await auth();
  
  if (!session) {
    redirect('/login');
  }
  
  return <div>{session.user.email}</div>;
}
```

## 💳 Pagos

Stripe y PayPal están configurados. Para procesar pagos:

```typescript
import { createCheckoutSession } from '@/lib/stripe';

// En tu API route
const session = await createCheckoutSession({
  customerId: user.id,
  planId: plan.id,
  successUrl: '/success',
  cancelUrl: '/cancel',
});
```

## 🔔 Notificaciones

El sistema de notificaciones envía emails y SMS automáticamente:

```typescript
import { NotificationTriggers } from '@/lib/notification-triggers';

// Al crear un ticket
await NotificationTriggers.onTicketCreated(customerId, {
  ticketCode: 'AB5K7Q',
  title: 'Problema con Mac',
  dashboardLink: 'https://...',
});
```

## ✅ Comandos Útiles

```bash
# Desarrollo
npm run dev              # Inicia servidor dev
npm run build           # Build de producción
npm start               # Inicia servidor producción

# Tipos y Linting
npm run type-check      # Verificar tipos TypeScript
npm run lint            # Ejecutar ESLint

# Base de datos
npm run prisma:generate # Generar cliente Prisma
npm run prisma:migrate  # Crear migración
npm run prisma:push     # Sincronizar schema
npm run prisma:studio   # Abrir Prisma Studio

# Testing (cuando esté implementado)
npm test                # Ejecutar tests
npm run test:coverage   # Tests con coverage
```

## 🐛 Troubleshooting

### Error: "Module not found"

```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

### Error: "Prisma client not found"

```bash
# Regenerar cliente Prisma
npx prisma generate
```

### Error: "Cannot find database"

```bash
# Asegúrate de que PostgreSQL está corriendo
# En Docker:
docker-compose ps

# O localmente:
brew services list | grep postgresql
```

### Cambios no se reflejan en el navegador

```bash
# Limpiar caché de Next.js
rm -rf .next
npm run dev
```

## 📝 Convenciones de Código

### Componentes

```typescript
// Siempre tipados con TypeScript
interface Props {
  title: string;
  onClick?: () => void;
}

export default function MyComponent({ title, onClick }: Props) {
  return <div onClick={onClick}>{title}</div>;
}
```

### API Routes

```typescript
// api/tickets/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    // Procesar...
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Error' }, { status: 400 });
  }
}
```

### Colores

- Primary: Negro/Blanco (según tema)
- Accent: Color principal de marca
- Muted: Colores grises
- Destructive: Rojo para acciones destructivas

## 🚀 Deployment

Ver [DEPLOYMENT_VERCEL.md](./DEPLOYMENT_VERCEL.md) para instrucciones completas de deployment.

## 📚 Recursos

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [Prisma](https://www.prisma.io/docs)
- [next-intl](https://next-intl-docs.vercel.app)

## 💡 Tips

1. Usa `npx prisma studio` frecuentemente para revisar la BD
2. Instala [Prisma extension](https://marketplace.visualstudio.com/items?itemName=Prisma.prisma) en VS Code
3. Usa el archivo `.env.local` para secretos locales
4. Lee los commits anteriores para entender la arquitectura
5. Usa branches descriptivas: `feature/ticket-system`, `fix/login-bug`

¡Feliz coding! 🎉
