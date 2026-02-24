# 🚀 Guia de Deployment - AdminStore

## Opções de Deployment

### 1. Vercel (Recomendado - Grátis até 100K requests/mês)

#### Passos:

1. **Criar conta Vercel**:
   - Ir para https://vercel.com
   - Fazer signup com GitHub/GitLab/Bitbucket
   - Conectar repositório

2. **Configurar projeto**:
   ```bash
   # Clonar repositório
   git clone https://github.com/seu-usuario/adminstore.git
   cd adminstore

   # Instalar Vercel CLI (opcional)
   npm i -g vercel

   # Deploy
   vercel
   ```

3. **Configurar domínio**:
   - Ir para Vercel Dashboard
   - Projeto → Settings → Domains
   - Adicionar domínio customizado
   - Atualizar DNS do domínio

4. **Variáveis de Ambiente**:
   - Settings → Environment Variables
   - Adicionar:
     ```
     SUPABASE_URL=https://seu-projeto.supabase.co
     SUPABASE_KEY=sua-chave-publica
     ```

5. **HTTPS Automático**:
   - Vercel gera certificado Let's Encrypt automaticamente

---

### 2. Netlify (Fácil - Grátis até 300 min/mês)

#### Passos:

1. **Conectar repositório**:
   - https://app.netlify.com
   - New site from Git
   - Selecionar GitHub/GitLab/Bitbucket
   - Selecionar repositório

2. **Configuração Build** (se necessário):
   - Build command: `echo 'PWA Application'`
   - Publish directory: `/`

3. **Variáveis de ambiente**:
   - Site settings → Build & deploy → Environment
   - Adicionar variáveis

4. **Deploy automático**:
   - A cada push, Netlify faz deploy automaticamente

---

### 3. AWS S3 + CloudFront

#### Setup:

1. **Criar bucket S3**:
   ```bash
   # Usando AWS CLI
   aws s3 mb s3://adminstore-seu-dominio

   # Configurar para website
   aws s3api put-bucket-website \
     --bucket adminstore-seu-dominio \
     --website-configuration file://website.json
   ```

2. **website.json**:
   ```json
   {
     "IndexDocument": {
       "Suffix": "index.html"
     },
     "ErrorDocument": {
       "Key": "index.html"
     }
   }
   ```

3. **Upload arquivos**:
   ```bash
   aws s3 sync . s3://adminstore-seu-dominio \
     --exclude ".git/*" \
     --exclude "node_modules/*"
   ```

4. **Criar CloudFront Distribution**:
   - AWS Console → CloudFront
   - Create Distribution
   - Origin: seu bucket S3
   - Default Root Object: index.html
   - Certificate: ACM (gratuito)

5. **Configurar DNS**:
   - Route 53 → Create Record
   - Type: A (Alias)
   - CloudFront Distribution

---

### 4. Servidor Próprio (Nginx + Docker)

#### Docker Compose Setup:

```yaml
# docker-compose.yml
version: '3.8'

services:
  adminstore:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./:/usr/share/nginx/html
      - ./nginx.conf:/etc/nginx/nginx.conf
      - /etc/letsencrypt:/etc/letsencrypt
    restart: always
    environment:
      - DOMAIN=seu-dominio.com

  certbot:
    image: certbot/certbot
    volumes:
      - /etc/letsencrypt:/etc/letsencrypt
      - /var/lib/letsencrypt:/var/lib/letsencrypt
    entrypoint: "/bin/sh -c 'certbot certonly --standalone -d seu-dominio.com && sleep 86400'"
    restart: always
```

#### nginx.conf:

```nginx
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_types text/plain text/css text/xml text/javascript 
               application/x-javascript application/xml+rss 
               application/javascript;

    # Cache headers
    map $sent_http_content_type $expires {
        default                    off;
        text/html                  epoch;
        text/css                   max;
        application/javascript     max;
        ~image/                    max;
    }

    # HTTP redirect
    server {
        listen 80;
        server_name seu-dominio.com www.seu-dominio.com;
        return 301 https://$server_name$request_uri;
    }

    # HTTPS
    server {
        listen 443 ssl http2;
        server_name seu-dominio.com www.seu-dominio.com;

        ssl_certificate /etc/letsencrypt/live/seu-dominio.com/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/seu-dominio.com/privkey.pem;

        # SSL Modern config
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers HIGH:!aNULL:!MD5;
        ssl_prefer_server_ciphers on;

        # Security headers
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-XSS-Protection "1; mode=block" always;

        root /usr/share/nginx/html;
        index index.html;

        # Cache assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 365d;
            add_header Cache-Control "public, immutable";
        }

        # PWA - Service Worker
        location = /service-worker.js {
            add_header Cache-Control "no-cache, no-store, must-revalidate";
            add_header Pragma "no-cache";
            add_header Expires "0";
        }

        # PWA - Manifest
        location = /manifest.json {
            add_header Cache-Control "no-cache, no-store, must-revalidate";
        }

        # SPA - Redirecionar 404 para index.html
        location / {
            try_files $uri $uri/ /index.html;
        }
    }
}
```

