const fs = require('fs');

const requestHandler = (req,res) => {
    const url = req.url;
    const method = req.method;
    if (url === '/') {
        res.write('<html>');
        res.write('<head><title>My First Page</title></head>');
        res.write(
            '<body><form action="/message" method="post"><input type="text" name="message"><button type="submit">Send</button></form></body>'
        );
        res.write('</html>');
        var date = new Date();
        console.log("Time: ", date.toDateString());
        return res.end();
    }

    if (url === '/message' && method === 'POST') {
        const body = [];
        req.on('data', (chunk) => {
            console.log(chunk);
            body.push(chunk);
        });
        return req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString();
            const message = parsedBody.split('=')[1];
            fs.writeFile('message.txt', message, (err) => {
                res.statusCode = 302;
                res.setHeader('Location', '/');
                return res.end();
            }); 
            console.log(message);
       });
            // res.statusCode = 302;
            // res.setHeader('Location', '/');
            // return res.end();
    }
    if(url === "/users"){
        res.write('<html>');
        res.write('<table><ul><li>User 1</li><li>User 2</li></ul></table>');
        res.write('</html>');
        return res.end();
    }
    res.setHeader('Content-Type', 'text/html');
    res.write('<html>');
    res.write('<head><title>My First Page</title></head>');
    res.write('<body><h1>Hello World!</h1></body>');
    res.write('</html>');
    res.end();
};

module.exports = {
    handlers: requestHandler,
    someText: 'Some hard coded text'
};