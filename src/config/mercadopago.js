import { MercadoPagoConfig, Payment, Preference } from "mercadopago";

// Inicializa la configuración de MercadoPago
const mercadoPagoConfig = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN,
});

// Instancia los módulos de pagos y preferencias
const payment = new Payment(mercadoPagoConfig);
const preference = new Preference(mercadoPagoConfig);

export { payment, preference };
