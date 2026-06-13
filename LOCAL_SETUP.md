# 🚀 Setup Local - AppleGranada

Instrucciones paso a paso para ejecutar el sitio localmente.

## ✅ Requisitos Previos

- Node.js 18+ instalado
- PostgreSQL 12+ corriendo localmente
- Git

## 📋 Paso 1: Instalar Dependencias

```bash
npm install
```

## 📋 Paso 2: Configurar la Base de Datos PostgreSQL

### Opción A: PostgreSQL local (recomendado para desarrollo)

```bash
# Asegúrate de que PostgreSQL está corriendo
# En macOS con Homebrew:
brew services start postgresql

# O si usas Docker:
docker-compose up -d
```

### Opción B: Crear DB manualmente

```bash
# Conectar a PostgreSQL
psql postgres

# En la consola de psql:
CREATE DATABASE applegranada;
CREATE USER applegranada_user WITH PASSWORD 'tu_password';
ALTER ROLE applegranada_user SET client_encoding TO 'utf8';
ALTER ROLE applegranada_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE applegranada_user SET default_transaction_deferrable TO on;
ALTER ROLE applegranada_user SET default_timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE applegranada TO applegranada_user;
\q
```

## 📋 Paso 3: Actualizar `.env.local`

Asegúrate de que tienes los valores correctos en `.env.local`:

```env
# Database - Ajusta según tu setup
DATABASE_URL="postgresql://applegranada_user:tu_password@localhost:5432/applegranada"

# Authentication
NEXTAUTH_SECRET="tu-clave-super-segura-cambiar-en-produccion"
NEXTAUTH_URL="http://localhost:3000"

# Las variables de Stripe, PayPal, Google Maps, SendGrid, Twilio
# ya deberían estar configuradas desde Vercel
# Para desarrollo local, usa valores de prueba (test keys)
```

## 📋 Paso 4: Ejecutar Migraciones y Seed

```bash
# Generar cliente Prisma
npm run prisma:generate

# Ejecutar migraciones
npm run prisma:migrate

# Ejecutar seed (crear admin y planes)
npm run prisma:seed
```

**Resultado esperado:**
```
🌱 Iniciando seed de base de datos...
✅ Admin creado: { email: 'miguel@zaba.la', role: 'ADMIN', ... }
✅ Plan Professional creado: { ... }
✅ Plan Business creado: { ... }
✅ Seed completado exitosamente!
```

## 📋 Paso 5: Iniciar el Servidor de Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en:
```
http://localhost:3000
```

## 🔐 Credenciales de Admin

- **Email**: `miguel@zaba.la`
- **Contraseña**: `Espanoles@2027`

Usa estas credenciales para login en:
```
http://localhost:3000/es/auth/login
```

## 🛠️ Comandos Útiles

```bash
# Ver estructura de BD en Prisma Studio
npm run prisma:studio

# Hacer push de cambios en schema sin migraciones
npm run prisma:push

# Type-check
npm run type-check

# Lint
npm run lint

# Build de producción
npm run build

# Start producción
npm start
```

## 🐳 Alternativa: Usar Docker

Si prefieres usar Docker para la BD:

```bash
# Iniciar PostgreSQL en Docker
docker-compose up -d

# Luego sigue los pasos 1, 3 y 4
npm install
npm run prisma:migrate
npm run prisma:seed

# Iniciar desarrollo
npm run dev
```

## 🔍 Troubleshooting

### Error: "relation \"users\" does not exist"

Ejecuta:
```bash
npm run prisma:migrate
npm run prisma:seed
```

### Error: "Connect ECONNREFUSED 127.0.0.1:5432"

PostgreSQL no está corriendo. Inicia con:
```bash
brew services start postgresql
# o
docker-compose up -d
```

### Error: "NEXTAUTH_SECRET is not set"

Asegúrate de que `.env.local` tiene `NEXTAUTH_SECRET` con un valor.

### Puerto 3000 ya en uso

Cambia el puerto:
```bash
npm run dev -- -p 3001
```

## 📱 Acceder a la Aplicación

- **Home (Marketing)**: http://localhost:3000/es
- **Login Admin**: http://localhost:3000/es/auth/login
- **Dashboard Admin**: http://localhost:3000/es/admin (después de login)
- **Cambiar idioma**: Usa el selector en la navegación

## 📝 Notas Importantes

- Las notificaciones (email/SMS) actualmente loguean en consola
- Para Stripe webhooks en desarrollo, usa [Stripe CLI](https://stripe.com/docs/stripe-cli)
- Google Maps requiere API key configurada (obtenida de Google Cloud Console)
- Por ahora no hay componentes ni páginas - el setup es solo de infraestructura

## 🎯 Próximos Pasos

1. Crear componentes UI con shadcn/ui
2. Implementar páginas de marketing
3. Crear dashboard de cliente
4. Crear panel de admin
5. Integrar autenticación
6. Configurar pagos (Stripe/PayPal)

---

¿Necesitas ayuda? Revisa QUICKSTART.md o DEPLOYMENT_VERCEL.md