#### Deploy com Docker:

```bash
# Build
docker-compose build

# Run
docker-compose up -d

# Check logs
docker-compose logs -f adminstore
```

---

### 5. GitHub Pages + Actions (Grátis - Estático)

#### .github/workflows/deploy.yml:

```yaml
name: Deploy AdminStore

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./
          cname: seu-dominio.com
```

---

## Checklist de Deployment

### Pré-Deployment
- [ ] Todos os testes passaram
- [ ] Variáveis de ambiente configuradas
- [ ] Supabase pronto em produção
- [ ] Domínio registado
- [ ] SSL certificate pronto
- [ ] Backups configurados

### Segurança
- [ ] HTTPS ativado
- [ ] CORS configurado corretamente
- [ ] Rate limiting ativo
- [ ] WAF habilitado (se disponível)
- [ ] Logs de erro configurados
- [ ] Monitoramento de performance

### Performance
- [ ] Caching habilitado
- [ ] Gzip compression ativo
- [ ] CDN configurado
- [ ] Imagens otimizadas
- [ ] Minificação CSS/JS
- [ ] Service Worker funcionando

### Monitoramento
- [ ] Sentry configurado (error tracking)
- [ ] Google Analytics integrado
- [ ] Alertas de downtime
- [ ] Backups automáticos
- [ ] Logs centralizados

---

## Otimizações Pós-Deploy

### 1. Sentry (Error Tracking)

```javascript
// No index.html, adicionar:
<script src="https://browser.sentry-cdn.com/7.85.0/bundle.min.js"></script>
<script>
    Sentry.init({
        dsn: "https://seu-key@sentry.io/seu-project",
        environment: "production",
        tracesSampleRate: 0.1
    });
</script>
```

### 2. Google Analytics

```javascript
// Adicionar em painel.html:
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### 3. Monitoramento Uptime

```bash
# Usando Uptime Robot (grátis)
# https://uptimerobot.com
# - Monitorar: https://seu-dominio.com
# - Alertas por email a cada 5 min de downtime
```

---

## Scaling para Múltiplas Regiões

### Geo-Replication com Supabase

```sql
-- Supabase Dashboard → SQL Editor
-- Criar réplicas em diferentes regiões
SELECT * FROM regions; -- Ver regiões disponíveis

-- Criar réplica
SELECT create_replica('seu-projeto-sa', 'sa-east-1');
```

### CDN Multi-Região

**Usando Cloudflare:**
1. https://dash.cloudflare.com
2. Adicionar domínio
3. Nameservers → Cloudflare
4. Performance → Auto Minify (ativar)
5. Caching → Aggressive

---

## Troubleshooting Deployment

### PWA não instala
```bash
# Verificar Service Worker
chrome://serviceworker-internals

# Verificar Manifest
chrome://apps

# Logs no console
console.log(navigator.serviceWorker)
```

### Performance lenta
```bash
# Analisar com Lighthouse
# DevTools → Lighthouse → Analyze page load

# Verificar Core Web Vitals
# https://web.dev/measure/

# Medir com WebPageTest
# https://www.webpagetest.org
```

### Erro 404 no reload
```nginx
# Adicionar no nginx.conf:
location / {
    try_files $uri $uri/ /index.html =404;
}
```

### CORS errors
```javascript
// Adicionar header no servidor
Access-Control-Allow-Origin: https://seu-dominio.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
```

---

## Backups Automáticos

### Supabase
- Dashboard → Settings → Backups
- Automático diariamente (incluso no plano pago)

### Dados Locais
```bash
# Script de backup
#!/bin/bash
DATE=$(date +%Y%m%d)
tar -czf backup-$DATE.tar.gz ./
aws s3 cp backup-$DATE.tar.gz s3://seu-bucket/backups/
```

---

## Certificado SSL

### Let's Encrypt (Automático)

```bash
# Usando Certbot
certbot certonly --standalone -d seu-dominio.com

# Renovar automaticamente
certbot renew --dry-run

# Cron job
0 3 * * * certbot renew --quiet
```

---

## Custos Estimados (Mensal)

| Serviço | Preço |
|---------|-------|
| Vercel | Grátis (até 100K req) |
| Netlify | Grátis (até 300 min build) |
| Supabase | $25 (Pro) |
| Stripe | 2.9% + $0.30 por transação |
| Domínio | $10-15 |
| **TOTAL** | **$35-40** |

---

## Próximas Etapas

1. ✅ Deploy em staging (teste)
2. ✅ Testes de carga
3. ✅ Testes de segurança
4. ✅ Treinamento de utilizadores
5. ✅ Migração de dados (se necessário)
6. ✅ Go-live!

---

**Versão**: 1.0.0  
**Última atualização**: Fevereiro 2026
