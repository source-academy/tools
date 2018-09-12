# Check if <input directory> and <output directory> are filled in or not
if [ $# -ne 2 ]
then 
	echo "Add parameters!: ./init.sh <input directory> <output directory>"
	echo "<input directory>: /home/user/input_directory"
	echo "<output directory>: /home/user/output_directory"
	
else
	begin=$(date +"%s")

	# get parameters
	INPUT_DIR=$1
	OUTPUT_DIR=$2

	# clone the configuration file
	CONFIG_DIR='ESLint-Ubuntu-Configuration'

	# create a folder containing copied input files from input directory
	TEMP_INPUT_DIR="input"
	if [ -d "$TEMP_INPUT_DIR" ]
	then
		echo "$TEMP_INPUT_DIR directory exists!"
	else
		echo "Create $TEMP_INPUT_DIR directory."
		mkdir $TEMP_INPUT_DIR
	fi
	INPUT_FILES=$INPUT_DIR"/*"
	cp $INPUT_FILES $TEMP_INPUT_DIR

	# generate report for each input file
	ESLINT="./node_modules/.bin/eslint"
	FILE_LIST=$(ls $TEMP_INPUT_DIR)
	
	declare -i count=0
	for FILE in $FILE_LIST;
	do
		NEW_FILE=$(echo "$FILE"| cut -d '.' -f 1)
		INPUT_FILE=$TEMP_INPUT_DIR"/"$FILE
		OUTPUT_FILE=$OUTPUT_DIR"/"$NEW_FILE".txt"
		$ESLINT -f codeframe $INPUT_FILE > $OUTPUT_FILE
		count=count+1
		modulo=$((count%50))
		if [ "$modulo" -eq "0" ]
		then
			echo "Processed "$count" files."
		fi
	done
	
	rm -rvf $TEMP_INPUT_DIR
	echo "Processed "$count" files in total."

	termin=$(date +"%s")
	difftimelps=$(($termin-$begin))
	echo "$(($difftimelps / 60)) minutes and $(($difftimelps % 60)) seconds elapsed."
fi


