# AppleGranada - Plataforma de Soporte Técnico

Sitio web corporativo y plataforma de gestión de soporte técnico para dispositivos Apple, con panel de cliente y administración completa.

## 🚀 Características Principales

### Sitio Web Corporativo
- ✅ Multi-página (Inicio, Servicios, Planes, Sobre nosotros, Contacto, Blog)
- ✅ Blog con 10 artículos optimizados para SEO
- ✅ Bilingüe (Español/Inglés)
- ✅ Diseño moderno y minimalista
- ✅ Tema light/dark
- ✅ Responsivo

### Dashboard de Cliente
- ✅ Gestión de tickets de soporte
- ✅ Mi Cuenta (perfil y configuración)
- ✅ Mi Plan (actual y opciones de cambio)
- ✅ Mis Facturas (historial y descargas)
- ✅ Notificaciones en tiempo real (Email + SMS)

### Panel de Administrador
- ✅ Gestión de clientes
- ✅ Gestión de planes (remoto/presencial)
- ✅ Gestión de facturas y pagos
- ✅ Gestión de tickets de soporte
- ✅ Reportes y estadísticas

### Funcionalidades Técnicas
- ✅ Autenticación segura (NextAuth.js)
- ✅ Base de datos con Prisma + PostgreSQL
- ✅ Integración de pagos (Stripe + PayPal)
- ✅ Sistema de notificaciones (Email + SMS)
- ✅ Soporte remoto con TeamViewer
- ✅ Ubicación presencial con Google Maps
- ✅ Validación de datos con Zod

## 📋 Requisitos Previos

- Node.js 18+ 
- npm o yarn
- PostgreSQL 12+
- Git

## ⚙️ Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/applegranada.git
cd applegranada
```

### 2. Instalar dependencias

```bash
npm install
# o
yarn install
```

### 3. Configurar variables de entorno

Copia el archivo `.env.example` a `.env.local` y completa los valores:

```bash
cp .env.example .env.local
```

Edita `.env.local` con tus credenciales:

```env
# Database
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/applegranada"

# Authentication
NEXTAUTH_SECRET="tu-secreto-seguro-aqui"
NEXTAUTH_URL="http://localhost:3000"

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# PayPal
NEXT_PUBLIC_PAYPAL_CLIENT_ID="tu-client-id"
PAYPAL_SECRET_ID="tu-secret-id"

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="tu-api-key"

# Email Service (SendGrid o similar)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="tu-email@gmail.com"
SMTP_PASSWORD="tu-contraseña"

# SMS Service (Twilio o similar)
TWILIO_ACCOUNT_SID="tu-account-sid"
TWILIO_AUTH_TOKEN="tu-auth-token"
TWILIO_PHONE_NUMBER="+34..."

# Application
NODE_ENV="development"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

### 4. Configurar la base de datos

```bash
# Ejecutar migraciones de Prisma
npx prisma migrate dev --name init

# Generar cliente Prisma
npx prisma generate
```

### 5. Crear usuario administrador (opcional)

```bash
# Seed de datos (si existe seed.ts)
npx prisma db seed
```

## 🏃 Ejecutar el Proyecto

### Desarrollo

```bash
npm run dev
# o
yarn dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### Producción

```bash
# Build
npm run build

# Start
npm start
```

## 📁 Estructura del Proyecto

```
applegranada/
├── app/                    # Next.js App Router
│   ├── [locale]/          # Rutas por idioma
│   │   ├── page.tsx       # Home
│   │   ├── servicios/     # Servicios
│   │   ├── planes/        # Planes y precios
│   │   ├── sobre-nosotros/ # Acerca de
│   │   ├── contacto/      # Contacto
│   │   ├── blog/          # Blog
│   │   ├── dashboard/     # Dashboard cliente
│   │   │   ├── tickets/
│   │   │   ├── account/
│   │   │   ├── plan/
│   │   │   └── invoices/
│   │   └── admin/         # Panel admin
│   ├── api/               # API Routes
│   └── layout.tsx         # Root layout
├── components/            # Componentes reutilizables
├── lib/                   # Utilidades
│   ├── prisma.ts         # Cliente Prisma
│   ├── notification-*.ts # Sistema de notificaciones
│   ├── ticket-utils.ts   # Utilidades de tickets
│   └── schemas.ts        # Validaciones Zod
├── messages/             # Traducciones i18n
│   ├── es.json          # Español
│   └── en.json          # Inglés
├── prisma/              # Schema de BD
│   └── schema.prisma
├── public/              # Assets estáticos
└── styles/              # Estilos globales

