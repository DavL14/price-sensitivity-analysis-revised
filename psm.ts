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
        calculateExpensivePercentages(responses);
        calculateCheapPercentages(responses);
        calculateTooExpensivePercentages(responses);
        calculateTooCheapPercentages(responses);
    });

function calculateExpensivePercentages(responses: Array<{expensive:number}>) {
    const pricePoints = [50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600];
    let counts = new Array(pricePoints.length).fill(0);

    responses.forEach(response => {
        pricePoints.forEach((price, index) => {
            if(response.expensive <= price){
                counts[index]++;
            }
        });
    });

    let expensivePercentages = counts.map(count => (count / responses.length) * 100);
    console.log("高い：")
    pricePoints.forEach((price, index) => {
        console.log(`${price} 円：${expensivePercentages[index].toFixed(1)}%`);
    });
}

function calculateCheapPercentages(responses: Array<{cheap:number}>) {
    const pricePoints = [50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600];
    let counts = new Array(pricePoints.length).fill(0);

    responses.forEach(response => {
        pricePoints.forEach((price, index) => {
            if(response.cheap >= price){
                counts[index]++;
            }
        });
    });

    let cheapPercentages = counts.map(count => (count / responses.length) * 100);
    console.log("安い：")
    pricePoints.forEach((price, index) => {
        console.log(`${price} 円：${cheapPercentages[index].toFixed(1)}%`);
    });
}

function calculateTooExpensivePercentages(responses: Array<{tooExpensive:number}>) {
    const pricePoints = [50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600];
    let counts = new Array(pricePoints.length).fill(0);

    responses.forEach(response => {
        pricePoints.forEach((price, index) => {
            if(response.tooExpensive <= price){
                counts[index]++;
            }
        });
    });

    let tooExpensivePercentages = counts.map(count => (count / responses.length) * 100);
    console.log("高い：")
    pricePoints.forEach((price, index) => {
        console.log(`${price} 円：${tooExpensivePercentages[index].toFixed(1)}%`);
    });
}

function calculateTooCheapPercentages(responses: Array<{tooCheap:number}>) {
    const pricePoints = [50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600];
    let counts = new Array(pricePoints.length).fill(0);

    responses.forEach(response => {
        pricePoints.forEach((price, index) => {
            if(response.tooCheap >= price){
                counts[index]++;
            }
        });
    });

    let tooCheapPercentages = counts.map(count => (count / responses.length) * 100);
    console.log("安い：")
    pricePoints.forEach((price, index) => {
        console.log(`${price} 円：${tooCheapPercentages[index].toFixed(1)}%`);
    });
}