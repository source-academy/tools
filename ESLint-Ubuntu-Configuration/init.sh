# TEST ESLINT
begin=$(date +"%s")

CONFIG_DIR='ESLint-Ubuntu-Configuration'


# TESTING

# install eslint locally
npm install eslint --save-dev
 
# install eslint plug-in
npm install eslint-plugin-more-naming-conventions

TEST_DIR="test"
FILE_LIST=$(ls $TEST_DIR)
ESLINT="./node_modules/.bin/eslint"

# GENERATE ONE FULL REPORT
OUTPUT_FILE=$TEST_DIR"/output.txt"
for FILE in $FILE_LIST;
do
	NEW_FILE=$(echo "$FILE"| cut -d '.' -f 1)
	INPUT_FILE=$TEST_DIR"/"$FILE
	$ESLINT -f codeframe $INPUT_FILE >> $OUTPUT_FILE
done

EXPECTED_OUTPUT_FILE="expected_output.txt"
IS_NULL=$(diff $EXPECTED_OUTPUT_FILE $OUTPUT_FILE)

if [ -z "$IS_NULL" ]; then
	echo "Installed successfully!"
else
	echo "Output file is not as expected!"
fi

# remove report file
rm $OUTPUT_FILE

# GENERATE RESULT FOR EACH FILE
#for FILE in $FILE_LIST;
#do 
#	NEW_FILE=$(echo "$FILE"| cut -d '.' -f 1)
#	INPUT_FILE=$TEST_DIR"/"$FILE
#	OUTPUT_FILE=$TEST_DIR"/"$NEW_FILE'.txt'
#	$ESLINT -f codeframe $INPUT_FILE > $OUTPUT_FILE
#done


termin=$(date +"%s")
difftimelps=$(($termin-$begin))
echo "$(($difftimelps / 60)) minutes and $(($difftimelps % 60)) seconds elapsed."



