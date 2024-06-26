const connection = require("./connection");
const conn = connection.promise()
const pluralize = require("pluralize");

class Model {
    constructor(obj = {}) {
        for (const key in obj) {
            this[key] = obj[key]
        }
    }

    toString() {
        return this.fullname || 'No string representation'
    }

    static get tableName() {
        let name = this.name
        name = name.replace(/.[A-Z]/, (m) => m.split('').join('_'))
        return pluralize(name.toLowerCase())
    }

    async add() {
        if (this.email) {
            const query = 'SELECT email FROM users WHERE email = ?';
            let results = await this.constructor.query(query, [this.email]);
            if (results.length > 0) {
                return "exists";
            }
        }

        const currentTime = new Date();

        // Format the current time to a MySQL-compatible datetime string
        const formattedTime = currentTime.toISOString().slice(0, 19).replace('T', ' ');


        let sql = `INSERT INTO ${this.constructor.tableName} (${Object.keys(this).join(", ")}, created_at, updated_at) VALUES (${'?'.repeat(Object.keys(this).length).split('').join(', ')}, ?, ?)`;
        let params = Object.values(this);
        params.push(formattedTime, formattedTime);

        let result = await this.constructor.query(sql, params, (err, res, fields) => {
            console.log(err, res, fields);
        })
        if (result.affectedRows > 0) {
            this.id = result.insertId;
            return "success";
        } else {
            return "error";
        }
    }

    static async find(filters = []) {
        let result = [];
        let params = [];
        let val = [];
        let operators = [];
        let sql = `SELECT * FROM ${this.tableName}`;

        try {
            if (filters.length) {
                if (Array.isArray(filters[0])) {
                    //check if filters includes OR
                    let includesOr = filters.some(([p]) => p.toLowerCase() === 'or');
                    // let includesNot = filters.some(([p]) => p.toLowerCase() === 'not');
                    //assign the operator (OR/AND)
                    let operator = (includesOr) ? "OR" : "AND";
                    // let not = (includesNot) ? " NOT": "";

                    //check if filters contains order by
                    if (filters.map(item => item[0].toLowerCase()).includes("order by")) {
                        let orderByIndex = filters.findIndex(item => item[0].toLowerCase() === "order by");
                        operators.push(filters[orderByIndex]);
                        filters.splice(orderByIndex, 1);
                    }
                    //checks if filters contains limit
                    if (filters.map(item => item[0].toLowerCase()).includes("limit")) {
                        let limitIndex = filters.findIndex(item => item[0].toLowerCase() === "limit");
                        operators.push(filters[limitIndex]);
                        filters.splice(limitIndex, 1);
                    }

                    //filter out the parameters and the values of arrays that have 2 values
                    params = filters.filter(([p, v]) => v !== undefined && v !== null && v !== '').map(([p, v]) => p);
                    val = filters.filter(([p, v]) => v !== undefined && v !== null && v !== '').map(([p, v]) => v);

                    //pass the extra operators into a string (Order By, and Limit)
                    let operatorsString = operators.map(op => op.join(' ')).join(' ');

                    //aet the value for clause, basically WHERE clause
                    let clause = "";

                    //add "where" in case there are still parameters after thr operators have been removed
                    if (filters.length) clause += ` WHERE`;
                    for (let i = 0; i < params.length; i++) {
                        clause += ` ${params[i]} = ? ${operator}`;
                    }
                    //remove the last (and/or)
                    clause = clause.replace(/ (AND|OR)$/, '');

                    sql += `${clause} ${operatorsString}`;
                } else {
                    params.push(filters[0]);
                    val.push(filters[1]);

                    sql += ` WHERE ${params} = ?`;
                }

            }
            let rows = await this.query(sql, val);
            for (const row of rows) {
                result.push(new this(row));
            }
            return result;
        } catch (err) {
            console.log(`SQL: ${sql}\nValues: ${val}\nFilters: ${filters}\n${err}`)
            return [];
        }
    }

    static async findById(id) {
        if (id) {
            let sql = `SELECT * FROM ${this.tableName} WHERE id = ?`
            let results = await this.query(sql, [id]);
            if (results.length) {
                let row = results[0]
                return new this(row)
            }
        }
        return {}
    }

    async update() {
        let sql = `UPDATE ${this.constructor.tableName} SET ${Object.keys(this).join(' = ?, ')} = ? WHERE id = ?`;
        let result = await this.constructor.query(sql, [...Object.values(this), this.id]);
        return result.affectedRow
    }

    static async selectDistinct(limit) {
        let sql = `SELECT DISTINCT v.*
                    FROM videos v
                    JOIN (
                    SELECT user_id, MAX(created_at) AS latest_created_at
                    FROM videos
                    WHERE type != 'short'
                    GROUP BY user_id
                    ORDER BY latest_created_at DESC
                    LIMIT 3
                    ) AS latest_videos
                    ON v.user_id = latest_videos.user_id AND v.created_at = latest_videos.latest_created_at
                    ORDER BY v.created_at DESC;`;
        let [results] = await conn.execute(sql);
        return results;
    }

    static async delete(id) {
        let sql = `DELETE FROM ${this.tableName} WHERE id = ?`
        await this.query(sql, [id]);
    }

    static async resetDB() {
        let sql = `DELETE FROM users WHERE id != ?`;
        try {
            await this.query(sql, [1]);
            console.log("Database Reset");
        } catch (err) {
            console.log("Error resetting the database");
        }

    }

    static async customSql(sql, val) {
        let result = [];
        let rows = await this.query(sql, val);
        for (const row of rows) {
            result.push(new this(row));
        }
        return result;
    }

    static async query(sql, params = []) {
        if (sql) {
            let [results] = await conn.execute(sql, params);
            return results
        }
    }
}

module.exports = Model;