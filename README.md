# AdminStore - Sistema POS Profissional Multi-loja

## 📋 Visão Geral

AdminStore é um **Sistema de Gestão de Loja (POS - Point of Sale) profissional**, tipo Shoprite, desenvolvido como PWA (Progressive Web App) com funcionalidades completas para vendas, pagamentos reais e gestão multi-loja.

## ✨ Funcionalidades Principais

### 🛒 Sistema POS Completo
- **Carrinho inteligente** com adição/remoção de produtos
- **Busca rápida** de produtos por nome ou código
- **Interface de vendas** otimizada para touchscreen
- **Cálculo automático** de totais com suporte a descontos
- **Histórico** de últimas vendas

### 💳 Pagamentos Reais (M-Pesa, E-Mola, mKesh, Cartão)
- **M-Pesa**: Integração com API de pagamentos móveis
- **E-Mola**: Suporte para pagamentos eletrónicos
- **mKesh**: Carteira digital
- **Cartão Bancário**: Via Stripe (sandbox/produção)
- **Dinheiro**: Com cálculo de troco automático
- **Cheque**: Registro de pagamento

### 🖨️ Impressão Profissional
- **Impressora Térmica USB**: Via window.print()
- **Impressora Bluetooth 58mm**: Web Bluetooth API
- **Impressora Bluetooth 80mm**: Compatibilidade total
- **Recibos em PDF**: Download automático
- **Formato Shoprite**: Logo, produtos, total, pagamento

### 📱 Scanner QR/Código de Barras
- **Câmera integrada**: Via html5-qrcode
- **Leitura automática**: QR Code e EAN/UPC
- **Histórico de leituras**: Com timestamps
- **Entrada manual**: Para emergências
- **Câmera frontal/traseira**: Seleção dinâmica

### 🏪 Sistema Multi-loja
- **Múltiplas lojas**: Um utilizador pode ter várias
- **Logo por loja**: Upload e customização
- **Dados independentes**: Cada loja tem seus próprios registos
- **Relatórios por loja**: Análise separada
- **Super Admin**: Ver todas as lojas

### 🔐 Autenticação Supabase
- **Registro seguro**: Com verificação de email
- **Confirmação por código**: 6 dígitos via Supabase
- **JWT tokens**: Sessões seguras
- **Recuperação de senha**: Email automático

### 📊 Dashboard Profissional
- **Estatísticas em tempo real**: Vendas hoje, mês, total
- **Gráficos interativos**: Tendências de vendas
- **Relatórios completos**: Por período, produto, cliente
- **Export para Excel**: Análise externa

### 📂 Banco de Dados (Supabase)
Tabelas implementadas:
- `lojas` - Dados de cada loja
- `usuarios` - Utilizadores e autenticação
- `produtos` - Catálogo de produtos
- `clientes` - Base de clientes
- `vendas` - Histórico de vendas
- `pagamentos` - Detalhe de pagamentos

### 🌐 PWA - Funcionamento Offline
- **Service Worker**: Cache inteligente
- **Offline First**: Funciona sem internet
- **IndexedDB**: Sincronização de dados
- **Background Sync**: Envia dados quando voltar online
- **Instalável**: Como aplicativo nativo

## 🚀 Instalação e Configuração

