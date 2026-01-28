try {
    const png = require('png-js');
    console.log('png-js loaded successfully');
    console.log('Main file path:', require.resolve('png-js'));
} catch (err) {
    console.error('Error loading png-js:', err);
}
