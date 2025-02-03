import { payment, preference } from "../config/mercadopago.js";
import { PaymentsModel } from '../models/paymentsModel.js';
import logger from '../logger.js';

export class PaymentsController {
    // Método estático para obtener el balance de un usuario.
    static async getBalanceById(req, res) {
        const { id: alumno_id } = req.params;
        const { id: usuario_id } = req.user;
        const { user_name } = req.user;

        try {
            const balance = await PaymentsModel.getBalanceById(alumno_id);
            logger.info(`El usuario ${usuario_id}: ${user_name} ha consultado el balance de ${alumno_id}`);
            return res.status(200).json(balance);
        } catch (error) {
            logger.error(`Error consultado balance de ${alumno_id} por usuario ${usuario_id}`);
            res.status(500).json({ error: 'Error al obtener balance' });
        }
    }

    static async setBalanceById(req, res) {
        const { id: alumno_id } = req.params;
        const { id: usuario_id } = req.user;
        const { monto, descripcion, tipo_movimiento } = req.body; // Ahora aceptamos `tipo_movimiento`

        try {
            // Validar que el monto sea un número
            if (isNaN(monto)) {
                throw new Error(`El valor de 'monto' debe ser un número válido. Recibido: ${monto}`);
            }

            // Validar el tipo de movimiento
            const tiposValidos = ['factura', 'pago']; // Se pueden agregar mas tipos de ser necesario
            if (!tipo_movimiento || !tiposValidos.includes(tipo_movimiento)) {
                throw new Error(`El valor de 'tipo_movimiento' debe ser uno de: ${tiposValidos.join(', ')}`);
            }

            // Obtener el último balance del alumno
            const [lastRecord] = await PaymentsModel.getBalanceById(alumno_id);

            // Si no hay registros previos, el balance inicial es 0
            const currentBalance = lastRecord ? lastRecord.balance_final : 0;

            // Calcular el nuevo balance
            const newBalance = tipo_movimiento === 'factura'
                ? parseFloat(currentBalance) + parseFloat(monto) // Suma para facturas
                : parseFloat(currentBalance) - parseFloat(monto); // Resta para pagos

            // Registrar el nuevo movimiento en estado_cuenta
            const newRecord = await PaymentsModel.updateBalance({
                alumno_id,
                descripcion: descripcion || (tipo_movimiento === 'factura' ? 'Factura generada' : 'Pago realizado'),
                tipo_movimiento,
                monto: monto,
                balance_final: newBalance,
            });

            logger.info(`El usuario ${usuario_id} ha registrado un ${tipo_movimiento} para el alumno ${alumno_id}`);
            return res.status(200).json(newRecord);
        } catch (error) {
            logger.error(`Error registrando movimiento para el alumno ${alumno_id} por usuario ${usuario_id}: ${error.message}`);
            res.status(500).json({ error: 'Error al registrar el movimiento' });
        }
    }

    // static async createPayment(req, res) {
    //     try {
    //         const { alumno_id, monto, descripcion } = req.body;
    //         console.log('alumno id: ', alumno_id)
    //         console.log('alumno monto: ', monto)
    //         console.log('alumno descripcion: ', descripcion)

    //         if (!monto || isNaN(monto) || monto <= 0) {
    //             return res.status(400).json({ error: "Monto inválido" });
    //         }

    //         const preferenceData = {
    //             items: [
    //                 {
    //                     title: descripcion || "Pago de clases",
    //                     unit_price: parseFloat(monto),
    //                     currency_id: "UYU",
    //                     quantity: 1,
    //                 },
    //             ],
    //             payer: {
    //                 email: req.user?.email || "cliente@example.com",
    //             },
    //             back_urls: {
    //                 success: `${process.env.FRONTEND_URL}/dashboard?status=success&alumno_id=${alumno_id}&monto=${monto}`,
    //                 failure: `${process.env.FRONTEND_URL}/dashboard?status=failure&alumno_id=${alumno_id}&monto=${monto}`,
    //                 pending: `${process.env.FRONTEND_URL}/dashboard?status=pending&alumno_id=${alumno_id}&monto=${monto}`,
    //             },
    //             auto_return: "approved",
    //             notification_url: `${process.env.BACKEND_URL}/api/payments/webhook`,
    //             metadata: {
    //                 alumno_id,
    //                 monto,
    //                 descripcion,
    //             },
    //         };

    //         // Enviar la preferencia de pago a MercadoPago
    //         const response = await preference.create({ body: preferenceData });

    //         logger.info("🔹 Respuesta completa de MercadoPago:", JSON.stringify(response, null, 2));

