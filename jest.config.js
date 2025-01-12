export default {
    testEnvironment: 'node',
    transform: {
        "^.+\\.m?js$": "babel-jest",
    }, // config para que Jest use Babel para las transformaciones a js 
    verbose: true,
};