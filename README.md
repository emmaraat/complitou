# complitou
Web app to send anonymous compliments to friends
Created by E.M. Raat in 2022 during Pearl Hacks 2022

## Inspiration
One of my friends is an amazing human being. I wanted to tell him some specific things I appreciate about him, but I was afraid that it would be awkward...
That overthinking lead to the idea of complitou, a web app that would allow people to send anonymous compliments to friends or even acquaintances, and spread a bit of wholesome love.
And with it being anonymous, it feels extra special, and the receiver can enjoy the compliment without feeling obligated to say thank you or downplay their awesomeness!

## Techniques
Complitou is developed in Express, a Node.js web application framework.
It uses Bulma, a CSS framework, for the formatting of the html.
AWS RDS database is used to store information about the sender, receiver, and compliment message.
AWS SES is used to send emails to validate the sender email, and to send the actual compliment to the receiver.

A big help for setting up the AWS SES SDK route was Erik Hanchett's video tutorial (https://youtu.be/HiHflLTqiwU) on integrating AWS SES with Express and Javascript

## Challenges (future)
* Since the emails are sent anonymously, there is a potential for abuse from people with ill intent. I would like to add a swearing/hatespeech detection algorithm in the back-end that scans compliments before they are allowed to pass through.
* Similarly, there is a potential for spamming, which I hope to resolve by utilizing the already existing 'senders' database to record how long ago the email address sent their previous email, and rate limiting this.
* The web app is currently not publicly available, in the future I would like host it on AWS or other hosting service.
* AWS SES: move out of Sandbox. AWS SES sandbox version only allows you to send emails from/to validated email addresses. I will have to apply for permission to move out of the sandbox for the web app to become functional.

## Challenges (past)
* I had to add a BodyParser middleware to succesfully extract the body from the posted HTML-form content. 
* I had to figure out how to dynamically create the message body of the validation/compliment emails, which required a specific formatting of the HTML body with the injected variables.