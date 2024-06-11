import axios from 'axios';
import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client';
import authenticate from '../middlewares/Middleware';
const prisma = new PrismaClient();


export const BankAPI = async(req: Request, res: Response): Promise<void> => {
    try {
        authenticate(req, res, async() => {
            const {amount, userId} = req.body;

            const BANKAPI_URL = await process.env.BANKAPI_URL as string;
    
            const response = await axios.post(`${BANKAPI_URL}/add`, {
    
                amount: amount,
                userId: userId
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            res.status(200).json({
                success: true,
                data: response.data,
                message: 'Succesfully communicated with the bank API'
            });
        })

    }
    catch(error) {
        console.log('Error: ', error)
        res.status(500).json({
            success: false,
            message: 'Cannot communicate to the Bank API'
        })
    }
}

export const BankAPIDeduct = async(req: Request, res: Response): Promise<void> => {
    try {
        authenticate(req, res, async() => {
            const {amount, userId} = req.body;

            const BANKAPI_URL = await process.env.BANKAPI_URL as string;
    
            const response = await axios.post(`${BANKAPI_URL}/deduct`, {
                amount: amount,
                userId: userId
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            res.status(200).json({
                success: true,
                data: response.data,
                message: 'Successfully communicated with the bank API'
            });
        });
    }
    catch(error) {
        console.log('Error: ', error)
        res.status(500).json({
            success: false,
            message: 'Cannot communicate to the Bank API'
        })
    }
}


export const addToWallet = async(req: Request, res: Response): Promise<void> => {
    try {
        authenticate(req, res, async() => {
            const {amount, userId} = req.body;

        const addAmount = await prisma.wallet.update({
            where: {
                userId: userId,
            },
            data: {
                balance: {
                    increment: amount
                }
            }
        });

        if(!addAmount) {
            res.status(404).json({
                success: false,
                message: 'User Not Found'
            });
            return;
        }

        const dummyBankId = 12345;
        const createTransactionRecord = await prisma.bankTransaction.create({
            data: {
                sender: dummyBankId,
                receiver: userId,
                amountTransfered: amount
            }
        });

        res.status(200).json({
            success: true,
            data: addAmount,
            message: 'Successfully added the amount to the balance'
        })    
        });
    }
    catch(error) {
        console.log('Error: ', error)
        res.status(500).json({
            success: false,
            message: 'Cannot communicate to the Bank API'
        })
    }
}

export const withdrawFromWallet = async(req: Request, res: Response): Promise<void> => {
    try {
        authenticate(req, res, async() => {
            const {amount, userId} = req.body;

            const deductAmount = await prisma.wallet.update({
                where: {
                    userId: userId
                },
                data: {
                    balance: {
                        decrement: amount
                    }
                }
            });
    
    
            if(!deductAmount) {
                res.status(404).json({
                    success: false,
                    message: 'User Not Found'
                });
            }
    
            const dummyBankAccount = 12345
    
            const createTransactionRecord = await prisma.bankTransaction.create({
                data: {
                    sender: userId,
                    BankIdReceiver: dummyBankAccount,
                    amountTransfered: amount
                }
            })
    
            res.status(200).json({
                success: true,
                data: deductAmount,
                message: 'Successfully deducted the amount from the balance'
            });
        });
    }

    catch(error) {
        console.log('Error: ', error)
        res.status(500).json({
            success: false,
            message: 'Cannot communicate to the Bank API'
        })
    }
}