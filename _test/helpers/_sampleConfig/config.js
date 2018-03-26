module.exports = {
  bundle: {url: '/assets/bundle.js', container: '#test'},
  assets: [{urlPath: '/assets', directory: './assets'}],
  routes: [
    {endpoint: '/foo', GET: (req, res) => {res.json({hello: 'foo'})}},
    {endpoint: '/bar', GET: (req, res) => {res.json({hello: 'bar'})}}
  ]
}