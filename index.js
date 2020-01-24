const server = require ('./server.js');
// const port = 4000; 

const port = process.env.PORT || 7000;
server.listen(port, () => {
    console.log('\n***server running\n', port);
});

