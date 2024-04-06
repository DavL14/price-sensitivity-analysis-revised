# Price Sensitivity Analysis Revised

Revised edition of a simple program that outputs the PSM (Price Sensitivity Measurement) Analysis from a certain .csv file.

Price Sensitivity Measurement (PSM) Analysis is a statistical method used to determine the optimal pricing for products or services based on how willing customers are to pay at different price points. This project demonstrates the application of PSM analysis on a dataset to find the highest price, compromise price, ideal price, and lowest quality assurance price. The analysis was initially conducted manually using Microsoft Excel, where graphs were drawn and key price points were identified. Subsequently, a TypeScript program was created to automate the extraction and display of these price points from the processed data.

## Prerequisites

- Node.js and npm (Node Package Manager): These are essential to run the TypeScript program. Install Node.js and npm from the [official Node.js website](https://nodejs.org/) or use Homebrew on macOS by running `brew install node`.
- TypeScript and ts-node: The project's codebase is written in TypeScript. Install globally via npm by running `npm install -g typescript ts-node`.
- An IDE or text editor that supports TypeScript, such as Visual Studio Code.

## Installation

1. Clone this repository to your local machine.
2. Navigate to the project directory.
3. Install TypeScript and TypeScript Node Definitions by running:

   ```sh
   npm install --save-dev typescript @types/node

4. Go into the directory of the cloned project.
5. Execute the program by running this command in the terminal.

   ```sh
   ts-node psm.ts --csvfile PSMrawdata
