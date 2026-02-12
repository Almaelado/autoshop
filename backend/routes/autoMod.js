var express = require('express');
var fs = require('fs');
var router = express.Router();
var authenticateToken = require('../middleware/authAuto');
var autoController = require('../controllers/autoControllerMod');
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = 'tmp/';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });


router.get('/minden', autoController.osszes);
router.get('/egy/:id', autoController.egy);
router.delete('/torol/:id', autoController.torol);
router.get('/marka', autoController.getMarka);
router.get('/szin', autoController.getSzin);
router.get('/uzemanyag', autoController.getUzemanyag);
router.post('/szuro', autoController.szuro);
router.post('/login', autoController.login);
router.post('/regisztracio',autoController.regisztracio);
router.get('/valtok', autoController.getValto);
router.get('/ajtok', autoController.getAjto);
router.get('/szemelyek', autoController.getSzemely);
router.get('/count', autoController.getCount);
router.post('/refresh', autoController.refresh);
router.get('/profil',authenticateToken,autoController.profil);
router.post('/logout', autoController.logout);
router.get('/ajanlott/:marka', autoController.ajanlott);
router.post('/erdekel', authenticateToken, autoController.erdekel);
router.get('/erdekeltek', authenticateToken, autoController.erdekeltek);
router.put('/profilmodosit', authenticateToken, autoController.felhasznaloModositas);
router.put('/jelszomodositas', authenticateToken, autoController.jelszoModositas);
router.post('/uzenet', authenticateToken, autoController.uzenetKuldes);
router.get('/uzenetek', authenticateToken, autoController.uzenetekLekerdezese);
router.post('/adminuzenetek', authenticateToken, autoController.AdminUzenetek);
router.get('/chatablak', authenticateToken, autoController.ChatAblak);
router.post('/admin/chatablak', authenticateToken, autoController.ChatAblakAdmin);
router.post('/felhasznalo/chatablak', authenticateToken, autoController.ChatAblakFelhasznalo);
router.get('/szamla', authenticateToken, autoController.szamlaAdatok);
router.get('/random',autoController.randomautok);
router.put('/szerkesztes/:id',authenticateToken,autoController.Szerkesztes);
router.post('/ujauto',authenticateToken,autoController.UjAuto);
router.post('/szamla',authenticateToken,autoController.UjSzamla);
router.post('/addszin', authenticateToken, autoController.AddSzin);
router.post('/adduzemanyag', authenticateToken, autoController.AddUzemanyag);
router.post('/addmodell', authenticateToken, autoController.AddModell);
router.post('/addvalto', authenticateToken, autoController.AddValto);
router.delete("/kepek/:autoId/:index",authenticateToken, autoController.KepTorles);
router.post("/kepek/:autoId", authenticateToken,upload.single('file'), autoController.KepFeltoltes);
module.exports = router;
