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
            },
            {
                test: /\.(png|jpe?g|gif|webp|svg)$/i,  // Cerca file di immagini
                type: 'asset/resource',  // Gestisce i file statici come risorse
                generator: {
                    filename: '[name][hash][ext]',  // Assicurati che le immagini siano salvate correttamente
                    publicPath: 'https://localhost:7282/js/'  // Percorso pubblico per le immagini
                }
            }
        ]
    }
};