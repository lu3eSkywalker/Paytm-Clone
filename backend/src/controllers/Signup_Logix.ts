import { Request, Response } from "express";
import {z} from 'zod';
import bcrypt from 'bcrypt';
import dotenv, { parse } from 'dotenv';
dotenv.config();
import jwt, { Secret } from 'jsonwebtoken';

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const secretjwt: string = process.env.JWT_SECRET || ''

const SignupSchema = z.object({
    name: z.string().min(2).max(20),
    email: z.string().email(),
    password: z.string().min(5)
});


/**
 * @swagger
 * /api/v1/signupuser:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 description: The user's name
 *               email:
 *                 type: string
 *                 description: The user's email
 *               password:
 *                 type: string
 *                 description: The user's password
 *     responses:
 *       200:
 *         description: Signed up successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                 message:
 *                   type: string
 *       411:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: object
 *       500:
 *         description: Entry Creation Failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 */


export const signupUser = async(req: Request, res: Response): Promise<void> => {
    try {

        const parsedInput = SignupSchema.safeParse(req.body);
        if(!parsedInput.success) {
            res.status(411).json({
                error: parsedInput.error
            })
            return;
        }

        const name = parsedInput.data.name
        const email = parsedInput.data.email
        const password = parsedInput.data.password


        let hashedPassword: string;
        hashedPassword = await bcrypt.hash(password, 10);

        const response = await prisma.users.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        });

        const createWallet = await prisma.wallet.create({
            data: {
                userId: response.id
            }
        })

        res.status(200).json({
            success: true,
            data: response,
            message: 'Signed up successfully'
        })

    }
    catch(error) {
        console.log('Error: ', error)
        res.status(500).json({
            success: false,
            message: 'Entry Creation Failed',
        })
    }
}


/**
 * @swagger
 * /api/v1/signupmerchant:
 *   post:
 *     summary: Create a new merchant account
 *     tags: [Merchant]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 description: The merchant's name
 *               email:
 *                 type: string
 *                 description: The merchant's email
 *               password:
 *                 type: string
 *                 description: The merchant's password
 *     responses:
 *       200:
 *         description: Signed up successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                      name: 
 *                          type: string
 *                      email:
 *                          type: string
 *                      password:
 *                          type: string
 *                 message:
 *                   type: string
 *       411:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: object
 *       500:
 *         description: Entry Creation Failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 */




export const signupMerchant = async(req: Request, res: Response): Promise<void> => {
    try {
        const parsedInput = SignupSchema.safeParse(req.body);
        if(!parsedInput.success) {
            res.status(411).json({
                error: parsedInput.error
            })
            return;
        }

        const name = parsedInput.data.name
        const email = parsedInput.data.email
        const password = parsedInput.data.password

        let hashedPassword: string;
        hashedPassword = await bcrypt.hash(password, 10);

        const response = await prisma.merchant.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        });

        const createWallet = await prisma.walletMerchant.create({
            data: {
                merchantId: response.id
            }
        })
        
        res.status(200).json({
            success: true,
            data: response,
            message: 'Signed up successfully'
        });
    }
    catch(error) {
        console.log('Error: ', error)
        res.status(500).json({
            success: false,
            message: 'Entry Creation Failed',
        })
    }
}


const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(5),
});


/**
 * @swagger
 * /api/v1/loginuser:
 *   post:
 *     summary: Login to user's account
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email
 *               password:
 *                 type: string
 *                 description: The user's password
 *     responses:
 *       200:
 *         description: Logged in Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                      name: 
 *                          type: string
 *                      email:
 *                          type: string
 *                      password:
 *                          type: string
 *                 token: 
 *                    type: string
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized - Password incorrect
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                  success:
 *                      type: boolean
 *                  message:
 *                      type: string
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       411:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: object
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 */


export const loginUser = async(req: Request<{email: string, password: string}>, res: Response): Promise<void> => {
    try {
        const parsedInput = LoginSchema.safeParse(req.body);
        if(!parsedInput.success) {
            res.status(411).json({
                error: parsedInput.error
            })
            return;
        }

        const email = parsedInput.data.email;
        const password = parsedInput.data.password;

        const user = await prisma.users.findUnique({
            where: {
                email: email,
            }
        });

        if(!user) {
            res.status(404).json({
                success: false,
                message: 'User not registered',
            });
            return
        }

        const payload = {
            email: user.email,
            name: user.name,
            id: user.id,
        }

        const compare = await bcrypt.compare(password, user.password);

        if(compare) {
            const token = jwt.sign({payload}, secretjwt, { expiresIn: "24hr"} );

            res.status(200).json({
                success: true,
                data: user,
                token: token,
                message: 'Logged in successfully'
            });
        } else {
            res.status(401).json({
                success: false,
                message: "Password Incorrect",
            });
            return;
        }
    }
    catch(error) {
        console.log('Error: ', error)
        res.status(500).json({
            success: false,
            message: 'Error Logging In',
        })
    }
}


/**
 * @swagger
 * /api/v1/loginmerchant:
 *   post:
 *     summary: Login to merchant's account
 *     tags: [Merchant]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 description: The merchant's email
 *               password:
 *                 type: string
 *                 description: The merchant's password
 *     responses:
 *       200:
 *         description: Logged in Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                      name: 
 *                          type: string
 *                      email:
 *                          type: string
 *                      password:
 *                          type: string
 *                 token: 
 *                    type: string
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized - Password incorrect
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                  success:
 *                      type: boolean
 *                  message:
 *                      type: string
 *       404:
 *         description: merchant not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       411:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: object
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 */


export const loginMechant = async(req: Request<{email: string, password: string}>, res: Response): Promise<void> => {
    try {
        const parsedInput = LoginSchema.safeParse(req.body);
        if(!parsedInput.success) {
            res.status(411).json({
                error: parsedInput.error
            })
            return;
        }

        const email = parsedInput.data.email;
        const password = parsedInput.data.password;

        const merchants = await prisma.merchant.findUnique({
            where: {
                email: email,
            }
        });

        if(!merchants) {
            res.status(404).json({
                success: false,
                message: 'User not registered',
            });
            return
        }

        const payload = {
            id: merchants.id,
            name: merchants.name,
            email: merchants.email
        }

        const compare = await bcrypt.compare(password, merchants.password)

        if(compare) {
            const token = jwt.sign({payload}, secretjwt, { expiresIn: "24hr"} )

            res.status(200).json({
                success: true,
                data: merchants,
                token: token,
                message: 'Logged in successfully'
            });
        } else {
            res.status(401).json({
                success: false,
                message: 'Password incorrect',
            });
            return;
        }
    }
    catch(error) {
        console.log('Error: ', error)
        res.status(500).json({
            success: false,
            message: 'Error Logging In',
        })
    }
}