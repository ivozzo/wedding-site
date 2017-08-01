# Wedding site

## Description
This is a wedding site template.
As it can be very difficult to modify all the templates, pages, etc. through external variables, I highly recommend to fork the project and create your own version.

## Usage
You have to build the template with 
```docker build -f Dockerfile -t image/name:tag .```
and you'll have to docker compose your new image with some database.

### My personal experience
I pushed the image on docker hub and used a docker hosting site (in my case, [Sloppy.io](https://sloppy.io/))
I suggest MongoDB as database.

STILL PENDING:
- [X] add the session management for admin user
- [X] add the session management for guests
- [X] prepare the mail template
- [X] send emails and tests
- [ ] CRUD for users and guests

ENVIRONMENT VARIABLES:

VARIABLE | Description
---------|----------
 NODE_SITE | Site url
 NODE_PORT | The port which will use Node JS
 MONGO_URL | The datatabase connection string (mongodb://host:port/db)
 MAIL_PORT | The SMTP port
 MAIL_USER | SMTP authentication
 MAIL_PASSWORD | SMTP password authentication
 MAIL_HOST | The SMTP host
 MAIL_ADDRESS | The mail address