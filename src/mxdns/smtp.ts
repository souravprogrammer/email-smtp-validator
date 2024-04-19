import net from 'net';
import dns from "dns";
import { hasCode, ErrorCodes } from './smtpErrors'
import { Result } from '../varifyResult/verifyResult'
interface MxRecords {
    mxRecords: Array<dns.MxRecord> | string;
}
interface SMTPVerifyOption {
    sender: string;
    recipient: string;
    timeOut: number;
    port: number;
}
interface SMTPOptions extends MxRecords, SMTPVerifyOption {

}
interface VerifyMailBox extends SMTPVerifyOption {
    exchange: string;
}

export async function smtpVerify(option: SMTPOptions): Promise<Result> {
    if (typeof option.mxRecords === "string") {
        return await VerifyMailBox({ ...option, exchange: option.mxRecords });
    }
    else {
        const smtpMxList = verifySmtpExchangeList(option);
        for await (let record of smtpMxList) {
            if (record.valid) {
                return record;
            }
        }
        return { valid: false }
    }
}

// this method will check all the mxRecords hight priority to low priority , this is time comsuming way
async function* verifySmtpExchangeList(option: SMTPOptions): AsyncGenerator<Result, Result, any> {
    if (!(typeof option.mxRecords === "object")) return { valid: false }
    for await (let record of option.mxRecords as dns.MxRecord[]) {
        const smtpResult = await VerifyMailBox({ ...option, exchange: record.exchange })
        if (smtpResult.valid) return smtpResult;
        yield smtpResult;
    }
    return { valid: false }
}
export async function VerifyMailBox(verify: VerifyMailBox) {

    return await new Promise<Result>((resolve) => {
        const commands = GenratemailBoxMessages(verify.sender, verify.recipient, verify.exchange);
        const socket = net.createConnection(25, verify.exchange);
        socket.setTimeout(verify.timeOut);



        socket.on('connect', () => {
            socket.on('data', msg => {

                if (hasCode(msg, 220) || hasCode(msg, 250)) {


                    socket.emit('next', msg)
                } else if (hasCode(msg, 550)) {
                    socket.emit('fail', 'Mailbox not found.')
                } else {
                    const code = Object.keys(ErrorCodes).find((x: any) => hasCode(msg, x)) as keyof typeof ErrorCodes | undefined;
                    socket.emit('fail', code ? ErrorCodes[code] : 'Unrecognized SMTP response.')
                }
            })

        })
        socket.once('fail', msg => {


            resolve({ valid: false, reason: msg })
            if (socket.writable && !socket.destroyed) {
                socket.write(`quit\r\n`);
                socket.end();
                socket.destroy();
            }
        })
        socket.on('close', hadError => {
            if (!hadError) {
                socket.emit('fail', 'Mail server closed connection without sending any data.')
            } else {
                socket.emit('fail', 'Mail server closed connection unexpectedly.')
            }

        })
        socket.on('success', () => {

            if (socket.writable && !socket.destroyed) {
                socket.write(`quit\r\n`);
                socket.end();
                socket.destroy();
            }
            resolve({ valid: true })
        })
        socket.on('timeout', () => {
            socket.emit('fail', 'Timeout')
        })
        socket.on('error', error => {

            socket.emit('fail', error)
        })
        socket.on('next', () => {
            const command = commands.next();

            if (command.done) {
                socket.emit('success');
            } else {
                if (socket.writable) {
                    socket.write(`${command.value}\r\n`)
                } else {
                    socket.emit('fail', 'SMTP communication unexpectedly closed.')
                }
            }
        })

    })
}
function* GenratemailBoxMessages(sender: string, recipient: string, exchange: string) {
    const messages = [
        `HELO ${exchange}`,
        `MAIL FROM: <${sender ?? recipient}>`,
        `RCPT TO: <${recipient}>`
    ];
    for (let msg of messages) {
        yield msg;
    }
}











