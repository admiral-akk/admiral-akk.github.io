---
layout: post
title:  "Passwordle"
date:   2022-05-20 10:00:00 -0400
categories: game dev-log
---

I've been wanted to make a multiplayer game for a while now, but being stuck in Unity-land made it a lot more complicated than it need to be. So I finally got around to learning to use Javascript, and put together a quick multiplayer-variant of Wordle.

### [Passwordle](http://passwordle.magikarpierz.com/)

The first thing I realized when using Javascript was how much I missed types. They're incredibly helpful for understanding what certain methods do by simply constraining the space of inputs/outputs. So I immediately switched to using Typescript.

I started with a design that relied on HTTP requests to update the state of the game. This was fine when players submitted a guess, but since it was a multiplayer game, the player needed to be notified when their opponent submits something. At first, I implemented this via polling, which works, but is annoying. I then transitioned to using WebSockets, via [Socket.io](https://socket.io/).

This worked with one minor annoyance. While my objects could be passed across the wire without issue, the methods attached to them were not. So when I added helper methods to my objects (for example, to check if the guess matched the answer), the client would error out. This could be worked around by declaring static helper functions, but I couldn't figure out how to express to Typescript that the objects passed across the wire shouldn't have any methods defined.

As for animations, [Animate.css](https://animate.style/) was a god send. With a small function for handling removing the animation afterwards, it was easy enough to add little animations to draw the player's attention to key events. After I had that running, all that was left was playtesting. Aside from a few bugs and occasional crashes, the primary feedback was that the game looked like someone had deliberately chosen fonts and colours to torture anyone with any amount of taste. But with a few (a lot) of CSS tweaks, I got to a result which I'm at least slightly proud of.

[jekyll-docs]: https://jekyllrb.com/docs/home
[jekyll-gh]:   https://github.com/jekyll/jekyll
[jekyll-talk]: https://talk.jekyllrb.com/Wordle 