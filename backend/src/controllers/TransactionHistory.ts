import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client';
import authenticate from "../middlewares/Middleware";
const prisma = new PrismaClient();





/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * 
 * /api/v1/getuserinfo/{id}:
 *   get:
 *     summary: Fetch the information of the user
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Id of the user
 *     responses:
 *       200:
 *         description: Successfully fetched the user info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: "John Doe"
 *                 message:
 *                   type: string
 *                   example: "Successfully fetched the user info"
 *       500:
 *         description: Error fetching user
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
 *                   example: "Error Fetching User."
 */


export const getUserInfo = async(req: Request, res: Response): Promise<void> => {
    try {
        authenticate(req, res, async() => {
            // const {userId} = req.body
            const id = req.params.id;

            const userId = parseInt(id);
            const getUser = await prisma.users.findUnique({
                where: {
                    id: userId
                },
                select: {
                    name: true,
                }
            });
    
            res.status(200).json({
                success: true,
                data: getUser,
                message: 'Successfully fetched the user info'
            });
        });
    }
    catch(error) {
        console.log('Error: ', error)
        res.status(500).json({
            success: false,
            message: 'Error Fetching User .',
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
 * /api/v1/sentfundsinfo/{id}:
 *   get:
 *     summary: Fetch the history of sent funds
 *     tags: [Transaction]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Id of the user
 *     responses:
 *       404:
 *         description: No transaction found
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
 *                   example: No transaction found.
 *       200:
 *         description: Successfully fetched the transactions
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
 *                       senderName:
 *                         type: string
 *                         example: "John Doe"
 *                       receiverName:
 *                         type: string
 *                         example: "Jane Smith"
 *                       amountTransferred:
 *                         type: string
 *                         example: "100.00"
 *                 message:
 *                   type: string
 *                   example: Successfully fetched the transactions.
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
 *                   example: Error fetching transactions.
 */

export const transferFundsHistorySent = async(req: Request, res: Response): Promise<void> => {
    try {

        authenticate(req, res, async() => {
            const id = req.params.id;

            const userId = parseInt(id);

            const findTransactions = await prisma.transaction.findMany({
                where: {
                    sender: userId
                },
                include: {
                    senderUser: {
                        select: {
                            name: true
                        }
                    },
                    receiverUser: {
                        select: {
                            name: true
                        }
                    }
                }
            });
    
            if(findTransactions.length === 0) {
                res.status(404).json({
                    success: false,
                    message: 'No transaction found.'
                });
                return;
            }
    
            const transactionsWithNames = findTransactions.map(transaction => ({
                id: transaction.id,
                senderName: transaction.senderUser?.name,
                receiverName: transaction.receiverUser?.name,
                amountTransfered: transaction.amountTransfered
            }));
    
            res.status(200).json({
                success: true,
                data: transactionsWithNames,
                message: 'Successfully fetched the transactions.'
            })
        })
    }
    catch(error) {
        console.log('Error: ', error)
        res.status(500).json({
            success: false,
            message: 'Entry Fetching transactions.',
        })
    }
}


export const transferFundsHistoryReceived = async(req: Request, res: Response): Promise<void> => {
    try{

        authenticate(req, res, async() => {
            const {userId} = req.body;

            const findTransactions = await prisma.transaction.findMany({
                where: {
                    receiver: userId
                },
                include: {
                    receiverUser: {
                        select: {
                            name: true
                        }
                    },
                    senderUser: {
                        select: {
                            name: true
                        }
                    }
                }
            });
    
            if(findTransactions.length === 0) {
                res.status(404).json({
                    success: false,
                    message: 'No transaction found.'
                });
                return;
            }
    
            const transactionWithNames = findTransactions.map(transaction => ({
                id: transaction.id,
                recieverName: transaction.receiverUser?.name,
                senderName: transaction.senderUser?.name,
                amountTransfered: transaction.amountTransfered
            }));
    
    
            res.status(200).json({
                success: true,
                data: transactionWithNames,
                message: 'Successfully fetched the transaction'
            });
        })
    }
    catch(error) {
        console.log('Error: ', error)
        res.status(500).json({
            success: false,
            message: 'Entry Fetching Transactions.',
        })
    }
}

export const transferHistoryBankAmountaddToUserWallet = async(req: Request, res: Response): Promise<void> => {
    try {
        authenticate(req, res, async() => {
            const {userId} = req.body;

            const findTransactions = await prisma.bankTransaction.findMany({
                where: {
                    receiver: userId,
                },
                include: {
                    receiverUser: {
                        select: {
                            name: true
                        }
                    }
                }
            });
    
            if(findTransactions.length === 0) {
                res.status(404).json({
                    success: false,
                    message: 'No transaction found'
                });
                return;
            }
    
            const transactionsWithNames = findTransactions.map(transaction => ({
                id: transaction.id,
                senderName: 'Bank Name',
                receiverName: transaction.receiverUser?.name,
                amountTransfered: transaction.amountTransfered
            }));
    
            res.status(200).json({
                success: true,
                data: transactionsWithNames,
                message: 'Successfully fetched the transactions.'
            });
        })
    }
    catch(error) {
        console.log('Error: ', error)
        res.status(500).json({
            success: false,
            message: 'Entry Fetching transactions.',
        })
    }
}


export const transferHistoryWithdrawToBankAcc = async(req: Request, res: Response): Promise<void> => {
    try {

        authenticate(req, res, async() => {
            const {userId} = req.body;

            const findTransactions = await prisma.bankTransaction.findMany({
                where: {
                    sender: userId
                },
            });
    
            if(findTransactions.length === 0) {
                res.status(404).json({
                    success: false,
                    message: 'No transaction found'
                });
                return;
            }
    
            const transactionWithNames = findTransactions.map(transaction => ({
                id: transaction.id,
                SenderId: userId,
                Receiver: "Bank Name",
                amountTransfered: transaction.amountTransfered
            }));
    
            res.status(200).json({
                success: true,
                data: transactionWithNames,
                message: 'Successfully fetched the transactions. '
            });
        })
    }
    catch(error) {
        console.log('Error: ', error)
        res.status(500).json({
            success: false,
            message: 'Entry Fetching transactions.',
        })
    }
}


export const transferFundsMerchantHistory = async(req: Request, res: Response): Promise<void> => {
    try {
        authenticate(req, res, async() => {
            const {userId} = req.body;

        const findTransactions = await prisma.merchantTransaction.findMany({
            where: {
                sender: userId
            },
            include: {
                senderUser: {
                    select: {
                        name: true
                    }
                },
                receiverMerchant: {
                    select: {
                        name: true
                    }
                }
            }
        });

        if(findTransactions.length === 0) {
            res.status(404).json({
                success: false,
                message: 'No transaction found.'
            });
            return;
        }

        const transactionWithNames = findTransactions.map(transaction => ({
            id: transaction.id,
            senderName: transaction.senderUser.name,
            receiverName: transaction.receiverMerchant.name,
            amountTrasfered: transaction.amountTransfered
        }));


        res.status(200).json({
            success: true,
            data: transactionWithNames,
            message: 'Transaction Fetched Successfully'
        })
        })
    }
    catch(error) {
        console.log('Error: ', error)
        res.status(500).json({
            success: false,
            message: 'Entry Fetching transactions.',
        })
    }
}