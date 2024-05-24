'use strict';
import { pool } from "../config/db.js";
import { insertQuery, updateQuery } from "../utils/query-util.js";
import { createHashedPassword, checkLevel, makeUserToken, response, checkDns, lowLevelException } from "../utils/util.js";
import axios from "axios";

const authCtrl = {
    signIn: async (req, res, next) => {
        try {
            const decode_user = checkLevel(req.cookies.token, 0, res);
            const decode_dns = checkDns(req.cookies.dns);
            let { user_name, user_pw, } = req.body;
            
            let user = await pool.query(`SELECT * FROM users WHERE user_name=?`, user_name);
            user = user?.result[0];

            if (!user) {
                return response(req, res, -100, "가입되지 않은 회원입니다.", {})
            }
            user_pw = (await createHashedPassword(user_pw, user.user_salt)).hashedPassword;
            if (user_pw != user.user_pw) {
                return response(req, res, -100, "가입되지 않은 회원입니다.", {})
            }
            const token = makeUserToken({
                id: user.id,
                user_name: user.user_name,
                nickname: user.nickname,
            })

            res.cookie("token", token, {
                httpOnly: true,
                maxAge: (60 * 60 * 1000) * 12 * 2,
                //sameSite: 'none'
            });
            return response(req, res, 100, "success", user)
        } catch (err) {
            console.log(err)
            return response(req, res, -200, "서버 에러 발생", false)
        } finally {

        }
    },
    signUp: async (req, res, next) => {
        try {
            const decode_user = checkLevel(req.cookies.token, 0, res);
            const decode_dns = checkDns(req.cookies.dns);
            let {
                user_name,
                user_pw,
                nickname,
            } = req.body;
            if (!user_pw) {
                return response(req, res, -100, "비밀번호를 입력해 주세요.", {});
            }
            let pw_data = await createHashedPassword(user_pw);
            let is_exist_user = await pool.query(`SELECT * FROM users WHERE user_name=?`, [user_name]);
            if (is_exist_user?.result.length > 0) {
                return response(req, res, -100, "유저아이디가 이미 존재합니다.", false)
            }

            user_pw = pw_data.hashedPassword;
            let user_salt = pw_data.salt;
            let obj = {
                user_name,
                user_pw,
                nickname,
                user_salt
            }
            let result = await insertQuery('users', obj);
            return response(req, res, 100, "success", {})
        } catch (err) {
            console.log(JSON.stringify(err))
            return response(req, res, -200, err?.message || "서버 에러 발생", false)
        } finally {

        }
    },
    signOut: async (req, res, next) => {
        try {
            const decode_user = checkLevel(req.cookies.token, 0, res);
            const decode_dns = checkDns(req.cookies.dns);
            res.clearCookie('token');
            return response(req, res, 100, "success", {})
        } catch (err) {
            console.log(err)
            return response(req, res, -200, "서버 에러 발생", false)
        } finally {

        }
    },
    checkSign: async (req, res, next) => {
        try {
            
            const decode_user = checkLevel(req.cookies.token, 0, res);
            const decode_dns = checkDns(req.cookies.dns);
            let favorite_data = await pool.query(`SELECT favorite AS favorites FROM users WHERE id=${decode_user?.id ?? 0}`);
            let favorite = favorite_data?.result[0]?.favorites;
            return response(req, res, 100, "success", { ...decode_user, favorite })
        } catch (err) {
            console.log(err)
            return response(req, res, -200, "서버 에러 발생", false)
        } finally {

        }
    },
    changeInfo: async (req, res, next) => {
        try {
            const decode_user = checkLevel(req.cookies.token, 0, res);
            const decode_dns = checkDns(req.cookies.dns);
            const {
                id,
                user_name,
                user_pw,
                nickname,
                favorite,
                portfolio,
            } = req.body
            
            let result = await updateQuery('users', {
                user_name,
                user_pw,
                nickname,
                favorite,
                portfolio,
            }, decode_user?.id);
            
            return response(req, res, 100, "success", {})
        } catch (err) {
            console.log(err)
            return response(req, res, -200, "서버 에러 발생", false)
        } finally {

        }
    },
    changePassword: async (req, res, next) => {
        try {
            const decode_user = checkLevel(req.cookies.token, 0, res);
            const decode_dns = checkDns(req.cookies.dns);
            const {
                password,
                new_password,
                user_name,
            } = req.body;

            let user = await pool.query(`SELECT * FROM users WHERE (phone_num=? AND user_name=? AND brand_id=${decode_dns?.id} AND status=0) OR (id=${decode_user?.id ?? 0}) `, [phone_num, user_name,]);
            user = user?.result[0];
            if (decode_user?.id == user?.id) {//개인정보 변경일때
                let user_pw = (await createHashedPassword(password, user.user_salt)).hashedPassword;
                if (user_pw != user.user_pw) {
                    return response(req, res, -100, "현재비밀번호가 일치하지 않습니다.", {})
                }
            } else {//비밀번호 찾기일때
                let send_log = await pool.query(`SELECT * FROM phone_check_tokens WHERE phone_token=? ORDER BY id DESC LIMIT 1`, [
                    phone_token,
                ])
                send_log = send_log?.result[0];
                if (send_log?.phone_num != phone_num) {
                    return response(req, res, -100, "휴대폰번호가 일치하지 않습니다.", false)
                }
            }
            if (user?.status == 1) {
                return response(req, res, -100, "승인 대기중입니다.", {})
            }
            if (user?.status == 2) {
                return response(req, res, -100, "로그인 불가 회원입니다.", {})
            }
            if (user?.status == 3) {
                return response(req, res, -100, "탈퇴회원입니다.", {})
            }

            let pw_data = await createHashedPassword(new_password);
            let result = updateQuery('users', {
                user_pw: pw_data.hashedPassword,
                user_salt: pw_data.salt,
            }, user?.id);

            return response(req, res, 100, "success", {})
        } catch (err) {
            console.log(err)
            return response(req, res, -200, "서버 에러 발생", false)
        } finally {

        }
    },
    resign: async (req, res, next) => {
        try {
            const decode_user = checkLevel(req.cookies.token, 0, res);
            const decode_dns = checkDns(req.cookies.dns);
            const {
                password
            } = req.body;
            let user = await pool.query(`SELECT * FROM users WHERE id=${decode_user?.id ?? 0} `);
            user = user?.result[0];
            let user_pw = (await createHashedPassword(password, user.user_salt)).hashedPassword;
            if (user_pw != user.user_pw) {
                return response(req, res, -100, "비밀번호가 일치하지 않습니다.", {})
            }
            await updateQuery('users', {
                status: 3,
                is_delete: 1
            }, user?.id);
            await res.clearCookie('token');
            return response(req, res, 100, "success", {})
        } catch (err) {
            console.log(err)
            return response(req, res, -200, "서버 에러 발생", false)
        } finally {

        }
    },
};

export default authCtrl;