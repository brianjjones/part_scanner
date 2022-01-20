#!/bin/bash
echo "Batch starting"

for file in $@
do
    echo $file ------
    BASEFILE="$(basename $file)"
    mkdir -p output
    # Replace white with black
    convert $file -fill white -fuzz 17% +opaque black "output/b_$BASEFILE"
    # Save a rotated too
    convert "output/b_$BASEFILE" -rotate 90 "output/b_r_$BASEFILE"
    # Do the same for white text. First make the black text another color
    convert $file -fill black -fuzz 20% -floodfill +0+0 white  "output/w_$BASEFILE"
    convert "output/w_$BASEFILE" -fill black -fuzz 13% +opaque white "output/w_$BASEFILE"
    # Make text black
    convert "output/w_$BASEFILE" -channel RGB -negate "output/w_$BASEFILE"
    # Save a rotated too
    convert "output/w_$BASEFILE" -rotate 90 "output/w_b_r_$BASEFILE"

done

python3 box.py "output/partlist" output/*.png