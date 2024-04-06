// Importing necessary modules
import fs from 'fs';
import csv from 'csv-parser';

const responses: Array<{expensive:number, cheap:number, tooExpensive:number, tooCheap:number}> = [];

// Extracting CSV file name from command-line arguments
const args = process.argv.slice(2); // Remove the first two elements
let csvFileName = 'PSMrawdata.csv'; // Default CSV file name

// Loop through arguments to find the '--csvfile' option
args.forEach((val, index) => {
    if (val === '-csvfile' && args[index + 1]){
        csvFileName = args[index + 1] + '.csv'; // Append '.csv' to the provided file name
    }
});

fs.createReadStream(csvFileName)
    .pipe(csv())
    .on('data', (data) => {
        responses.push({
            expensive: parseFloat(data['高い']),
            cheap: parseFloat(data['安い']),
            tooExpensive: parseFloat(data['高すぎる']),
            tooCheap: parseFloat(data['安すぎる'])
        });
    })
    .on('end', () => {
        calculateAndPrintPSM(responses);
    });

function calculateAndPrintPSM(responses: Array<{expensive:number, cheap:number, tooExpensive:number, tooCheap:number}>) {
    // Loop through each response and print the values. 
    // I did this to help verify that my data is being read correctly before proceeding with any calculations.
    responses.forEach((response, index) => {
        console.log(`Sample ${index + 1}: Expensive - ${response.expensive}, Cheap - ${response.cheap}, Too Expensive - ${response.tooExpensive}, Too Cheap - ${response.tooCheap}`);
    });

    // Added calculation logic after verifying that the data is being read correctly.

}