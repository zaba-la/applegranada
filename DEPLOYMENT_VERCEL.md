# Guía de Deployment en Vercel

Esta guía te ayudará a desplegar Soporte Granada en Vercel de forma segura y eficiente.

## 📋 Requisitos Previos

- Cuenta en [Vercel](https://vercel.com)
- Cuenta en [GitHub](https://github.com)
- Credenciales de servicios externos configuradas

## 🚀 Pasos para Desplegar

### 1. Preparar el Proyecto

Asegúrate de que todo esté commiteado en Git:

```bash
git add .
git commit -m "Preparar para deployment en Vercel"
git push origin main
```

### 2. Conectar Vercel a GitHub

1. Dirígete a [vercel.com](https://vercel.com)
2. Inicia sesión con tu cuenta
3. Haz clic en "New Project"
4. Selecciona "Import Git Repository"
5. Busca y selecciona el repositorio `soportegranada`
6. Haz clic en "Import"

### 3. Configurar Variables de Entorno

En el panel de Vercel:

1. Ve a "Settings" → "Environment Variables"
2. Añade todas las variables necesarias:

```
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=tu-secreto-seguro-aqui
NEXTAUTH_URL=https://soportegranada.vercel.app (o tu dominio)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_PAYPAL_CLIENT_ID=...
PAYPAL_SECRET_ID=...
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=...
SENDGRID_API_KEY=...
SENDGRID_FROM_EMAIL=noreply@soportegranada.es
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=...
NEXT_PUBLIC_SITE_URL=https://soportegranada.vercel.app
NODE_ENV=production
```

### 4. Configurar Base de Datos

Soporte Granada requiere PostgreSQL. Recomendamos:

#### Opción A: Neon (Recomendado para Vercel)

1. Ve a [neon.tech](https://neon.tech)
2. Crea una cuenta y un nuevo proyecto
3. Copia la connection string
4. Pégala como `DATABASE_URL` en Vercel

```bash
# Desde tu máquina local, ejecutar migraciones
DATABASE_URL=tu-connection-string npx prisma migrate deploy
```

#### Opción B: Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Crea un nuevo proyecto
3. Ve a "Settings" → "Database"
4. Copia la connection string PostgreSQL
5. Pégala como `DATABASE_URL` en Vercel

#### Opción C: AWS RDS

1. Crea una instancia RDS de PostgreSQL
2. Obtén la connection string
3. Asegúrate de que el security group permita conexiones
4. Pégala como `DATABASE_URL` en Vercel

### 5. Deploy Inicial

Después de configurar las variables:

1. Haz clic en "Deploy"
2. Vercel ejecutará el build automáticamente
3. Espera a que se complete

### 6. Ejecutar Migraciones de Base de Datos

Una vez que el deploy inicial sea exitoso:

```bash
# Opción 1: Desde tu máquina (recomendado inicialmente)
DATABASE_URL=tu-production-db-url npx prisma migrate deploy

# Opción 2: Desde la consola de Vercel
# Ir a Deployments → Funciones → Ver logs
```

### 7. Configurar Dominio Personalizado

1. En Vercel, ve a "Settings" → "Domains"
2. Añade tu dominio (ej: soportegranada.es)
3. Vercel te dará instrucciones de DNS
4. Actualiza los DNS en tu proveedor de dominios

### 8. Configurar HTTPS y SSL

Vercel proporciona SSL automáticamente con Let's Encrypt. Una vez configurado el dominio, verifica:

1. Ve a "Settings" → "Certificates"
2. Asegúrate de que el certificado está activo
3. Todos los subdominios también estarán protegidos

## 🔑 Secretos para GitHub Actions (Opcional)

Si deseas usar CI/CD automático:

1. Ve al repositorio en GitHub
2. Settings → Secrets and variables → Actions
3. Añade los siguientes secretos:

```
VERCEL_TOKEN=tu-vercel-token
VERCEL_ORG_ID=tu-org-id
VERCEL_PROJECT_ID=tu-project-id
```

Para obtenerlos:
- **VERCEL_TOKEN**: [vercel.com/account/tokens](https://vercel.com/account/tokens)
- **VERCEL_ORG_ID** y **VERCEL_PROJECT_ID**: En los settings del proyecto en Vercel

## 🛡️ Configuración de Seguridad

### Stripe Webhooks

1. Ve a tu dashboard de Stripe
2. Webhooks → Añadir endpoint
3. URL: `https://soportegranada.vercel.app/api/webhooks/stripe`
4. Eventos a escuchar:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copia el Signing Secret → `STRIPE_WEBHOOK_SECRET`

### PayPal Webhooks

1. Ve a [developer.paypal.com](https://developer.paypal.com)
2. Apps & Credentials
3. Webhooks → Create Webhook
4. URL: `https://soportegranada.vercel.app/api/webhooks/paypal`
5. Selecciona los eventos necesarios
6. Copia el Webhook ID → `PAYPAL_WEBHOOK_ID`

### Google Maps

1. Ve a [Google Cloud Console](https://console.cloud.google.com)
2. Crea un nuevo proyecto
3. Habilita: Maps JavaScript API, Places API, Maps Embed API
4. Crea una clave API
5. Restringe a tus dominios
6. Copia la clave → `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`

### SendGrid (Email)

1. Ve a [sendgrid.com](https://sendgrid.com)
2. Crea una cuenta y verifica tu dominio
3. Email API → Create API Key
4. Copia la clave → `SENDGRID_API_KEY`

### Twilio (SMS)

1. Ve a [twilio.com](https://twilio.com)
2. Account → Auth Tokens
3. Copia Account SID y Auth Token
4. Compra un número de teléfono (Messaging)
5. Copia los valores → `TWILIO_*`

## 🔄 Deployment Automático

### Desde Main

Cada push a la rama `main` activará:
1. Tests unitarios
2. Linting y type check
3. Build
4. Deploy a producción (si todo pasa)

### Desde Develop

Cada push a `develop` solo ejecuta:
1. Tests
2. Linting
3. Build (sin deploy)

## 📊 Monitoreo

### Vercel Analytics

1. Ve a "Analytics" en tu proyecto Vercel
2. Monitorea Web Vitals
3. Verifica performance

### Error Tracking

1. Ve a "Error Tracking" en Vercel
2. Recibe alertas automáticas
3. Identifica problemas rápidamente

### Database Logs

Con Neon/Supabase:
1. Accede al dashboard de la BD
2. Monitorea queries lentas
3. Optimiza según sea necesario

## 🔧 Troubleshooting

### Build Falla

```bash
# Verifica el build localmente
npm run build

# Comprueba tipos
npm run type-check

# Comprueba linting
npm run lint
```

### Migraciones Fallan

```bash
# Conecta directamente a la BD
DATABASE_URL=tu-url npx prisma migrate status

# Si hay problema, verifica que la BD esté accesible
```

### Variables de Entorno No Encontradas

1. Ve a Vercel → Settings → Environment Variables
2. Verifica que estén correctamente añadidas
3. Redeploy el proyecto

### Problemas con NextAuth

```bash
# Asegúrate de que NEXTAUTH_SECRET sea único y largo
openssl rand -base64 32

# Actualiza NEXTAUTH_URL a tu dominio final
```

## 🚀 Escalado

Si el tráfico crece:

1. **Database**: Aumenta los recursos en Neon/Supabase
2. **Serverless**: Vercel escala automáticamente
3. **Storage**: Considera usar Cloudinary o S3 para archivos

## 📞 Soporte

- [Documentación de Vercel](https://vercel.com/docs)
- [Discord de Vercel](https://vercel.com/support)
- [Documentación de Next.js](https://nextjs.org/docs)

## ✅ Checklist Final

- [ ] Proyecto en GitHub
- [ ] Variables de entorno configuradas en Vercel
- [ ] Base de datos PostgreSQL creada
- [ ] Migraciones ejecutadas
- [ ] Dominio configurado y DNS apuntando a Vercel
- [ ] HTTPS activado
- [ ] Webhooks de Stripe/PayPal configurados
- [ ] SendGrid/Twilio configurados
- [ ] CI/CD funcionando
- [ ] Tests pasando
- [ ] Error tracking activo
- [ ] Backups de BD configurados
- [ ] Alertas configuradas

¡Listo para producción! 🎉
