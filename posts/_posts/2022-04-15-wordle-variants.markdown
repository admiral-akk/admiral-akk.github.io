---
layout: post
title:  "Wordle Variants"
date:   2022-04-15 11:00:00 -0400
categories: game dev-log
---

I've been experimenting with Wordle-variants for the past few weeks and built two experimental games ([Wordle Blitz](/games/wordle-blitz.html), [Crosswordle](/games/crosswordle.html)). It's a solid design space since people already understand the core game, and so you can simply focus on your twist.

### [Crosswordle](/games/crosswordle.html)

<figure>
  <img src="https://s3.us-west-1.amazonaws.com/magikarpierz.com/magikarpierz/photos/wordle/crosswordle.PNG" alt="Behold the ugliest color scheme known to science"/>
  <figcaption text-align="center">Behold the ugliest color scheme known to humanity</figcaption>
</figure>


# Motivation

1. Wordle is limited to 5-letter words. What if we expand it?
2. Crosswords are fun. 
3. Crosswordle is a solid pun. 

# Approach

Generate a crossword of Wordle answers, and have the player solve it.

# Issues

1. How do we decide if a word is valid?
1. The UX for filling in a regular crossword is fiddly; you have to select individual blocks and then type.
  - I addressed this using the approach from [octordle](https://octordle.com/): each guess applies to every block simultanously. 
1. Displaying the information the player has gathered is much harder when you have arbitrarily many problems to solve.
  - I added the information into the square directly, which had two problems I couldn't quite resolve. First, the text had to be smaller thus was hard to read. Secondly, the color convention was inverted from Wordle; yellow now meant that the letter could be there unlike in Wordle where it indicated that the letter couldn't possibly be there.


# Datascraping

To avoid being too derivative, I made two wordbank: one for potential answers, and one for valid guesses. The reason to seperate these is:
- If the player doesn't know an answer, they get really annoyed as they try to guess it. 
- If the player wants to feel smart and use an obscure (but valid) word, we should accomodate that.

To accomodate this, I scraped data from:
- [Scrabble Dictionary](https://boardgames.stackexchange.com/questions/38366/latest-collins-scrabble-words-list-in-text-file)
- [Meaningpedia](https://meaningpedia.com/) 
- Words from various dataset on [Wikipedia](https://en.wiktionary.org/wiki/Wiktionary:Frequency_lists#English)

I then scored the various words, and set a seperate score threshold for valid answers and valid guesses. I had a lot of additional data relating to word-usage frequency, but it turns out that simply the number of datasets that the word could be found in was a sufficiently good score, so I moved on.

I then pruned the lists via some heutistics, removing any words:
- with non-standard alphaber characters (punctuation, accents)
- with capital letters (since proper nouns are typically removed)
- with [bigrams that don't exist in English](https://www.petercollingridge.co.uk/blog/language/analysing-english/bigrams/)
- which are specific slurs. I just don't need that in my game.

For answers specifically, I removed any pluralizations which ended in an 's'. Otherwise 's' would be a disproportionatly common guess for the last letter.

# Crossword Generation

Actually generating the crossword was simple dynamic programming algorithm. I also wanted to try and get "prettier" crosswords, so I tried generating 100 random crosswords, scored each according to how "compact" they were, and used the best one.

# Results

The game resulted in a few changes to how you'd play:
1. The dominant strategy seemed to be to place a few guesses to figure out what letters were in the crossword before actually trying to guess words.
2. Because you just need to fill the individual squares, you don't need to guess every word exactly. For example, if you had two blocks remaining, \_LESS and TRAC\_, you could guess "BLOCK" to fill both the first letter of "BLESS" and last letter of "TRACK" simultanously.

### [Wordle Blitz](/games/wordle-blitz.html)

<figure>
  <img src="https://s3.us-west-1.amazonaws.com/magikarpierz.com/magikarpierz/photos/wordle/wordle-blitz.PNG"/>
</figure>

# Motivation

Wordle optmizes for perfect guesses. This can be frustrating when:

1. There are multiple equally valid options (\_IGHT -> "LIGHT", "FIGHT", "SIGHT", ...)
2. You can't think of any valid options (\_UIJ\_)

Wordle also allows for an "opening book". There are certain words which are better first words ("FAIRY"), and certain words which are terrible starting words ("MUMMY").

# Approach

Score the player based on how long it takes to figure the word out. 

Also, have the player guess multiple words, and prevent them from re-using the same words. This prevents them from using the same starter word each time.

# Learnings

When I initially made the game, I set it up to be more of a "time-rush" mode. After you successfully guessed the word, the game would award you a point and generate another word for you to guess. Your goal was to guess as many words as possible in 60 seconds.

This ended up missing some core appeals of Wordle, namely:
1. High stress
2. No comparison between players (everyone would get different words)

So instead:
1. I kept the scoring to rely on time, but removed the timelimit.
	- Also, I initially kept the time in millisecond format (1:12.512) but the constantly shifting numbers made this stressful. Shifting to second-level granuality (1:13) made the experience much less stress inducing.
1. I set a fixed list of words to guess. 

# WebGL Hackery

The last bit of functionality I wanted to implement was sharing. 

The unicode for the green, grey and yellow squares was pretty easy to find here: https://unicode.org/emoji/charts/full-emoji-list.html

The main issue is that WebGL builds of Unity don't get direct access to the clipboard; only the Javascript frame around it does. Unity does allow your code to [interact with the browser](https://docs.unity3d.com/Manual/webgl-interactingwithbrowserscripting.html), and thankfully, [someone](https://forum.unity.com/threads/copy-paste-has-anyone-built-a-good-solution-for-this.401851/#post-7263700) came up with a short JS snippet that handles copying to clipboard:

{% highlight Javascript %}
mergeInto(LibraryManager.library, {
  CopyToClipboard: function (arg){
    // changed from "input" to "textarea" to preserve newlines
    var tempInput = document.createElement("textarea"); 
          tempInput.value = Pointer_stringify(arg);
          document.body.appendChild(tempInput);
          tempInput.select();
          document.execCommand("copy");
          document.body.removeChild(tempInput); 
                 }
});
{% endhighlight %}

We can then import this function for use in our code through the following snippet:

{% highlight C# %} 
[DllImport("__Internal")]
private static extern void CopyToClipboard(string text);
     
public static void SetText(string text) {          
  #if UNITY_WEBGL && UNITY_EDITOR == false
    CopyToClipboard(text);
  #else
    GUIUtility.systemCopyBuffer = text;
  #endif
}
{% endhighlight %}

And then we 
[jekyll-docs]: https://jekyllrb.com/docs/home
[jekyll-gh]:   https://github.com/jekyll/jekyll
[jekyll-talk]: https://talk.jekyllrb.com/Wordle 