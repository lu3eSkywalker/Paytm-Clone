import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import {z} from 'zod';
import authenticate from "../middlewares/Middleware";


const searchuserByNameSchema = z.object({
    name: z.string().min(2).max(200),
})

export const searchuserByName = async(req: Request, res: Response): Promise<void> => {
    try {
        authenticate(req, res, async() => {
            const parsedInput = searchuserByNameSchema.safeParse(req.body);
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
                message: 'Successfully fetched the users'
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


export const searchuserByEmail = async(req: Request, res: Response): Promise<void> => {
    try {
        authenticate(req, res, async() => {
            const parsedInput = searchuserByEmailSchema.safeParse(req.body);
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