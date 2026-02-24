# 💳 Guia de Integração de Pagamentos Reais

## M-Pesa (Moçambique)

### 1. Obter Credenciais
- Contactar Vodacom em Maputo
- Solicitar API M-Pesa
- Fornecer: Domínio, IP, Documentação Comercial

### 2. Configuração no AdminStore

```javascript
// Em pos.html, adicionar após processPayment():

// Configuração M-Pesa
const MPESA_CONFIG = {
    apiUrl: 'https://api.vodacom.co.mz/mpesa/c2b/v1/queryTransactionStatus',
    consumerKey: 'seu-consumer-key',
    consumerSecret: 'seu-consumer-secret',
    businessShortCode: '123456',
    passkey: 'sua-passkey',
    amount: 0,
    phoneNumber: '',
    accountReference: 'AdminStore',
    transactionDesc: 'Pagamento de Venda'
};

async function processMpesaPayment(phone, amount) {
    try {
        const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
        const password = btoa(MPESA_CONFIG.businessShortCode + MPESA_CONFIG.passkey + timestamp);
        
        const payload = {
            BusinessShortCode: MPESA_CONFIG.businessShortCode,
            Password: password,
            Timestamp: timestamp,
            TransactionType: 'CustomerPayBillOnline',
            Amount: Math.round(amount),
            PartyA: phone.replace(/\D/g, ''),
            PartyB: MPESA_CONFIG.businessShortCode,
            PhoneNumber: phone.replace(/\D/g, ''),
            CallBackURL: 'https://seu-dominio.com/api/mpesa/callback',
            AccountReference: MPESA_CONFIG.accountReference,
            TransactionDesc: MPESA_CONFIG.transactionDesc
        };

        const response = await fetch(MPESA_CONFIG.apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + await getMpesaToken()
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        
        if (data.ResponseCode === '0') {
            return {
                success: true,
                checkoutRequestID: data.CheckoutRequestID,
                customerMessage: data.CustomerMessage
            };
        } else {
            throw new Error(data.errorMessage || 'Erro M-Pesa');
        }
    } catch (error) {
        console.error('Erro M-Pesa:', error);
        throw error;
    }
}

async function getMpesaToken() {
    const auth = btoa(MPESA_CONFIG.consumerKey + ':' + MPESA_CONFIG.consumerSecret);
    const response = await fetch('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
        method: 'GET',
        headers: {
            'Authorization': 'Basic ' + auth
        }
    });
    
    const data = await response.json();
    return data.access_token;
}

// Chamar quando M-Pesa é selecionado:
// await processMpesaPayment(phoneNumber, total);
```

### 3. Callback Server (Node.js)

```javascript
// backend/routes/mpesa.js
const express = require('express');
const router = express.Router();

router.post('/callback', (req, res) => {
    const body = req.body.Body;
    const result = body.stkCallback;
    
    if (result.ResultCode === 0) {
        // Pagamento bem-sucedido
        const metadata = result.CallbackMetadata.Item;
        const amount = metadata[0].Value;
        const mpesaRef = metadata[1].Value;
        const phoneNumber = metadata[4].Value;
        
        // Atualizar venda como paga no Supabase
        console.log('Pagamento confirmado:', {
            amount,
            mpesaRef,
            phoneNumber
        });
    }
    
    res.json({ success: true });
});

module.exports = router;
```

---

## E-Mola (Moçambique)

### 1. Obter Credenciais
- Visitar https://emola.co.mz
- Registar como comerciante
- Obter Merchant ID e API Key

### 2. Configuração

