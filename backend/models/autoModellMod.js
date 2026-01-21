const pool = require('../config/db.js');
const bcrypt = require('bcrypt');
const Auto = {};

Auto.osszes = async () => {
    try {
        const [rows] = await pool.execute('SELECT * FROM osszes_auto');
        return rows;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

Auto.egy = async (id) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM osszes_auto WHERE id = ?', [id]);
        return rows[0];
    } catch (error) {
        console.error(error);
        throw error;
    }
};

Auto.hoozzaad = async (autoData) => {
    try {
        const { marka_id, model, valto_id, kiadasiev, uzemanyag_id, motormeret, km, ar, ajtoszam, szemelyek, szin_id, irat, leiras } = autoData;
        const [result] = await pool.execute(
            'INSERT INTO osszes_auto (marka_id, model, valto_id, kiadasiev, uzemanyag_id, motormeret, km, ar, ajtoszam, szemelyek, szin_id, irat, leiras) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [marka_id, model, valto_id, kiadasiev, uzemanyag_id, motormeret, km, ar, ajtoszam, szemelyek, szin_id, irat, leiras]
        );
        return { id: result.insertId, ...autoData };
    } catch (error) {
        console.error(error);
        throw error;
    }
};

Auto.modosit = async (id, autoData) => {
    try {
        const { marka_id, model, valto_id, kiadasiev, uzemanyag_id, motormeret, km, ar, ajtoszam, szemelyek, szin_id, irat, leiras } = autoData;
        await pool.execute(
            'UPDATE osszes_auto SET marka_id = ?, model = ?, valto_id = ?, kiadasiev = ?, uzemanyag_id = ?, motormeret = ?, km = ?, ar = ?, ajtoszam = ?, szemelyek = ?, szin_id = ?, irat = ?, leiras = ? WHERE id = ?',
            [marka_id, model, valto_id, kiadasiev, uzemanyag_id, motormeret, km, ar, ajtoszam, szemelyek, szin_id, irat, leiras, id]
        );
        return { id, ...autoData };
    } catch (error) {
        console.error(error);
        throw error;
    }
};
Auto.torol = async (id) => {
    try {
        await pool.execute('DELETE FROM osszes_auto WHERE id = ?', [id]);
    } catch (error) {
        console.error(error);
        throw error;
    }
};
Auto.getMarka = async () => {
    try {
        const [rows] = await pool.execute('SELECT * FROM marka');
        return rows;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
Auto.getSzin = async () => {
    try {
        const [rows] = await pool.execute('SELECT * FROM szin');
        return rows;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
Auto.getUzemanyag = async () => {
    try {
        const [rows] = await pool.execute('SELECT * FROM uzemanyag');
        return rows;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
Auto.getfelhasz = async (username) =>{
    const [rows] = await pool.query("SELECT * FROM user WHERE username = ?", [username]);
    return rows[0];
}
Auto.getValto = async () => {
    try {
        const [rows] = await pool.execute('SELECT váltó FROM osszes_auto GROUP BY váltó');
        return rows;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
Auto.getAjto = async () => {
    try {
        const [rows] = await pool.execute('SELECT ajtoszam FROM osszes_auto GROUP BY ajtoszam');
        return rows;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
Auto.getSzemely = async () => {
    try {
        const [rows] = await pool.execute('SELECT szemelyek FROM osszes_auto GROUP BY szemelyek');
        return rows;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
Auto.validatePassword = async (username, password) =>{
    const user = await Auto.getfelhasz(username);
    if (!user) {
        return false;
    }
    const match = await bcrypt.compare(password, user.password);
    return match ? user : false;
}
Auto.szuro = async (sql, values) => {
    try {
        const [rows] = await pool.execute(sql, values);
        return rows;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
Auto.getCount = async () => {
    try {
        const [rows] = await pool.execute('SELECT COUNT(*) as count FROM osszes_auto');
        return rows[0].count;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
};
Auto.regisztracio = async (data) =>{
    try {
        const hashedPassword = await bcrypt.hash(data.password,10);
        const  [result] = await pool.execute('insert into vevok (jelszo,email) VALUES(?,?)',[hashedPassword,data.email]);
        return result;
    } catch (error) {
        console.error(error);
        throw error;
    }
}
Auto.keresEmail = async(email) =>{
    const [rows] = await pool.query("Select * from vevok where email = ?",[email])
    return rows[0];
}
Auto.validatePassword = async (email,password) =>{
    const user = await Auto.keresEmail(email);
    console.log(user);
    if(!user){
        return false;
    }
    console.log(user.jelszo, password);
    const match = await bcrypt.compare(password,user.jelszo);
    console.log("Password match:", match);
    return match ? user:false;
}
// Érdeklődés hozzáadása
Auto.erdekelHozzaad = async (vevo_id, auto_id) => {
    try {
        await pool.execute(
            "INSERT IGNORE INTO erdeklodesek (vevo_id, auto_id) VALUES (?, ?)",
            [vevo_id, auto_id]
        );
        return true;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// Érdeklődött autók lekérdezése
Auto.erdekeltekListaja = async (vevo_id) => {
    try {
        const [rows] = await pool.execute(
            `SELECT a.* FROM osszes_auto a JOIN erdeklodesek e ON a.id = e.auto_id WHERE e.vevo_id = ?`,
            [vevo_id]
        );
        return rows;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
Auto.felhasznalok = async () => {
    try {
        const [rows] = await pool.execute('SELECT * FROM vevok');
        return rows;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
Auto.felhasznaloModositas = async ( data) => {
    try {
        const { nev, email, lakcim, adoszam,id } = data;
        await pool.execute(
            'UPDATE vevok SET nev = ?, email = ?, lakcim = ?, adoszam = ? WHERE id = ?',
            [nev, email, lakcim, adoszam, id]
        );
        return { id, ...data };
    } catch (error) {
        console.error(error);
        throw error;
    }
};
Auto.jelszoModositas = async (email, newPassword) => {
    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await pool.execute(
            'UPDATE vevok SET jelszo = ? WHERE email = ?',
            [hashedPassword, email]
        );
        return true;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
Auto.uzenetKuldes = async (vevo_id, auto_id, uzenet) => {
    try {
        await pool.execute(
            'INSERT INTO uzenet (vevo_id, auto_id, uzenet_text, elkuldve) VALUES (?, ?, ?, ?)',
            [vevo_id, auto_id, uzenet, new Date()]
        );
        return true;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
Auto.uzenetekLekerdezese = async (vevo_id) => {
    try {
        const [rows] = await pool.execute(
            ` SELECT auto_id,vevo_id,osszes_auto.nev,osszes_auto.model,osszes_auto.ar
 FROM uzenet
                inner JOIN osszes_auto ON osszes_auto.id = uzenet.auto_id
                WHERE uzenet.vevo_id = '7'
                GROUP by auto_id;`,
            [vevo_id]
        );
        return rows;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
Auto.AdminuzenetekLekerdezese = async () => {
    try {
        const [rows] = await pool.execute(
            `SELECT u.id,v.nev,u.vevo_id,u.auto_id,a.model,a.ar,u.uzenet_text,u.elkuldve,u.valasz
FROM uzenet u
JOIN (
    SELECT vevo_id, auto_id, MAX(elkuldve) AS max_elkuldve
    FROM uzenet
    WHERE valasz IS NULL
    GROUP BY vevo_id, auto_id
) ut ON ut.vevo_id = u.vevo_id
     AND ut.auto_id = u.auto_id
     AND ut.max_elkuldve = u.elkuldve
JOIN osszes_auto a ON u.auto_id = a.id
JOIN vevok v ON u.vevo_id = v.id
ORDER BY u.elkuldve DESC;

`
        );
        return rows;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
Auto.ChatAblak = async (vevo_id, auto_id) => {
    try {
        const [rows] = await pool.execute(
            `SELECT * FROM uzenet WHERE vevo_id = ? AND auto_id = ?`,
            [vevo_id, auto_id]
        );
        return rows;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

Auto.ChatAblakAdmin = async (uzenetId, uzenet_text) => {
    try {
        console.log("Admin válasz küldése:", uzenetId, uzenet_text);
        await pool.execute(
            `UPDATE uzenet
SET valasz = ?,
    valasz_datum = ?
WHERE id = ?;
`,
            [uzenet_text, new Date(), uzenetId]
        );
        return true;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
Auto.ChatAblakFelhasznalo = async (vevo_id, auto_id, uzenet_text) => {
    try {
        await pool.execute(
            'INSERT INTO uzenet (vevo_id, auto_id, uzenet_text, elkuldve) VALUES (?, ?, ?, ?)',
            [vevo_id, auto_id, uzenet_text, new Date()]
        );
        return true;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
Auto.szamlaAdatok = async () => {
    try {
        const jsonData = {};
        const [vevok] = await pool.execute(
            `SELECT id,nev,lakcim,adoszam,email FROM vevok where admin!=1`,
        );
        const [fizetesimod] = await pool.execute(
            `SELECT * FROM fizmodo`,
        );
        jsonData.vevok = vevok;
        jsonData.fizetesimod = fizetesimod;
        return jsonData;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

module.exports = Auto;
