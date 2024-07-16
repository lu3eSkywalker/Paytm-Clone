import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import {z} from 'zod';
import authenticate from "../middlewares/Middleware";


const searchuserByNameSchema = z.object({
    name: z.string().min(2).max(200),
})

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * 
 * /api/v1/byname/{name}:
 *   get:
 *     summary: Fetch the user using name
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: Name of the user
 *     responses:
 *       404:
 *         description: No user exists by this name
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: 
 *                   type: boolean
 *                 message:
 *                   type: string
 *       200:
 *         description: Successfully fetched the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: "Luke Skywalker"
 *                       email: 
 *                          type: string
 *                          example: "lukeskywalker@gmail.com"
 *                       wallet: 
 *                          type: object
 *                 message:
 *                   type: string
 *       500:
 *         description: Error fetching the transactions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message: 
 *                   type: string
 *                   example: Error fetching the user
 */

export const searchuserByName = async(req: Request, res: Response): Promise<void> => {
    try {
        authenticate(req, res, async() => {
            const parsedInput = searchuserByNameSchema.safeParse(req.params.name);
            if(!parsedInput.success) {
                res.status(411).json({
                    error: parsedInput.error
                })
                return;
            }
    
            const name = parsedInput.data?.name
    
            const getUser = await prisma.users.findMany({
                where: {
                    name: {
                        contains: name,
                        mode: 'insensitive'
                    }
                },
            });
    
            if(getUser.length === 0) {
                res.status(404).json({
                    success: false,
                    message: 'No User Exists by this Name'
                });
                return;
            }
    
            res.status(200).json({
                success: true,
                data: getUser,
                message: 'Successfully fetched the user'
            })
        })

    }
    catch(error) {
        console.log('Error: ', error)
        res.status(500).json({
            success: false,
            message: 'Error Fetching User',
        })
    }
}


const searchuserByEmailSchema = z.object({
    email: z.string().email(),
})

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * 
 * /api/v1/byemail/{email}:
 *   get:
 *     summary: Fetch the user using name
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: email
 *         schema:
 *           type: string
 *         required: true
 *         description: Email of the user
 *     responses:
 *       404:
 *         description: No user exists by this email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: 
 *                   type: boolean
 *                 message:
 *                   type: string 
 *       200:
 *         description: Successfully fetched the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: "Luke Skywalker"
 *                       email: 
 *                          type: string
 *                          example: "lukeskywalker@gmail.com"
 *                       wallet: 
 *                          type: object
 *                 message:
 *                   type: string
 *       500:
 *         description: Error fetching the transactions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message: 
 *                   type: string
 *                   example: Error fetching the user
 */


export const searchuserByEmail = async(req: Request, res: Response): Promise<void> => {
    try {
        authenticate(req, res, async() => {
            const parsedInput = searchuserByEmailSchema.safeParse(req.params.email);
            if(!parsedInput.success) {
                res.status(411).json({
                    error: parsedInput.error
                })
                return;
            }
    
            const email = parsedInput.data?.email;
    
            const getUser = await prisma.users.findUnique({
                where: {
                    email: email
                }
            });
    
            if(!getUser) {
                res.status(404).json({
                    success: false,
                    message: 'No user Found'
                });
                return;
            }
    
            res.status(200).json({
                success: true,
                data: getUser,
                message: 'Successfully Fetched the user'
            })
        })
        
    }
    catch(error) {
        console.log('Error: ', error)
        res.status(500).json({
            success: false,
            message: 'Error Fetching User',
        })
    }
}