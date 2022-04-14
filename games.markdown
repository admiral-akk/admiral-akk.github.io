---
layout: page
title: Games
permalink: /games/
---

Here's a list of games!

{% for game in site.games %}
  <h2>
    <a href="{{ game.url }}">
      {{ game.title }}
    </a>
  </h2>
  <p>{{ game.description | markdownify }}</p>
{% endfor %}

[jekyll-organization]: https://github.com/jekyll
