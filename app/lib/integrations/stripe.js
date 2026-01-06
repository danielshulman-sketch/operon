/**
 * Stripe Integration
 * Actions: create_customer, create_payment, create_payment_link, create_checkout_session, check_payment_status
 */

export const stripeIntegration = {
    name: 'Stripe',

    /**
     * Create a new Stripe customer
     */
    async create_customer(credentials, config, context) {
        const { email, name, description } = config;

        if (!email) {
            throw new Error('Email is required');
        }

        const params = new URLSearchParams();
        params.append('email', email);
        if (name) params.append('name', name);
        if (description) params.append('description', description);

        const response = await fetch('https://api.stripe.com/v1/customers', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${credentials.api_key}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`Stripe API error: ${error.error.message}`);
        }

        const data = await response.json();

        return {
            success: true,
            customer_id: data.id,
            email: data.email
        };
    },

    /**
     * Create a payment intent
     */
    async create_payment(credentials, config, context) {
        const { amount, currency, customer_id, description } = config;

        if (!amount || !currency) {
            throw new Error('Amount and currency are required');
        }

        const params = new URLSearchParams();
        params.append('amount', Math.round(amount * 100)); // Convert to cents
        params.append('currency', currency.toLowerCase());
        if (customer_id) params.append('customer', customer_id);
        if (description) params.append('description', description);

        const response = await fetch('https://api.stripe.com/v1/payment_intents', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${credentials.api_key}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`Stripe API error: ${error.error.message}`);
        }

        const data = await response.json();

        return {
            success: true,
            payment_intent_id: data.id,
            amount: data.amount / 100,
            currency: data.currency,
            status: data.status
        };
    },

    /**
     * Create a Stripe payment link for appointment booking
     */
    async create_payment_link(credentials, config, context) {
        const { amount, currency, description, quantity } = config;

        if (!amount || !currency) {
            throw new Error('Amount and currency are required');
        }

        // First create a product
        const productParams = new URLSearchParams();
        productParams.append('name', description || 'Appointment Booking');

        const productResponse = await fetch('https://api.stripe.com/v1/products', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${credentials.api_key}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: productParams
        });

        if (!productResponse.ok) {
            const error = await productResponse.json();
            throw new Error(`Stripe API error: ${error.error.message}`);
        }

        const product = await productResponse.json();

        // Create a price for the product
        const priceParams = new URLSearchParams();
        priceParams.append('product', product.id);
        priceParams.append('unit_amount', Math.round(amount * 100));
        priceParams.append('currency', currency.toLowerCase());

        const priceResponse = await fetch('https://api.stripe.com/v1/prices', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${credentials.api_key}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: priceParams
        });

        if (!priceResponse.ok) {
            const error = await priceResponse.json();
            throw new Error(`Stripe API error: ${error.error.message}`);
        }

        const price = await priceResponse.json();

        // Create payment link
        const linkParams = new URLSearchParams();
        linkParams.append('line_items[0][price]', price.id);
        linkParams.append('line_items[0][quantity]', quantity || 1);

        const linkResponse = await fetch('https://api.stripe.com/v1/payment_links', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${credentials.api_key}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: linkParams
        });

        if (!linkResponse.ok) {
            const error = await linkResponse.json();
            throw new Error(`Stripe API error: ${error.error.message}`);
        }

        const link = await linkResponse.json();

        return {
            success: true,
            payment_link: link.url,
            payment_link_id: link.id,
            amount: amount,
            currency: currency
        };
    },

    /**
     * Create a Stripe Checkout session
     */
    async create_checkout_session(credentials, config, context) {
        const { amount, currency, description, success_url, cancel_url, customer_email } = config;

        if (!amount || !currency) {
            throw new Error('Amount and currency are required');
        }

        const params = new URLSearchParams();
        params.append('mode', 'payment');
        params.append('line_items[0][price_data][currency]', currency.toLowerCase());
        params.append('line_items[0][price_data][product_data][name]', description || 'Appointment Booking');
        params.append('line_items[0][price_data][unit_amount]', Math.round(amount * 100));
        params.append('line_items[0][quantity]', 1);

        if (success_url) {
            params.append('success_url', success_url);
        } else {
            params.append('success_url', 'https://example.com/success?session_id={CHECKOUT_SESSION_ID}');
        }

        if (cancel_url) {
            params.append('cancel_url', cancel_url);
        } else {
            params.append('cancel_url', 'https://example.com/cancel');
        }

        if (customer_email) {
            params.append('customer_email', customer_email);
        }

        const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${credentials.api_key}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`Stripe API error: ${error.error.message}`);
        }

        const data = await response.json();

        return {
            success: true,
            checkout_url: data.url,
            session_id: data.id,
            amount: amount,
            currency: currency,
            status: data.status
        };
    },

    /**
     * Check payment status
     */
    async check_payment_status(credentials, config, context) {
        const { session_id, payment_intent_id } = config;

        if (!session_id && !payment_intent_id) {
            throw new Error('Either session_id or payment_intent_id is required');
        }

        let endpoint = '';
        if (session_id) {
            endpoint = `https://api.stripe.com/v1/checkout/sessions/${session_id}`;
        } else {
            endpoint = `https://api.stripe.com/v1/payment_intents/${payment_intent_id}`;
        }

        const response = await fetch(endpoint, {
            headers: {
                'Authorization': `Bearer ${credentials.api_key}`
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`Stripe API error: ${error.error.message}`);
        }

        const data = await response.json();

        return {
            success: true,
            payment_status: data.payment_status || data.status,
            paid: data.payment_status === 'paid' || data.status === 'succeeded',
            amount: data.amount_total ? data.amount_total / 100 : (data.amount ? data.amount / 100 : 0),
            currency: data.currency
        };
    },

    /**
     * Get Stripe account statistics
     */
    async get_stats(credentials) {
        const { api_key } = credentials;

        try {
            // Fetch customers
            const customersResponse = await fetch('https://api.stripe.com/v1/customers?limit=1', {
                headers: { 'Authorization': `Bearer ${api_key}` }
            });
            const customersData = await customersResponse.json();

            // Fetch recent charges
            const chargesResponse = await fetch('https://api.stripe.com/v1/charges?limit=100', {
                headers: { 'Authorization': `Bearer ${api_key}` }
            });
            const chargesData = await chargesResponse.json();

            const successfulCharges = (chargesData.data || []).filter(c => c.paid && c.status === 'succeeded');
            const totalRevenue = successfulCharges.reduce((sum, c) => sum + c.amount, 0) / 100;

            // Fetch balance
            const balanceResponse = await fetch('https://api.stripe.com/v1/balance', {
                headers: { 'Authorization': `Bearer ${api_key}` }
            });
            const balanceData = await balanceResponse.json();

            return {
                customers: {
                    total: customersData.has_more ? '1000+' : customersData.data?.length || 0
                },
                revenue: {
                    total: totalRevenue,
                    currency: balanceData.available?.[0]?.currency || 'usd',
                    successful_charges: successfulCharges.length
                },
                balance: {
                    available: (balanceData.available?.[0]?.amount || 0) / 100,
                    pending: (balanceData.pending?.[0]?.amount || 0) / 100
                }
            };
        } catch (error) {
            console.error('Stripe stats error:', error);
            throw new Error(`Failed to fetch Stripe statistics: ${error.message}`);
        }
    }
};
