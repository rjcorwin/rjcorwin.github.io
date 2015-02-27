# Is HabitRPG NSFW? Here's a trick to make it more SFW.

I like to use HabitRPG all day but my little green guy on my screen and all my other friends with their crazy head dresses doesn't look like I'm being productive when they flash across my screen for all to see. I wrote some code to hide the top two bars, remove the Rewards bar, and then even out the remaining three columns to fill the screen (gotta love Bootstrap Grid system). 

Here's the code. Open Developer tools in your browser and paste this into the console when you are on the HabitRPG page.
```
$('nav').hide();
$('#undefined-sticky-wrapper').hide();
$('.rewards').hide();
$('.col-md-3').addClass('col-md-4').removeClass('col-md-3');
```

<a href="javascript:$('nav').hide();$('#undefined-sticky-wrapper').hide();$('.rewards').hide();$('.col-md-3').addClass('col-md-4').removeClass('col-md-3');void 0">Make HabitRPG Safe for Work</a> <-- Here's a bookmarklet to make it easy to run this code on the HabitRPG page. Thanks to n-gauge on Hacker News for figuring out I needed `;void 0` at the end of the code!

<a href="https://news.ycombinator.com/item?id=8219501">Comments on Hacker News</a>
