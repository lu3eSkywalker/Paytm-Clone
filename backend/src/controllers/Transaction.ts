import { Request, Response } from "express";
import {z} from 'zod';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import authenticate from "../middlewares/Middleware";



const transferFundSchema = z.object({
    amount: z.number().min(1).max(9999999999)
});
/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * 
 * /api/v1/transferfund:
 *   post:
 *     summary: Transfer funds from one user to another
 *     tags: [Wallet]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user1Id:
 *                 type: integer
 *                 description: ID of the sender
 *               user2Id:
 *                 type: integer
 *                 description: ID of the receiver
 *               amount: 
 *                 type: integer
 *                 description: Amount to be transferred
 *             required:
 *               - user1Id
 *               - user2Id
 *               - amount
 *     responses:
 *       404:
 *         description: Insufficient Balance
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
 *                   example: Insufficient Balance
 *       200:
 *         description: Successfully transferred the funds
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user1balance:
 *                   type: integer
 *                   example: 900
 *                 user2balance:
 *                   type: integer
 *                   example: 1100
 *                 message:
 *                   type: string
 *                   example: Successfully transferred the funds
 *       500:
 *         description: Error transferring the funds
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
 *                   example: Error transferring the funds
 */


export const transferFunds = async(req: Request, res: Response): Promise<void> => {
    try {
        authenticate(req, res, async() => {
            const parsedInput = transferFundSchema.safeParse(req.body);
            if(!parsedInput.success) {
                res.status(411).json({
                    error: parsedInput.error
                })
                return;
            }
    
            const amount = parsedInput.data.amount;
    
            const{user1Id, user2Id} = req.body as {user1Id: number, user2Id: number};
    
            const user1wallet = await prisma.wallet.findFirstOrThrow({
                where: {
                    userId: user1Id
                },
                select: {
                    id: true,
                    balance: true
                }
            });
    
            const balance = user1wallet?.balance
    
            if(!(balance > amount)) {
                res.status(404).json({
                    success: false,
                    message: 'Insufficient Balance'
                })
                return;
            }
    
            const deduceFund = await prisma.wallet.update({
                where: {
                    id: user1wallet.id
                },
                data: {
                    balance: {
                        decrement: amount
                    }
                }
            });
    
    
            const user2wallet = await prisma.wallet.findFirst({
                where: {
                    userId: user2Id
                },
                select: {
                    id: true,
                }
            })
    
            const addfund = await prisma.wallet.update({
                where: {
                    id: user2wallet?.id
                },
                data: {
                    balance: {
                        increment: amount
                    }
                }
            });
    
            
            const createTransactionRecord = await prisma.transaction.create({
                data: {
                    sender: user1Id,
                    receiver: user2Id,
                    amountTransfered: amount
                }
            });
    
            res.status(200).json({
                success: true,
                message: 'Successfully transferred the funds',
                user1balance: deduceFund.balance,
                user2balance: addfund.balance
            })
        })
    }
    catch(error) {
        console.log('Error: ', error)
        res.status(500).json({
            success: false,
            message: 'Entry transferring the funds',
        })
    }
}

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * 
 * /api/v1/fundsmerchant:
 *   post:
 *     summary: Transfer funds from one user to another
 *     tags: [Wallet]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: ID of the sender
 *               MerchantId:
 *                 type: integer
 *                 description: ID of the merchant
 *               amount: 
 *                 type: integer
 *                 description: Amount to be transferred
 *             required:
 *               - userId
 *               - MerchantId
 *               - amount
 *     responses:
 *       404:
 *         description: Insufficient Balance
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
 *                   example: Insufficient Balance
 *       200:
 *         description: Successfully transferred the funds
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 userbalance:
 *                   type: integer
 *                   example: 900
 *                 merchantbalance:
 *                   type: integer
 *                   example: 1100
 *                 message:
 *                   type: string
 *                   example: Successfully transferred the funds
 *       500:
 *         description: Error transferring the funds
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
 *                   example: Error transferring the funds
 */


export const transferFundsToMerchant = async(req: Request, res: Response): Promise<void> => {
    try {

        const {userId, MerchantId, amount} = req.body;

        const userWallet = await prisma.wallet.findFirstOrThrow({
            where: {
                id: userId
            },
            select: {
                id: true,
                balance: true,
            }
        });

        const balance = userWallet?.balance

        if(!(balance > amount)) {
            res.status(404).json({
                success: false,
                message: 'Insufficient Balance'
            });
            return;
        }

        const userWalletUpdate = await prisma.wallet.update({
            where: {
                userId: userId
            },
            data: {
                balance: {
                    decrement: amount
                }
            }
        });
        
        const mechantWallet = await prisma.walletMerchant.update({
            where: {
                merchantId: MerchantId
            },
            data: {
                balance: {
                    increment: amount
                }
            }
        });

        const createTransactionRecord = await prisma.merchantTransaction.create({
            data: {
                sender: userId,
                receiver: MerchantId,
                amountTransfered: amount
            }
        });

        res.status(200).json({
            success: true,
            userBalance: userWalletUpdate.balance,
            merchantBalance: mechantWallet.balance,
            message: 'Successfully Added the balance to merchant wallet'
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