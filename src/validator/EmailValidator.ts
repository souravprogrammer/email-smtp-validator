
import dns from "dns";
import { EmailValidatorOption, GenerateDefaultOptions, Options } from "../options/options";
import { VerifyResult, Result } from "../varifyResult/verifyResult";
import { EmailRegexVerify } from "../regex/emailRegex";
import { checkDisposable } from "../disposable/disposable";
import { getBestMx } from "../mxdns/mxdns";
import { smtpVerify } from "../mxdns/smtp";


type OutputReselt = {
    [key in keyof VerifyResult]: Result
}

class SmtpEmailValidator {
    options: Options
    constructor(options: EmailValidatorOption = {}) {
        this.options = GenerateDefaultOptions(options)
    }
    async verify(emailAdderss: string): Promise<OutputReselt> {
        const result: OutputReselt = {}
        if (this.options.validateRegex) {
            const regexResult = EmailRegexVerify(emailAdderss)

            result.regex = regexResult;
            // result.set("regex", regexResult)
            if (!regexResult.valid) return result;
        }
        const [address, domian] = emailAdderss.split("@");
        if (this.options.validateDisposable) {

            const isDisposable = await checkDisposable(domian as string);
            // result.set("disposable", isDisposable)
            result.disposable = isDisposable;

            if (!isDisposable.valid) return result;
        }
        if (this.options.validateMx) {
            // returns a list of mx related to a domain 
            const mxRecords = await getBestMx(domian as string);
            // if the domain has no mx records, it is not a valid email address
            if (!mxRecords) {
                result.mx = { valid: false, reason: "No Mx records found" }
                // result.set("mx", { valid: false, reason: "No Mx records found" })
                return result;
            }
            result.mx = { valid: true }
            // result.set("mx", { valid: true, })
            if (this.options.validateSMTP) {

                const smtpResult =
                    await smtpVerify({
                        sender: this.options.sender,
                        recipient: emailAdderss,
                        timeOut: this.options.timeout,
                        port: this.options.port,
                        mxRecords: this.options.validateSMTPdeep ? mxRecords : mxRecords[0]?.exchange as string
                    })
                result.smtp = smtpResult as Result
                // result.set("smtp", smtpResult as Result)
            }

        }
        return result;
    }
}
export default SmtpEmailValidator;