### Pré-requisitos
- Node.js 14+ (opcional, para servidor de desenvolvimento)
- Navegador moderno (Chrome, Firefox, Edge, Safari)
- Supabase account (gratuito em https://supabase.com)

### 1. Configurar Supabase

```bash
# 1. Criar conta em https://supabase.com
# 2. Criar novo projeto
# 3. Copiar URL e chave API
# 4. Atualizar em index.html, painel.html, pos.html:

const SUPABASE_URL = 'https://seu-projeto.supabase.co';
const SUPABASE_KEY = 'sua-chave-publica';
```

### 2. Criar Tabelas no Supabase

```sql
-- Tabela de Lojas
CREATE TABLE lojas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  owner_id UUID REFERENCES auth.users,
  country TEXT,
  logo TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de Utilizadores
CREATE TABLE usuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  loja_id UUID REFERENCES lojas(id),
  role TEXT DEFAULT 'vendedor',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de Produtos
CREATE TABLE produtos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  loja_id UUID REFERENCES lojas(id),
  nome TEXT NOT NULL,
  sku TEXT NOT NULL,
  preco DECIMAL(10,2),
  quantidade INT DEFAULT 0,
  categoria TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de Clientes
CREATE TABLE clientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  loja_id UUID REFERENCES lojas(id),
  nome TEXT NOT NULL,
  telefone TEXT,
  email TEXT,
  endereco TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de Vendas
CREATE TABLE vendas (
  id TEXT PRIMARY KEY,
  loja_id UUID REFERENCES lojas(id),
  cliente_id UUID REFERENCES clientes(id),
  total DECIMAL(10,2),
  items JSONB,
  metodo_pagamento TEXT,
  status TEXT DEFAULT 'completed',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de Pagamentos
CREATE TABLE pagamentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venda_id TEXT REFERENCES vendas(id),
  metodo TEXT,
  valor DECIMAL(10,2),
  referencia TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 3. Publicar a Aplicação

#### Opção A: Vercel (Recomendado)
```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Fazer login
vercel login

# 3. Deploy
vercel
```

#### Opção B: Netlify
```bash
# 1. Conectar repositório Git
# 2. Deploy automático de https://github.com/seu-usuario/adminstore
```

#### Opção C: Servidor Próprio (Apache/Nginx)
```bash
# 1. Copiar todos os arquivos para /var/www/html/adminstore/
# 2. Configurar SSL (Let's Encrypt)
# 3. Apontar domínio

# Nginx config:
server {
    listen 443 ssl http2;
    server_name seu-dominio.com;
    
    ssl_certificate /etc/letsencrypt/live/seu-dominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/seu-dominio.com/privkey.pem;
    
    root /var/www/html/adminstore;
    index index.html;
    
    # PWA
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## 📱 Usar como Aplicativo

### Android
1. Abrir em Chrome
2. Menu (⋯) → Instalar aplicativo
3. Aceitar
4. Ícone na Home Screen

### iOS
1. Abrir em Safari
2. Partilhar → Adicionar à Home Screen
3. Nomear e Adicionar

### Computador
1. Abrir em Edge/Chrome
2. Menu (⋯) → Instalar AdminStore
3. Ícone no Desktop

## 🖨️ Conectar Impressoras

### Impressora Bluetooth

1. **Emparelar no Sistema**:
   - Android: Configurações > Bluetooth > Procurar dispositivos
   - iOS: Configurações > Bluetooth > Procurar dispositivos
   - Windows: Configurações > Dispositivos > Bluetooth

2. **Na Aplicação**:
   - Clicar "Conectar Impressora"
   - Selecionar impressora na lista
   - Confirmar emparelhamento no dispositivo
   - Aparecerá "Impressora conectada"

3. **Imprimir Recibo**:
   - Ao finalizar venda, clicar "Imprimir"
   - Recibo enviado diretamente para impressora

### Impressora USB

- Conectar via USB
- Sistema deteta automaticamente
- Clicar "Imprimir" (usa window.print())

## 💰 Configurar Pagamentos Reais

### M-Pesa (Moçambique)
```javascript
// Em pos.html, adicionar:
const MPESA_API = 'https://api.vodacom.co.mz/mpesa/c2b/v1/queryTransactionStatus';
const MPESA_KEY = 'sua-chave-api';
const MPESA_SECRET = 'sua-chave-secreta';
```

### E-Mola (Moçambique)
```javascript
const EMOLA_API = 'https://api.emola.co.mz/api/payment';
const EMOLA_MERCHANT_ID = 'seu-id-comerciante';
const EMOLA_API_KEY = 'sua-chave-api';
```

### mKesh (Angola/Moçambique)
```javascript
const MKESH_API = 'https://api.mkesh.com/v1/payments';
const MKESH_KEY = 'sua-chave-api';
```

### Stripe (Cartão - Teste)
```javascript
const STRIPE_PUBLIC_KEY = 'pk_test_51234567890';
const STRIPE_SECRET_KEY = 'sk_test_98765432'; // Apenas no servidor!
```

## 📊 Estrutura de Arquivos

```
/
├── index.html          # Página inicial e login
├── painel.html         # Dashboard da loja
├── pos.html           # Sistema POS/Vendas
├── scanner.html       # Leitor QR com câmera
├── manifest.json      # Configuração PWA
├── service-worker.js  # Service Worker offline
└── README.md          # Esta documentação
```

## 🔑 Principais APIs Utilizadas

- **Supabase Auth**: Autenticação
- **Supabase Database**: Banco de dados
- **Web Bluetooth API**: Impressoras Bluetooth
- **HTML5 QR Code**: Scanner QR
- **IndexedDB**: Armazenamento offline
- **Service Worker**: Cache e sincronização
- **Web Print API**: Impressão

## 🛡️ Segurança

- ✅ HTTPS obrigatório em produção
- ✅ JWT tokens para autenticação
- ✅ Row-level security no Supabase
- ✅ Validação de entrada no cliente e servidor
- ✅ Proteção CSRF em formulários
- ✅ Dados sensíveis não armazenados no localStorage
- ⚠️ NÃO colocar chaves secretas no cliente!

## 🧪 Testar a Aplicação

1. **Abrir em navegador**:
   ```
   http://localhost:8000 (ou seu domínio)
   ```

2. **Registar conta**:
   - Preencher formulário de registro
   - Confirmar email com código de 6 dígitos
   - Fazer login

3. **Testar POS**:
   - Clicar "PDV (Vendas)"
   - Adicionar produtos ao carrinho
   - Selecionar método de pagamento
   - Finalizar venda
   - Imprimir recibo

4. **Testar Scanner**:
   - Clicar "Scanner QR"
   - Permitir câmera
   - Apontar para código QR/barras

## 📈 Dicas de Uso

### Aumentar Vendas
- Adicionar mais produtos via Dashboard
- Usar códigos QR/EAN nos produtos
- Treinar vendedores na interface

### Manter Sistema Rápido
- Limpar histórico do navegador periodicamente
- Atualizar Supabase para plano pago em produção
- Usar CDN para imagens

### Integração com Contabilidade
- Exportar vendas em Excel via Dashboard
- Sincronizar com contabilista mensalmente
- Manter backups de dados

## 🐛 Troubleshooting

### Câmera não funciona
- Verificar permissões do navegador
- Permitir câmera em Configurações
- Tentar em navegador diferente

### Impressora não conecta
- Verificar emparelhamento Bluetooth
- Reiniciar impressora
- Testar com aplicativo do fabricante

### Dados não sincronizam offline
- Verificar conexão internet
- Limpar cache do navegador
- Verificar status do Supabase

### Login não funciona
- Verificar email está ativado no Supabase
- Limpar cookies
- Tentar incógnito

## 📞 Suporte

Para problemas:
1. Verificar documentação Supabase
2. Consultar chat de suporte do navegador (F12)
3. Contactar support@adminstore.com

## 📄 Licença

Este projeto é de uso livre. Modifique conforme necessário.

## 🎯 Roadmap

- [ ] Integração WhatsApp para notificações
- [ ] App nativa Android/iOS
- [ ] Gestão de fidelização de clientes
- [ ] Relatórios avançados com IA
- [ ] Sincronização com ERP
- [ ] Suporte múltiplas moedas
- [ ] Vendas por telefone (takeaway)

---

**Desenvolvido com ❤️ para pequenos e médios negócios**

Versão: 1.0.0  
Última atualização: Fevereiro 2026