    //         if (!response || !response.body || !response.body.init_point) {
    //             logger.error("❌ Error: La respuesta de MercadoPago no contiene 'init_point'.");
    //             return res.status(500).json({ error: "Error en la respuesta de MercadoPago", details: response });
    //         }

    //         logger.info(`✅ Pago creado para el alumno ${alumno_id}. URL de pago: ${response.body.init_point}`);

    //         return res.status(200).json({ init_point: response.body.init_point });

    //     } catch (error) {
    //         logger.error(`❌ Error al generar el pago: ${error.message}`);
    //         return res.status(500).json({ error: "Error al generar el pago", details: error.message });
    //     }
    // }

    static async createPayment(req, res) {
        try {
            const { alumno_id, monto, descripcion } = req.body;

            if (!monto || isNaN(monto) || monto <= 0) {
                return res.status(400).json({ error: "Monto inválido" });
            }

            const preferenceData = {
                items: [
                    {
                        title: descripcion || "Pago de clases",
                        unit_price: parseFloat(monto),
                        currency_id: "UYU",
                        quantity: 1,
                    },
                ],
                payer: {
                    email: req.user?.email || "cliente@example.com",
                },
                back_urls: {
                    success: `${process.env.FRONTEND_URL}/dashboard?status=success&alumno_id=${alumno_id}&monto=${monto}`,
                    failure: `${process.env.FRONTEND_URL}/dashboard?status=failure&alumno_id=${alumno_id}&monto=${monto}`,
                    pending: `${process.env.FRONTEND_URL}/dashboard?status=pending&alumno_id=${alumno_id}&monto=${monto}`,
                },
                auto_return: "approved",
                // notification_url: `${process.env.BACKEND_URL}/api/payments/webhook`,
                notification_url: `https://pjff153m-4000.brs.devtunnels.ms/api/payments/webhook`,
                metadata: {
                    alumno_id,
                    monto,
                    descripcion,
                },
            };

            const response = await preference.create({ body: preferenceData });
            // console.log(response)

            logger.info("🔹 Respuesta completa de MercadoPago:", JSON.stringify(response.body, null, 2));

            // 🔹 Imprimir las claves específicas
            logger.info(`🔹 init_point: ${response.init_point}`);
            logger.info(`🔹 sandbox_init_point: ${response.sandbox_init_point}`);

            // 🔹 Asegurar que estamos tomando el link correcto
            // const initPoint = response.sandbox_init_point || response.init_point;
            const initPoint = response.init_point;

            if (!initPoint) {
                logger.error("❌ Error: No se encontró un 'init_point' válido en la respuesta de MercadoPago.");
                return res.status(500).json({ error: "Error en la respuesta de MercadoPago", details: response.body });
            }

            logger.info(`✅ Pago creado para el alumno ${alumno_id}. URL de pago: ${initPoint}`);

            return res.status(200).json({ init_point: initPoint });

        } catch (error) {
            logger.error(`❌ Error al generar el pago: ${error.message}`);
            return res.status(500).json({ error: "Error al generar el pago", details: error.message });
        }
    }
    static async webhook(req, res) {
        try {
            logger.info(`Request: ${req.method} ${req.url}`);
            logger.info("🔹Webhook recibido desde MercadoPago Query Params:", req.query);

            const { type, "data.id": paymentId } = req.query; // Leer la info desde req.query

            // Verificar si es un evento de pago
            if (type !== "payment" || !paymentId) {
                logger.warn("⚠️ Webhook recibido sin datos de pago válidos.");
                return res.status(204).json({ error: "Webhook sin datos válidos" });
            }

            logger.info(`🔹 Consultando detalles del pago con ID: ${paymentId}`);

            // Obtener información del pago desde MercadoPago
            const paymentData = await payment.get({ id: paymentId });
            // console.log(`🔹 Payment Dada de ID: ${paymentId}: ${JSON.stringify(paymentData)}`)

            if (!paymentData) {
                logger.error(`❌ No se encontró información para el pago ID: ${paymentId}`);
                return res.status(404).json({ error: "Pago no encontrado" });
            }

            logger.info("🔹 Datos del pago recibidos:", paymentData);

            // Extraer datos relevantes
            const status = paymentData.status; // "approved", "pending", "rejected"
            const alumno_id = paymentData.metadata?.alumno_id || null;
            const monto_pagado = paymentData.transaction_amount;
            const id_transaccion_mp = paymentData.id;

            if (!alumno_id) {
                logger.error("⚠️ Error: No se encontró alumno_id en metadata.");
                return res.status(400).json({ error: "alumno_id no encontrado" });
            }

            // Obtener el último balance del alumno
            const [lastRecord] = await PaymentsModel.getBalanceById(alumno_id);
            const balance_actual = lastRecord ? lastRecord.balance_final : 0;

            let nuevo_balance = balance_actual - monto_pagado;

            // Procesar pago aprobado
            if (status === "approved") {
                await PaymentsModel.updateBalance({
                    alumno_id,
                    descripcion: `Pago aprobado vía MercadoPago - ${monto_pagado}`,
                    monto: monto_pagado,
                    balance_final: nuevo_balance,
                    metodo_pago: "mercadopago",
                    estado: "completado",
                    id_transaccion_mp,
                });

                logger.info(`✅ Pago aprobado para el alumno ${alumno_id}. Nuevo balance: ${nuevo_balance}`);
            }
            // Procesar pago rechazado
            else if (status === "rejected") {
                await PaymentsModel.updateBalance({
                    alumno_id,
                    descripcion: `Pago rechazado en MercadoPago`,
                    monto: 0,
                    balance_final: balance_actual,
                    metodo_pago: "mercadopago",
                    estado: "fallido",
                    id_transaccion_mp,
                });

                logger.warn(`❌ Pago rechazado para el alumno ${alumno_id}. Balance: ${balance_actual}`);
            }

            return res.status(200).json({ status, alumno_id, monto_pagado, nuevo_balance });

        } catch (error) {
            logger.error("❌ Error en el webhook:", error);
            return res.status(500).json({ error: "Error interno en el webhook" });
        }
    }


