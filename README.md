# Email SMTP Validator

uses regex to verify email addresses, looks up common mistakes, checks against disposable email lists, looks for DNS records, and examines SMTP server feedback.


## Prerequisites
Make sure you have the following software installed:
- Node.js (version 12 or higher)
- npm (Node Package Manager) or yarn
### Installation

Install the module through NPM:

    $ npm install email-smtp-validator --save

Install the module through yarn:

    $ yarn add email-smtp-validator --save

## Key Features
  - Validates email regular expression
  - Verifies that the email was not created using [disposable-email-domains](https://www.npmjs.com/package/disposable-email-domains) from a throwaway email service.
  - Validates MX records are present on DNS.
  - Validates SMTP server is running.
  - Validates mailbox exists on SMTP server.
  - typescript support.

## Examples

Include the module, create a new `EmailValidator` object and call `verify` method:

```javascript
import { EmailValidator } from "email-smtp-validator";

const emailValidator = new EmailValidator({{
    sender: 'name@example.org', // optional default value null
    validateRegex: true , // default value true
    validateMx: true, // default value true
    validateDisposable: true, // default value false
    validateSMTP: true, // default value false
    validateSMTPdeep?: true, // default value false
    timeout: 1000 *10, // default value 8 seconds
    port: 25, // default port 25
  }});

 const  res = await emailValidator.verify('foo@email.com');
 //  {
 //     regex : {valid : true},
 //     disposable : {valid : true},
 //     mx : {valid : true},
 //     smtp : {valid : false , reason : "Mailbox not found"},
 //  }
```

When a domain does not exist or has no MX records, the domain validation will fail, and the smtp validation will not be included in the response because it could not be performed.



## Configuration options
 ### `timeout` 
 Set a timeout in seconds for the smtp connection. Default: `8000`.
 ### `Port` 
 Set a port according to your use case for smtp/smtps . Default: `25`.


## License
This project is licensed under the terms of the [MIT License](LICENSE.md). You are free to modify and distribute the software in accordance with the conditions specified in the MIT License. Feel free to adapt the application to suit your needs while complying with the requirements of the license.