import { User } from "../model/user";
import { connectionPool } from "../util/connection-util";
import { userConverter } from "../util/user-converter";



const bcrypt = require('bcrypt');


/**
 * Register user with email if already in database
 */
export async function findByEmail(email: string): Promise <User> {
    const client = await connectionPool.connect();
    try {
        const resp = await client.query(
            `SELECT * FROM ers.ers_users
            WHERE user_email = $1`,
                [email]
        );
        if(resp.rows.length) {
            return userConverter(resp.rows[0]);
        }
        return null;
    } finally {
        client.release();
    }
}

/**
 * Offically register user in database, fill out user infomation
 */
export async function fillNewUser(username: string, password: string, firstname: string, lastname: string, email: string): Promise <any> {
    const client = await connectionPool.connect();
    try {
        const resp = await client.query(
            `UPDATE ers.ers_users
            SET ers_username = $1, ers_password = $2, user_first_name = $3, user_last_name = $4
            WHERE user_email = $5`,
                [username, password, firstname, lastname, email]
        );
        return resp.rows;
    } finally {
        client.release();
    }
}

/**
 * Check database credentials when user login
 */
export async function findByUsernameAndPassword(username: string, password: string): Promise <any> {
    const client = await connectionPool.connect();
    try {
        const pass = await client.query(
            `SELECT ers_password FROM ers.ers_users
            WHERE ers_username = $1`,
            [username]
        );
        const userDBPassword = pass.rows[0].ers_password;
        const equal = await bcrypt.compareSync(password, userDBPassword);
        if(equal) {
            const resp = await client.query(
                `SELECT
                    ers_users_id, ers_username, user_first_name,
                    user_last_name, user_email, user_role
                FROM ers.ers_users u JOIN ers.ers_user_roles r
                ON u.user_role_id = r.ers_user_role_id
                WHERE u.ers_username = $1 AND u.ers_password = $2`,
                    [username, userDBPassword]
            );
            if(resp.rows.length) {
                return userConverter(resp.rows[0]);
            }
            return null;
        }
    } finally {
        client.release();
    }
}

/**
 * Add reimbursement to database
 */
export async function addReimbursement(amount: number, submitted: string, description: string, authorId: number, typeId: number): Promise <any> {
    console.log('this is authorid ' + authorId)
    const client = await connectionPool.connect();
    try {
        const resp = await client.query(
            `INSERT INTO ers.ers_reimbursement
            (
                reimb_amount, reimb_submitted, reimb_description,
                reimb_author, reimb_status_id, reimb_type_id
            )
            VALUES ($1, $2, $3, $4, 1, $5)`,
            [amount, submitted, description, authorId, typeId]
        );
    } finally {
        client.release();
    }
}

/**
 * Get reimbursements from database
 */
export async function getReimbursments(id: number): Promise<any[]> {
    const client = await connectionPool.connect();
    try {
        const resp = await client.query(
            `SELECT
                reimb_id, reimb_type, reimb_description, reimb_amount,
                reimb_submitted, reimb_status,
                CONCAT(user_last_name, ' ', user_first_name) AS full_name,
                reimb_resolved 
            FROM ers.ers_reimbursement r
                JOIN ers.ers_reimbursement_status s
                ON (r.reimb_status_id = s.reimb_status_id)
                    JOIN ers.ers_reimbursement_type t
                    ON (r.reimb_type_id = t.reimb_type_id)
                        LEFT JOIN ers.ers_users u
                        ON (r.reimb_resolver = u.ers_users_id)
                            WHERE r.reimb_author = $1
                            ORDER BY reimb_id`,
                            [id]
        );
        if(resp.rows.length) {
            return resp.rows;
        }
        return null;
    } finally {
        client.release();
    }
}

/**
 * Get all reimbursements from database
 */
export async function getAllReimbursments(): Promise<any[]> {
    const client = await connectionPool.connect();
    try {
        const resp = await client.query(
            `SELECT
                reimb_id, CONCAT(u.user_last_name, ' ', u.user_first_name) AS full_name,
                reimb_submitted, reimb_status, reimb_amount, reimb_resolved, reimb_description,
                reimb_type, u.user_email, CONCAT(u2.user_last_name, ' ', u2.user_first_name) AS resolver_name
            FROM ers.ers_reimbursement r
                JOIN ers.ers_reimbursement_status s
                USING (reimb_status_id)
                    JOIN ers.ers_reimbursement_type t
                    USING (reimb_type_id)
                        LEFT JOIN ers.ers_users u
                        ON (r.reimb_author = u.ers_users_id)
                            LEFT JOIN ers.ers_users u2
                            ON (r.reimb_resolver = u2.ers_users_id)
                                ORDER BY reimb_id`
        );
        if(resp.rows.length) {
            return resp.rows;
        }
        return null;
    } finally {
        client.release();
    }
}

/**
 * Update an accepted/declined reimbursement to the database
 */
export async function updateReimbursement(reimbId: number, resolved: string, resolverId: number, statusId: number): Promise<any> {
    const client = await connectionPool.connect();
    try {
        const resp = await client.query(
            `UPDATE ers.ers_reimbursement
            SET reimb_resolved = $1, reimb_resolver = $2, reimb_status_id = $3
            WHERE(reimb_id = $4)`,
            [resolved, resolverId, statusId, reimbId]
        );
        console.log('resp');
        console.log(resp.rows);
        return resp.rows[0];
    }  finally {
        client.release();
    }
}