```javascript
const EMOLA_CONFIG = {
    apiUrl: 'https://api.emola.co.mz/api/payment',
    merchantId: 'seu-merchant-id',
    apiKey: 'sua-api-key',
    callbackUrl: 'https://seu-dominio.com/api/emola/callback'
};

async function processEmolaPay(email, amount, orderId) {
    try {
        const payload = {
            merchantId: EMOLA_CONFIG.merchantId,
            amount: amount,
            currency: 'MZN',
            email: email,
            orderId: orderId,
            description: 'Compra AdminStore',
            callbackUrl: EMOLA_CONFIG.callbackUrl,
            redirectUrl: 'https://seu-dominio/pos.html'
        };

        // Assinar requisição
        const signature = generateEmolaSig (payload);

        const response = await fetch(EMOLA_CONFIG.apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': EMOLA_CONFIG.apiKey,
                'X-SIGNATURE': signature
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        
        if (data.status === 'success') {
            // Redirecionar para URL de pagamento
            window.location.href = data.paymentUrl;
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error('Erro E-Mola:', error);
        showAlert('Erro ao processar pagamento E-Mola', 'error');
    }
}

function generateEmolaSig(payload) {
    // Implementar conforme documentação E-Mola
    return 'signature-hash';
}
```

---

## mKesh (Angola/Moçambique)

### 1. Obter Credenciais
- Visitar https://mkesh.com
- Registar comerciante
- Obter API credentials

### 2. Configuração

```javascript
const MKESH_CONFIG = {
    apiUrl: 'https://api.mkesh.com/v1/payments',
    publicKey: 'sua-public-key',
    secretKey: 'sua-secret-key',
    webhookUrl: 'https://seu-dominio.com/api/mkesh/webhook'
};

async function processMkeshPayment(email, amount, phone) {
    try {
        const payload = {
            public_key: MKESH_CONFIG.publicKey,
            amount: amount * 100, // Centavos
            email: email,
            phone: phone,
            first_name: 'Cliente',
            last_name: 'AdminStore',
            currency: 'MZN',
            description: 'Venda POS',
            metadata: {
                orderId: generateId()
            }
        };

        const response = await fetch(MKESH_CONFIG.apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + MKESH_CONFIG.secretKey
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        
        if (data.success) {
            // Abrir modal de pagamento
            openMkeshPaymentModal(data.authorization_url);
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error('Erro mKesh:', error);
        showAlert('Erro ao processar pagamento mKesh', 'error');
    }
}
```

---

## Stripe (Cartão Bancário)

### 1. Obter Credenciais
- Criar conta em https://stripe.com
- Modo Teste: pk_test_... e sk_test_...
- Modo Produção: pk_live_... e sk_live_...

### 2. Instalação

```html
<!-- Em pos.html, adicionar no HEAD -->
<script src="https://js.stripe.com/v3/"></script>
```

### 3. Configuração Completa

```javascript
const STRIPE_CONFIG = {
    publicKey: 'pk_test_seu-teste-key',
    secretKey: 'sk_test_seu-teste-secret', // APENAS no servidor!
    webhookSecret: 'whsec_seu-webhook-secret'
};

// Inicializar Stripe
const stripe = Stripe(STRIPE_CONFIG.publicKey);

async function processStripePayment(amount, email) {
    try {
        // Criar PaymentIntent no servidor
        const response = await fetch('/api/create-payment-intent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify({
                amount: Math.round(amount * 100),
                email: email,
                metadata: {
                    orderId: generateId()
                }
            })
        });

        const data = await response.json();

        // Confirmar pagamento com Stripe
        const confirmResult = await stripe.confirmCardPayment(data.clientSecret, {
            payment_method: {
                card: {
                    token: data.stripeToken // Ou usar Elements
                },
                billing_details: {
                    email: email
                }
            }
        });

        if (confirmResult.paymentIntent.status === 'succeeded') {
            return {
                success: true,
                paymentIntentId: confirmResult.paymentIntent.id
            };
        } else {
            throw new Error('Pagamento não confirmado');
        }
    } catch (error) {
        console.error('Erro Stripe:', error);
        showAlert('Erro ao processar cartão', 'error');
    }
}

// Versão com Stripe Elements (UI melhor)
async function setupStripeElements() {
    const elements = stripe.elements();
    const cardElement = elements.create('card');
    cardElement.mount('#card-element');

    document.getElementById('card-element').addEventListener('change', (event) => {
        const displayError = document.getElementById('card-errors');
        if (event.error) {
            displayError.textContent = event.error.message;
        } else {
            displayError.textContent = '';
        }
    });

    return { stripe, elements, cardElement };
}
```

