const fs = require('fs');
const winston = require('winston');
const { S3Client } = require('@aws-sdk/client-s3');
const mongoose = require('mongoose');
const path = require('path');
const jwt = require('jsonwebtoken');

class Config {
    constructor() {
        // Charger la configuration à partir d'un fichier ou des variables d'environnement
        const configFile = process.env.CONFIG_FILE || './config.json';
        this.config = this.loadConfig(configFile);

        // Mode de stockage
        this.storageMode = process.env.STORAGE_MODE || 'local'; // Par défaut : local

        // Initialiser les logs
        this.logLevel = this.config.LOG_LEVEL || process.env.LOG_LEVEL || 'info';
        this.logger = this.initializeLogger();

        // Initialiser JWT
        this.jwt = jwt;

        // Initialiser S3 (uniquement si mode production)
        if (this.storageMode === 'aws') {
            this.s3 = new S3Client({
                region: this.config.AWS_REGION || process.env.AWS_REGION,
                credentials: {
                    accessKeyId: this.config.AWS_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID,
                    secretAccessKey: this.config.AWS_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY,
                },
            });
        }

        // Initialiser MongoDB
        this.mongoURI = this.config.MONGO_URI || process.env.MONGO_URI;
    }

    // Méthode pour charger un fichier de configuration
    loadConfig(filePath) {
        try {
            if (fs.existsSync(filePath)) {
                const data = fs.readFileSync(filePath);
                return JSON.parse(data);
            }
            return {}; // Retourne un objet vide si le fichier n'existe pas
        } catch (error) {
            console.error(`Erreur lors du chargement de la configuration : ${error.message}`);
            return {};
        }
    }

    // Méthode pour initialiser le logger
    initializeLogger() {
        return winston.createLogger({
            level: this.logLevel,
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.printf(({ level, message, timestamp }) => {
                    return `${timestamp} [${level.toUpperCase()}]: ${message}`;
                })
            ),
            transports: [
                new winston.transports.Console(),
                new winston.transports.File({
                    filename: path.resolve(process.cwd(), 'application.log'), // Met dans la racine du projet
                }),
            ],
        });
    }

    // Méthode pour connecter MongoDB
    async connectDB() {
        try {
            await mongoose.connect(this.mongoURI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            this.logger.info('MongoDB Connected...');
        } catch (error) {
            this.logger.error(`Erreur de connexion à MongoDB : ${error.message}`);
            process.exit(1); // Arrêter le serveur en cas d'erreur
        }
    }

    // Méthode pour gérer les logs
    log(level, message) {
        if (this.logger[level]) {
            this.logger[level](message);
        } else {
            this.logger.info(message); // Par défaut, log en info si le niveau n'est pas trouvé
        }
    }
}

module.exports = new Config();
