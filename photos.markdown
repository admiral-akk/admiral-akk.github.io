---
layout: page
title: Photos
permalink: /photos/
---

Here are national park pictures!

{% for photo in site.photos %}
  <h2>
    <a href="{{ photo.url }}">
      {{ photo.title }}
    </a>
  </h2>
  <p>{{ photo.description | markdownify }}</p>
{% endfor %}


[jekyll-organization]: https://github.com/jekyll
