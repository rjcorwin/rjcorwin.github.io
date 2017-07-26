# How to make GIFs

GIFs are a powerful tool for showing a quick example of something. A GIF is worth a thousand words it feels like sometimes. 

Here are some tips.

- capture with giphy capture
  - https://giphy.com/apps/giphycapture
- Reduce colors and optimize with gifsicle.
  - On Mac with brew, install with `brew install gifsicle`
  - Run command `gifsicle --colors 256 -O3 original.gif -o output.gif` 
  - Install the gif command into your ZSH with `mkdir ~/bin && echo "gifsicle --colors 256 -O3 $1 -o $2" > ~/bin/gif.sh && chmod +x ~/bin/gif.sh && echo 'alias gif="~/bin/gif.sh" >> ~/.zshrc'`. Then open a new ZSH session and run `gif some-gif-to-optimize.gif the-optimized-gif-output.gif`.
- reduce framerate (takes a while) https://ezgif.com/
