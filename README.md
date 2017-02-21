A little web app for making interactive [self-similarity matrices](https://en.wikipedia.org/wiki/Self-similarity_matrix) from text (in particular, song lyrics and poetry). 

Given a text of length n tokens, constructs an n x n matrix, where (i, j) is filled in iff the ith and jth words are the same (after some normalization).

There are lots of examples of researchers constructing self-similarity matrices from raw audio features for the purposes of visualization or segmentation (e.g. [1](http://dl.acm.org/citation.cfm?id=319472), [2](http://dl.acm.org/citation.cfm?id=1178734)), which I drew inspiration from. I don't know of any previous applications of the technique to lyrics/verse.
