---
layout: post
title:  "Unity UI Animation"
date:   2022-04-15 14:00:00 -0400
categories: game dev-log
---

# Problem 

In the process of building some [Wordle variants](/games/crosswordle.html), I needed to be able to easily animate UI components. For example, I wanted letters to "pop" when the letter is added.

<figure>
  <img src="https://s3.us-west-1.amazonaws.com/magikarpierz.com/magikarpierz/gifs/wordle/pop_animation.gif" alt="Yes, it's spelled popped"/>
  <figcaption text-align="center">Yes, it's spelled "popped" but 5 letter limit so sue me</figcaption>
</figure>

There are existing robust solutions ([LeenTween](https://assetstore.unity.com/packages/tools/animation/leantween-3595)), but I was interested in whether I could come up with a simple, extensible approach.

# Approach

Create an abstract class which handles the orchestration common to all animations:
1. Add an animation to a GameObject with some parameters for initialization.
2. Keep track of how long the animation had been playing for.
3. Apply the animation at each update.
4. When the duration had elapsed, destroy itself.
5. If there's already an animation on the object, just remove the new one we added.

Then to implement a concrete animation, we need to implement:
1. A parameter struct which contains the duration of the animation, as well as any parameters specific to the animation (ex: speed, color).
2. A function which takes in the current time of the animation, and sets the state of the object accordingly.

Once I'd set up this framework, the code per animation was pretty minimal/bug-free. Here was the code I wrote to set up the "pop" animation posted above:

{% highlight C# %}
using UnityEngine;

public struct PopParameters : IAnimationParameters {
    public float Duration { get; set; }
    public float Magnitude { get; set; }
    public PopParameters(float duration, float magnitude) {
        Duration = duration;
        Magnitude = magnitude;
    }
}

public class Pop : ParameterizedAnimation<PopParameters, Pop> {
    private float SizeAt(float t) {
        return 1 + Parameters.Magnitude * (1 - Mathf.Abs(2 * t - 1));
    }

    protected override void Animate(float t) {
        transform.localScale = Vector3.one * SizeAt(t);
    }
}
{% endhighlight %}

Using this, having an arbitrary element pop was a single line.

{% highlight C# %}
Pop.AddAnimation(gameObject, new PopParameters(0.2f, 0.3f));
{% endhighlight %}

## Appendix - Code Samples

# Abstract Class/Parameter Interface

{% highlight C# %}
using UnityEngine;

public interface IAnimationParameters {
    public float Duration { get; }
}

public abstract class ParameterizedAnimation<T, AnimationType> : MonoBehaviour 
	where T : IAnimationParameters 
	where AnimationType : ParameterizedAnimation<T, AnimationType> {
    private float _time;

    private void Initialize(T parameters) {
        Parameters = parameters;
        _time = 0f;
    }

    private void Update() {
        _time += Time.deltaTime;
        if (_time > Parameters.Duration)
            Destroy(this);
        else
            Animate(_time / Parameters.Duration);
    }

    private void OnDestroy() {
        Animate(1f);
    }

    protected T Parameters;
    protected abstract void Animate(float t);

    public static void AddAnimation(GameObject target, T parameters) {
        var existingAnimation = target.GetComponent<AnimationType>();
        if (existingAnimation != null)
            Destroy(existingAnimation);
        var animation = (AnimationType)target.AddComponent(typeof(AnimationType));
        animation.Initialize(parameters);
    }
}
{% endhighlight %}

# Pop

{% highlight C# %}
using UnityEngine;

public struct PopParameters : IAnimationParameters {
    public float Duration { get; set; }
    public float Magnitude { get; set; }
    public PopParameters(float duration, float magnitude) {
        Duration = duration;
        Magnitude = magnitude;
    }
}

public class Pop : ParameterizedAnimation<PopParameters, Pop> {
    private float SizeAt(float t) {
        return 1 + Parameters.Magnitude * (1 - Mathf.Abs(2 * t - 1));
    }

    protected override void Animate(float t) {
        transform.localScale = Vector3.one * SizeAt(t);
    }
}
{% endhighlight %}

# Fadeout

{% highlight C# %}
using UnityEngine.UI;

public struct FadeoutParameters : IAnimationParameters {
    public float Duration { get; set; }
    private float _startTime;
    public float Start => _startTime / Duration;
    public Graphic[] ColorObjects { get; }
    public FadeoutParameters(float duration, float startTime, Graphic[] colorObjects) {
        Duration = duration;
        _startTime = startTime;
        ColorObjects = colorObjects;
    }
}

public class Fadeout : ParameterizedAnimation<FadeoutParameters, Fadeout> {
    protected override void Animate(float t) {
        float alpha = t < Parameters.Start ? 1f : 1 - (t - Parameters.Start) / (1 - Parameters.Start);
        foreach (var graphic in Parameters.ColorObjects) {
            graphic.enabled = alpha > 0f;
            var color = graphic.color;
            color.a = alpha;
            graphic.color = color;
        }
    }

    protected override void SetParameters(FadeoutParameters parameters) {
        _start = parameters.Start;
        _colorObjects = parameters.ColorObjects;
    }
}
{% endhighlight %}
[jekyll-docs]: https://jekyllrb.com/docs/home
[jekyll-gh]:   https://github.com/jekyll/jekyll
[jekyll-talk]: https://talk.jekyllrb.com/