### 4. Backend Server (Node.js)

```javascript
// backend/routes/stripe.js
const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET);

router.post('/create-payment-intent', async (req, res) => {
    const { amount, email, metadata } = req.body;

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount, // Em centavos
            currency: 'mzn', // Moeda
            description: 'Venda AdminStore',
            receipt_email: email,
            metadata: metadata
        });

        res.json({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Webhook para confirmação
router.post('/webhook', express.raw({type: 'application/json'}), (req, res) => {
    const sig = req.headers['stripe-signature'];

    try {
        const event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );

        if (event.type === 'payment_intent.succeeded') {
            const paymentIntent = event.data.object;
            
            // Atualizar venda como paga no Supabase
            console.log('Pagamento confirmado:', paymentIntent.id);
        }

        res.json({received: true});
    } catch (err) {
        res.status(400).send(`Webhook Error: ${err.message}`);
    }
});

module.exports = router;
```

---

## Validação de Pagamento Universal

```javascript
// Função para validar todos os métodos
async function validatePayment(method, amount, phoneOrEmail) {
    switch(method) {
        case 'mpesa':
            return await validateMpesa(phoneOrEmail, amount);
        case 'emola':
            return await validateEmola(phoneOrEmail, amount);
        case 'mkesh':
            return await validateMkesh(phoneOrEmail, amount);
        case 'card':
            return await validateCard(phoneOrEmail, amount);
        case 'cash':
            return { success: true, verified: true };
        default:
            throw new Error('Método desconhecido');
    }
}

// Salvar transação
async function recordTransaction(saleId, method, amount, reference, status = 'pending') {
    const transaction = {
        id: generateId(),
        saleId: saleId,
        method: method,
        amount: amount,
        reference: reference,
        status: status,
        timestamp: new Date().toISOString()
    };

    // Salvar no Supabase
    const response = await fetch(`${SUPABASE_URL}/rest/v1/pagamentos`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'apikey': SUPABASE_KEY
        },
        body: JSON.stringify(transaction)
    });

    return response.json();
}
```

---

## Testes

### M-Pesa
- Número teste: 254708374149
- PIN: 123456

### Stripe
- Cartão visa: 4242 4242 4242 4242
- Data: 12/25
- CVC: 123
- ZIP: 12345

### E-Mola
- Consultar portal de testes

---

## Variáveis de Ambiente (.env)

```
# Supabase
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_KEY=sua-chave-publica

# M-Pesa
MPESA_KEY=chave
MPESA_SECRET=secret
MPESA_CODE=123456
MPESA_PASSKEY=passkey

# E-Mola
EMOLA_MERCHANT_ID=id
EMOLA_API_KEY=chave

# mKesh
MKESH_PUBLIC_KEY=public
MKESH_SECRET_KEY=secret

# Stripe
STRIPE_PUBLIC=pk_live_...
STRIPE_SECRET=sk_live_... (servidor apenas)
STRIPE_WEBHOOK=whsec_...
```

---

## Checklist de Implementação

- [ ] Credenciais M-Pesa obtidas
- [ ] Credenciais E-Mola obtidas
- [ ] Credenciais mKesh obtidas
- [ ] Conta Stripe criada
- [ ] Variáveis de ambiente configuradas
- [ ] Backend preparado para callbacks
- [ ] Testes de pagamento concluídos
- [ ] Webhooks configurados
- [ ] Certificados SSL ativados
- [ ] Transações registadas em database
- [ ] Relatórios de pagamento funcionando

---

**Nota**: Nunca coloque chaves secretas no código frontend. Use sempre um backend seguro para processar pagamentos.
