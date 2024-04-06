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
