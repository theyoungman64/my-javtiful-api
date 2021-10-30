const express = require('express')
const fs = require('fs')
const path = require('path')
const app = express()
const os = require('os');
const axios = require('axios');

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
  let jsonData = fs.readFileSync('public/fakyutub-link.json');
  let javs = JSON.parse(jsonData);
  res.render('index');
})

app.get('/image/:name', function (req, res) {
  res.sendFile(path.join(__dirname, `images/${req.params.name}`))
})

app.get('/video/redirector', async (req, res) => {
  try {
    let { id, resolution = '480p' } = req.query;
    let { data } = await axios.post(`https://fakyutube.com/api/source/${id}`, {});
    let dataObj = data.data.find(item => item.label === resolution)
    res.redirect(dataObj.file)
  } catch (error) {
    res.send(error.message);
  }
})

app.get('/video/stream', async (req, res) => {
  try {
    let { id, resolution = '480p' } = req.query;
    let { data } = await axios.post(`https://fakyutube.com/api/source/${id}`, {});
    let dataObj = data.data.find(item => item.label === resolution);
    let stream = await axios({
      method: 'get',
      url: dataObj.file,
      responseType: 'stream',
      headers: {
        range: req.headers.range || 0
      }
    });
    res.writeHead(206, stream.headers);
    stream.data.pipe(res);
  } catch (error) {
    res.send(error.message);
  }
})

app.get('/video/:name', function (req, res) {
  const path = `assets/${req.params.name}`
  const stat = fs.statSync(path)
  const fileSize = stat.size
  const range = req.headers.range

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-")
    const start = parseInt(parts[0], 10)
    const end = parts[1]
      ? parseInt(parts[1], 10)
      : fileSize - 1

    if (start >= fileSize) {
      res.status(416).send('Requested range not satisfiable\n' + start + ' >= ' + fileSize);
      return
    }

    const chunksize = (end - start) + 1
    const file = fs.createReadStream(path, { start, end })
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    }

    res.writeHead(206, head)
    file.pipe(res)
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(200, head)
    fs.createReadStream(path).pipe(res)
  }
})

app.listen(4000, function () {
  console.log('Listening on port 4000!')
  // console.log("ip address : " + os.networkInterfaces()['Wi-Fi'].filter((net) => { return net.family === 'IPv4' }).map((net) => { return net.address })[0]);
})
