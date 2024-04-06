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

        // Point of Marginal Expensiveness (PME) : 最高価格
        // Indifference Price Point (IPP) : 妥協価格
        // Optimal Price Point (OPP) : 理想価格
        // Point of Marginal Cheapness (PMC) : 最低品質保証価格

        console.log('');
        
        const pmeValue = findCrossPoints(tableData, '高すぎて買えない', '安い');
        console.log(`最高価格　　　　 : ${pmeValue.targetPoint}`);

        const ippValue = findCrossPoints(tableData, '高い', '安い');
        console.log(`妥協価格　　　　 : ${ippValue.targetPoint}`);

        const oppValue = findCrossPoints(tableData, '高すぎて買えない', '安すぎて買わない');
        console.log(`理想価格　　　　 : ${oppValue.targetPoint}`);

        const pmcValue = findCrossPoints(tableData, '高い', '安すぎて買わない');
        console.log(`最低品質保証価格 : ${pmcValue.targetPoint}`);

        console.log('');
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

function findCrossPoints(tableData: PricePointPercentages[], col1: keyof PricePointPercentages, col2: keyof PricePointPercentages): 
{ 
    x1: number;
    x2: number;
    y1: number;
    y2: number;
    y3: number;
    y4: number;
    targetPoint: string;
}{
    let crossPointBefore = { price: 'Not Found', col1: '0%', col2: '0%' };
    let crossPointAfter = { price: 'Not Found', col1: '0%', col2: '0%' };
    let foundCrossPoint = false;

    for (let i = 0; i < tableData.length; i++) {
        const percentage1 = parseFloat(tableData[i][col1].replace('%', ''));
        const percentage2 = parseFloat(tableData[i][col2].replace('%', ''));

        if (percentage1 > percentage2 && !foundCrossPoint) {
            crossPointAfter = {
                price: tableData[i].Price.replace(' 円', ''),
                col1: tableData[i][col1].replace('%', ''),
                col2: tableData[i][col2].replace('%', '')
            };
            if (i > 0) {
                crossPointBefore = {
                    price: tableData[i - 1].Price.replace(' 円', ''),
                    col1: tableData[i - 1][col1].replace('%', ''),
                    col2: tableData[i - 1][col2].replace('%', '')
                };
            }
            foundCrossPoint = true;
            break;
        }
    }

    // Cross Point Before Price : X1, X3
    // Cross Point After Price : X2, X4
    // Cross Point Before Col 1 : Y1
    // Cross Point After Col 1 : Y2
    // Cross Point Before Col 2 : Y3
    // Cross Point After Col 2 : Y4

    let x1 = parseFloat(crossPointBefore.price);
    let x2 = parseFloat(crossPointAfter.price);
    let y1 = parseFloat(crossPointBefore.col1);
    let y2 = parseFloat(crossPointAfter.col1);
    let y3 = parseFloat(crossPointBefore.col2);
    let y4 = parseFloat(crossPointAfter.col2);

    let targetPointCalculation = (( y3 - y1 ) * (( x1 - x2 ) ** 2 )+ x1 * ( y1 - y2 ) * ( x1 - x2 ) - x1 * ( y3 - y4 ) * ( x1 - x2 )) / (( y1 - y2 ) * ( x1 - x2 ) - ( x1 - x2 ) * ( y3 - y4 ));
    let targetPoint = targetPointCalculation.toFixed(2);

    return { x1, x2, y1, y2, y3, y4, targetPoint };
}