# 📖 INSTRUÇÕES COMPLETAS DE USO - ADMINSTORE

## 🎯 ÍNDICE
1. [Começar](#começar)
2. [Login e Registro](#login-e-registro)
3. [Dashboard](#dashboard)
4. [Sistema POS](#sistema-pos)
5. [Scanner QR](#scanner-qr)
6. [Pagamentos](#pagamentos)
7. [Impressoras](#impressoras)
8. [Offline](#offline-mode)
9. [FAQ](#faq)

---

## 🚀 COMEÇAR

### 1. Primeiro Acesso
```
1. Abrir navegador (Chrome, Firefox, Safari, Edge)
2. Ir para: https://seu-dominio.com
3. Você verá a página inicial do AdminStore
4. Escolher: "Fazer Login" ou "Criar Conta"
```

### 2. Requisitos Mínimos
- ✅ Navegador moderno (2020+)
- ✅ Conexão internet (primeira vez)
- ✅ Dispositivo: Smartphone, Tablet ou Computador
- ✅ Câmera (opcional, para scanner QR)

---

## 📝 LOGIN E REGISTRO

### CRIAR CONTA (Primeira Vez)

#### Passo 1: Formulário de Registro
```
1. Clicar em "Registar-se"
2. Preencher:
   ├─ Nome da Loja: (nome da sua loja)
   ├─ Email: (seu email válido)
   ├─ Senha: (mín. 6 caracteres)
   ├─ Confirmar Senha: (mesma password)
   ├─ Logo (opcional): (clicar para upload)
   └─ País: (Moçambique, Angola, etc.)
```

#### Passo 2: Força da Senha
```
🔴 Muito fraca  → Adicione maiúsculas, números, símbolos
🟠 Fraca        → Continue melhorando
🟡 Média        → Boa senha
🟢 Forte        → Muito segura
🟢 Muito Forte  → Excelente!
```

#### Passo 3: Confirmação de Email
```
1. Após submeter, você receberá um email
2. No email virá um CÓDIGO de 6 dígitos
3. Inserir os 6 dígitos nos campos da tela
4. Clicar "Confirmar"
5. ✅ Sua conta foi criada!
```

### FAZER LOGIN

#### Cada Vez que Aceder
```
1. Ir para: https://seu-dominio.com
2. Inserir:
   ├─ Email: seu@email.com
   └─ Senha: sua-senha-segura
3. Clicar "Entrar"
4. ✅ Bem-vindo ao Dashboard!
```

#### Esqueceu a Senha?
```
1. Clicar em "Esqueci a senha" (em breve)
2. Inserir seu email
3. Receberá link de reset
4. Criar nova senha
5. Fazer login novamente
```

---

## 📊 DASHBOARD

### Layout Principal

O Dashboard mostra:
```
┌─────────────────────────────────────────────────┐
│  ADMINSTORE - Painel de Controlo                 │
├────────────┬──────────────────────────────────────┤
│   SIDEBAR  │                                      │
│            │         ESTATÍSTICAS HOJE             │
│   📊 Menu  │  • Vendas: 1.250,00 MT              │
│            │  • Transações: 12                     │
│            │  • Clientes: 5                        │
│            │                                      │
│   Links:   │  AÇÕES RÁPIDAS                       │
│  • PDV     │  [Novo PDV] [Scanner] [Produto]     │
│  • Scanner │                                      │
│  • Prods   │  ÚLTIMAS VENDAS                     │
│  • Config  │  ID  | Cliente | Valor | Data      │
│            │  ... | ...     | ...   | ...       │
└────────────┴──────────────────────────────────────┘
```

### Seções Principais

#### 1. ESTADÍSTICAS (Cards no Topo)
```
💰 VENDAS HOJE
   Total: 1.250,00 MT
   Comparação: ↑ 12.5% vs ontem

📊 VENDAS MÊS
   Total: 45.000,00 MT
   Comparação: ↑ 8.3% vs mês anterior

🔢 TRANSAÇÕES
   Número: 42
   Período: Últimas 24h

👥 CLIENTES
   Total registados: 125
   Novos este mês: 8
```

#### 2. AÇÕES RÁPIDAS (Botões)
```
[🛒 Novo PDV]        → Ir para sistema de vendas
[📱 Scanner QR]      → Abrir leitor de códigos
[📦 Novo Produto]    → Adicionar produto ao catálogo
[👥 Novo Cliente]    → Registar novo cliente
```

#### 3. ÚLTIMAS VENDAS (Tabela)
```
ID    Cliente       Valor      Data
123   João Silva    450,50 MT  28 Feb, 14:30
124   Maria Santos  120,00 MT  28 Feb, 15:45
125   Pedro Costa   89,99 MT   28 Feb, 16:20
...
```

### Navegação Sidebar

```
📊 DASHBOARD    → Página inicial (está aqui)
🛒 PDV          → Sistema de vendas
📱 SCANNER      → Leitor QR/código de barras
📦 PRODUTOS     → Gerenciar catálogo
💰 VENDAS       → Histórico de transações
👥 CLIENTES     → Base de clientes
📈 RELATÓRIOS   → Análises e gráficos
⚙️ CONFIGURAÇÃO → Settings da loja
```

---

## 🛒 SISTEMA POS (Ponto de Venda)

### Aceder ao POS

```
1. Clicar em "PDV (Vendas)" no sidebar
2. Ou clicar botão "Novo PDV" no Dashboard
3. Você verá 2 colunas: PRODUTOS | CARRINHO
```

### Layout do POS

```
┌────────────────────────────┬──────────────┐
│   PRODUTOS                 │  CARRINHO    │
│                            │              │
│ 🔍 Buscar produto...      │ Item 1   MT  │
│                            │ Item 2   MT  │
│ [Arroz 5kg]   450 MT      │ Item 3   MT  │
│ [Feijão 1kg]  250 MT      │              │
│ [Óleo 1L]     180 MT      │  Subtotal:   │
│ [Sal 1kg]     50 MT       │  Desconto:   │
│ [Açúcar 1kg]  120 MT      │              │
│ ...                        │  TOTAL:      │
│                            │              │
│                            │ [Finalizar V]│
└────────────────────────────┴──────────────┘
```

### PASSO 1: Adicionar Produtos

#### Opção A: Clicando em Produtos
```
1. Ver lista de produtos lado esquerdo
2. Clicar no produto (ex: "Arroz 5kg")
3. ✅ Produto adicionado ao carrinho!
4. Repetir para mais produtos
```

#### Opção B: Buscar
```
1. Clicar na barra de busca "🔍 Buscar..."
2. Digitar nome do produto (ex: "arroz")
3. Ver resultados filtrados
4. Clicar no resultado
5. ✅ Adicionado ao carrinho!
```

#### Opção C: Usar Scanner
```
1. Clicar botão "📱 Scanner QR"
2. Apontar câmera para código
3. Sistema lê automaticamente
4. ✅ Produto adicionado!
```

### PASSO 2: Ajustar Quantidades

No carrinho, para cada produto:
```
Arroz 5kg
Qtd: [−] 1 [+]    Preço: 450 MT
Status: Pronto para venda

Para aumentar: Clicar [+]
Para diminuir: Clicar [−]
Para remover: Clicar botão "Remover"
```

### PASSO 3: Ver Resumo

O carrinho mostra:
```
SUBTOTAL:  2.500,00 MT
DESCONTO:      0,00 MT
─────────────────────
TOTAL:     2.500,00 MT
```

### PASSO 4: Finalizar Venda

```
1. Clicar botão grande verde "Finalizar Venda"
2. Escolher forma de pagamento (ver abaixo)
3. Confirmar pagamento
4. ✅ Venda registada!
5. Recibo impresso automaticamente
6. Carrinho limpo, pronto para próxima venda
```

---

## 📱 SCANNER QR

### Acesso Rápido

```
1. Dashboard → Clicar "📱 Scanner QR"
2. Ou PDV → Clicar botão "📱 Scanner QR"
```

### Interface do Scanner

```
┌─────────────────────────────────┐
│  📱 Scanner QR/Código de Barras  │
├─────────────────────────────────┤
│  [📷 Câmera]  [⌨️ Manual]  [📋]  │  <- Abas
│                                 │
│  ┌─────────────────────────────┐│
│  │                              ││  <- Câmera
│  │     Aponte para código       ││
│  │                              ││
│  └─────────────────────────────┘│
│                                 │
│  Ou insira manualmente: [_____] │
│                                 │
│  [Histórico: 12 lidos]          │
└─────────────────────────────────┘
```

### PASSO 1: Permitir Câmera (Primeira Vez)

```
1. Quando abrir scanner, navegador pede permissão
2. Clicar "Permitir" ou "Allow"
3. ✅ Câmera ativada!
```

### PASSO 2: Ler Código

```
1. Apontar câmera para código QR ou barras
2. Deixar bem iluminado
3. Sistema lê automaticamente
4. ✅ Mostra produto encontrado
```

Se não encontrou:
```
❌ "Produto não encontrado"
Tente:
• Melhorar iluminação
• Aproximar mais
• Testar com outro código
```

### PASSO 3: Adicionar ao Carrinho

```
Quando produto é reconhecido:
┌─────────────────┐
│ ✓ Código Lido   │
│ Arroz 5kg       │
│ 450,00 MT       │
│ [Adicionar]     │
└─────────────────┘

Clicar "Adicionar" para colocar no carrinho
```

### Abas do Scanner

#### 📷 Câmera
- Usar câmera do dispositivo
- Lê QR e código de barras
- Histórico de leituras

#### ⌨️ Manual
- Digitar código manualmente
- Útil se câmera não funciona
- Colocar código e clicar "Ler"

#### 📋 Histórico
- Ver últimos códigos lidos
- Quantidade lida nesta sessão
- Copiar código para clipboard

---

## 💳 PAGAMENTOS

### Formas Suportadas

```
┌───────────────────────────────────────┐
│  Como Quer Pagar?                     │
├───────────────────────────────────────┤
│ [💵 Dinheiro]    [📱 M-Pesa]         │
│ [💳 Cartão]      [📲 E-Mola]         │
│ [💰 mKesh]       [📄 Cheque]         │
└───────────────────────────────────────┘
```

### DINHEIRO

```
1. Clicar "💵 Dinheiro"
2. Inserir valor recebido (ex: 3000)
3. Sistema calcula automaticamente:

   Total:        2.500,00 MT
   Recebido:     3.000,00 MT
   Troco:          500,00 MT

4. Confirmar pagamento
5. ✅ Pronto!
```

### M-PESA (Moçambique)

```
1. Clicar "📱 M-Pesa"
2. Inserir número de telefone:
   +258 82 123 4567
3. Inserir referência (opcional)
4. Sistema envia transação
5. Cliente confirma no telemóvel
6. ✅ Pagamento recebido!
```

### CARTÃO BANCÁRIO (Stripe)

```
1. Clicar "💳 Cartão"
2. Inserir dados:
   • Número: 4242 4242 4242 4242 (teste)
   • Validade: 12/25
   • CVC: 123
3. Clicar "Confirmar"
4. ✅ Processado!

⚠️ Dados não são armazenados
```

### E-MOLA (Moçambique)

```
1. Clicar "📲 E-Mola"
2. Sistema redireciona para portal
3. Cliente faz pagamento no banco
4. Confirmar no AdminStore
5. ✅ Venda confirmada!
```

### mKESH (Angola/Moçambique)

```
1. Clicar "💰 mKesh"
2. Inserir dados de acesso
3. Confirmar transação
4. Sistema recebe confirmação
5. ✅ Pago!
```

### CHEQUE

```
1. Clicar "📄 Cheque"
2. Inserir dados:
   • Número do cheque
   • Banco
   • Data
3. Registar na base
4. ✅ Pendente de compensação
```

---

## 🖨️ IMPRESSORAS

### CONECTAR IMPRESSORA BLUETOOTH

#### Primeira Vez

```
1. PDV → Botão "🖨️ Conectar Impressora"
2. Sistema lista impressoras disponíveis
3. Selecionar sua impressora
4. Confirmar emparelhamento NO DISPOSITIVO
5. Dispositivo pede confirmação
6. ✅ "Impressora conectada!"
```

#### Propriedades

```
Suportadas:
• Impressora Térmica 58mm
• Impressora Térmica 80mm
• Compatível com Bluetooth 4.0+
• Baud rate: 9600 bps

Não suportadas:
• Impressoras USB diretas
• Dispositivos Bluetooth antigos
• Impressoras de rede
```

### IMPRIMIR RECIBO

#### Automático

```
Ao finalizar venda:
1. Pagamento confirmado
2. Sistema envia para impressora
3. Recibo imprime automaticamente
4. ✅ Pronto!
```

#### Manual

```
1. PDV → Clicar "Imprimir"
2. Escolher:
   • Impressora Bluetooth
   • Impressora USB (print)
3. Inserir quantidade de cópias
4. ✅ Imprimindo...
```

### FORMATO DO RECIBO

```
══════════════════════════════════
        ADMINSTORE
        Loja Premium
════════════════════════════════════

ITENS:
Arroz 5kg          Qtd: 2    900,00 MT
Feijão 1kg         Qtd: 1    250,00 MT
Óleo 1L            Qtd: 1    180,00 MT

────────────────────────────────────
SUBTOTAL:                  1.330,00 MT
DESCONTO:                      0,00 MT
────────────────────────────────────
TOTAL:                     1.330,00 MT

PAGAMENTO: Dinheiro
DATA: 28 Feb 2026, 14:30

Obrigado pela compra!
════════════════════════════════════
```

### USAR SEM BLUETOOTH

Se não tiver Bluetooth:
```
1. Conectar impressora USB
2. PDV → Clicar "Imprimir"
3. Browser abre diálogo de impressão
4. Selecionar impressora USB
5. Clicar "Imprimir"
6. ✅ Cópia em papel!
```

---

## 📴 OFFLINE MODE

### Funciona Sem Internet?

**SIM!** ✅ AdminStore funciona 100% offline

### Como Funciona

```
Online:
1. Conexão internet ativa
2. Tudo sincroniza em tempo real
3. Acesso a todos os dados

Offline (sem internet):
1. Sistema ainda funciona normalmente
2. Dados locais (últimas vendas, produtos)
3. Nenhuma internet necessária

Volta a Conectar:
1. Internet volta
2. Sistema sincroniza automaticamente
3. Tudo atualiza
```

### Dados Guardados Localmente

```
✅ Carrinho (não guardado)
✅ Produtos (últimos consultados)
✅ Vendas (histórico local)
✅ Configurações (preferências)
❌ Dados novos de outros POS
```

### GUARDAR PARA OFFLINE

```
1. PDV → Botão "💾 Guardar Offline"
2. Sistema copia dados localmente
3. ✅ "Guardado com sucesso!"

Depois:
• Funciona mesmo sem internet
• Vendas ficam registadas localmente
• Sincroniza quando voltar online
```

### Sincronizar Dados

```
Automático:
• Quando volta internet
• Cada 5 minutos
• Ao abrir nova página

Manual:
1. Settings → "Sincronizar Agora"
2. Aguardar confirmação
3. ✅ "Sincronizado!"
```

---

## ❓ FAQ - PERGUNTAS FREQUENTES

### Esqueci a Senha

**P:** Como recupero a senha?
**R:** 
```
1. Página login → "Esqueci a senha"
2. Inserir email
3. Receber email com link
4. Criar nova senha
5. Fazer login
```

### Mudar Informações da Loja

**P:** Como mudo nome/logo da loja?
**R:**
```
1. Dashboard → ⚙️ Configuração
2. Editar:
   • Nome loja
   • Logo
   • Moeda
   • Horário funcionamento
3. Clicar "Guardar"
4. ✅ Atualizado!
```

### Adicionar Utilizadores

**P:** Posso adicionar vendedores?
**R:**
```
1. Settings → "Utilizadores"
2. Clicar "Adicionar Novo"
3. Inserir email do vendedor
4. Selecionar nível de acesso:
   • Vendedor: PDV + Dashboard
   • Gerente: +Produtos, Clientes
   • Admin: Acesso total
5. Enviar convite
6. Vendedor recebe email
7. ✅ Pronto!
```

### Imprimir Relatórios

**P:** Como exporto vendas?
**R:**
```
1. Dashboard → 📈 Relatórios
2. Selecionar período (hoje, mês, ano)
3. Clicar "Exportar Excel"
4. Arquivo baixa (*.xlsx)
5. Abrir em Excel/Google Sheets
6. ✅ Analisar dados!
```

### Integrar M-Pesa

**P:** Como configuro M-Pesa?
**R:**
```
1. Settings → "Pagamentos"
2. Clicar "Adicionar M-Pesa"
3. Inserir credenciais:
   • Consumer Key
   • Consumer Secret
   • Business Code
   • Passkey
4. Testar conexão
5. ✅ Pronto!

Contactar: support@adminstore.local
```

### Recuperar Venda Cancelada

**P:** Apaguei uma venda. Como recupero?
**R:**
```
1. Dashboard → "Relatórios"
2. Filtrar por data
3. Procurar venda no histórico
4. Clicar e ver detalhes
5. Sistema mantém histórico completo

⚠️ Não é possível apagar, apenas registar como cancelada
```

### Múltiplas Lojas

**P:** Tenho 2 lojas. Como faço?
**R:**
```
1. Dashboard → ⚙️ Configuração
2. "Adicionar Nova Loja"
3. Preencher dados
4. Ativar logo
5. Toggle entre lojas no sidebar
6. ✅ Cada loja tem seus dados!
```

### Dispositivo não Abre Câmera

**P:** Scanner não reconhece câmera
**R:**
```
1. Verificar permissões:
   • Android: Configurações > Apps > AdminStore > Câmera
   • iOS: Configurações > AdminStore > Câmera
   • Computador: Browser > Permissões

2. Se não funciona:
   • Usar "Entrada Manual"
   • Digitar código manualmente

3. Contactar: support@adminstore.local
```

---

## 🎓 DICAS & TRUQUES

### Keyboard Shortcuts

```
Ctrl + L     → Logout
Ctrl + K     → Focar busca de produtos
Enter        → Enviar formulário
Esc          → Fechar modal
```

### Otimizar Performance

```
1. Limpar cache: Settings → "Limpar Dados Locais"
2. Fechar abas desnecessárias
3. Reiniciar navegador diariamente
4. Usar navegador atualizado
```

### Segurança

```
✅ Senhas seguras (8+ caracteres)
✅ Logout ao terminar
✅ Não partilhar PIN
✅ HTTPS sempre
✅ Backups automáticos
```

### Primeiras Passos (Roteiro)

```
DIA 1:
1. Registar conta
2. Adicionar 5 produtos
3. Fazer 1 venda teste
4. Conectar impressora

DIA 2:
1. Treinar vendedor
2. Adicionar mais produtos
3. Configurar pagamentos

DIA 3:
1. Go live!
2. Monitorar vendas
3. Ajustar conforme necessário
```

---

## 📞 SUPORTE

### Precisa de Ajuda?

```
📧 Email:     support@adminstore.local
📚 Docs:      https://docs.adminstore.local
💬 Chat:      https://chat.adminstore.local
🔧 Issues:    https://github.com/adminstore/issues
```

### Horário de Atendimento

```
Segunda - Sexta:  08:00 - 18:00
Sábado:           09:00 - 13:00
Domingo:          Fechado

Resposta em:     < 2 horas
```

---

**Obrigado por usar AdminStore!** 🎉

*Para mais informações, visite https://docs.adminstore.local*

Versão: 1.0.0
Última atualização: Fevereiro 2026
