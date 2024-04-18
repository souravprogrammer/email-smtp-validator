
import { Result, SubVerifyResult } from "../varifyResult/verifyResult";
const tester = /^[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
// Thanks to:
// http://fightingforalostcause.net/misc/2006/compare-email-regex.php
// http://thedailywtf.com/Articles/Validating_Email_Addresses.aspx
// http://stackoverflow.com/questions/201323/what-is-the-best-regular-expression-for-validating-email-addresses/201378#201378
// https://en.wikipedia.org/wiki/Email_address  The format of an email address is local-part@domain, where the 
// local part may be up to 64 octets long and the domain may have a maximum of 255 octets.[4]
export function EmailRegexVerify(email: string): Result {
    if (!email) return { valid: false, reason: "email not provided" };

    const emailParts: Array<string> = email.trim().split('@');
    if (emailParts.length !== 2) return { valid: false, reason: `Email does not contain "@".` };

    const account: string = emailParts[0] as string;
    const address: string = emailParts[1] as string;

    if (account.length > 64) return { valid: false, reason: `Invalid Email Length` };

    else if (address.length > 255) return { valid: false, reason: `Invalid Email domain` };
    // };

    const domainParts = address.split('.');

    if (domainParts.some(function (part) {
        return part.length > 63;
    })) return { valid: false };

    return tester.test(email) ? { valid: true } : { valid: false, reason: "Invalid Email" }
};