    // static async webhook(req, res) {
    //     try {
    //         // logger.info("🔹 Webhook recibido desde MercadoPago:");
    //         // logger.info("🔹 Headers:", req.headers);
    //         // logger.info("🔹 Body:", req.body);

    //         const paymentInfo = req.body;
    //         console.log('req.query: ', req.query)

    //         // Verificar que la petición sea válida
    //         if (!paymentInfo || !paymentInfo.type || !paymentInfo.data) {
    //             logger.error("❌ Error: Webhook recibido sin datos válidos.");
    //             return res.status(400).json({ error: "Invalid webhook payload" });
    //         }

    //         // Solo procesamos eventos de pago
    //         if (paymentInfo.type === "payment") {
    //             const paymentId = paymentInfo.data.id;
    //             logger.info(`🔹 Consultando detalles del pago con ID: ${paymentId}`);

    //             const paymentData = await payment.get({ id: paymentId });
    //             logger.info("🔹 Datos del pago recibidos:", paymentData.body);

    //             const status = paymentData.body.status; // "approved", "pending", "rejected"
    //             const alumno_id = paymentData.body.metadata?.alumno_id || null;
    //             const monto_pagado = paymentData.body.transaction_amount;

    //             if (!alumno_id) {
    //                 logger.error("⚠️ Error: No se encontró alumno_id en metadata.");
    //                 return res.status(400).json({ error: "alumno_id no encontrado" });
    //             }

    //             // Obtener el último balance del alumno
    //             const [lastRecord] = await PaymentsModel.getBalanceById(alumno_id);
    //             const balance_actual = lastRecord ? lastRecord.balance_final : 0;
    //             let nuevo_balance = balance_actual - monto_pagado;

    //             // Procesar pago aprobado
    //             if (status === "approved") {
    //                 await PaymentsModel.updateBalance({
    //                     alumno_id,
    //                     descripcion: `Pago aprobado vía MercadoPago - ${monto_pagado}`,
    //                     monto: monto_pagado,
    //                     balance_final: nuevo_balance,
    //                     metodo_pago: "mercadopago",
    //                     estado: "completado",
    //                     id_transaccion_mp: paymentData.body.id,
    //                 });

    //                 logger.info(`✅ Pago aprobado para el alumno ${alumno_id}. Nuevo balance: ${nuevo_balance}`);
    //             }
    //             // Procesar pago rechazado
    //             else if (status === "rejected") {
    //                 await PaymentsModel.updateBalance({
    //                     alumno_id,
    //                     descripcion: `Pago rechazado en MercadoPago`,
    //                     monto: 0,
    //                     balance_final: balance_actual,
    //                     metodo_pago: "mercadopago",
    //                     estado: "fallido",
    //                     id_transaccion_mp: paymentData.body.id,
    //                 });

    //                 logger.warn(`❌ Pago rechazado para el alumno ${alumno_id}. Balance: ${balance_actual}`);
    //             }

    //             return res.status(200).json({ status, alumno_id, monto_pagado, nuevo_balance });
    //         }

    //         logger.warn("⚠️ Webhook recibido con tipo no manejado:", paymentInfo.type);
    //         return res.sendStatus(200);
    //     } catch (error) {
    //         logger.error("❌ Error en el webhook:", error);
    //         return res.sendStatus(500);
    //     }
    // }
}
