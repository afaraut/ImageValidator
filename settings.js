var exports;

exports.appPort = process.env.PORT || 3700;
exports.mongoDBURL = process.env.mongoDBURL || 'mongodb://localhost:27017/ImageDatasetEval';
exports.collection_MongoDB = process.env.collection_MongoDB || 'Eval';