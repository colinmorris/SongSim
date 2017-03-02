#!/bin/bash

imgsize=800
#dest=public/img/gallery/
dest='./'
for path in "$@"
do
    fname=$(basename "$path")
    base="${fname%.*}"
    inkscape -z -e "${dest}${base}.png" -w $imgsize $path
done
