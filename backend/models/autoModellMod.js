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

module.exports = Auto;
