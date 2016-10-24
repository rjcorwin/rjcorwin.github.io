# Quickly reformat comment paragraphs to code's required width
Maybe the first time we write a comment block it looks nice and neat like...
```
/*
  The quick brown fox jumped over the lazy dog. The quick 
  brown fox jumped over the lazy dog the quick brown fox 
  jumped over the lazy dog. The quick brown fox jumped over 
  the lazy dog.
*/
```
But then inevitably we have some text we need to add in the middle...
```
/*
  The quick brown fox jumped over the lazy dog. The quick 
  brown fox jumped over the lazy dog the quick brown fox who is my cousin frank
  jumped over the lazy dog. The quick brown fox jumped over 
  the lazy dog.
*/
```
... and now our nice and neat formatting is all messed up! Reflow to the rescue! 

In Atom, select the comment block and then go to `Edit -> Reflow Selection`. In Vim, select the comment block (`v` then arrow around) and then type `gq` like GQ now you are dressed up much nicer.
```
/*
  The quick brown fox jumped over the lazy dog. The quick 
  brown fox jumped over the lazy dog the quick brown fox who
   is my cousin frank jumped over the lazy dog. The quick
   brown fox jumped over the lazy dog.
*/
```

Check out the [VIM wiki](http://vim.wikia.com/wiki/Automatic_formatting_of_paragraphs) for more info on options for things like setting what the width of paragraphs should be.
