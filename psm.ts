// Importing necessary modules
import fs from 'fs';
import csv from 'csv-parser';

const pricePoints = [50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600];
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
        const expensivePercentages = calculateExpensivePercentages(responses);
        const cheapPercentages = calculateCheapPercentages(responses);
        const tooExpensivePercentages = calculateTooExpensivePercentages(responses);
        const tooCheapPercentages = calculateTooCheapPercentages(responses);

        // Combine the data into a single structure for table output
        const tableData = expensivePercentages.map((expensivePercentage, index) => ({
            Price: `${pricePoints[index]} 円`,
            高い: `${expensivePercentages[index]}%`,
            安い: `${cheapPercentages[index]}%`,
            高すぎて買えない: `${tooExpensivePercentages[index]}%`,
            安すぎて買わない: `${tooCheapPercentages[index]}%`,
        }));

        // Output the data as a table
        console.table(tableData);

        // Indifference Price Point : 妥協価格
        // Optimal Price Point : 理想価格
        // Point of Marginal Cheapness (PMC) : 最低品質保証価格
        // Point of Marginal Expensiveness (PME) : 最高価格

        const { beforePrice, afterPrice, beforeCol1, afterCol1, beforeCol2, afterCol2 } = findBeforeAfter(tableData, '高すぎて買えない', '安い');
        console.log(`Cross point before: ${beforePrice}, 高すぎて買えない: ${beforeCol1}, 安い: ${beforeCol2}`);
        console.log(`Cross point after: ${afterPrice}, 高すぎて買えない: ${afterCol1}, 安い: ${afterCol2}`);
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

    let expensivePercentages = counts.map(count => ((count / responses.length) * 100).toFixed(1));
    return expensivePercentages;
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

    let cheapPercentages = counts.map(count => ((count / responses.length) * 100).toFixed(1));
    return cheapPercentages;
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

    let tooExpensivePercentages = counts.map(count => ((count / responses.length) * 100).toFixed(1));
    return tooExpensivePercentages;
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

    let tooCheapPercentages = counts.map(count => ((count / responses.length) * 100).toFixed(1));
    return tooCheapPercentages;
}

type PricePointPercentages = {
    Price: string;
    高い: string;
    安い: string;
    高すぎて買えない: string;
    安すぎて買わない: string;
};

function findBeforeAfter(tableData: PricePointPercentages[], col1: keyof PricePointPercentages, col2: keyof PricePointPercentages): 
{ 
    beforePrice: string; afterPrice: string;
    beforeCol1: string; afterCol1: string;
    beforeCol2: string; afterCol2: string; 
}{
    let crossPointBefore = { price: 'Not Found', col1: '0%', col2: '0%' };
    let crossPointAfter = { price: 'Not Found', col1: '0%', col2: '0%' };
    let foundCrossPoint = false;

    for (let i = 0; i < tableData.length; i++) {
        const percentage1 = parseFloat(tableData[i][col1].replace('%', ''));
        const percentage2 = parseFloat(tableData[i][col2].replace('%', ''));

        if (percentage1 > percentage2 && !foundCrossPoint) {
            crossPointAfter = {
            price: tableData[i].Price,
            col1: tableData[i][col1],
            col2: tableData[i][col2]
            };
            if (i > 0) {
            crossPointBefore = {
                price: tableData[i - 1].Price,
                col1: tableData[i - 1][col1],
                col2: tableData[i - 1][col2]
            };
            }
            foundCrossPoint = true;
            break;
        }
    }
    return {
        beforePrice: crossPointBefore.price, afterPrice: crossPointAfter.price,
        beforeCol1: crossPointBefore.col1, afterCol1: crossPointAfter.col1,
        beforeCol2: crossPointBefore.col2, afterCol2: crossPointAfter.col2
    };
}