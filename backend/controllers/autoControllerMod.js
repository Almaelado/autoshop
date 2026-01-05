const jwt = require('jsonwebtoken');

const Auto=require('../models/autoModellMod');

const ACCESS_SECRET = process.env.ACCESS_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

function generateAccessToken(user) {
    return jwt.sign(user, ACCESS_SECRET, { expiresIn: '15m' }); 
}

function generateRefreshToken(user) {
    return jwt.sign(user, REFRESH_SECRET, { expiresIn: '7d' }); 
}

const autoController={
    async osszes(req, res) {
        try {
            const autos =  await Auto.osszes();
            res.status(200).json(autos);
        } catch (error) {
            console.error("Error fetching all cars:", error);
            res.status(500).json({ message: error.message });
        }
    },
    async egy(req, res) {
        try {
            const id = req.params.id;
            const auto = await Auto.egy(id);
            if (auto) {
                res.status(200).json(auto);
            } else {
                res.status(404).json({ message: 'Auto not found' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    async hozzaad(req, res) {
        try {
            const autoData = req.body;
            const ujAuto = await Auto.hoozzaad(autoData);
            res.status(201).json(ujAuto);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    async modosit(req, res) {
        try {
            const id = req.params.id;
            const autoData = req.body;
            const frissitettAuto = await Auto.modosit(id, autoData);
            res.status(200).json(frissitettAuto);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    async torol(req, res) {
        try {
            const id = req.params.id;
            await Auto.torol(id);
            res.status(204).end();
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    async szinkeres(req,res){
        try {
            const szin_id=req.params.szin_id;
            const autos=await Auto.szinkeres(szin_id);
            res.status(200).json(autos);
        } catch (error) {
            res.status(500).json({message:error.message});
        }
    },

    async getMarka(req, res) {
        try {
            const autos =  await Auto.getMarka();
            res.status(200).json(autos);
        } catch (error) {
            console.error("Error fetching all cars:", error);
            res.status(500).json({ message: error.message });
        }
    },
    async getSzin(req, res) {
        try {
            const autos =  await Auto.getSzin();
            res.status(200).json(autos);
        } catch (error) {
            console.error("Error fetching all cars:", error);
            res.status(500).json({ message: error.message });
        }
    },
    async getUzemanyag(req, res) {
        try {
            const autos =  await Auto.getUzemanyag();
            res.status(200).json(autos);
        } catch (error) {
            console.error("Error fetching all cars:", error);
            res.status(500).json({ message: error.message });
        }
    },
    async getValto(req, res) {
        try {
            const autos =  await Auto.getValto();
            res.status(200).json(autos);
        } catch (error) {
            console.error("Error fetching all cars:", error);
            res.status(500).json({ message: error.message });
        }
    },
    async getAjto(req, res) {   
        try {
            const autos =  await Auto.getAjto();
            res.status(200).json(autos);
        } catch (error) {
            console.error("Error fetching all cars:", error);
            res.status(500).json({ message: error.message });
        }
    },
    async getSzemely(req, res) {
        try {
            const autos =  await Auto.getSzemely();
            res.status(200).json(autos);
        } catch (error) {
            console.error("Error fetching all cars:", error);
            res.status(500).json({ message: error.message });
        }
    },
async szuro(req, res, next) {
    try {
        const szuro_json = req.body;
        console.log("Szurok:", szuro_json);

        let whereClauses = [];
        let values = [];

        // Tömb alapú szűrők
        const fieldMap = {
            markak: "nev",
            uzemanyag: "üzemanyag",
            szin: "szin_nev",
            valto: "váltó",
            ajto: "ajtoszam",
            szemely: "szemelyek"
        };

        for (const key in fieldMap) {
            const sqlField = fieldMap[key];
            if (Array.isArray(szuro_json[key]) && szuro_json[key].length > 0) {
                whereClauses.push(`${sqlField} IN (${szuro_json[key].map(() => '?').join(',')})`);
                values.push(...szuro_json[key]);
            }
        }

        // Range szűrők
        const rangeFields = {
            arRange: "ar",
            kmRange: "km",
            evjarat: "kiadasiev"
        };

        for (const key in rangeFields) {
            if (Array.isArray(szuro_json[key]) && szuro_json[key].length === 2) {
                whereClauses.push(`${rangeFields[key]} BETWEEN ? AND ?`);
                values.push(szuro_json[key][0], szuro_json[key][1]);
            }
        }

        // Boolean mező
        if (typeof szuro_json.irat === "boolean" && szuro_json.irat === true) {
            whereClauses.push(`irat = ?`);
            values.push(1);
        }

        // Motorméret
        if (typeof szuro_json.motormeret === "number" && szuro_json.motormeret > 0) {
            whereClauses.push(`motormeret >= ?`);
            values.push(szuro_json.motormeret);
        }

        // Keresés SQL-ben (csak létező oszlopok)
        if (szuro_json.keres && szuro_json.keres.trim() !== "") {
            const keres = `%${szuro_json.keres.trim()}%`;
            whereClauses.push(`(nev LIKE ? OR model LIKE ? OR szin_nev LIKE ?)`);
            values.push(keres, keres, keres);
        }

        // SQL összeállítása
        let sql = "SELECT * FROM osszes_auto";
        if (whereClauses.length > 0) {
            sql += " WHERE " + whereClauses.join(" AND ");
        }

        // Paginálás
        const limit = Number(szuro_json.limit) || 10;
        const page = Number(szuro_json.page) || 1;
        const offset = (page - 1) * limit;

        // LIMIT és OFFSET közvetlenül az SQL-be
        sql += ` LIMIT ${limit} OFFSET ${offset}`;

        console.log("Generated SQL:", sql, "Values:", values);

        // Lekérés
        const results = await Auto.szuro(sql, values);
        res.status(200).json(results);

    } catch (error) {
        console.error("Error in filtering:", error);
        res.status(500).json({ message: error.message });
    }
}


,

    async login (req, res,next){   
        const { email, password } = req.body;    
        const user = await Auto.validatePassword(email,password);
        console.log('Bejelentkezési kísérlet:', user);

        if(user!= false){
            const accessToken = generateAccessToken(user);
            const refreshToken = generateRefreshToken(user);
            res.cookie('refreshToken', refreshToken, 
                { httpOnly: true, 
                  secure: false, // true ha HTTPS-t használsz
                  sameSite: 'Lax', // Strict, Lax, None
                  maxAge: 7*24*60*60*1000 // 7 nap
                });
            res.json({ accessToken, user });
        } else {
            res.status(401).send('Érvénytelen belépés');
        }
    },
    async getCount(req, res) {
        try {
            const count =  await Auto.getCount();
            res.status(200).json({count: count});
        } catch (error) {   
            console.error("Error fetching car count:", error);
            res.status(500).json({ message: error.message });
        }
    },
    async regisztracio(req,res){
        try {
            const body = req.body;
            if(!body.email || !body.password){
                res.status(404).send("Nincs email vagy jelszo");
            }
            else{
                const response = await Auto.regisztracio(body);
                res.status(200).json(response);
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    refresh (req, res) {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.sendStatus(204); // nincs cookie
        }

        jwt.verify(refreshToken, REFRESH_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403); // lejárt / hamis
            }

            const { iat, exp, ...payload } = user; // eltávolítjuk a JWT metaadatokat és csak a felhasználói adatokat tartjuk meg payload változóban pl: { id: user.id, email: user.email }
            const newAccessToken = generateAccessToken(payload);
            console.log(payload);
            res.json({ accessToken: newAccessToken , user: payload });
        });
    },
    profil (req, res) { 
            const user = req.user;  // req.user-t az authenticateToken middleware állítja be
            console.log("Profil lekérdezés user:", user);
        res.json(user);
    },
    logout (req, res) {
        res.clearCookie('refreshToken', { httpOnly: true, secure: false, sameSite: 'Lax' });
        res.sendStatus(204);
    }

};
module.exports=autoController;