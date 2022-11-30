const fs = require("fs");

var DEFAULT_EMAIL_TEMPLATE_PATH =
    process.cwd() + "/template/default_email_tmp.html";
const DEFAULT_EMAIL_TEMPLATE = fs.readFileSync(
    DEFAULT_EMAIL_TEMPLATE_PATH,
    "utf8"
);

var DEFAULT_EMAIL_VERIFY_TEMPLATE_PATH =
    process.cwd() + "/template/email_verify_success_tmp.html";
const DEFAULT_EMAIL_VERIFY_TEMPLATE = fs.readFileSync(
    DEFAULT_EMAIL_VERIFY_TEMPLATE_PATH,
    "utf8"
);

module.exports = { DEFAULT_EMAIL_TEMPLATE, DEFAULT_EMAIL_VERIFY_TEMPLATE };

