// config file

export default {
  mongoUrl: process.env.MONGO_URL || "mongodb://0.0.0.0:27017/test",
  privateKey: process.env.PRIVATE_KEY || '{"kty":"oct","kid":"d03b7d54-ea8e-4623-a385-1453d20a0ce2","k":"WUixz8QbSnn1NgY9ubC1WCFP34mtpsBKFUBX_IxdJ5g","alg":"A256GCM"}' as string,
  jwt: {
    expiration: process.env.JWT_EXPIRATION || "1h"
  }
}

