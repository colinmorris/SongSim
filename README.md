# [SongSim](https://colinmorris.github.io/SongSim/#/)

A little web app for making interactive [self-similarity matrices](https://en.wikipedia.org/wiki/Self-similarity_matrix) from text (in particular, song lyrics and poetry). 

Given a text of length n tokens, constructs an n x n matrix, where (i, j) is filled in iff the ith and jth words are the same (after some normalization).

There are lots of examples of researchers constructing self-similarity matrices from raw audio features for the purposes of visualization or segmentation (e.g. [1](http://dl.acm.org/citation.cfm?id=319472), [2](http://dl.acm.org/citation.cfm?id=1178734)), which I drew inspiration from. I don't know of any previous applications of the technique to lyrics/verse.

### Note on canned data

`public/canned` contains a bunch of text files with examples of verse (pop songs, poems, nursery rhymes, etc.). Some of these works are in the public domain, and some are not. I don't own any of that content (and the license on the software in this repo does not extend to those files). My use of the songs which are under copyright is presumed to be fair, given the transformativeness of the use, and that purpose of use is educational and non-commercial.

### Generating matrix image files

(This is mostly a note to myself so I don't forget.)

- set config.debug = true
- in browser, press 'batch export' button
    - (this will respect all current settings wrt color, single-word matches, etc.)
- unzip
- run pngify.sh
- move pngs to public/img/gallery (or wherever else they're needed)

### Demo

[View demo at https://colinmorris.github.io/SongSim](https://colinmorris.github.io/SongSim)

### License

MIT