```

## 🛠️ Stack Tecnológico

### Frontend
- **Framework**: Next.js 14 (App Router)
- **UI**: shadcn/ui + Radix UI
- **Styling**: Tailwind CSS
- **Temas**: next-themes
- **i18n**: next-intl

### Backend
- **Runtime**: Node.js
- **ORM**: Prisma
- **Autenticación**: NextAuth.js
- **Validación**: Zod

### Base de Datos
- **DBMS**: PostgreSQL
- **Migraciones**: Prisma Migrate

### Integraciones
- **Pagos**: Stripe, PayPal
- **Email**: SendGrid (configurable)
- **SMS**: Twilio (configurable)
- **Mapas**: Google Maps API
- **Soporte Remoto**: TeamViewer API

## 🔑 Variables de Entorno Requeridas

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `DATABASE_URL` | Conexión a PostgreSQL | `postgresql://...` |
| `NEXTAUTH_SECRET` | Secreto para tokens | `random-string-here` |
| `NEXTAUTH_URL` | URL de la aplicación | `http://localhost:3000` |
| `STRIPE_SECRET_KEY` | API Key de Stripe | `sk_test_...` |
| `PAYPAL_SECRET_ID` | ID secreto de PayPal | `...` |

## 📝 Modelos de Base de Datos

### Usuario
- ID, Email, Contraseña
- Rol (Admin/Cliente)
- Idioma preferido

### Cliente
- Datos personales
- Plan asignado
- Dispositivos Apple

### Plan
- Nombre (ES/EN)
- Precio remoto/presencial
- Características
- Ciclo de facturación

### Ticket
- Código único (6 caracteres)
- Estado, Prioridad
- Tipo de dispositivo
- Modo de servicio (remoto/presencial)
- Ubicación (si presencial)
- Código de TeamViewer (si remoto)

### Factura
- Número único
- Monto, Estado
- Cliente, Plan
- Fecha de vencimiento

### Notificación
- Tipo (TICKET_CREATED, PAYMENT_RECEIVED, etc.)
- Canal (EMAIL, SMS, AMBOS)
- Estado (PENDING, SENT, FAILED)
- Contenido personalizado

## 🔐 Seguridad

- ✅ Contraseñas hasheadas (bcryptjs)
- ✅ Autenticación con JWT
- ✅ Protección CSRF
- ✅ Validación de entrada (Zod)
- ✅ Rate limiting (recomendado)
- ✅ Comunicación encriptada (HTTPS)
- ✅ Variables de entorno no expuestas

## 📊 API Endpoints (Ejemplos)

```
POST   /api/auth/register        # Registro de cliente
POST   /api/auth/login           # Login
POST   /api/tickets              # Crear ticket
GET    /api/tickets/:id          # Obtener ticket
PATCH  /api/tickets/:id          # Actualizar ticket
POST   /api/invoices             # Crear factura
GET    /api/payments/:id         # Obtener pago
POST   /api/admin/plans          # Crear plan (admin)
GET    /api/admin/customers      # Listar clientes (admin)
```

## 🧪 Testing

```bash
# Ejecutar tests
npm run test

# Coverage
npm run test:coverage
```

## 📦 Build para Producción

```bash
# Verificar tipos
npm run type-check

# Linting
npm run lint

# Build
npm run build

# Verificar que el build está correcto
npm start
```

## 🚀 Deployment

### Vercel (Recomendado)

```bash
npm i -g vercel
vercel
```

### Docker

```bash
# Crear imagen
docker build -t applegranada .

# Ejecutar contenedor
docker run -p 3000:3000 applegranada
```

### Otros proveedores
- Railway
- Render
- DigitalOcean
- AWS

## 📖 Documentación Adicional

- [Next.js](https://nextjs.org/docs)
- [Prisma](https://www.prisma.io/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [next-intl](https://next-intl-docs.vercel.app)

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/amazing-feature`)
3. Commit tus cambios (`git commit -m 'Add amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👥 Soporte

¿Preguntas o problemas? 

- 📧 Email: hola@applegranada.es
- 🐛 Issues: [GitHub Issues](https://github.com/tu-usuario/applegranada/issues)
- 💬 Discusiones: [GitHub Discussions](https://github.com/tu-usuario/applegranada/discussions)

## 🙌 Créditos

- Diseño y concepto: AppleGranada
- Desarrollado con ❤️ usando Next.js y Tailwind CSS

---

**Versión**: 1.0.0  
**Última actualización**: Junio 2026
