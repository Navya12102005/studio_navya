# Enable direct contact delivery

1. Open https://web3forms.com/ and create a form access key for `hello@studionavya.com`. Use an inbox you can access and complete its email verification.
2. In `config.js`, set `window.SITE.web3formsKey` to that form’s access key. Web3Forms intends this key for browser forms; do not put an email password, SMTP credential or private API secret here.
3. Deploy the static site. Configure any domain restrictions or spam controls available in your Web3Forms account for your published domain.
4. Submit one genuine test enquiry from the published website and confirm receipt in the inbox (including spam). A successful API response means the provider accepted the submission; inbox receipt is a separate check.

The key determines the receiving inbox. Changing the email text elsewhere on the page does not change the recipient configured by Web3Forms.

When a key is configured, the form posts visitor name, reply email, enquiry type, organisation, message and optional project reference to `https://api.web3forms.com/submit`. It locks during submission, blocks duplicate submits and includes a honeypot. A 15-second timeout or a provider/network failure preserves the form contents and offers an email-app/copy fallback. It does not automatically retry an ambiguous submission.

When no key is configured, the email-draft fallback remains available and does not claim to send anything. Form data is not persisted in browser storage by this site.

## Validation

Start the local server, then run:

```sh
node scripts/contact.cjs
node scripts/smoke.cjs
```

Delivery tests intercept every provider request and use a dummy access key. They verify success, request contents, duplicate prevention, provider rejection, server error, invalid JSON, network failure, message preservation and fallback. They never send an email. Live inbox delivery remains unverified until a real key is configured and a real submission is checked.
