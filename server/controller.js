const { getCodeService, addCodeService } = require("./service.js");

const getCodeBlock = async (req, res) => {
    const result = await getCodeService(req.params.blockcodeId);

    if (result.status !== 200) {
      res.status(402).send("code block not found in db");
    } else {
      res.json(result);
    }

};

const changeCodeBlock = async (req, res) => {
  const result = await addCodeService(req.params.blockcodeId, req.body.code);
  if (result.status !== 200) {
    res.status(402).send("failed updating the block code");
  } else {
    res.sendStatus(200);
  }
};

module.exports = { getCodeBlock, changeCodeBlock };
