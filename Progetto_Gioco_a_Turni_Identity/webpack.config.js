const path = require('path');

module.exports = {
    entry: './src/ts/app.ts',  // Il file TypeScript principale
    output: {
        filename: 'bundle.js',   // Il nome del file JavaScript bundle
        path: path.resolve(__dirname, './wwwroot/js')  // Cartella di output
    },
    resolve: {
        extensions: ['.ts', '.js']  // Risolve file TypeScript e JavaScript
    },
    module: {
        rules: [
            {
                test: /\.ts$/,  // Cerca file .ts
                use: 'ts-loader',  // Usa ts-loader per compilarli
                exclude: /node_modules/
            }
            //{
            //    test: /\.(png|jpg|gif|svg)$/, // Regola per gestire file di immagine
            //    type: 'asset/resource', // Con Webpack 5, gestiamo i file statici come risorse
            //    generator: {
            //        filename: 'images/[name][ext]' // Cartella di output delle immagini
            //    }
            //}
        ]
    }
};