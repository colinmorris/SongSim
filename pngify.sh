#!/bin/bash

imgsize=800
#dest=public/img/gallery/
dest='./'
dpi=90
for path in "$@"
do
    fname=$(basename "$path")
    base="${fname%.*}"
    #inkscape -z -e "${dest}${base}.png" -w $imgsize $path
    inkscape -z -e "${dest}${base}.png" -d $dpi $path
done
