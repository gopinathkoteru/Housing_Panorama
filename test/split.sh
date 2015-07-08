cd $1
for folder in `ls`
do
	cd $folder
	test = `echo $folder | cut -d'_' -f1`
	echo "**************************************"
	echo $folder | grep "blur"
	for file in `ls`
	do
		if [ $file == "mobile_b.jpg" ] || [ $file == "mobile_d.jpg" ] || [ $file == "mobile_f.jpg" ] || [ $file == "mobile_l.jpg" ] || [ $file == "mobile_r.jpg" ] || [ $file == "mobile_u.jpg" ]
		then
			name=`echo "$file" | cut -d'.' -f1`
			mkdir $name
			if echo $folder | grep "blur"
			then
				convert -crop 128x128 $file $name/%d.jpg
			else
				convert -crop 512x512 $file $name/%d.jpg
			fi
			rm $file
		fi
	done
	cd ..
done

