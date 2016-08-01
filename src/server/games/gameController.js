export default {
  addRequest: (req, res, next) => {
    let gameReq = req.body;
    console.log(gameReq);
    
    res.status(201).send('requst added');
  }
}