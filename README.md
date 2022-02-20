# complitou
Web app to send anonymous compliments to friends
Created by E.M. Raat in 2022

## Inspiration
One of my friends is an amazing human being. I wanted to tell him some specific things I appreciate about him, but I was afraid that it would be awkward...
That overthinking lead to the idea of complitou, a web app that would allow people to send anonymous compliments to friends or even acquaintances, and spread a bit of wholesome love.
And with it being anonymous, it feels extra special, and the receiver can enjoy the compliment without feeling obligated to say thank you or downplay their awesomeness!

## Techniques
Complitou is developed in Express, a Node.js web application framework.
It uses Bulma, a CSS framework, for the formatting of the html.
AWS RDS database is used to store information about the sender, receiver, and compliment message.
AWS SES is used to send emails to validate the sender email, and to send the actual compliment to the receiver.

A big help for setting up the AWS SES SDK route was Erik Hanchett's (https://youtu.be/HiHflLTqiwU)[video] on AWS SES with Express and Javascript

## To be added
* Processing the validation link and actually sending the compliment to the receiver
* A message to inform senders that they should check their email to validate their compliment
* An FAQ page
* Nicer formatting

## Challenges (future)
* Since the emails are sent anonymously, there is a potential for abuse from people with ill intent. I would like to add a hatespeech detection algorithm in the back-end that scans compliments before they are allowed to pass through.
* Similarly, there is a potential for spamming, which I hope to resolve by adding further use of my 'senders' database to record how long ago the email address sent their previous email, and rate limiting this.

## Challenges (past)
* It was my first time working with Node.js, Express, Bulma, AWS SES, and AWS RDS databases... A whole lot of new techniques in other words!
It was challenging to wrap my head around so many new syntax rules and make everything work together, but I quite liked the way routers work in Express.

* Posting the HTML form to my router was giving me problems with an empty request body, which was solved by adding a BodyParser middleware.

* Sending a dynamic link (the validation link) in the validation email proved to be quite difficult.