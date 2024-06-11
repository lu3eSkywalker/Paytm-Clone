import { Request, Response } from "express";
import {z} from 'zod';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import authenticate from "../middlewares/Middleware";



const transferFundSchema = z.object({
    amount: z.number().min(1).max(9999999999)
})



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
            message: 'Entry Creation Failed',
        })
    }
}


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