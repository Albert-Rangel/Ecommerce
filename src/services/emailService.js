import nodemailer from 'nodemailer'
import { logger } from '../utils/logger.js';

export default class emailService {

    async sendEmail(tickect) {

        try {

            const idstring = tickect._id.toHexString();
            const { code, purchase_datetime, amount, purchaser } = tickect

            const transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                auth: {
                    user: 'claudie.funk69@ethereal.email',
                    pass: '77VaKZY8tzXPWsqQuK'
                }
            });

            var message = {
                from: "sender@server.com",
                to: "claudie.funk69@ethereal.email",
                subject: ` Ticket  ${code}`,
                text: "Gracias por su compra. Ticket generado a continuacion los detalles",
                html: ` <h1>Purchase Details</h1>
                <p>Purchase ID:  ${idstring}</p>
                <p>Email:  ${purchaser}</p>
                <p>Code:  ${code}</p>
                <p>Total Amount:  ${amount}</p>
                <p>Total Time:  ${purchase_datetime}</p>`,


            };

            await transporter.sendMail(message);

            return "SUC|hola se envio"

        } catch (error) {
            logger.error("Error en emailService/sendEmail: " + error)

            return `ERR|Error generico. Descripcion :${error}`
        }
    }

    async sendEmailRecover(email, subject, html) {

        try {
            //Gabreiel por aca te comento, yo habia pensado en esta funcion que dinamicamente
            //recibiera el email a quien quiere enviarselo por eso es que lo recibo,
            //sin embargo se lo estoy cableando a mi correo de ethereal porque no  puedo enviar correos a 
            //otras plataformas solo a mi cuenta.
            const transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                auth: {
                    user: 'claudie.funk69@ethereal.email',
                    pass: '77VaKZY8tzXPWsqQuK'
                }
            });

            var message = {
                from: "sender@server.com",
                // to: email,
                to: "claudie.funk69@ethereal.email",
                subject: `${subject}`,
                text: "Porfavor para restablecer su contraseña de click en el link",
                html: `${html}`,
            };

            await transporter.sendMail(message);

            return "SUC|hola se envio"

        } catch (error) {
            logger.error("Error en emailService/sendEmail: " + error)

            return `ERR|Error generico. Descripcion :${error}`
        }
    }

    async getEmailTemplate(data) {
        const { email, token } = data;

        const emailUser = email.split('@')[0].toString();
        const url = 'http://localhost:8080/recover';

        return `
        <form>
          <div>
            <label>Hola ${emailUser}</label>
            <br>
            <a href="${url}?token=${token}" target="_blank">Recuperar contraseña</a>
          </div>
        </form>
        `;
    }
}